import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..", "..");
const templatesRoot = path.join(repoRoot, "src/templates");
const outputPath = path.join(repoRoot, "src/core/registry/bundled-templates.ts");

type BundledFile = { path: string; content: string };

function collect(kind: "skills" | "agents", fileName: string): BundledFile[] {
  const dir = path.join(templatesRoot, kind);
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      if (!entry.isDirectory()) {
        return [];
      }
      const filePath = path.join(dir, entry.name, fileName);
      return readdirSync(path.join(dir, entry.name), { withFileTypes: true }).some((nested) => nested.name === fileName)
        ? [
            {
              path: path.relative(templatesRoot, filePath).replaceAll(path.sep, "/"),
              content: readFileSync(filePath, "utf8"),
            },
          ]
        : [];
    })
    .sort((left, right) => left.path.localeCompare(right.path));
}

function collectCommands(): BundledFile[] {
  const dir = path.join(templatesRoot, "commands");
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => ({
      path: path.relative(templatesRoot, path.join(dir, entry.name)).replaceAll(path.sep, "/"),
      content: readFileSync(path.join(dir, entry.name), "utf8"),
    }))
    .sort((left, right) => left.path.localeCompare(right.path));
}

const skills = collect("skills", "SKILL.md");
const agents = collect("agents", "AGENT.md");
const commands = collectCommands();

function serialize(entries: BundledFile[]): string {
  return entries.map((entry) => `  { path: ${JSON.stringify(entry.path)}, content: ${JSON.stringify(entry.content)} }`).join(",\n");
}

const content = `/**\n * Bundled template sources for compiled binaries.\n * Generated from src/templates.\n * Do not edit by hand.\n */\n\nexport const BUNDLED_TEMPLATE_FILES = {\n  skills: [\n${serialize(skills)}\n  ],\n  agents: [\n${serialize(agents)}\n  ],\n  commands: [\n${serialize(commands)}\n  ],\n} as const;\n`;

mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, content);
console.log(`Wrote ${outputPath}`);
