import { describe, test, expect } from "bun:test"
import { BuiltinCommandNameSchema } from "../../src/config/schema"

describe("Compound Engineering Commands", () => {
  describe("Command Schema Validation", () => {
    test("all compound command names are valid", () => {
      //#given
      const compoundCommands = [
        "compound:workflows:plan",
        "compound:workflows:create",
        "compound:workflows:status",
        "compound:workflows:complete",
        "compound:code:refactor",
        "compound:code:review",
        "compound:code:optimize",
        "compound:code:format",
        "compound:git:smart-commit",
        "compound:git:branch",
        "compound:git:merge",
        "compound:git:cleanup",
        "compound:project:init",
        "compound:project:build",
        "compound:project:deploy",
        "compound:project:test",
        "compound:util:clean",
        "compound:util:backup",
        "compound:util:restore",
        "compound:util:doctor",
        "compound:docs:deploy-docs",
        "compound:docs:release-docs",
        "compound:docs:feature-video",
        "compound:docs:test-browser",
      ]

      //#when
      const results = compoundCommands.map((cmd) => BuiltinCommandNameSchema.safeParse(cmd))

      //#then
      const failures = results.filter((r) => !r.success)
      expect(failures.length).toBe(0)
    })

    test("all command names follow compound:category:action pattern", () => {
      //#given
      const compoundCommands = [
        "compound:workflows:plan",
        "compound:code:refactor",
        "compound:git:smart-commit",
        "compound:project:init",
        "compound:util:clean",
        "compound:docs:deploy-docs",
      ]

      //#when
      const pattern = /^compound:[a-z]+:[a-z-]+$/
      const validCommands = compoundCommands.filter((cmd) => pattern.test(cmd))

      //#then
      expect(validCommands.length).toBe(compoundCommands.length)
    })
  })

  describe("Command Organization", () => {
    test("workflows commands exist (4)", () => {
      //#given
      const workflowCommands = [
        "compound:workflows:plan",
        "compound:workflows:create",
        "compound:workflows:status",
        "compound:workflows:complete",
      ]

      //#when
      const results = workflowCommands.map((cmd) => BuiltinCommandNameSchema.safeParse(cmd))

      //#then
      expect(results.every((r) => r.success)).toBe(true)
    })

    test("code commands exist (4)", () => {
      //#given
      const codeCommands = [
        "compound:code:refactor",
        "compound:code:review",
        "compound:code:optimize",
        "compound:code:format",
      ]

      //#when
      const results = codeCommands.map((cmd) => BuiltinCommandNameSchema.safeParse(cmd))

      //#then
      expect(results.every((r) => r.success)).toBe(true)
    })

    test("git commands exist (4)", () => {
      //#given
      const gitCommands = [
        "compound:git:smart-commit",
        "compound:git:branch",
        "compound:git:merge",
        "compound:git:cleanup",
      ]

      //#when
      const results = gitCommands.map((cmd) => BuiltinCommandNameSchema.safeParse(cmd))

      //#then
      expect(results.every((r) => r.success)).toBe(true)
    })

    test("project commands exist (4)", () => {
      //#given
      const projectCommands = [
        "compound:project:init",
        "compound:project:build",
        "compound:project:deploy",
        "compound:project:test",
      ]

      //#when
      const results = projectCommands.map((cmd) => BuiltinCommandNameSchema.safeParse(cmd))

      //#then
      expect(results.every((r) => r.success)).toBe(true)
    })

    test("util commands exist (4)", () => {
      //#given
      const utilCommands = [
        "compound:util:clean",
        "compound:util:backup",
        "compound:util:restore",
        "compound:util:doctor",
      ]

      //#when
      const results = utilCommands.map((cmd) => BuiltinCommandNameSchema.safeParse(cmd))

      //#then
      expect(results.every((r) => r.success)).toBe(true)
    })

    test("docs commands exist (4)", () => {
      //#given
      const docCommands = [
        "compound:docs:deploy-docs",
        "compound:docs:release-docs",
        "compound:docs:feature-video",
        "compound:docs:test-browser",
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
        "compound:workflows:plan",
        "compound:workflows:create",
        "compound:workflows:status",
        "compound:workflows:complete",
        "compound:code:refactor",
        "compound:code:review",
        "compound:code:optimize",
        "compound:code:format",
        "compound:git:smart-commit",
        "compound:git:branch",
        "compound:git:merge",
        "compound:git:cleanup",
        "compound:project:init",
        "compound:project:build",
        "compound:project:deploy",
        "compound:project:test",
        "compound:util:clean",
        "compound:util:backup",
        "compound:util:restore",
        "compound:util:doctor",
        "compound:docs:deploy-docs",
        "compound:docs:release-docs",
        "compound:docs:feature-video",
        "compound:docs:test-browser",
      ]

      //#when
      const validCount = allCommands.filter((cmd) => BuiltinCommandNameSchema.safeParse(cmd).success).length

      //#then
      expect(validCount).toBe(24)
    })

    test("no duplicate commands", () => {
      //#given
      const allCommands = [
        "compound:workflows:plan",
        "compound:workflows:create",
        "compound:workflows:status",
        "compound:workflows:complete",
        "compound:code:refactor",
        "compound:code:review",
        "compound:code:optimize",
        "compound:code:format",
        "compound:git:smart-commit",
        "compound:git:branch",
        "compound:git:merge",
        "compound:git:cleanup",
        "compound:project:init",
        "compound:project:build",
        "compound:project:deploy",
        "compound:project:test",
        "compound:util:clean",
        "compound:util:backup",
        "compound:util:restore",
        "compound:util:doctor",
        "compound:docs:deploy-docs",
        "compound:docs:release-docs",
        "compound:docs:feature-video",
        "compound:docs:test-browser",
      ]

      //#when
      const uniqueCommands = new Set(allCommands)

      //#then
      expect(uniqueCommands.size).toBe(allCommands.length)
    })
  })
})
