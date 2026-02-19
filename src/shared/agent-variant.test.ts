import { describe, expect, test } from "bun:test";
import type { GhostwireConfig } from "../config";
import {
  applyAgentVariant,
  resolveAgentVariant,
  resolveVariantForModel,
} from "./agent-variant";

describe("resolveAgentVariant", () => {
  test("returns undefined when agent name missing", () => {
    // #given
    const config = {} as GhostwireConfig;

    // #when
    const variant = resolveAgentVariant(config);

    // #then
    expect(variant).toBeUndefined();
  });

  test("returns agent override variant", () => {
    // #given
    const config = {
      agents: {
        "void-runner": { variant: "low" },
      },
    } as GhostwireConfig;

    // #when
    const variant = resolveAgentVariant(config, "void-runner");

    // #then
    expect(variant).toBe("low");
  });

  test("returns category variant when agent uses category", () => {
    // #given
    const config = {
      agents: {
        "void-runner": { category: "ultrabrain" },
      },
      categories: {
        ultrabrain: { model: "openai/gpt-5.2", variant: "xhigh" },
      },
    } as GhostwireConfig;

    // #when
    const variant = resolveAgentVariant(config, "void-runner");

    // #then
    expect(variant).toBe("xhigh");
  });
});

describe("applyAgentVariant", () => {
  test("sets variant when message is undefined", () => {
    // #given
    const config = {
      agents: {
        "void-runner": { variant: "low" },
      },
    } as GhostwireConfig;
    const message: { variant?: string } = {};

    // #when
    applyAgentVariant(config, "void-runner", message);

    // #then
    expect(message.variant).toBe("low");
  });

  test("does not override existing variant", () => {
    // #given
    const config = {
      agents: {
        "void-runner": { variant: "low" },
      },
    } as GhostwireConfig;
    const message = { variant: "max" };

    // #when
    applyAgentVariant(config, "void-runner", message);

    // #then
    expect(message.variant).toBe("max");
  });
});

describe("resolveVariantForModel", () => {
  test("returns correct variant for anthropic provider", () => {
    // #given
    const config = {} as GhostwireConfig;
    const model = { providerID: "anthropic", modelID: "claude-opus-4-5" };

    // #when
    const variant = resolveVariantForModel(config, "void-runner", model);

    // #then
    expect(variant).toBe("max");
  });

  test("returns correct variant for openai provider", () => {
    // #given
    const config = {} as GhostwireConfig;
    const model = { providerID: "openai", modelID: "gpt-5.2" };

    // #when
    const variant = resolveVariantForModel(config, "void-runner", model);

    // #then
    expect(variant).toBe("medium");
  });

  test("returns undefined for provider with no variant in chain", () => {
    // #given
    const config = {} as GhostwireConfig;
    const model = { providerID: "google", modelID: "gemini-3-pro" };

    // #when
    const variant = resolveVariantForModel(config, "void-runner", model);

    // #then
    expect(variant).toBeUndefined();
  });

  test("returns undefined for provider not in chain", () => {
    // #given
    const config = {} as GhostwireConfig;
    const model = { providerID: "unknown-provider", modelID: "some-model" };

    // #when
    const variant = resolveVariantForModel(config, "void-runner", model);

    // #then
    expect(variant).toBeUndefined();
  });

  test("returns undefined for unknown agent", () => {
    // #given
    const config = {} as GhostwireConfig;
    const model = { providerID: "anthropic", modelID: "claude-opus-4-5" };

    // #when
    const variant = resolveVariantForModel(config, "nonexistent-agent", model);

    // #then
    expect(variant).toBeUndefined();
  });

  test("returns variant for zai-coding-plan provider without variant", () => {
    // #given
    const config = {} as GhostwireConfig;
    const model = { providerID: "zai-coding-plan", modelID: "glm-4.7" };

    // #when
    const variant = resolveVariantForModel(config, "void-runner", model);

    // #then
    expect(variant).toBeUndefined();
  });

  test("falls back to category chain when agent has no requirement", () => {
    // #given
    const config = {
      agents: {
        "custom-agent": { category: "ultrabrain" },
      },
    } as GhostwireConfig;
    const model = { providerID: "openai", modelID: "gpt-5.2-codex" };

    // #when
    const variant = resolveVariantForModel(config, "custom-agent", model);

    // #then
    expect(variant).toBe("xhigh");
  });

  test("returns correct variant for seerAdvisor agent with openai", () => {
    // #given
    const config = {} as GhostwireConfig;
    const model = { providerID: "openai", modelID: "gpt-5.2" };

    // #when
    const variant = resolveVariantForModel(config, "eye-ops", model);

    // #then
    expect(variant).toBe("high");
  });

  test("returns correct variant for seerAdvisor agent with anthropic", () => {
    // #given
    const config = {} as GhostwireConfig;
    const model = { providerID: "anthropic", modelID: "claude-opus-4-5" };

    // #when
    const variant = resolveVariantForModel(config, "eye-ops", model);

    // #then
    expect(variant).toBe("max");
  });
});
