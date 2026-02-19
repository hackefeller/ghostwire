import type { AgentConfig } from "@opencode-ai/sdk";
import type {
  BuiltinAgentName,
  AgentOverrideConfig,
  AgentOverrides,
  AgentFactory,
  AgentPromptMetadata,
} from "./types";
import type {
  CategoriesConfig,
  CategoryConfig,
  GitMasterConfig,
} from "../config/schema";
import { createSisyphusAgent } from "./cipher-operator";
import { createOracleAgent, ORACLE_PROMPT_METADATA } from "./seer-advisor";
import {
  createLibrarianAgent,
  LIBRARIAN_PROMPT_METADATA,
} from "./archive-researcher";
import { createExploreAgent, EXPLORE_PROMPT_METADATA } from "./scout-recon";
import {
  createMultimodalLookerAgent,
  MULTIMODAL_LOOKER_PROMPT_METADATA,
} from "./optic-analyst";
import { createMetisAgent } from "./tactician-strategist";
import { createAtlasAgent } from "./nexus-orchestrator";
import { createMomusAgent } from "./glitch-auditor";
import { COMPOUND_AGENT_MAPPINGS } from "./compound";
import type {
  AvailableAgent,
  AvailableCategory,
  AvailableSkill,
} from "./dynamic-agent-prompt-builder";
import {
  deepMerge,
  fetchAvailableModels,
  resolveModelWithFallback,
  AGENT_MODEL_REQUIREMENTS,
  findCaseInsensitive,
  includesCaseInsensitive,
  readConnectedProvidersCache,
  isModelAvailable,
} from "../shared";
import {
  DEFAULT_CATEGORIES,
  CATEGORY_DESCRIPTIONS,
} from "../tools/delegate-task/constants";
import { resolveMultipleSkills } from "../features/opencode-skill-loader/skill-content";
import { createBuiltinSkills } from "../features/builtin-skills";
import type {
  LoadedSkill,
  SkillScope,
} from "../features/opencode-skill-loader/types";
import type { BrowserAutomationProvider } from "../config/schema";
export {
  createAgentToolRestrictions,
  createAgentToolAllowlist,
} from "../shared/permission-compat";

type AgentSource = AgentFactory | AgentConfig;

const agentSources: Record<BuiltinAgentName, AgentSource> = {
  "cipher-operator": createSisyphusAgent,
  "seer-advisor": createOracleAgent,
  "archive-researcher": createLibrarianAgent,
  "scout-recon": createExploreAgent,
  "optic-analyst": createMultimodalLookerAgent,
  "tactician-strategist": createMetisAgent,
  "glitch-auditor": createMomusAgent,
  // Note: Nexus Orchestrator is handled specially in createBuiltinAgents()
  // because it needs OrchestratorContext, not just a model string
  "nexus-orchestrator": createAtlasAgent as unknown as AgentFactory,
  // Compound Engineering Agents (28 total)
  ...COMPOUND_AGENT_MAPPINGS,
};

/**
 * Metadata for each agent, used to build Cipher Operator's dynamic prompt sections
 * (Delegation Table, Tool Selection, Key Triggers, etc.)
 */
const agentMetadata: Partial<Record<BuiltinAgentName, AgentPromptMetadata>> = {
  "seer-advisor": ORACLE_PROMPT_METADATA,
  "archive-researcher": LIBRARIAN_PROMPT_METADATA,
  "scout-recon": EXPLORE_PROMPT_METADATA,
  "optic-analyst": MULTIMODAL_LOOKER_PROMPT_METADATA,
};

function isFactory(source: AgentSource): source is AgentFactory {
  return typeof source === "function";
}

export function buildAgent(
  source: AgentSource,
  model: string,
  categories?: CategoriesConfig,
  gitMasterConfig?: GitMasterConfig,
  browserProvider?: BrowserAutomationProvider,
): AgentConfig {
  const base = isFactory(source) ? source(model) : source;
  const categoryConfigs: Record<string, CategoryConfig> = categories
    ? { ...DEFAULT_CATEGORIES, ...categories }
    : DEFAULT_CATEGORIES;

  const agentWithCategory = base as AgentConfig & {
    category?: string;
    skills?: string[];
    variant?: string;
  };
  if (agentWithCategory.category) {
    const categoryConfig = categoryConfigs[agentWithCategory.category];
    if (categoryConfig) {
      if (!base.model) {
        base.model = categoryConfig.model;
      }
      if (
        base.temperature === undefined &&
        categoryConfig.temperature !== undefined
      ) {
        base.temperature = categoryConfig.temperature;
      }
      if (base.variant === undefined && categoryConfig.variant !== undefined) {
        base.variant = categoryConfig.variant;
      }
    }
  }

  if (agentWithCategory.skills?.length) {
    const { resolved } = resolveMultipleSkills(agentWithCategory.skills, {
      gitMasterConfig,
      browserProvider,
    });
    if (resolved.size > 0) {
      const skillContent = Array.from(resolved.values()).join("\n\n");
      base.prompt = skillContent + (base.prompt ? "\n\n" + base.prompt : "");
    }
  }

  return base;
}

/**
 * Creates OmO-specific environment context (time, timezone, locale).
 * Note: Working directory, platform, and date are already provided by OpenCode's system.ts,
 * so we only include fields that OpenCode doesn't provide to avoid duplication.
 * See: https://github.com/pontistudios/ghostwire/issues/379
 */
export function createEnvContext(): string {
  const now = new Date();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;

  const dateStr = now.toLocaleDateString(locale, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const timeStr = now.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return `
<grid-env>
  Current date: ${dateStr}
  Current time: ${timeStr}
  Timezone: ${timezone}
  Locale: ${locale}
</grid-env>`;
}

/**
 * Expands a category reference from an agent override into concrete config properties.
 * Category properties are applied unconditionally (overwriting factory defaults),
 * because the user's chosen category should take priority over factory base values.
 * Direct override properties applied later via mergeAgentConfig() will supersede these.
 */
function applyCategoryOverride(
  config: AgentConfig,
  categoryName: string,
  mergedCategories: Record<string, CategoryConfig>,
): AgentConfig {
  const categoryConfig = mergedCategories[categoryName];
  if (!categoryConfig) return config;

  const result = { ...config } as AgentConfig & Record<string, unknown>;
  if (categoryConfig.model) result.model = categoryConfig.model;
  if (categoryConfig.variant !== undefined)
    result.variant = categoryConfig.variant;
  if (categoryConfig.temperature !== undefined)
    result.temperature = categoryConfig.temperature;
  if (categoryConfig.reasoningEffort !== undefined)
    result.reasoningEffort = categoryConfig.reasoningEffort;
  if (categoryConfig.textVerbosity !== undefined)
    result.textVerbosity = categoryConfig.textVerbosity;
  if (categoryConfig.thinking !== undefined)
    result.thinking = categoryConfig.thinking;
  if (categoryConfig.top_p !== undefined) result.top_p = categoryConfig.top_p;
  if (categoryConfig.maxTokens !== undefined)
    result.maxTokens = categoryConfig.maxTokens;

  return result as AgentConfig;
}

function mergeAgentConfig(
  base: AgentConfig,
  override: AgentOverrideConfig,
): AgentConfig {
  const { prompt_append, ...rest } = override;
  const merged = deepMerge(base, rest as Partial<AgentConfig>);

  if (prompt_append && merged.prompt) {
    merged.prompt = merged.prompt + "\n" + prompt_append;
  }

  return merged;
}

function mapScopeToLocation(scope: SkillScope): AvailableSkill["location"] {
  if (scope === "user" || scope === "opencode") return "user";
  if (scope === "project" || scope === "opencode-project") return "project";
  return "plugin";
}

export async function createBuiltinAgents(
  disabledAgents: string[] = [],
  agentOverrides: AgentOverrides = {},
  directory?: string,
  systemDefaultModel?: string,
  categories?: CategoriesConfig,
  gitMasterConfig?: GitMasterConfig,
  discoveredSkills: LoadedSkill[] = [],
  client?: any,
  browserProvider?: BrowserAutomationProvider,
  uiSelectedModel?: string,
): Promise<Record<string, AgentConfig>> {
  const connectedProviders = readConnectedProvidersCache();
  // IMPORTANT: Do NOT pass client to fetchAvailableModels during plugin initialization.
  // This function is called from config handler, and calling client API causes deadlock.
  // See: https://github.com/pontistudios/ghostwire/issues/1301
  const availableModels = await fetchAvailableModels(undefined, {
    connectedProviders: connectedProviders ?? undefined,
  });

  const result: Record<string, AgentConfig> = {};
  const availableAgents: AvailableAgent[] = [];

  const mergedCategories = categories
    ? { ...DEFAULT_CATEGORIES, ...categories }
    : DEFAULT_CATEGORIES;

  const availableCategories: AvailableCategory[] = Object.entries(
    mergedCategories,
  ).map(([name]) => ({
    name,
    description:
      categories?.[name]?.description ??
      CATEGORY_DESCRIPTIONS[name] ??
      "General tasks",
  }));

  const builtinSkills = createBuiltinSkills({ browserProvider });
  const builtinSkillNames = new Set(builtinSkills.map((s) => s.name));

  const builtinAvailable: AvailableSkill[] = builtinSkills.map((skill) => ({
    name: skill.name,
    description: skill.description,
    location: "plugin" as const,
  }));

  const discoveredAvailable: AvailableSkill[] = discoveredSkills
    .filter((s) => !builtinSkillNames.has(s.name))
    .map((skill) => ({
      name: skill.name,
      description: skill.definition.description ?? "",
      location: mapScopeToLocation(skill.scope),
    }));

  const availableSkills: AvailableSkill[] = [
    ...builtinAvailable,
    ...discoveredAvailable,
  ];

  for (const [name, source] of Object.entries(agentSources)) {
    const agentName = name as BuiltinAgentName;

    if (agentName === "cipher-operator") continue;
    if (agentName === "nexus-orchestrator") continue;
    if (includesCaseInsensitive(disabledAgents, agentName)) continue;

    const override = findCaseInsensitive(agentOverrides, agentName);
    const requirement = AGENT_MODEL_REQUIREMENTS[agentName];

    // Check if agent requires a specific model
    if (requirement?.requiresModel && availableModels) {
      if (!isModelAvailable(requirement.requiresModel, availableModels)) {
        continue;
      }
    }

    const isPrimaryAgent = isFactory(source) && source.mode === "primary";

    const resolution = resolveModelWithFallback({
      uiSelectedModel: isPrimaryAgent ? uiSelectedModel : undefined,
      userModel: override?.model,
      fallbackChain: requirement?.fallbackChain,
      availableModels,
      systemDefaultModel,
    });
    if (!resolution) continue;
    const { model, variant: resolvedVariant } = resolution;

    let config = buildAgent(
      source,
      model,
      mergedCategories,
      gitMasterConfig,
      browserProvider,
    );

    // Apply resolved variant from model fallback chain
    if (resolvedVariant) {
      config = { ...config, variant: resolvedVariant };
    }

    // Expand override.category into concrete properties (higher priority than factory/resolved)
    const overrideCategory = (override as Record<string, unknown> | undefined)
      ?.category as string | undefined;
    if (overrideCategory) {
      config = applyCategoryOverride(
        config,
        overrideCategory,
        mergedCategories,
      );
    }

    if (agentName === "archive-researcher" && directory && config.prompt) {
      const envContext = createEnvContext();
      config = { ...config, prompt: config.prompt + envContext };
    }

    // Direct override properties take highest priority
    if (override) {
      config = mergeAgentConfig(config, override);
    }

    result[name] = config;

    const metadata = agentMetadata[agentName];
    if (metadata) {
      availableAgents.push({
        name: agentName,
        description: config.description ?? "",
        metadata,
      });
    }
  }

  if (!disabledAgents.includes("cipher-operator")) {
    const cipherOverride = agentOverrides["cipher-operator"];
    const cipherRequirement = AGENT_MODEL_REQUIREMENTS["cipher-operator"];

    const cipherResolution = resolveModelWithFallback({
      uiSelectedModel,
      userModel: cipherOverride?.model,
      fallbackChain: cipherRequirement?.fallbackChain,
      availableModels,
      systemDefaultModel,
    });

    if (cipherResolution) {
      const { model: cipherModel, variant: cipherResolvedVariant } =
        cipherResolution;

      let cipherConfig = createSisyphusAgent(
        cipherModel,
        availableAgents,
        undefined,
        availableSkills,
        availableCategories,
      );

      if (cipherResolvedVariant) {
        cipherConfig = { ...cipherConfig, variant: cipherResolvedVariant };
      }

      const sisOverrideCategory = (
        cipherOverride as Record<string, unknown> | undefined
      )?.category as string | undefined;
      if (sisOverrideCategory) {
        cipherConfig = applyCategoryOverride(
          cipherConfig,
          sisOverrideCategory,
          mergedCategories,
        );
      }

      if (directory && cipherConfig.prompt) {
        const envContext = createEnvContext();
        cipherConfig = {
          ...cipherConfig,
          prompt: cipherConfig.prompt + envContext,
        };
      }

      if (cipherOverride) {
        cipherConfig = mergeAgentConfig(cipherConfig, cipherOverride);
      }

      result["cipher-operator"] = cipherConfig;
    }
  }

  if (!disabledAgents.includes("nexus-orchestrator")) {
    const orchestratorOverride = agentOverrides["nexus-orchestrator"];
    const nexusRequirement = AGENT_MODEL_REQUIREMENTS["nexus-orchestrator"];

    const nexusResolution = resolveModelWithFallback({
      // NOTE: Nexus Orchestrator does NOT use uiSelectedModel - respects its own fallbackChain (k2p5 primary)
      userModel: orchestratorOverride?.model,
      fallbackChain: nexusRequirement?.fallbackChain,
      availableModels,
      systemDefaultModel,
    });

    if (nexusResolution) {
      const { model: nexusModel, variant: nexusResolvedVariant } =
        nexusResolution;

      let orchestratorConfig = createAtlasAgent({
        model: nexusModel,
        availableAgents,
        availableSkills,
        userCategories: categories,
      });

      if (nexusResolvedVariant) {
        orchestratorConfig = {
          ...orchestratorConfig,
          variant: nexusResolvedVariant,
        };
      }

      const nexusOverrideCategory = (
        orchestratorOverride as Record<string, unknown> | undefined
      )?.category as string | undefined;
      if (nexusOverrideCategory) {
        orchestratorConfig = applyCategoryOverride(
          orchestratorConfig,
          nexusOverrideCategory,
          mergedCategories,
        );
      }

      if (orchestratorOverride) {
        orchestratorConfig = mergeAgentConfig(
          orchestratorConfig,
          orchestratorOverride,
        );
      }

      result["nexus-orchestrator"] = orchestratorConfig;
    }
  }

  return result;
}
