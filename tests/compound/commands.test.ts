import { describe, test, expect } from "bun:test"
import { BuiltinCommandNameSchema } from "../../src/config/schema"

describe("Compound Engineering Commands", () => {
  describe("Command Schema Validation", () => {
    test("all compound command names are valid", () => {
      //#given
      const compoundCommands = [
        "ghostwire:workflows:plan",
        "ghostwire:workflows:create",
        "ghostwire:workflows:status",
        "ghostwire:workflows:complete",
        "ghostwire:code:refactor",
        "ghostwire:code:review",
        "ghostwire:code:optimize",
        "ghostwire:code:format",
        "ghostwire:git:smart-commit",
        "ghostwire:git:branch",
        "ghostwire:git:merge",
        "ghostwire:git:cleanup",
        "ghostwire:project:init",
        "ghostwire:project:build",
        "ghostwire:project:deploy",
        "ghostwire:project:test",
        "ghostwire:util:clean",
        "ghostwire:util:backup",
        "ghostwire:util:restore",
        "ghostwire:util:doctor",
        "ghostwire:docs:deploy-docs",
        "ghostwire:docs:release-docs",
        "ghostwire:docs:feature-video",
        "ghostwire:docs:test-browser",
      ]

      //#when
      const results = compoundCommands.map((cmd) => BuiltinCommandNameSchema.safeParse(cmd))

      //#then
      const failures = results.filter((r) => !r.success)
      expect(failures.length).toBe(0)
    })

    test("all command names follow ghostwire:category:action pattern", () => {
      //#given
      const compoundCommands = [
        "ghostwire:workflows:plan",
        "ghostwire:code:refactor",
        "ghostwire:git:smart-commit",
        "ghostwire:project:init",
        "ghostwire:util:clean",
        "ghostwire:docs:deploy-docs",
      ]

      //#when
      const pattern = /^ghostwire:[a-z]+:[a-z-]+$/
      const validCommands = compoundCommands.filter((cmd) => pattern.test(cmd))

      //#then
      expect(validCommands.length).toBe(compoundCommands.length)
    })
  })

  describe("Command Organization", () => {
    test("workflows commands exist (4)", () => {
      //#given
      const workflowCommands = [
        "ghostwire:workflows:plan",
        "ghostwire:workflows:create",
        "ghostwire:workflows:status",
        "ghostwire:workflows:complete",
      ]

      //#when
      const results = workflowCommands.map((cmd) => BuiltinCommandNameSchema.safeParse(cmd))

      //#then
      expect(results.every((r) => r.success)).toBe(true)
    })

    test("code commands exist (4)", () => {
      //#given
      const codeCommands = [
        "ghostwire:code:refactor",
        "ghostwire:code:review",
        "ghostwire:code:optimize",
        "ghostwire:code:format",
      ]

      //#when
      const results = codeCommands.map((cmd) => BuiltinCommandNameSchema.safeParse(cmd))

      //#then
      expect(results.every((r) => r.success)).toBe(true)
    })

    test("git commands exist (4)", () => {
      //#given
      const gitCommands = [
        "ghostwire:git:smart-commit",
        "ghostwire:git:branch",
        "ghostwire:git:merge",
        "ghostwire:git:cleanup",
      ]

      //#when
      const results = gitCommands.map((cmd) => BuiltinCommandNameSchema.safeParse(cmd))

      //#then
      expect(results.every((r) => r.success)).toBe(true)
    })

    test("project commands exist (4)", () => {
      //#given
      const projectCommands = [
        "ghostwire:project:init",
        "ghostwire:project:build",
        "ghostwire:project:deploy",
        "ghostwire:project:test",
      ]

      //#when
      const results = projectCommands.map((cmd) => BuiltinCommandNameSchema.safeParse(cmd))

      //#then
      expect(results.every((r) => r.success)).toBe(true)
    })

    test("util commands exist (4)", () => {
      //#given
      const utilCommands = [
        "ghostwire:util:clean",
        "ghostwire:util:backup",
        "ghostwire:util:restore",
        "ghostwire:util:doctor",
      ]

      //#when
      const results = utilCommands.map((cmd) => BuiltinCommandNameSchema.safeParse(cmd))

      //#then
      expect(results.every((r) => r.success)).toBe(true)
    })

    test("docs commands exist (4)", () => {
      //#given
      const docCommands = [
        "ghostwire:docs:deploy-docs",
        "ghostwire:docs:release-docs",
        "ghostwire:docs:feature-video",
        "ghostwire:docs:test-browser",
      ]

      //#when
      const results = docCommands.map((cmd) => BuiltinCommandNameSchema.safeParse(cmd))

      //#then
      expect(results.every((r) => r.success)).toBe(true)
    })
  })

  describe("Command Categories", () => {
    test("24 total compound commands", () => {
      //#given
      const allCommands = [
        "ghostwire:workflows:plan",
        "ghostwire:workflows:create",
        "ghostwire:workflows:status",
        "ghostwire:workflows:complete",
        "ghostwire:code:refactor",
        "ghostwire:code:review",
        "ghostwire:code:optimize",
        "ghostwire:code:format",
        "ghostwire:git:smart-commit",
        "ghostwire:git:branch",
        "ghostwire:git:merge",
        "ghostwire:git:cleanup",
        "ghostwire:project:init",
        "ghostwire:project:build",
        "ghostwire:project:deploy",
        "ghostwire:project:test",
        "ghostwire:util:clean",
        "ghostwire:util:backup",
        "ghostwire:util:restore",
        "ghostwire:util:doctor",
        "ghostwire:docs:deploy-docs",
        "ghostwire:docs:release-docs",
        "ghostwire:docs:feature-video",
        "ghostwire:docs:test-browser",
      ]

      //#when
      const validCount = allCommands.filter((cmd) => BuiltinCommandNameSchema.safeParse(cmd).success).length

      //#then
      expect(validCount).toBe(24)
    })

    test("no duplicate commands", () => {
      //#given
      const allCommands = [
        "ghostwire:workflows:plan",
        "ghostwire:workflows:create",
        "ghostwire:workflows:status",
        "ghostwire:workflows:complete",
        "ghostwire:code:refactor",
        "ghostwire:code:review",
        "ghostwire:code:optimize",
        "ghostwire:code:format",
        "ghostwire:git:smart-commit",
        "ghostwire:git:branch",
        "ghostwire:git:merge",
        "ghostwire:git:cleanup",
        "ghostwire:project:init",
        "ghostwire:project:build",
        "ghostwire:project:deploy",
        "ghostwire:project:test",
        "ghostwire:util:clean",
        "ghostwire:util:backup",
        "ghostwire:util:restore",
        "ghostwire:util:doctor",
        "ghostwire:docs:deploy-docs",
        "ghostwire:docs:release-docs",
        "ghostwire:docs:feature-video",
        "ghostwire:docs:test-browser",
      ]

      //#when
      const uniqueCommands = new Set(allCommands)

      //#then
      expect(uniqueCommands.size).toBe(allCommands.length)
    })
  })
})
