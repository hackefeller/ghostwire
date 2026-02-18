/**
 * Lazy loader tests for feature bundles
 */

import { describe, it, expect, beforeEach } from "bun:test"
import { PriorityLoader, ComponentLoader, createBundleLoaders } from "./lazy-loader"
import { compoundEngineeringBundle } from "./compound-engineering"

describe("PriorityLoader", () => {
  let loader: PriorityLoader<string>

  beforeEach(() => {
    loader = new PriorityLoader<string>()
  })

  it("registers and loads P0 components immediately", async () => {
    //#given P0 component
    let loaded = false
    loader.register({
      name: "test-p0",
      type: "agent",
      priority: 0,
      loader: async () => {
        loaded = true
        return "p0-value"
      },
    })

    //#when checking immediately
    await new Promise((resolve) => setTimeout(resolve, 10))

    //#then P0 loaded immediately
    expect(loaded).toBe(true)
    expect(loader.isLoaded("test-p0")).toBe(true)
  })

  it("lazy loads P1 components on demand", async () => {
    //#given P1 component
    let loaded = false
    loader.register({
      name: "test-p1",
      type: "command",
      priority: 1,
      loader: async () => {
        loaded = true
        return "p1-value"
      },
    })

    //#before access - not loaded
    expect(loaded).toBe(false)

    //#when accessing
    const result = await loader.get("test-p1")

    //#then loaded on demand
    expect(loaded).toBe(true)
    expect(result).toBe("p1-value")
  })

  it("returns cached value on subsequent gets", async () => {
    //#given component
    let loadCount = 0
    loader.register({
      name: "cached-test",
      type: "skill",
      priority: 1,
      loader: async () => {
        loadCount++
        return `value-${loadCount}`
      },
    })

    //#when accessing multiple times
    const r1 = await loader.get("cached-test")
    const r2 = await loader.get("cached-test")
    const r3 = await loader.get("cached-test")

    //#then cached (loader called only once)
    expect(loadCount).toBe(1)
    expect(r1).toBe(r2)
    expect(r2).toBe(r3)
  })

  it("handles concurrent loads with deduplication", async () => {
    //#given slow loader
    let loadCount = 0
    loader.register({
      name: "concurrent-test",
      type: "agent",
      priority: 1,
      loader: async () => {
        loadCount++
        await new Promise((r) => setTimeout(r, 50))
        return "concurrent-value"
      },
    })

    //#when requesting concurrently
    const [r1, r2, r3] = await Promise.all([
      loader.get("concurrent-test"),
      loader.get("concurrent-test"),
      loader.get("concurrent-test"),
    ])

    //#then deduplicated
    expect(loadCount).toBe(1)
    expect(r1).toBe(r2)
    expect(r2).toBe(r3)
  })

  it("returns undefined for unknown components", async () => {
    //#when getting unregistered
    const result = await loader.get("unknown")

    //#then undefined
    expect(result).toBeUndefined()
  })

  it("provides accurate stats", async () => {
    //#given registered components
    loader.register({ name: "a", type: "agent", priority: 0, loader: async () => "a" })
    loader.register({ name: "b", type: "command", priority: 1, loader: async () => "b" })
    loader.register({ name: "c", type: "skill", priority: 2, loader: async () => "c" })

    //#wait for P0 async load
    await new Promise((resolve) => setTimeout(resolve, 50))

    //#when getting stats
    const stats = loader.getStats()

    //#then accurate
    expect(stats.registered).toBe(3)
    expect(stats.loaded).toBe(1) // Only P0 loaded
  })
})

describe("createBundleLoaders", () => {
  it("creates loaders for all bundle components", () => {
    //#given compound engineering bundle
    const loaders = createBundleLoaders(compoundEngineeringBundle, async () => "test")

    //#when counting
    const p0Loaders = loaders.filter((l) => l.priority === 0)
    const p1Loaders = loaders.filter((l) => l.priority === 1)

    //#then correct priority distribution
    expect(p0Loaders.length).toBeGreaterThan(0) // Should have P0 components
    expect(loaders.length).toBeGreaterThan(p0Loaders.length) // Should have more than just P0
    expect(loaders.length).toBe(
      (compoundEngineeringBundle.components.agents?.length ?? 0) +
        (compoundEngineeringBundle.components.commands?.length ?? 0) +
        (compoundEngineeringBundle.components.skills?.length ?? 0) +
        (compoundEngineeringBundle.components.mcpServers?.length ?? 0)
    )
  })

  it("assigns correct types to loaders", () => {
    //#given loaders
    const loaders = createBundleLoaders(compoundEngineeringBundle, async () => "test")

    //#when checking types
    const agentLoaders = loaders.filter((l) => l.type === "agent")
    const commandLoaders = loaders.filter((l) => l.type === "command")
    const skillLoaders = loaders.filter((l) => l.type === "skill")
    const mcpLoaders = loaders.filter((l) => l.type === "mcp")

    //#then correct counts
    expect(agentLoaders.length).toBe(compoundEngineeringBundle.components.agents?.length ?? 0)
    expect(commandLoaders.length).toBe(compoundEngineeringBundle.components.commands?.length ?? 0)
    expect(skillLoaders.length).toBe(compoundEngineeringBundle.components.skills?.length ?? 0)
    expect(mcpLoaders.length).toBe(compoundEngineeringBundle.components.mcpServers?.length ?? 0)
  })

  it("assigns P0 priority to critical components", () => {
    //#given loaders
    const loaders = createBundleLoaders(compoundEngineeringBundle, async () => "test")

    //#when checking P0 components
    const p0Names = [
      "agent-native-reviewer",
      "architecture-strategist",
      "security-sentinel",
      "/workflows:plan",
      "frontend-design",
    ]

    //#then all P0 components have priority 0
    for (const name of p0Names) {
      const loader = loaders.find((l) => l.name === name)
      if (loader) {
        expect(loader.priority).toBe(0)
      }
    }
  })
})
