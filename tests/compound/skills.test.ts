import { describe, test, expect } from "bun:test"
import { COMPOUND_SKILLS, COMPOUND_SKILL_NAMES } from "../../src/features/builtin-skills/compound-skills"

describe("Compound Engineering Skills", () => {
  describe("Skill Definitions", () => {
    test("all 73 skills are defined", () => {
      //#given
      const expectedCount = 73

      //#when
      const actualCount = COMPOUND_SKILLS.length

      //#then
      expect(actualCount).toBe(expectedCount)
    })

    test("all skills have unique names", () => {
      //#given
      const names = COMPOUND_SKILLS.map((skill) => skill.name)

      //#when
      const uniqueNames = new Set(names)

      //#then
      expect(uniqueNames.size).toBe(COMPOUND_SKILLS.length)
    })

    test("all skill names use compound: prefix", () => {
      //#given
      const invalidSkills = COMPOUND_SKILLS.filter((skill) => !skill.name.startsWith("compound:"))

      //#when & #then
      expect(invalidSkills.length).toBe(0)
    })

    test("all skills have descriptions", () => {
      //#given
      const skillsWithoutDesc = COMPOUND_SKILLS.filter((skill) => !skill.description || skill.description.length === 0)

      //#when & #then
      expect(skillsWithoutDesc.length).toBe(0)
    })

    test("all skills have templates", () => {
      //#given
      const skillsWithoutTemplate = COMPOUND_SKILLS.filter((skill) => !skill.template || skill.template.length === 0)

      //#when & #then
      expect(skillsWithoutTemplate.length).toBe(0)
    })

    test("skill descriptions are informative (min 20 chars)", () => {
      //#given
      const shortDescriptions = COMPOUND_SKILLS.filter((skill) => skill.description.length < 20)

      //#when & #then
      expect(shortDescriptions.length).toBe(0)
    })

    test("skill templates contain meaningful content", () => {
      //#given
      const thinTemplates = COMPOUND_SKILLS.filter((skill) => skill.template.length < 50)

      //#when & #then
      expect(thinTemplates.length).toBe(0)
    })
  })

  describe("Skill Categories", () => {
    test("development skills are properly categorized (25 skills)", () => {
      //#given
      const devSkills = COMPOUND_SKILLS.filter((s) =>
        ["typescript-expert", "python-expert", "ruby-expert", "go-expert", "rust-expert", "react-expert", "vue-expert", "next-expert", "node-expert", "database-expert", "api-design-expert", "testing-expert", "security-expert", "performance-expert", "refactoring-expert", "documentation-code", "dependency-management", "architecture-design", "code-review", "cli-development", "web-scraping", "integration-expertise", "monorepo-management", "type-system-expert", "algorithm-expert"].some(
          (keyword) => s.name.includes(keyword)
        )
      )

      //#when & #then
      expect(devSkills.length).toBe(25)
    })

    test("design skills are properly categorized (18 skills)", () => {
      //#given
      const designSkills = COMPOUND_SKILLS.filter((s) =>
        ["frontend-design", "figma-expertise", "design-system", "accessibility-expert", "responsive-design", "animation-expertise", "color-typography", "interaction-design", "visual-design", "dark-mode-design", "design-documentation", "user-research", "branding-expertise", "icon-design", "illustration-expertise", "css-expertise", "tailwind-mastery", "component-design"].some(
          (keyword) => s.name.includes(keyword)
        )
      )

      //#when & #then
      expect(designSkills.length).toBe(18)
    })

    test("devops skills are properly categorized (12 skills)", () => {
      //#given
      const devopsSkills = COMPOUND_SKILLS.filter((s) =>
        ["docker-expertise", "kubernetes-expert", "ci-cd-expert", "terraform-expertise", "aws-expert", "gcp-expertise", "monitoring-expert", "security-infrastructure", "database-ops", "networking-devops", "scaling-expertise", "disaster-recovery"].some(
          (keyword) => s.name.includes(keyword)
        )
      )

      //#when & #then
      expect(devopsSkills.length).toBe(12)
    })

    test("documentation skills are properly categorized (10 skills)", () => {
      //#given
      const docSkills = COMPOUND_SKILLS.filter((s) =>
        ["api-documentation", "technical-writing", "readme-expertise", "tutorial-creation", "changelog-expertise", "documentation-site", "architecture-documentation", "video-documentation", "contributing-guides", "knowledge-base"].some(
          (keyword) => s.name.includes(keyword)
        )
      )

      //#when & #then
      expect(docSkills.length).toBe(10)
    })

    test("analysis skills are properly categorized (8 skills)", () => {
      //#given
      const analysisSkills = COMPOUND_SKILLS.filter((s) =>
        ["code-analysis", "performance-analysis", "security-analysis", "git-analysis", "dependency-analysis", "data-analysis", "trend-analysis", "cost-analysis"].some(
          (keyword) => s.name.includes(keyword)
        )
      )

      //#when & #then
      expect(analysisSkills.length).toBe(8)
    })
  })

  describe("Skill Names Export", () => {
    test("COMPOUND_SKILL_NAMES matches COMPOUND_SKILLS count", () => {
      //#given
      const expectedCount = COMPOUND_SKILLS.length

      //#when
      const actualCount = COMPOUND_SKILL_NAMES.length

      //#then
      expect(actualCount).toBe(expectedCount)
    })

    test("all skill names in export are valid", () => {
      //#given
      const skillNameSet = new Set(COMPOUND_SKILLS.map((s) => s.name))

      //#when
      const invalidNames = COMPOUND_SKILL_NAMES.filter((name) => !skillNameSet.has(name))

      //#then
      expect(invalidNames.length).toBe(0)
    })
  })

  describe("Skill Interface Compliance", () => {
    test("all skills are valid BuiltinSkill objects", () => {
      //#given & #when
      const invalidSkills = COMPOUND_SKILLS.filter((skill) => {
        return (
          typeof skill.name !== "string" ||
          typeof skill.description !== "string" ||
          typeof skill.template !== "string" ||
          !skill.name.length ||
          !skill.description.length ||
          !skill.template.length
        )
      })

      //#then
      expect(invalidSkills.length).toBe(0)
    })

    test("no skills have placeholder content", () => {
      //#given
      const placeholderSkills = COMPOUND_SKILLS.filter((skill) =>
        ["TODO", "PLACEHOLDER", "FIXME", "XXX", "IMPLEMENT ME"].some((marker) =>
          skill.description.toUpperCase().includes(marker) || skill.template.toUpperCase().includes(marker)
        )
      )

      //#when & #then
      expect(placeholderSkills.length).toBe(0)
    })
  })
})
