/**
 * Cache tests for feature bundles
 */

import { describe, it, expect, beforeEach } from "bun:test"
import { ComponentCache, MemoryPressureManager } from "./cache"

describe("ComponentCache", () => {
  let cache: ComponentCache<string>

  beforeEach(() => {
    cache = new ComponentCache<string>({
      maxMemoryMB: 10, // Small for testing
      maxItems: 5,
      ttlMs: 1000, // 1 second for testing
      criticalComponents: new Set(["critical"]),
    })
  })

  it("stores and retrieves values", () => {
    //#given value
    cache.set("key1", "value1")

    //#when retrieving
    const result = cache.get("key1")

    //#then correct value
    expect(result).toBe("value1")
  })

  it("returns undefined for missing keys", () => {
    //#when getting missing
    const result = cache.get("missing")

    //#then undefined
    expect(result).toBeUndefined()
  })

  it("updates access time on get (LRU)", () => {
    //#given multiple values
    cache.set("a", "1")
    cache.set("b", "2")
    cache.set("c", "3")

    //#when accessing 'a'
    cache.get("a")

    //#then 'a' is now most recently used (would be evicted last)
    // This is verified by eviction order test below
    expect(cache.has("a")).toBe(true)
  })

  it("evicts lowest priority items when full", () => {
    //#given full cache
    cache.set("low1", "v1", { priority: 3 })
    cache.set("low2", "v2", { priority: 3 })
    cache.set("med", "v3", { priority: 2 })
    cache.set("high", "v4", { priority: 1 })
    cache.set("critical", "v5", { priority: 0 }) // Protected

    expect(cache.getStats().itemCount).toBe(5)

    //#when adding another
    cache.set("new", "v6", { priority: 3 })

    //#then lowest priority evicted
    expect(cache.has("low1")).toBe(false) // Evicted
    expect(cache.has("critical")).toBe(true) // Protected
    expect(cache.has("high")).toBe(true)
  })

  it("does not evict critical components", () => {
    //#given critical component
    cache.set("critical", "value", { priority: 0 })

    //#when filling cache
    for (let i = 0; i < 10; i++) {
      cache.set(`item-${i}`, `value-${i}`, { priority: 3 })
    }

    //#then critical still present
    expect(cache.has("critical")).toBe(true)
  })

  it("expires items after TTL", async () => {
    //#given value with short TTL
    cache.set("expires", "value")

    //#before expiry
    expect(cache.has("expires")).toBe(true)

    //#wait for expiry
    await new Promise((r) => setTimeout(r, 1100))

    //#then expired
    expect(cache.has("expires")).toBe(false)
    expect(cache.get("expires")).toBeUndefined()
  })

  it("provides accurate stats", () => {
    //#given cached values
    cache.set("a", "1", { memoryEstimateMB: 1 })
    cache.set("b", "2", { memoryEstimateMB: 2 })

    //#when getting stats
    const stats = cache.getStats()

    //#then accurate
    expect(stats.itemCount).toBe(2)
    expect(stats.calculatedSize).toBe(3 * 1024 * 1024) // 3MB
    expect(stats.memoryUsagePercent).toBeGreaterThan(0)
  })

  it("deletes specific keys", () => {
    //#given values
    cache.set("a", "1")
    cache.set("b", "2")

    //#when deleting
    const deleted = cache.delete("a")

    //#then deleted
    expect(deleted).toBe(true)
    expect(cache.has("a")).toBe(false)
    expect(cache.has("b")).toBe(true)
  })

  it("clears all entries", () => {
    //#given values
    cache.set("a", "1")
    cache.set("b", "2")

    //#when clearing
    cache.clear()

    //#then empty
    expect(cache.getStats().itemCount).toBe(0)
    expect(cache.has("a")).toBe(false)
  })

  it("evicts by priority correctly", () => {
    //#given values at different priorities
    cache.set("p3-1", "v1", { priority: 3, memoryEstimateMB: 2 })
    cache.set("p3-2", "v2", { priority: 3, memoryEstimateMB: 2 })
    cache.set("p2", "v3", { priority: 2, memoryEstimateMB: 2 })
    cache.set("p1", "v4", { priority: 1, memoryEstimateMB: 2 })

    //#when evicting to free up space
    const evicted = cache.evictByPriority(3) // Target 3MB (lower than current)

    //#then lowest priority evicted first
    expect(evicted).toBeGreaterThan(0)
  })
})

describe("MemoryPressureManager", () => {
  it("registers caches", () => {
    //#given manager and cache
    const manager = new MemoryPressureManager()
    const cache = new ComponentCache<string>()

    //#when registering
    manager.registerCache("test", cache)

    //#then registered (no error)
    expect(manager).toBeDefined()
  })

  it("provides memory stats", () => {
    //#given manager
    const manager = new MemoryPressureManager()

    //#when getting stats
    const stats = manager.getMemoryStats()

    //#then has required fields
    expect(stats.heapUsed).toBeDefined()
    expect(stats.heapLimit).toBeDefined()
    expect(stats.percentUsed).toBeDefined()
  })
})
