/**
 * LRU Cache with memory pressure handling for feature bundles
 * 
 * Provides size-based eviction, TTL support, and memory pressure monitoring.
 */

import type { Priority } from "./lazy-loader"

export interface LRUCacheEntry<T> {
  value: T
  priority: Priority
  lastAccessed: number
  memoryEstimate: number // bytes
}

export interface LRUCacheConfig {
  maxMemoryMB: number
  maxItems: number
  ttlMs: number
  criticalComponents: Set<string>
}

export const DEFAULT_LRU_CONFIG: LRUCacheConfig = {
  maxMemoryMB: 512,
  maxItems: 100,
  ttlMs: 1000 * 60 * 30, // 30 minutes
  criticalComponents: new Set([
    "atlas",
    "sisyphus",
    "oracle",
  ]),
}

export interface MemoryStats {
  itemCount: number
  calculatedSize: number
  maxSize: number
  memoryUsagePercent: number
}

/**
 * Simple LRU Cache implementation for feature bundle components
 */
export class ComponentCache<T> {
  private cache: Map<string, LRUCacheEntry<T>>
  private config: LRUCacheConfig
  private currentMemoryUsage: number = 0

  constructor(config: Partial<LRUCacheConfig> = {}) {
    this.config = { ...DEFAULT_LRU_CONFIG, ...config }
    this.cache = new Map()
  }

  /**
   * Get a value from cache
   */
  get(name: string): T | undefined {
    const entry = this.cache.get(name)
    
    if (!entry) return undefined

    // Check if expired
    if (this.isExpired(entry)) {
      this.cache.delete(name)
      this.currentMemoryUsage -= entry.memoryEstimate
      return undefined
    }

    // Update access time (LRU behavior)
    entry.lastAccessed = Date.now()
    
    // Move to end (most recently used)
    this.cache.delete(name)
    this.cache.set(name, entry)

    return entry.value
  }

  /**
   * Set a value in cache
   */
  set(
    name: string,
    value: T,
    options: {
      priority?: Priority
      memoryEstimateMB?: number
    } = {}
  ): void {
    // Check if component is critical (P0)
    const isCritical = this.config.criticalComponents.has(name)
    const priority = isCritical ? 0 : (options.priority ?? 99)

    const memoryEstimate = (options.memoryEstimateMB ?? 1) * 1024 * 1024

    // Check if we need to evict
    if (this.shouldEvict(memoryEstimate)) {
      this.evictForSpace(memoryEstimate)
    }

    const entry: LRUCacheEntry<T> = {
      value,
      priority,
      lastAccessed: Date.now(),
      memoryEstimate,
    }

    // Remove old entry if exists
    const oldEntry = this.cache.get(name)
    if (oldEntry) {
      this.currentMemoryUsage -= oldEntry.memoryEstimate
    }

    this.cache.set(name, entry)
    this.currentMemoryUsage += memoryEstimate
  }

  /**
   * Check if a key exists in cache
   */
  has(name: string): boolean {
    const entry = this.cache.get(name)
    if (!entry) return false
    
    if (this.isExpired(entry)) {
      this.cache.delete(name)
      this.currentMemoryUsage -= entry.memoryEstimate
      return false
    }

    return true
  }

  /**
   * Delete a specific key
   */
  delete(name: string): boolean {
    const entry = this.cache.get(name)
    if (entry) {
      this.currentMemoryUsage -= entry.memoryEstimate
      return this.cache.delete(name)
    }
    return false
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.cache.clear()
    this.currentMemoryUsage = 0
  }

  /**
   * Get cache statistics
   */
  getStats(): MemoryStats {
    const maxSizeBytes = this.config.maxMemoryMB * 1024 * 1024
    return {
      itemCount: this.cache.size,
      calculatedSize: this.currentMemoryUsage,
      maxSize: maxSizeBytes,
      memoryUsagePercent: (this.currentMemoryUsage / maxSizeBytes) * 100,
    }
  }

  /**
   * Evict entries by priority to free up space
   */
  evictByPriority(targetMemoryMB: number): number {
    const targetBytes = targetMemoryMB * 1024 * 1024
    let evicted = 0

    // Get entries sorted by priority (highest number = lowest priority)
    const entries = Array.from(this.cache.entries())
      .filter(([key]) => !this.config.criticalComponents.has(key))
      .sort((a, b) => b[1].priority - a[1].priority)

    for (const [key, entry] of entries) {
      if (this.currentMemoryUsage <= targetBytes) break

      this.cache.delete(key)
      this.currentMemoryUsage -= entry.memoryEstimate
      evicted++

      console.log(`[ComponentCache] Evicted ${key} (priority: ${entry.priority})`)
    }

    return evicted
  }

  /**
   * Get all keys in cache
   */
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  private isExpired(entry: LRUCacheEntry<T>): boolean {
    const age = Date.now() - entry.lastAccessed
    return age > this.config.ttlMs
  }

  private shouldEvict(newEntrySize: number): boolean {
    const maxSizeBytes = this.config.maxMemoryMB * 1024 * 1024
    return this.currentMemoryUsage + newEntrySize > maxSizeBytes ||
           this.cache.size >= this.config.maxItems
  }

  private evictForSpace(requiredBytes: number): void {
    const maxSizeBytes = this.config.maxMemoryMB * 1024 * 1024
    
    // Evict lowest priority items until we have space
    while (
      (this.currentMemoryUsage + requiredBytes > maxSizeBytes ||
       this.cache.size >= this.config.maxItems) &&
      this.cache.size > 0
    ) {
      // Find lowest priority non-critical entry
      let lowestPriorityEntry: [string, LRUCacheEntry<T>] | null = null
      
      for (const [key, entry] of this.cache.entries()) {
        if (this.config.criticalComponents.has(key)) continue
        
        if (!lowestPriorityEntry || entry.priority > lowestPriorityEntry[1].priority) {
          lowestPriorityEntry = [key, entry]
        }
      }

      if (!lowestPriorityEntry) break // Only critical components left

      const [key, entry] = lowestPriorityEntry
      this.cache.delete(key)
      this.currentMemoryUsage -= entry.memoryEstimate
    }
  }
}

/**
 * Memory pressure manager for monitoring and handling memory limits
 */
export class MemoryPressureManager {
  private config: {
    softLimitPercent: number
    hardLimitPercent: number
    criticalLimitPercent: number
    checkIntervalMs: number
  }
  private checkInterval?: ReturnType<typeof setInterval>
  private caches: Map<string, ComponentCache<unknown>> = new Map()

  constructor(config: Partial<{
    softLimitPercent: number
    hardLimitPercent: number
    criticalLimitPercent: number
    checkIntervalMs: number
  }> = {}) {
    this.config = {
      softLimitPercent: 70,
      hardLimitPercent: 85,
      criticalLimitPercent: 95,
      checkIntervalMs: 5000,
      ...config,
    }
  }

  registerCache(name: string, cache: ComponentCache<unknown>): void {
    this.caches.set(name, cache)
  }

  startMonitoring(): void {
    this.checkInterval = setInterval(() => {
      this.checkMemoryPressure()
    }, this.config.checkIntervalMs)
  }

  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
    }
  }

  private checkMemoryPressure(): void {
    const usage = process.memoryUsage()
    const heapStats = (process as unknown as { memoryUsage(): NodeJS.MemoryUsage; v8: { getHeapStatistics(): { heap_size_limit: number } } }).v8?.getHeapStatistics?.()
    const heapLimitMB = heapStats ? heapStats.heap_size_limit / 1024 / 1024 : 4096 // Default 4GB
    const heapUsedMB = usage.heapUsed / 1024 / 1024
    const usagePercent = (heapUsedMB / heapLimitMB) * 100

    console.log(`[MemoryManager] Heap: ${heapUsedMB.toFixed(1)}MB / ${heapLimitMB.toFixed(1)}MB (${usagePercent.toFixed(1)}%)`)

    if (usagePercent >= this.config.criticalLimitPercent) {
      this.handleCriticalPressure()
    } else if (usagePercent >= this.config.hardLimitPercent) {
      this.handleHardPressure()
    } else if (usagePercent >= this.config.softLimitPercent) {
      this.handleSoftPressure()
    }
  }

  private handleSoftPressure(): void {
    console.warn("[MemoryManager] Soft memory pressure detected - evicting low-priority components")

    for (const [name, cache] of this.caches) {
      const stats = cache.getStats()
      if (stats.memoryUsagePercent > 50) {
        // Evict 20% of non-critical components
        const targetMemory = stats.calculatedSize * 0.8 / (1024 * 1024)
        const evicted = cache.evictByPriority(targetMemory)
        console.log(`[MemoryManager] Evicted ${evicted} items from ${name}`)
      }
    }
  }

  private handleHardPressure(): void {
    console.error("[MemoryManager] HARD memory pressure - aggressive eviction")

    for (const [name, cache] of this.caches) {
      // Evict everything except P0 components
      const stats = cache.getStats()
      const targetMemory = (stats.maxSize / (1024 * 1024)) * 0.3 // Target 30% of max
      const evicted = cache.evictByPriority(targetMemory)
      console.log(`[MemoryManager] Evicted ${evicted} items from ${name}`)
    }
  }

  private handleCriticalPressure(): void {
    console.error("[MemoryManager] CRITICAL memory pressure - emergency cleanup")

    // Trigger GC if available (requires --expose-gc flag)
    if (global.gc) {
      console.log("[MemoryManager] Forcing garbage collection")
      global.gc()
    }

    // Clear all non-critical components from all caches
    for (const [name, cache] of this.caches) {
      const keys = cache.keys()
      for (const key of keys) {
        // Critical components are protected in the cache's criticalComponents set
        // which is checked during eviction
      }
      const stats = cache.getStats()
      const targetMemory = (stats.maxSize / (1024 * 1024)) * 0.2 // Target 20% of max
      cache.evictByPriority(targetMemory)
    }
  }

  getMemoryStats(): {
    heapUsed: string
    heapLimit: string
    percentUsed: string
  } {
    const usage = process.memoryUsage()
    const heapStats = (process as unknown as { memoryUsage(): NodeJS.MemoryUsage; v8: { getHeapStatistics(): { heap_size_limit: number } } }).v8?.getHeapStatistics?.()
    const heapLimitMB = heapStats ? heapStats.heap_size_limit / 1024 / 1024 : 4096

    return {
      heapUsed: `${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      heapLimit: `${heapLimitMB.toFixed(2)} MB`,
      percentUsed: `${((usage.heapUsed / (heapStats?.heap_size_limit ?? 1)) * 100).toFixed(2)}%`,
    }
  }
}
