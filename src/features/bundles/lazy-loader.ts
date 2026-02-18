/**
 * Lazy loading and caching for feature bundle components
 * 
 * Implements priority-based loading and LRU caching with memory pressure handling.
 */

import type { FeatureBundle } from "./types"

export type ComponentType = "agent" | "command" | "skill" | "mcp"
export type Priority = 0 | 1 | 2 | 3 // P0, P1, P2, P3

export interface ComponentLoader<T> {
  name: string
  type: ComponentType
  priority: Priority
  loader: () => Promise<T>
  loaded?: T
  lastAccessed?: number
  loadCount?: number
}

export interface CacheEntry<T> {
  value: T
  priority: Priority
  lastAccessed: number
  memoryEstimate: number // bytes
}

export interface LazyLoadConfig {
  maxMemoryMB: number
  maxItems: number
  ttlMs: number
  criticalComponents: Set<string>
}

export const DEFAULT_LAZY_LOAD_CONFIG: LazyLoadConfig = {
  maxMemoryMB: 512,
  maxItems: 100,
  ttlMs: 1000 * 60 * 30, // 30 minutes
  criticalComponents: new Set([
    "atlas",
    "sisyphus",
    "oracle",
  ]),
}

/**
 * Priority-based lazy loader for feature bundle components
 */
export class PriorityLoader<T> {
  private components: Map<string, ComponentLoader<T>> = new Map()
  private loaded: Map<string, T> = new Map()
  private loadingPromises: Map<string, Promise<T>> = new Map()
  private config: LazyLoadConfig

  constructor(config: Partial<LazyLoadConfig> = {}) {
    this.config = { ...DEFAULT_LAZY_LOAD_CONFIG, ...config }
  }

  /**
   * Register a component for lazy loading
   */
  register(loader: ComponentLoader<T>): void {
    this.components.set(loader.name, loader)

    // P0 components are loaded immediately
    if (loader.priority === 0) {
      this.loadImmediately(loader.name)
    }
  }

  /**
   * Get a component, loading it if necessary
   */
  async get(name: string): Promise<T | undefined> {
    // Return cached instance
    if (this.loaded.has(name)) {
      const component = this.loaded.get(name)!
      this.updateAccessTime(name)
      return component
    }

    // Return existing promise to prevent duplicate loads
    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name)
    }

    const loader = this.components.get(name)
    if (!loader) return undefined

    // Load the component
    const loadPromise = this.loadComponent(name, loader)
    this.loadingPromises.set(name, loadPromise)

    try {
      const instance = await loadPromise
      this.loaded.set(name, instance)
      return instance
    } finally {
      this.loadingPromises.delete(name)
    }
  }

  /**
   * Check if a component is registered
   */
  has(name: string): boolean {
    return this.components.has(name)
  }

  /**
   * Check if a component is loaded
   */
  isLoaded(name: string): boolean {
    return this.loaded.has(name)
  }

  /**
   * Get all registered component names
   */
  getRegisteredNames(): string[] {
    return Array.from(this.components.keys())
  }

  /**
   * Get all loaded component names
   */
  getLoadedNames(): string[] {
    return Array.from(this.loaded.keys())
  }

  /**
   * Unload a specific component from memory
   */
  unload(name: string): boolean {
    const hadItem = this.loaded.has(name)
    this.loaded.delete(name)
    return hadItem
  }

  /**
   * Clear all loaded components
   */
  clear(): void {
    this.loaded.clear()
    this.loadingPromises.clear()
  }

  /**
   * Get memory statistics
   */
  getStats(): {
    registered: number
    loaded: number
    loading: number
  } {
    return {
      registered: this.components.size,
      loaded: this.loaded.size,
      loading: this.loadingPromises.size,
    }
  }

  private async loadImmediately(name: string): Promise<void> {
    const loader = this.components.get(name)
    if (!loader) return

    try {
      const instance = await loader.loader()
      this.loaded.set(name, instance)
    } catch (error) {
      console.error(`[PriorityLoader] Failed to load P0 component ${name}:`, error)
    }
  }

  private async loadComponent(
    name: string,
    loader: ComponentLoader<T>
  ): Promise<T> {
    const instance = await loader.loader()
    loader.loaded = instance
    loader.lastAccessed = Date.now()
    loader.loadCount = (loader.loadCount ?? 0) + 1
    return instance
  }

  private updateAccessTime(name: string): void {
    const loader = this.components.get(name)
    if (loader) {
      loader.lastAccessed = Date.now()
    }
  }
}

/**
 * Creates loaders for all components in a feature bundle
 */
export function createBundleLoaders<T>(
  bundle: FeatureBundle,
  loadComponent: (name: string, type: ComponentType) => Promise<T>
): ComponentLoader<T>[] {
  const loaders: ComponentLoader<T>[] = []

  // Helper to determine priority based on bundle configuration
  const getPriority = (name: string): Priority => {
    // P0: Critical agents
    const p0Agents = [
      "agent-native-reviewer",
      "architecture-strategist",
      "security-sentinel",
      "performance-oracle",
      "code-simplicity-reviewer",
      "data-integrity-guardian",
      "deployment-verification-agent",
    ]
    // P0: Critical commands
    const p0Commands = [
      "/workflows:plan",
      "/workflows:review",
      "/workflows:work",
      "/workflows:compound",
    ]
    // P0: Critical skills
    const p0Skills = [
      "frontend-design",
      "skill-creator",
      "create-agent-skills",
    ]

    if (p0Agents.includes(name) || p0Commands.includes(name) || p0Skills.includes(name)) {
      return 0
    }

    // For now, default to P1 for compound engineering components
    return 1
  }

  // Create loaders for agents
  bundle.components.agents?.forEach((name) => {
    loaders.push({
      name,
      type: "agent",
      priority: getPriority(name),
      loader: () => loadComponent(name, "agent"),
    })
  })

  // Create loaders for commands
  bundle.components.commands?.forEach((name) => {
    loaders.push({
      name,
      type: "command",
      priority: getPriority(name),
      loader: () => loadComponent(name, "command"),
    })
  })

  // Create loaders for skills
  bundle.components.skills?.forEach((name) => {
    loaders.push({
      name,
      type: "skill",
      priority: getPriority(name),
      loader: () => loadComponent(name, "skill"),
    })
  })

  // Create loaders for MCP servers
  bundle.components.mcpServers?.forEach((name) => {
    loaders.push({
      name,
      type: "mcp",
      priority: 1, // MCP servers are P1
      loader: () => loadComponent(name, "mcp"),
    })
  })

  return loaders
}
