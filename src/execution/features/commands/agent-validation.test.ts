import { describe, it, expect } from "bun:test";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import {
  VALID_AGENT_IDS,
  VALID_CATEGORIES,
  VALID_COMMAND_NAMES,
  VALID_SKILL_NAMES,
  isValidAgentId,
  isValidCommandName,
  isValidSkillName,
} from "../../../orchestration/agents/constants";

const COMMANDS_DIR = join(import.meta.dir, "commands");
const TEMPLATES_DIR = join(import.meta.dir, "templates");

/**
 * Extract all agent, category, command, and skill references from a file
 */
function extractReferences(content: string): {
  subagentTypes: { value: string; line: number }[];
  categories: { value: string; line: number }[];
  commands: { value: string; line: number }[];
  skills: { value: string; line: number }[];
} {
  const subagentTypes: { value: string; line: number }[] = [];
  const categories: { value: string; line: number }[] = [];
  const commands: { value: string; line: number }[] = [];
  const skills: { value: string; line: number }[] = [];

  const lines = content.split("\n");
  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Match subagent_type="value" or subagent_type='value'
    const subagentTypeRegex = /subagent_type\s*=\s*["']([^"']+)["']/g;
    let match;
    while ((match = subagentTypeRegex.exec(line)) !== null) {
      subagentTypes.push({ value: match[1], line: lineNum });
    }

    // Match category: "value" or category: 'value' (YAML style) or category="value"
    const categoryRegex = /(?:category\s*:\s*|category\s*=\s*)["']([^"']+)["']/g;
    while ((match = categoryRegex.exec(line)) !== null) {
      categories.push({ value: match[1], line: lineNum });
    }

    // Match command names (ghostwire:xxx)
    const commandRegex = /ghostwire:[a-z0-9:-]+/g;
    while ((match = commandRegex.exec(line)) !== null) {
      commands.push({ value: match[0], line: lineNum });
    }

    // Match skill names in load_skills: ["..."] or skills: ["..."]
    const skillRegex = /(?:load_skills|skills)\s*:\s*\[[^\]]*"([^"]+)"[^\]]*\]/g;
    while ((match = skillRegex.exec(line)) !== null) {
      skills.push({ value: match[1], line: lineNum });
    }
  });

  return { subagentTypes, categories, commands, skills };
}

/**
 * Get all TypeScript files in a directory recursively
 */
async function getTsFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getTsFiles(fullPath)));
    } else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) {
      files.push(fullPath);
    }
  }

  return files;
}

describe("Agent Reference Validation", () => {
  it("commands/ must use only valid agent IDs in subagent_type", async () => {
    const files = await getTsFiles(COMMANDS_DIR);
    const errors: string[] = [];

    for (const file of files) {
      const content = await readFile(file, "utf-8");
      const { subagentTypes } = extractReferences(content);

      for (const { value, line } of subagentTypes) {
        if (!isValidAgentId(value)) {
          errors.push(`${file}:${line}: Invalid subagent_type="${value}"`);
        }
      }
    }

    expect(errors).toEqual([]);
  });

  it("templates/ must use only valid agent IDs in subagent_type", async () => {
    const files = await getTsFiles(TEMPLATES_DIR);
    const errors: string[] = [];

    for (const file of files) {
      const content = await readFile(file, "utf-8");
      const { subagentTypes } = extractReferences(content);

      for (const { value, line } of subagentTypes) {
        if (!isValidAgentId(value)) {
          errors.push(`${file}:${line}: Invalid subagent_type="${value}"`);
        }
      }
    }

    expect(errors).toEqual([]);
  });

  it("commands/ must use valid categories", async () => {
    const files = await getTsFiles(COMMANDS_DIR);
    const errors: string[] = [];

    for (const file of files) {
      const content = await readFile(file, "utf-8");
      const { categories } = extractReferences(content);

      for (const { value, line } of categories) {
        if (!VALID_CATEGORIES.includes(value as any)) {
          errors.push(`${file}:${line}: Invalid category="${value}"`);
        }
      }
    }

    expect(errors).toEqual([]);
  });

  it("templates/ must use valid categories", async () => {
    const files = await getTsFiles(TEMPLATES_DIR);
    const errors: string[] = [];

    for (const file of files) {
      const content = await readFile(file, "utf-8");
      const { categories } = extractReferences(content);

      for (const { value, line } of categories) {
        if (!VALID_CATEGORIES.includes(value as any)) {
          errors.push(`${file}:${line}: Invalid category="${value}"`);
        }
      }
    }

    expect(errors).toEqual([]);
  });

  it("commands/ must use valid command names", async () => {
    const files = await getTsFiles(COMMANDS_DIR);
    const errors: string[] = [];

    for (const file of files) {
      const content = await readFile(file, "utf-8");
      const { commands } = extractReferences(content);

      for (const { value, line } of commands) {
        if (!isValidCommandName(value)) {
          errors.push(`${file}:${line}: Invalid command="${value}"`);
        }
      }
    }

    expect(errors).toEqual([]);
  });

  it("templates/ must use valid command names", async () => {
    const files = await getTsFiles(TEMPLATES_DIR);
    const errors: string[] = [];

    for (const file of files) {
      const content = await readFile(file, "utf-8");
      const { commands } = extractReferences(content);

      for (const { value, line } of commands) {
        if (!isValidCommandName(value)) {
          errors.push(`${file}:${line}: Invalid command="${value}"`);
        }
      }
    }

    expect(errors).toEqual([]);
  });

  it("commands/ must use valid skill names", async () => {
    const files = await getTsFiles(COMMANDS_DIR);
    const errors: string[] = [];

    for (const file of files) {
      const content = await readFile(file, "utf-8");
      const { skills } = extractReferences(content);

      for (const { value, line } of skills) {
        if (!isValidSkillName(value)) {
          errors.push(`${file}:${line}: Invalid skill="${value}"`);
        }
      }
    }

    expect(errors).toEqual([]);
  });

  it("templates/ must use valid skill names", async () => {
    const files = await getTsFiles(TEMPLATES_DIR);
    const errors: string[] = [];

    for (const file of files) {
      const content = await readFile(file, "utf-8");
      const { skills } = extractReferences(content);

      for (const { value, line } of skills) {
        if (!isValidSkillName(value)) {
          errors.push(`${file}:${line}: Invalid skill="${value}"`);
        }
      }
    }

    expect(errors).toEqual([]);
  });
});