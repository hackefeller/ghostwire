import type { AgentConfig } from "@opencode-ai/sdk";
import type { AgentMode } from "./types";
import { isGptModel } from "./types";
import type { AgentOverrideConfig } from "../../platform/config/schema";
import {
  createAgentToolRestrictions,
  type PermissionValue,
} from "../../platform/config/permission-compat";

const MODE: AgentMode = "subagent";

const DARK_RUNNER_PROMPT = `<Role>
Dark Runner - Focused executor from Ghostwire.
Execute tasks directly. NEVER delegate or spawn other agents.
</Role>

<Critical_Constraints>
BLOCKED ACTIONS (will fail if attempted):
- task tool: BLOCKED
- delegate_task tool: BLOCKED

ALLOWED: call_grid_agent - You CAN spawn scoutRecon/archiveResearcher agents for research.
You work ALONE for implementation. No delegation of implementation tasks.
</Critical_Constraints>

<Todo_Discipline>
TODO OBSESSION (NON-NEGOTIABLE):
- 2+ steps → todowrite FIRST, atomic breakdown
- Mark in_progress before starting (ONE at a time)
- Mark completed IMMEDIATELY after each step
- NEVER batch completions

No todos on multi-step work = INCOMPLETE WORK.
</Todo_Discipline>

<Verification>
Task NOT complete without:
- lsp_diagnostics clean on changed files
- Build passes (if applicable)
- All todos marked completed
</Verification>

<Style>
- Start immediately. No acknowledgments.
- Match user's communication style.
- Dense > verbose.
</Style>`;

function buildDarkRunnerPrompt(promptAppend?: string): string {
  if (!promptAppend) return DARK_RUNNER_PROMPT;
  return DARK_RUNNER_PROMPT + "\n\n" + promptAppend;
}

// Core tools that Dark Runner must NEVER have access to
// Note: call_grid_agent is ALLOWED so subagents can spawn scoutRecon/archiveResearcher
const BLOCKED_TOOLS = ["task", "delegate_task"];

export const DARK_RUNNER_DEFAULTS = {
  model: "anthropic/claude-sonnet-4-5",
  temperature: 0.1,
} as const;

export function createDarkRunnerAgent(
  override: AgentOverrideConfig | undefined,
  systemDefaultModel?: string,
): AgentConfig {
  if (override?.disable) {
    override = undefined;
  }

  const model = override?.model ?? systemDefaultModel ?? DARK_RUNNER_DEFAULTS.model;
  const temperature = override?.temperature ?? DARK_RUNNER_DEFAULTS.temperature;

  const promptAppend = override?.prompt_append;
  const prompt = buildDarkRunnerPrompt(promptAppend);

  const baseRestrictions = createAgentToolRestrictions(BLOCKED_TOOLS);

  const userPermission = (override?.permission ?? {}) as Record<string, PermissionValue>;
  const basePermission = baseRestrictions.permission;
  const merged: Record<string, PermissionValue> = { ...userPermission };
  for (const tool of BLOCKED_TOOLS) {
    merged[tool] = "deny";
  }
  merged.call_grid_agent = "allow";
  const toolsConfig = { permission: { ...merged, ...basePermission } };

  const base: AgentConfig = {
    description:
      override?.description ??
      "Focused task executor. Same discipline, no delegation. (Dark Runner - Ghostwire)",
    mode: MODE,
    model,
    temperature,
    maxTokens: 64000,
    prompt,
    color: override?.color ?? "#20B2AA",
    ...toolsConfig,
  };

  if (override?.top_p !== undefined) {
    base.top_p = override.top_p;
  }

  if (isGptModel(model)) {
    return { ...base, reasoningEffort: "medium" } as AgentConfig;
  }

  return {
    ...base,
    thinking: { type: "enabled", budgetTokens: 32000 },
  } as AgentConfig;
}

createDarkRunnerAgent.mode = MODE;
