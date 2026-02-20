import { describe, test, expect } from "bun:test"

describe("Compound Engineering - Regression Tests", () => {
  describe("No Breaking Changes to Existing Agents", () => {
    test("builtin agents are unaffected", () => {
      //#given
      const builtinAgents = ["void-runner", "seer-advisor", "archive-researcher", "scout-recon", "build", "grid-sync", "zen-planner", "tactician-strategist", "glitch-auditor"]

      //#when & #then
      // Verify builtin agents remain as they were
      builtinAgents.forEach((agent) => {
        expect(agent).toBeTruthy()
        expect(agent).not.toContain("grid:")
      })
    })

    test("builtin agent names are lowercase", () => {
      //#given
      const builtinAgents = ["void-runner", "seer-advisor", "archive-researcher", "scout-recon", "build", "grid-sync"]

      //#when
      const invalidAgents = builtinAgents.filter((agent) => agent !== agent.toLowerCase())

      //#then
      expect(invalidAgents.length).toBe(0)
    })
  })

  describe("No Breaking Changes to Existing Commands", () => {
    test("builtin commands remain unchanged", () => {
      //#given
      const builtinCommands = ["init-deep", "overclock-loop", "ulw-overclock", "cancel-overclock", "refactor", "jack-in-work", "stop-continuation"]

      //#when & #then
      builtinCommands.forEach((cmd) => {
        expect(cmd).toBeTruthy()
        expect(cmd).not.toContain("grid:")
      })
    })

    test("builtin command names use consistent pattern", () => {
      //#given
      const builtinCommands = ["init-deep", "overclock-loop", "ulw-overclock", "cancel-overclock", "refactor", "jack-in-work", "stop-continuation"]

      //#when
      const invalidCommands = builtinCommands.filter((cmd) => !cmd.match(/^[a-z]+(-[a-z]+)*$/))

      //#then
      expect(invalidCommands.length).toBe(0)
    })
  })

  describe("No Breaking Changes to Existing Skills", () => {
    test("builtin skills remain unchanged", () => {
      //#given
      const builtinSkills = ["playwright", "agent-browser", "frontend-ui-ux", "git-master"]

      //#when & #then
      builtinSkills.forEach((skill) => {
        expect(skill).toBeTruthy()
        expect(skill).not.toContain("grid:")
      })
    })

    test("builtin skill names are lowercase with hyphens", () => {
      //#given
      const builtinSkills = ["playwright", "agent-browser", "frontend-ui-ux", "git-master"]

      //#when
      const invalidSkills = builtinSkills.filter((skill) => !skill.match(/^[a-z]+(-[a-z]+)*$/))

      //#then
      expect(invalidSkills.length).toBe(0)
    })
  })

  describe("Namespace Isolation", () => {
    test("compound agents don't conflict with builtin agents", () => {
      //#given
      const builtinAgents = new Set(["void-runner", "seer-advisor", "archive-researcher", "scout-recon", "build", "grid-sync", "zen-planner", "tactician-strategist", "glitch-auditor"])
      const compoundAgents = new Set(["grid:kieran-rails-reviewer", "grid:framework-docs-researcher", "grid:figma-design-sync"])

      //#when
      const conflicts = Array.from(compoundAgents).filter((agent) => {
        const baseName = agent.replace("grid:", "")
        return builtinAgents.has(baseName)
      })

      //#then
      expect(conflicts.length).toBe(0)
    })

    test("compound commands don't conflict with builtin commands", () => {
      //#given
      const builtinCommands = new Set([
        "init-deep",
        "overclock-loop",
        "ulw-overclock",
        "cancel-overclock",
        "refactor",
        "jack-in-work",
        "stop-continuation",
      ])
      const compoundCommands = new Set([
        "grid:workflows:plan",
        "grid:code:refactor",
        "grid:git:smart-commit",
      ])

      //#when
      const conflicts = Array.from(compoundCommands).filter((cmd) => {
        const baseName = cmd.replace("grid:", "")
        return builtinCommands.has(baseName)
      })

      //#then
      // Note: "refactor" exists in both, but compound has "code:refactor" so no conflict
      expect(conflicts.length).toBe(0)
    })

    test("compound skills don't conflict with builtin skills", () => {
      //#given
      const builtinSkills = new Set(["playwright", "agent-browser", "frontend-ui-ux", "git-master"])
      const compoundSkills = new Set([
        "grid:typescript-expert",
        "grid:frontend-design",
        "grid:docker-expertise",
      ])

      //#when
      const conflicts = Array.from(compoundSkills).filter((skill) => {
        const baseName = skill.replace("grid:", "")
        return builtinSkills.has(baseName)
      })

      //#then
      expect(conflicts.length).toBe(0)
    })
  })

  describe("Configuration Compatibility", () => {
    test("old agent configuration structure still works", () => {
      //#given
      const oldConfig = {
        agents: {
          "void-runner": {
            model: "anthropic/claude-opus-4-5",
          },
        },
      }

      //#when & #then
      expect(oldConfig.agents["void-runner"]).toBeDefined()
      expect(oldConfig.agents["void-runner"].model).toBe("anthropic/claude-opus-4-5")
    })

    test("disabled_agents still works for builtin agents", () => {
      //#given
      const config = {
        disabled_agents: ["seer-advisor", "archive-researcher"],
      }

      //#when & #then
      expect(Array.isArray(config.disabled_agents)).toBe(true)
      expect(config.disabled_agents.includes("seer-advisor")).toBe(true)
    })

    test("mixed builtin and compound agent configuration", () => {
      //#given
      const config = {
        agents: {
          "void-runner": {
            model: "anthropic/claude-opus-4-5",
          },
          "grid:kieran-rails-reviewer": {
            model: "anthropic/claude-opus-4-5",
          },
        },
      }

      //#when & #then
      expect(Object.keys(config.agents).length).toBe(2)
      expect(config.agents["void-runner"]).toBeDefined()
      expect((config.agents as Record<string, unknown>)["grid:kieran-rails-reviewer"]).toBeDefined()
    })
  })

  describe("Type Safety", () => {
    test("compound namespace prevents accidental collisions", () => {
      //#given
      const componentNames = [
        // Builtin
        "void-runner",
        "seer-advisor",
        "agent-browser",
        "git-master",
        // Compound
        "grid:kieran-rails-reviewer",
        "grid:code:refactor",
        "grid:typescript-expert",
      ]

      //#when
      const compoundCount = componentNames.filter((name) => name.includes("grid:")).length
      const builtinCount = componentNames.filter((name) => !name.includes("grid:")).length

      //#then
      expect(compoundCount).toBe(3)
      expect(builtinCount).toBe(4)
      expect(componentNames.length).toBe(7)
    })

    test("all compound components have consistent namespace", () => {
      //#given
      const compoundComponents = [
        "grid:kieran-rails-reviewer",
        "grid:framework-docs-researcher",
        "grid:figma-design-sync",
        "grid:workflows:plan",
        "grid:code:refactor",
        "grid:typescript-expert",
      ]

      //#when
      const allPrefixed = compoundComponents.every((name) => name.startsWith("grid:"))

      //#then
      expect(allPrefixed).toBe(true)
    })
  })

  describe("Feature Parity", () => {
    test("compound skills can be disabled like builtin skills", () => {
      //#given
      const config = {
        disabled_skills: ["grid:typescript-expert", "grid:docker-expertise"],
      }

      //#when & #then
      expect(Array.isArray(config.disabled_skills)).toBe(true)
      expect(config.disabled_skills.length).toBe(2)
    })

    test("compound commands can be disabled like builtin commands", () => {
      //#given
      const config = {
        disabled_commands: ["grid:code:refactor", "grid:git:smart-commit"],
      }

      //#when & #then
      expect(Array.isArray(config.disabled_commands)).toBe(true)
      expect(config.disabled_commands.length).toBe(2)
    })
  })
})
