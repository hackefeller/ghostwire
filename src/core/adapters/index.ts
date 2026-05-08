/**
 * Command adapters index
 *
 * Re-exports all tool command adapters and creates a populated registry.
 */

import { claudeAdapter } from "./claude.js";
import { codexAdapter } from "./codex.js";
import { githubCopilotAdapter } from "./github-copilot.js";
import { piAdapter } from "./pi.js";
import { createAdapterRegistry } from "./registry.js";

/**
 * Create a fully populated adapter registry with all supported tools
 */
export function createPopulatedAdapterRegistry() {
  const registry = createAdapterRegistry();

  registry.register(claudeAdapter);
  registry.register(codexAdapter);
  registry.register(githubCopilotAdapter);
  registry.register(piAdapter);

  return registry;
}
