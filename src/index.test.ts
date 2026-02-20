import { describe, expect, it } from "bun:test";
import { includesCaseInsensitive } from "./integration/shared";

/**
 * Tests for conditional tool registration logic in index.ts
 *
 * The actual plugin initialization is complex to test directly,
 * so we test the underlying logic that determines tool registration.
 */
describe("look_at tool conditional registration", () => {
  describe("isMultimodalLookerEnabled logic", () => {
    // #given opticAnalyst is in disabled_agents
    // #when checking if agent is enabled
    // #then should return false (disabled)
    it("returns false when opticAnalyst is disabled (exact case)", () => {
      const disabledAgents = ["analyzer-media"];
      const isEnabled = !includesCaseInsensitive(disabledAgents, "analyzer-media");
      expect(isEnabled).toBe(false);
    });

    // #given opticAnalyst is in disabled_agents with different case
    // #when checking if agent is enabled
    // #then should return false (case-insensitive match)
    it("returns false when opticAnalyst is disabled (case-insensitive)", () => {
      const disabledAgents = ["ANALYZER-MEDIA"];
      const isEnabled = !includesCaseInsensitive(disabledAgents, "analyzer-media");
      expect(isEnabled).toBe(false);
    });

    // #given opticAnalyst is NOT in disabled_agents
    // #when checking if agent is enabled
    // #then should return true (enabled)
    it("returns true when opticAnalyst is not disabled", () => {
      const disabledAgents = ["eye-ops", "data-dive"];
      const isEnabled = !includesCaseInsensitive(disabledAgents, "analyzer-media");
      expect(isEnabled).toBe(true);
    });

    // #given disabled_agents is empty
    // #when checking if agent is enabled
    // #then should return true (enabled by default)
    it("returns true when disabled_agents is empty", () => {
      const disabledAgents: string[] = [];
      const isEnabled = !includesCaseInsensitive(disabledAgents, "analyzer-media");
      expect(isEnabled).toBe(true);
    });

    // #given disabled_agents is undefined (simulated as empty array)
    // #when checking if agent is enabled
    // #then should return true (enabled by default)
    it("returns true when disabled_agents is undefined (fallback to empty)", () => {
      const disabledAgents = undefined;
      const isEnabled = !includesCaseInsensitive(disabledAgents ?? [], "analyzer-media");
      expect(isEnabled).toBe(true);
    });
  });

  describe("conditional tool spread pattern", () => {
    // #given lookAt is not null (agent enabled)
    // #when spreading into tool object
    // #then look_at should be included
    it("includes look_at when lookAt is not null", () => {
      const lookAt = { execute: () => {} }; // mock tool
      const tools = {
        ...(lookAt ? { look_at: lookAt } : {}),
      };
      expect(tools).toHaveProperty("look_at");
    });

    // #given lookAt is null (agent disabled)
    // #when spreading into tool object
    // #then look_at should NOT be included
    it("excludes look_at when lookAt is null", () => {
      const lookAt = null;
      const tools = {
        ...(lookAt ? { look_at: lookAt } : {}),
      };
      expect(tools).not.toHaveProperty("look_at");
    });
  });
});
