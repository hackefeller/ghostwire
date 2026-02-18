/**
 * Feature Bundle Registration System
 * 
 * Manages registration, loading, and lifecycle of feature bundles.
 */

import type { FeatureBundle, FeatureBundleConfig, BundleComponents } from "./types"
import { PriorityLoader, ComponentLoader, createBundleLoaders, type ComponentType, type Priority } from "./lazy-loader"
import { ComponentCache, MemoryPressureManager } from "./cache"

export interface RegisteredBundle {
  bundle: FeatureBundle
  config: FeatureBundleConfig
  loader: PriorityLoader<unknown>
  cache: ComponentCache<unknown>
  registeredAt: number
  status: "pending" | "loading" | "ready" | "error"
  error?: string
}

export interface BundleRegistryConfig {
  lazyLoad: boolean
  enableCaching: boolean
  memoryPressureCheck: boolean
}

export const DEFAULT_REGISTRY_CONFIG: BundleRegistryConfig = {
  lazyLoad: true,
  enableCaching: true,
  memoryPressureCheck: true,
}

/**
 * Central registry for all feature bundles
 */
export class BundleRegistry {
  private bundles: Map<string, RegisteredBundle> = new Map()
  private memoryManager: MemoryPressureManager
  private config: BundleRegistryConfig

  constructor(config: Partial<BundleRegistryConfig> = {}) {
    this.config = { ...DEFAULT_REGISTRY_CONFIG, ...config }
    this.memoryManager = new MemoryPressureManager()
    
    if (this.config.memoryPressureCheck) {
      this.memoryManager.startMonitoring()
    }
  }

  /**
   * Register a feature bundle
   */
  register(bundle: FeatureBundle, userConfig?: Partial<FeatureBundleConfig>): void {
    const config: FeatureBundleConfig = {
      enabled: userConfig?.enabled ?? bundle.config.enabled,
      lazyLoad: userConfig?.lazyLoad ?? bundle.config.lazyLoad,
      cacheSize: userConfig?.cacheSize ?? bundle.config.cacheSize,
    }

    if (!config.enabled) {
      console.log(`[BundleRegistry] Bundle "${bundle.name}" is disabled, skipping registration`)
      return
    }

    // Create loader and cache for this bundle
    const loader = new PriorityLoader<unknown>({
      maxMemoryMB: config.cacheSize,
    })

    const cache = new ComponentCache<unknown>({
      maxMemoryMB: config.cacheSize,
    })

    // Register with memory manager
    this.memoryManager.registerCache(bundle.name, cache)

    const registeredBundle: RegisteredBundle = {
      bundle,
      config,
      loader,
      cache,
      registeredAt: Date.now(),
      status: "pending",
    }

    this.bundles.set(bundle.name, registeredBundle)

    console.log(`[BundleRegistry] Registered bundle "${bundle.name}" with ${this.getComponentCount(bundle)} components`)
  }

  /**
   * Load a bundle (transition from pending to ready)
   */
  async loadBundle(bundleName: string): Promise<boolean> {
    const registered = this.bundles.get(bundleName)
    if (!registered) {
      console.error(`[BundleRegistry] Bundle "${bundleName}" not found`)
      return false
    }

    if (registered.status === "ready") {
      return true
    }

    registered.status = "loading"

    try {
      // Create loaders for all components
      const loaders = createBundleLoaders(registered.bundle, async (name, type) => {
        // This would actually load the component from the imported plugin
        // For now, we return a placeholder
        return { name, type, loaded: true }
      })

      // Register all loaders
      for (const loader of loaders) {
        registered.loader.register(loader)
      }

      registered.status = "ready"
      console.log(`[BundleRegistry] Bundle "${bundleName}" loaded successfully`)
      return true
    } catch (error) {
      registered.status = "error"
      registered.error = error instanceof Error ? error.message : String(error)
      console.error(`[BundleRegistry] Failed to load bundle "${bundleName}":`, error)
      return false
    }
  }

  /**
   * Get a component from a bundle
   */
  async getComponent<T>(bundleName: string, componentName: string): Promise<T | undefined> {
    const registered = this.bundles.get(bundleName)
    if (!registered) return undefined

    if (registered.status !== "ready") {
      const loaded = await this.loadBundle(bundleName)
      if (!loaded) return undefined
    }

    // Try cache first
    const cached = registered.cache.get(componentName)
    if (cached) {
      return cached as T
    }

    // Load via loader
    const component = await registered.loader.get(componentName)
    if (component) {
      // Cache the result
      const loader = registered.loader["components"].get(componentName)
      if (loader) {
        registered.cache.set(componentName, component, {
          priority: loader.priority,
        })
      }
    }

    return component as T
  }

  /**
   * Check if a bundle is registered
   */
  hasBundle(bundleName: string): boolean {
    return this.bundles.has(bundleName)
  }

  /**
   * Get bundle status
   */
  getBundleStatus(bundleName: string): RegisteredBundle["status"] | undefined {
    return this.bundles.get(bundleName)?.status
  }

  /**
   * Get all registered bundle names
   */
  getBundleNames(): string[] {
    return Array.from(this.bundles.keys())
  }

  /**
   * Get bundle statistics
   */
  getBundleStats(bundleName: string): {
    totalComponents: number
    loaded: number
    cached: number
    status: string
  } | undefined {
    const registered = this.bundles.get(bundleName)
    if (!registered) return undefined

    return {
      totalComponents: this.getComponentCount(registered.bundle),
      loaded: registered.loader.getStats().loaded,
      cached: registered.cache.getStats().itemCount,
      status: registered.status,
    }
  }

  /**
   * Unload a bundle (free memory but keep registration)
   */
  unloadBundle(bundleName: string): boolean {
    const registered = this.bundles.get(bundleName)
    if (!registered) return false

    registered.loader.clear()
    registered.cache.clear()
    registered.status = "pending"

    console.log(`[BundleRegistry] Unloaded bundle "${bundleName}"`)
    return true
  }

  /**
   * Unregister a bundle completely
   */
  unregister(bundleName: string): boolean {
    const registered = this.bundles.get(bundleName)
    if (!registered) return false

    this.unloadBundle(bundleName)
    this.bundles.delete(bundleName)

    console.log(`[BundleRegistry] Unregistered bundle "${bundleName}"`)
    return true
  }

  /**
   * Get registry statistics
   */
  getStats(): {
    totalBundles: number
    readyBundles: number
    loadingBundles: number
    errorBundles: number
    totalComponents: number
  } {
    let totalComponents = 0
    let readyBundles = 0
    let loadingBundles = 0
    let errorBundles = 0

    for (const [_, registered] of this.bundles) {
      totalComponents += this.getComponentCount(registered.bundle)
      
      if (registered.status === "ready") readyBundles++
      else if (registered.status === "loading") loadingBundles++
      else if (registered.status === "error") errorBundles++
    }

    return {
      totalBundles: this.bundles.size,
      readyBundles,
      loadingBundles,
      errorBundles,
      totalComponents,
    }
  }

  /**
   * Dispose of the registry (cleanup)
   */
  dispose(): void {
    this.memoryManager.stopMonitoring()
    
    for (const [name, _] of this.bundles) {
      this.unregister(name)
    }
  }

  private getComponentCount(bundle: FeatureBundle): number {
    return (
      (bundle.components.agents?.length ?? 0) +
      (bundle.components.commands?.length ?? 0) +
      (bundle.components.skills?.length ?? 0) +
      (bundle.components.mcpServers?.length ?? 0)
    )
  }
}

// Singleton instance
let globalRegistry: BundleRegistry | null = null

/**
 * Get or create the global bundle registry
 */
export function getBundleRegistry(config?: Partial<BundleRegistryConfig>): BundleRegistry {
  if (!globalRegistry) {
    globalRegistry = new BundleRegistry(config)
  }
  return globalRegistry
}

/**
 * Reset the global registry (mainly for testing)
 */
export function resetBundleRegistry(): void {
  if (globalRegistry) {
    globalRegistry.dispose()
    globalRegistry = null
  }
}
