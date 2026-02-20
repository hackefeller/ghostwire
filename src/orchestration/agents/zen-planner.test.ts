import { describe, test, expect } from "bun:test";
import { AUGUR_PLANNER_SYSTEM_PROMPT } from "./zen-planner";

describe("AUGUR_PLANNER_SYSTEM_PROMPT Glitch Auditor invocation policy", () => {
  test("should direct providing ONLY the file path string when invoking Glitch Auditor", () => {
    // #given
    const prompt = AUGUR_PLANNER_SYSTEM_PROMPT;

    // #when / #then
    // Should mention Glitch Auditor and providing only the path
    expect(prompt.toLowerCase()).toMatch(
      /glitch[-\s]auditor.*only.*path|path.*only.*glitch[-\s]auditor/,
    );
  });

  test("should forbid wrapping Glitch Auditor invocation in explanations or markdown", () => {
    // #given
    const prompt = AUGUR_PLANNER_SYSTEM_PROMPT;

    // #when / #then
    // Should mention not wrapping or using markdown for the path
    expect(prompt.toLowerCase()).toMatch(/not.*wrap|no.*explanation|no.*markdown/);
  });
});
