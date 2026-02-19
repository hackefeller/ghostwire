import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const TARGETS = [
  "src",
  "docs",
  "README.md",
  "README.ja.md",
  "README.ko.md",
  "README.zh-cn.md",
  "AGENTS.md",
  "package.json",
];
const LEGACY_TOKENS = [
  "ghostwire",
  "sisyphus",
  "atlas",
  "prometheus",
  "oracle",
  "librarian",
  "metis",
  "momus",
  "multimodal-looker",
  "call_omo_agent",
  "compound:",
  ".sisyphus/",
];

function collectFiles(path: string): string[] {
  const abs = join(ROOT, path);
  const st = statSync(abs);
  if (st.isFile()) return [abs];

  const out: string[] = [];
  for (const entry of readdirSync(abs)) {
    if (entry === "dist" || entry === "node_modules" || entry === ".git")
      continue;
    out.push(...collectFiles(join(path, entry)));
  }
  return out;
}

describe("naming hard cutover", () => {
  test("contains no legacy naming tokens", () => {
    const files = TARGETS.flatMap(collectFiles);
    const hits: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, "utf8");
      for (const token of LEGACY_TOKENS) {
        if (content.includes(token)) {
          hits.push(`${file}: ${token}`);
        }
      }
    }

    expect(hits).toEqual([]);
  });
});
