#!/usr/bin/env bun
/**
 * Build-time validation script for agent/category/command/skill references
 * 
 * Scans templates/ and commands/ directories for references and validates
 * against constants.ts. Exits with error if invalid references found.
 * 
 * Usage:
 *   bun script/validate-agent-references.ts
 *   bun run validate:agent-references
 */

/// <reference types="bun-types" />

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
} from "../src/orchestration/agents/constants";

const PROJECT_ROOT = join(import.meta.dir, "..");
const COMMANDS_DIR = join(PROJECT_ROOT, "src/execution/features/commands/commands");
const TEMPLATES_DIR = join(PROJECT_ROOT, "src/execution/features/commands/templates");

/**
 * Extract all references from a file
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

    // Match category: "value" or category: 'value' or category="value"
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
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await getTsFiles(fullPath)));
      } else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Directory might not exist
    console.warn(`Warning: Could not read directory ${dir}:`, error);
  }

  return files;
}

/**
 * Validate all files in a directory
 */
async function validateDirectory(dir: string): Promise<string[]> {
  const errors: string[] = [];
  const files = await getTsFiles(dir);

  for (const file of files) {
    const content = await readFile(file, "utf-8");
    const { subagentTypes, categories, commands, skills } = extractReferences(content);
    const relativePath = file.replace(PROJECT_ROOT + "/", "");

    // Validate agent IDs
    for (const { value, line } of subagentTypes) {
      if (!isValidAgentId(value)) {
        errors.push(`${relativePath}:${line}: Invalid subagent_type="${value}"`);
      }
    }

    // Validate categories
    for (const { value, line } of categories) {
      if (!VALID_CATEGORIES.includes(value as any)) {
        errors.push(`${relativePath}:${line}: Invalid category="${value}"`);
      }
    }

    // Validate command names
    for (const { value, line } of commands) {
      if (!isValidCommandName(value)) {
        errors.push(`${relativePath}:${line}: Invalid command="${value}"`);
      }
    }

    // Validate skill names
    for (const { value, line } of skills) {
      if (!isValidSkillName(value)) {
        errors.push(`${relativePath}:${line}: Invalid skill="${value}"`);
      }
    }
  }

  return errors;
}

/**
 * Main validation function
 */
async function main() {
  console.log("🔍 Validating agent references in commands and templates...\n");

  const allErrors: string[] = [];

  // Validate commands directory
  console.log(`📁 Checking: ${COMMANDS_DIR}`);
  const commandErrors = await validateDirectory(COMMANDS_DIR);
  allErrors.push(...commandErrors);

  // Validate templates directory
  console.log(`📁 Checking: ${TEMPLATES_DIR}`);
  const templateErrors = await validateDirectory(TEMPLATES_DIR);
  allErrors.push(...templateErrors);

  // Report results
  console.log("\n" + "=".repeat(60));
  
  if (allErrors.length > 0) {
    console.log(`\n❌ Found ${allErrors.length} invalid reference(s):\n`);
    allErrors.forEach((error) => console.log(`  ${error}`));
    console.log("\n" + "=".repeat(60));
    console.log("\nValid agent IDs:", VALID_AGENT_IDS.join(", "));
    console.log("Valid categories:", VALID_CATEGORIES.join(", "));
    console.log("Valid command names:", VALID_COMMAND_NAMES.join(", "));
    console.log("Valid skill names:", VALID_SKILL_NAMES.join(", "));
    console.log("");
    process.exit(1);
  } else {
    console.log("\n✅ All references are valid!");
    console.log("=".repeat(60));
    process.exit(0);
  }
}

main().catch((error) => {
  console.error("Validation failed:", error);
  process.exit(1);
});