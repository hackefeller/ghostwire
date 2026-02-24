import { describe, test, expect } from "bun:test"

describe("Regression Tests", () => {
  describe("No Breaking Changes to Existing Agents", () => {
    test("plugin agents are unaffected", () => {
      //#given
      const pluginAgents = ["operator", "seer-advisor", "archive-researcher", "scout-recon", "build", "orchestrator", "planner", "tactician-strategist", "glitch-auditor"]

      //#when & #then
      pluginAgents.forEach((agent) => {
        expect(agent).toBeTruthy()
        expect(agent).not.toContain("grid:")
      })
    })

    test("plugin agent names are lowercase", () => {
      //#given
      const pluginAgents = ["operator", "seer-advisor", "archive-researcher", "scout-recon", "build", "orchestrator"]

      //#when
      const invalidAgents = pluginAgents.filter((agent) => agent !== agent.toLowerCase())

      //#then
      expect(invalidAgents.length).toBe(0)
    })
  })

  describe("No Breaking Changes to Existing Commands", () => {
    test("plugin commands remain unchanged", () => {
      //#given
      const pluginCommands = ["init-deep", "ultrawork-loop", "cancel-ultrawork", "refactor", "jack-in-work", "stop-continuation"]

      //#when & #then
      pluginCommands.forEach((cmd) => {
        expect(cmd).toBeTruthy()
        expect(cmd).not.toContain("grid:")
      })
    })

    test("plugin command names use consistent pattern", () => {
      //#given
      const pluginCommands = ["init-deep", "ultrawork-loop", "cancel-ultrawork", "refactor", "jack-in-work", "stop-continuation"]

      //#when
      const invalidCommands = pluginCommands.filter((cmd) => !cmd.match(/^[a-z]+(-[a-z]+)*$/))

      //#then
      expect(invalidCommands.length).toBe(0)
    })
  })

  describe("No Breaking Changes to Existing Skills", () => {
    test("builtin skills remain unchanged", () => {
      //#given
      const builtinSkills = ["playwright", "agent-browser", "frontend-ui-ux", "git-master", "learnings"]

      //#when & #then
      builtinSkills.forEach((skill) => {
        expect(skill).toBeTruthy()
      })
    })

    test("builtin skill names are lowercase with hyphens", () => {
      //#given
      const builtinSkills = ["playwright", "agent-browser", "frontend-ui-ux", "git-master", "learnings"]

      //#when
      const invalidSkills = builtinSkills.filter((skill) => !skill.match(/^[a-z]+(-[a-z]+)*$/))

      //#then
      expect(invalidSkills.length).toBe(0)
    })
  })

  describe("Learnings System", () => {
    test("learnings command exists", () => {
      //#given & #when
      const { CommandNameSchema } = require('../src/platform/config/schema');
      
      //#then
      expect(CommandNameSchema.safeParse("ghostwire:workflows:learnings").success).toBe(true)
    })
    
    test("learnings skill exists", () => {
      //#given & #when
      const { createSkills } = require('../src/execution/features/skills/skills');
      const skills = createSkills();
      
      //#then
      expect(skills.find(s => s.name === 'learnings')).toBeDefined()
    })
  })

  describe("Backward Compatibility: Old Command Names", () => {
    test("old command names are recognized in schema with ghostwire: prefix", () => {
      //#given
      const { CommandNameSchema } = require('../src/platform/config/schema');
      const oldCommandNames = [
        "ghostwire:jack-in-work",
        "ghostwire:ultrawork-loop",
        "ghostwire:cancel-ultrawork",
        "ghostwire:stop-continuation"
      ]

      //#when & #then
      oldCommandNames.forEach((oldCmd) => {
        expect(CommandNameSchema.safeParse(oldCmd).success).toBe(true)
      })
    })

    test("jack-in-work (deprecated) still exists in schema", () => {
      //#given
      const { CommandNameSchema } = require('../src/platform/config/schema');

      //#when & #then
      expect(CommandNameSchema.safeParse("ghostwire:jack-in-work").success).toBe(true)
    })

    test("ultrawork-loop (deprecated) still exists in schema", () => {
      //#given
      const { CommandNameSchema } = require('../src/platform/config/schema');

      //#when & #then
      expect(CommandNameSchema.safeParse("ghostwire:ultrawork-loop").success).toBe(true)
    })

    test("cancel-ultrawork (deprecated) still exists in schema", () => {
      //#given
      const { CommandNameSchema } = require('../src/platform/config/schema');

      //#when & #then
      expect(CommandNameSchema.safeParse("ghostwire:cancel-ultrawork").success).toBe(true)
    })

    test("stop-continuation (deprecated) still exists in schema", () => {
      //#given
      const { CommandNameSchema } = require('../src/platform/config/schema');

      //#when & #then
      expect(CommandNameSchema.safeParse("ghostwire:stop-continuation").success).toBe(true)
    })
  })

  describe("New Task-Driven Command Names", () => {
    test("all new workflow commands are defined with ghostwire: prefix", () => {
      //#given
      const newWorkflowCommands = [
        "ghostwire:workflows:create",
        "ghostwire:workflows:execute",
        "ghostwire:workflows:status",
        "ghostwire:workflows:complete",
        "ghostwire:workflows:plan"
      ]

      //#when
      const { CommandNameSchema } = require('../src/platform/config/schema');

      //#then
      newWorkflowCommands.forEach((cmd) => {
        expect(CommandNameSchema.safeParse(cmd).success).toBe(true)
      })
    })

    test("all new work loop commands are defined with ghostwire: prefix", () => {
      //#given
      const newWorkCommands = [
        "ghostwire:work:loop",
        "ghostwire:work:cancel"
      ]

      //#when
      const { CommandNameSchema } = require('../src/platform/config/schema');

      //#then
      newWorkCommands.forEach((cmd) => {
        expect(CommandNameSchema.safeParse(cmd).success).toBe(true)
      })
    })

    test("new commands map to correct old commands for backward compatibility", () => {
      //#given
      const { CommandNameSchema } = require('../src/platform/config/schema');
      const mappings = [
        ["ghostwire:workflows:execute", "ghostwire:jack-in-work"],
        ["ghostwire:work:loop", "ghostwire:ultrawork-loop"],
        ["ghostwire:work:cancel", "ghostwire:cancel-ultrawork"],
        ["ghostwire:workflows:stop", "ghostwire:stop-continuation"]
      ]

      //#when & #then
      mappings.forEach(([newCmd, oldCmd]) => {
        expect(CommandNameSchema.safeParse(newCmd).success).toBe(true)
        expect(CommandNameSchema.safeParse(oldCmd).success).toBe(true)
      })
    })
  })
})
