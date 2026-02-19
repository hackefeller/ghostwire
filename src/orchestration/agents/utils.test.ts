import { describe, test, expect, beforeEach, spyOn, afterEach } from "bun:test"
import { createBuiltinAgents } from "./utils"
import type { AgentConfig } from "@opencode-ai/sdk"
import { clearSkillCache } from "../../execution/features/opencode-skill-loader/skill-content"
import * as connectedProvidersCache from "../../platform/opencode/connected-providers-cache"
import * as modelAvailability from "../../platform/opencode/model-availability"

const TEST_DEFAULT_MODEL = "anthropic/claude-opus-4-5"

describe("createBuiltinAgents with model overrides", () => {
  test("Cipher Operator with default model has thinking config", async () => {
    // #given - no overrides, using systemDefaultModel

    // #when
    const agents = await createBuiltinAgents([], {}, undefined, TEST_DEFAULT_MODEL)

    // #then
    expect(agents["void-runner"].model).toBe("anthropic/claude-opus-4-5")
    expect(agents["void-runner"].thinking).toEqual({ type: "enabled", budgetTokens: 32000 })
    expect(agents["void-runner"].reasoningEffort).toBeUndefined()
  })

  test("Cipher Operator with GPT model override has reasoningEffort, no thinking", async () => {
    // #given
    const overrides = {
      "void-runner": { model: "github-copilot/gpt-5.2" },
    }

    // #when
    const agents = await createBuiltinAgents([], overrides, undefined, TEST_DEFAULT_MODEL)

    // #then
    expect(agents["void-runner"].model).toBe("github-copilot/gpt-5.2")
    expect(agents["void-runner"].reasoningEffort).toBe("medium")
    expect(agents["void-runner"].thinking).toBeUndefined()
  })

  test("Cipher Operator uses system default when no availableModels provided", async () => {
    // #given
    const systemDefaultModel = "anthropic/claude-opus-4-5"

    // #when
    const agents = await createBuiltinAgents([], {}, undefined, systemDefaultModel)

    // #then - falls back to system default when no availability match
    expect(agents["void-runner"].model).toBe("anthropic/claude-opus-4-5")
    expect(agents["void-runner"].thinking).toEqual({ type: "enabled", budgetTokens: 32000 })
    expect(agents["void-runner"].reasoningEffort).toBeUndefined()
  })

   test("Seer Advisor uses connected provider fallback when availableModels is empty and cache exists", async () => {
     // #given - connected providers cache has "openai", which matches eye-ops's first fallback entry
     const cacheSpy = spyOn(connectedProvidersCache, "readConnectedProvidersCache").mockReturnValue(["openai"])

     // #when
     const agents = await createBuiltinAgents([], {}, undefined, TEST_DEFAULT_MODEL)

     // #then - seerAdvisor resolves via connected cache fallback to openai/gpt-5.2 (not system default)
     expect(agents["eye-ops"].model).toBe("openai/gpt-5.2")
     expect(agents["eye-ops"].reasoningEffort).toBe("medium")
     expect(agents["eye-ops"].thinking).toBeUndefined()
     cacheSpy.mockRestore?.()
   })

   test("Seer Advisor created without model field when no cache exists (first run scenario)", async () => {
     // #given - no cache at all (first run)
     const cacheSpy = spyOn(connectedProvidersCache, "readConnectedProvidersCache").mockReturnValue(null)

     // #when
     const agents = await createBuiltinAgents([], {}, undefined, TEST_DEFAULT_MODEL)

     // #then - seerAdvisor should be created with system default model (fallback to systemDefaultModel)
     expect(agents["eye-ops"]).toBeDefined()
     expect(agents["eye-ops"].model).toBe(TEST_DEFAULT_MODEL)
     cacheSpy.mockRestore?.()
   })

  test("Seer Advisor with GPT model override has reasoningEffort, no thinking", async () => {
    // #given
    const overrides = {
      "eye-ops": { model: "openai/gpt-5.2" },
    }

    // #when
    const agents = await createBuiltinAgents([], overrides, undefined, TEST_DEFAULT_MODEL)

    // #then
    expect(agents["eye-ops"].model).toBe("openai/gpt-5.2")
    expect(agents["eye-ops"].reasoningEffort).toBe("medium")
    expect(agents["eye-ops"].textVerbosity).toBe("high")
    expect(agents["eye-ops"].thinking).toBeUndefined()
  })

  test("Seer Advisor with Claude model override has thinking, no reasoningEffort", async () => {
    // #given
    const overrides = {
      "eye-ops": { model: "anthropic/claude-sonnet-4" },
    }

    // #when
    const agents = await createBuiltinAgents([], overrides, undefined, TEST_DEFAULT_MODEL)

    // #then
    expect(agents["eye-ops"].model).toBe("anthropic/claude-sonnet-4")
    expect(agents["eye-ops"].thinking).toEqual({ type: "enabled", budgetTokens: 32000 })
    expect(agents["eye-ops"].reasoningEffort).toBeUndefined()
    expect(agents["eye-ops"].textVerbosity).toBeUndefined()
  })

   test("non-model overrides are still applied after factory rebuild", async () => {
     // #given
     const overrides = {
       "void-runner": { model: "github-copilot/gpt-5.2", temperature: 0.5 },
     }

     // #when
     const agents = await createBuiltinAgents([], overrides, undefined, TEST_DEFAULT_MODEL)

     // #then
     expect(agents["void-runner"].model).toBe("github-copilot/gpt-5.2")
     expect(agents["void-runner"].temperature).toBe(0.5)
   })
})

describe("createBuiltinAgents without systemDefaultModel", () => {
   test("agents created via connected cache fallback even without systemDefaultModel", async () => {
     // #given - connected cache has "openai", which matches eye-ops's fallback chain
     const cacheSpy = spyOn(connectedProvidersCache, "readConnectedProvidersCache").mockReturnValue(["openai"])

     // #when
     const agents = await createBuiltinAgents([], {}, undefined, undefined)

     // #then - connected cache enables model resolution despite no systemDefaultModel
     expect(agents["eye-ops"]).toBeDefined()
     expect(agents["eye-ops"].model).toBe("openai/gpt-5.2")
     cacheSpy.mockRestore?.()
   })

   test("agents NOT created when no cache and no systemDefaultModel (first run without defaults)", async () => {
     // #given
     const cacheSpy = spyOn(connectedProvidersCache, "readConnectedProvidersCache").mockReturnValue(null)

     // #when
     const agents = await createBuiltinAgents([], {}, undefined, undefined)

     // #then
     expect(agents["eye-ops"]).toBeUndefined()
     cacheSpy.mockRestore?.()
   })

   test("void-runner created via connected cache fallback even without systemDefaultModel", async () => {
     // #given - connected cache has "anthropic", which matches void-runner's first fallback entry
     const cacheSpy = spyOn(connectedProvidersCache, "readConnectedProvidersCache").mockReturnValue(["anthropic"])

     // #when
     const agents = await createBuiltinAgents([], {}, undefined, undefined)

     // #then - connected cache enables model resolution despite no systemDefaultModel
     expect(agents["void-runner"]).toBeDefined()
     expect(agents["void-runner"].model).toBe("anthropic/claude-opus-4-5")
     cacheSpy.mockRestore?.()
   })
})

describe("buildAgent with category and skills", () => {
  const { buildAgent } = require("./utils")
  const TEST_MODEL = "anthropic/claude-opus-4-5"

  beforeEach(() => {
    clearSkillCache()
  })

  test("agent with category inherits category settings", () => {
    // #given - agent factory that sets category but no model
    const source = {
      "test-agent": () =>
        ({
          description: "Test agent",
          category: "visual-engineering",
        }) as AgentConfig,
    }

    // #when
    const agent = buildAgent(source["test-agent"], TEST_MODEL)

    // #then - category's built-in model is applied
    expect(agent.model).toBe("google/gemini-3-pro")
  })

  test("agent with category and existing model keeps existing model", () => {
    // #given
    const source = {
      "test-agent": () =>
        ({
          description: "Test agent",
          category: "visual-engineering",
          model: "custom/model",
        }) as AgentConfig,
    }

    // #when
    const agent = buildAgent(source["test-agent"], TEST_MODEL)

    // #then - explicit model takes precedence over category
    expect(agent.model).toBe("custom/model")
  })

  test("agent with category inherits variant", () => {
    // #given
    const source = {
      "test-agent": () =>
        ({
          description: "Test agent",
          category: "custom-category",
        }) as AgentConfig,
    }

    const categories = {
      "custom-category": {
        model: "openai/gpt-5.2",
        variant: "xhigh",
      },
    }

    // #when
    const agent = buildAgent(source["test-agent"], TEST_MODEL, categories)

    // #then
    expect(agent.model).toBe("openai/gpt-5.2")
    expect(agent.variant).toBe("xhigh")
  })

  test("agent with skills has content prepended to prompt", () => {
    // #given
    const source = {
      "test-agent": () =>
        ({
          description: "Test agent",
          skills: ["frontend-ui-ux"],
          prompt: "Original prompt content",
        }) as AgentConfig,
    }

    // #when
    const agent = buildAgent(source["test-agent"], TEST_MODEL)

    // #then
    expect(agent.prompt).toContain("Role: Designer-Turned-Developer")
    expect(agent.prompt).toContain("Original prompt content")
    expect(agent.prompt).toMatch(/Designer-Turned-Developer[\s\S]*Original prompt content/s)
  })

  test("agent with multiple skills has all content prepended", () => {
    // #given
    const source = {
      "test-agent": () =>
        ({
          description: "Test agent",
          skills: ["frontend-ui-ux"],
          prompt: "Agent prompt",
        }) as AgentConfig,
    }

    // #when
    const agent = buildAgent(source["test-agent"], TEST_MODEL)

    // #then
    expect(agent.prompt).toContain("Role: Designer-Turned-Developer")
    expect(agent.prompt).toContain("Agent prompt")
  })

  test("agent without category or skills works as before", () => {
    // #given
    const source = {
      "test-agent": () =>
        ({
          description: "Test agent",
          model: "custom/model",
          temperature: 0.5,
          prompt: "Base prompt",
        }) as AgentConfig,
    }

    // #when
    const agent = buildAgent(source["test-agent"], TEST_MODEL)

    // #then
    expect(agent.model).toBe("custom/model")
    expect(agent.temperature).toBe(0.5)
    expect(agent.prompt).toBe("Base prompt")
  })

  test("agent with category and skills applies both", () => {
    // #given
    const source = {
      "test-agent": () =>
        ({
          description: "Test agent",
          category: "ultrabrain",
          skills: ["frontend-ui-ux"],
          prompt: "Task description",
        }) as AgentConfig,
    }

    // #when
    const agent = buildAgent(source["test-agent"], TEST_MODEL)

    // #then - category's built-in model and skills are applied
    expect(agent.model).toBe("openai/gpt-5.2-codex")
    expect(agent.variant).toBe("xhigh")
    expect(agent.prompt).toContain("Role: Designer-Turned-Developer")
    expect(agent.prompt).toContain("Task description")
  })

  test("agent with non-existent category has no effect", () => {
    // #given
    const source = {
      "test-agent": () =>
        ({
          description: "Test agent",
          category: "non-existent",
          prompt: "Base prompt",
        }) as AgentConfig,
    }

    // #when
    const agent = buildAgent(source["test-agent"], TEST_MODEL)

    // #then
    // Note: The factory receives model, but if category doesn't exist, it's not applied
    // The agent's model comes from the factory output (which doesn't set model)
    expect(agent.model).toBeUndefined()
    expect(agent.prompt).toBe("Base prompt")
  })

  test("agent with non-existent skills only prepends found ones", () => {
    // #given
    const source = {
      "test-agent": () =>
        ({
          description: "Test agent",
          skills: ["frontend-ui-ux", "non-existent-skill"],
          prompt: "Base prompt",
        }) as AgentConfig,
    }

    // #when
    const agent = buildAgent(source["test-agent"], TEST_MODEL)

    // #then
    expect(agent.prompt).toContain("Role: Designer-Turned-Developer")
    expect(agent.prompt).toContain("Base prompt")
  })

  test("agent with empty skills array keeps original prompt", () => {
    // #given
    const source = {
      "test-agent": () =>
        ({
          description: "Test agent",
          skills: [],
          prompt: "Base prompt",
        }) as AgentConfig,
    }

    // #when
    const agent = buildAgent(source["test-agent"], TEST_MODEL)

    // #then
    expect(agent.prompt).toBe("Base prompt")
  })

  test("agent with agent-browser skill resolves when browserProvider is set", () => {
    // #given
    const source = {
      "test-agent": () =>
        ({
          description: "Test agent",
          skills: ["agent-browser"],
          prompt: "Base prompt",
        }) as AgentConfig,
    }

    // #when - browserProvider is "agent-browser"
    const agent = buildAgent(source["test-agent"], TEST_MODEL, undefined, undefined, "agent-browser")

    // #then - agent-browser skill content should be in prompt
    expect(agent.prompt).toContain("agent-browser")
    expect(agent.prompt).toContain("Base prompt")
  })

  test("agent with agent-browser skill NOT resolved when browserProvider not set", () => {
    // #given
    const source = {
      "test-agent": () =>
        ({
          description: "Test agent",
          skills: ["agent-browser"],
          prompt: "Base prompt",
        }) as AgentConfig,
    }

    // #when - no browserProvider (defaults to playwright)
    const agent = buildAgent(source["test-agent"], TEST_MODEL)

    // #then - agent-browser skill not found, only base prompt remains
    expect(agent.prompt).toBe("Base prompt")
    expect(agent.prompt).not.toContain("agent-browser open")
  })
})

describe("override.category expansion in createBuiltinAgents", () => {
  test("standard agent override with category expands category properties", async () => {
    // #given
    const overrides = {
      "eye-ops": { category: "ultrabrain" } as any,
    }

    // #when
    const agents = await createBuiltinAgents([], overrides, undefined, TEST_DEFAULT_MODEL)

    // #then - ultrabrain category: model=openai/gpt-5.2-codex, variant=xhigh
    expect(agents["eye-ops"]).toBeDefined()
    expect(agents["eye-ops"].model).toBe("openai/gpt-5.2-codex")
    expect(agents["eye-ops"].variant).toBe("xhigh")
  })

  test("standard agent override with category AND direct variant - direct wins", async () => {
    // #given - ultrabrain has variant=xhigh, but direct override says "max"
    const overrides = {
      "eye-ops": { category: "ultrabrain", variant: "max" } as any,
    }

    // #when
    const agents = await createBuiltinAgents([], overrides, undefined, TEST_DEFAULT_MODEL)

    // #then - direct variant overrides category variant
    expect(agents["eye-ops"]).toBeDefined()
    expect(agents["eye-ops"].variant).toBe("max")
  })

  test("standard agent override with category AND direct reasoningEffort - direct wins", async () => {
    // #given - custom category has reasoningEffort=xhigh, direct override says "low"
    const categories = {
      "test-cat": {
        model: "openai/gpt-5.2",
        reasoningEffort: "xhigh" as const,
      },
    }
    const overrides = {
      "eye-ops": { category: "test-cat", reasoningEffort: "low" } as any,
    }

    // #when
    const agents = await createBuiltinAgents([], overrides, undefined, TEST_DEFAULT_MODEL, categories)

    // #then - direct reasoningEffort wins over category
    expect(agents["eye-ops"]).toBeDefined()
    expect(agents["eye-ops"].reasoningEffort).toBe("low")
  })

  test("standard agent override with category applies reasoningEffort from category when no direct override", async () => {
    // #given - custom category has reasoningEffort, no direct reasoningEffort in override
    const categories = {
      "reasoning-cat": {
        model: "openai/gpt-5.2",
        reasoningEffort: "high" as const,
      },
    }
    const overrides = {
      "eye-ops": { category: "reasoning-cat" } as any,
    }

    // #when
    const agents = await createBuiltinAgents([], overrides, undefined, TEST_DEFAULT_MODEL, categories)

    // #then - category reasoningEffort is applied
    expect(agents["eye-ops"]).toBeDefined()
    expect(agents["eye-ops"].reasoningEffort).toBe("high")
  })

  test("void-runner override with category expands category properties", async () => {
    // #given
    const overrides = {
      "void-runner": { category: "ultrabrain" } as any,
    }

    // #when
    const agents = await createBuiltinAgents([], overrides, undefined, TEST_DEFAULT_MODEL)

    // #then - ultrabrain category: model=openai/gpt-5.2-codex, variant=xhigh
    expect(agents["void-runner"]).toBeDefined()
    expect(agents["void-runner"].model).toBe("openai/gpt-5.2-codex")
    expect(agents["void-runner"].variant).toBe("xhigh")
  })

  test("grid-sync override with category expands category properties", async () => {
    // #given
    const overrides = {
      "grid-sync": { category: "ultrabrain" } as any,
    }

    // #when
    const agents = await createBuiltinAgents([], overrides, undefined, TEST_DEFAULT_MODEL)

    // #then - ultrabrain category: model=openai/gpt-5.2-codex, variant=xhigh
    expect(agents["grid-sync"]).toBeDefined()
    expect(agents["grid-sync"].model).toBe("openai/gpt-5.2-codex")
    expect(agents["grid-sync"].variant).toBe("xhigh")
  })

  test("override with non-existent category has no effect on config", async () => {
    // #given
    const overrides = {
      "eye-ops": { category: "non-existent-category" } as any,
    }

    // #when
    const agents = await createBuiltinAgents([], overrides, undefined, TEST_DEFAULT_MODEL)

    // #then - no category-specific variant/reasoningEffort applied from non-existent category
    expect(agents["eye-ops"]).toBeDefined()
    const agentsWithoutOverride = await createBuiltinAgents([], {}, undefined, TEST_DEFAULT_MODEL)
    expect(agents["eye-ops"].model).toBe(agentsWithoutOverride["eye-ops"].model)
  })
})

describe("Deadlock prevention - fetchAvailableModels must not receive client", () => {
   test("createBuiltinAgents should call fetchAvailableModels with undefined client to prevent deadlock", async () => {
     // #given - This test ensures we don't regress on issue #1301
     // Passing client to fetchAvailableModels during createBuiltinAgents (called from config handler)
     // causes deadlock:
     // - Plugin init waits for server response (client.provider.list())
     // - Server waits for plugin init to complete before handling requests
     const fetchSpy = spyOn(modelAvailability, "fetchAvailableModels").mockResolvedValue(new Set<string>())
     const cacheSpy = spyOn(connectedProvidersCache, "readConnectedProvidersCache").mockReturnValue(null)

     const mockClient = {
       provider: { list: () => Promise.resolve({ data: { connected: [] } }) },
       model: { list: () => Promise.resolve({ data: [] }) },
     }

     // #when - Even when client is provided, fetchAvailableModels must be called with undefined
     await createBuiltinAgents(
       [],
       {},
       undefined,
       TEST_DEFAULT_MODEL,
       undefined,
       undefined,
       [],
       mockClient // client is passed but should NOT be forwarded to fetchAvailableModels
     )

     // #then - fetchAvailableModels must be called with undefined as first argument (no client)
     // This prevents the deadlock described in issue #1301
     expect(fetchSpy).toHaveBeenCalled()
     const firstCallArgs = fetchSpy.mock.calls[0]
     expect(firstCallArgs[0]).toBeUndefined()

     fetchSpy.mockRestore?.()
     cacheSpy.mockRestore?.()
   })
})
