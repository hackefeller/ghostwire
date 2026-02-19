# AGENTS KNOWLEDGE BASE

## OVERVIEW
10 AI agents for multi-model orchestration. Cipher Operator (primary), Nexus Orchestrator (orchestrator), seer-advisor, archive-researcher, scout-recon, optic-analyst, Augur Planner, Tactician Strategist, Glitch Auditor, Cipher Operator-Junior.

## STRUCTURE
```
agents/
├── nexus-orchestrator.ts                    # Master Orchestrator (holds todo list)
├── cipher-operator.ts                 # Main prompt (SF Bay Area engineer identity)
├── cipher-runner.ts          # Delegated task executor (category-spawned)
├── seer-advisor.ts                   # Strategic advisor (GPT-5.2)
├── archive-researcher.ts                # Multi-repo research (GitHub CLI, Context7)
├── scout-recon.ts                  # Fast contextual grep (Grok Code)
├── optic-analyst.ts        # Media analyzer (Gemini 3 Flash)
├── augur-planner-prompt.ts        # Planning (Interview/Consultant mode, 1196 lines)
├── tactician-strategist.ts                    # Pre-planning analysis (Gap detection)
├── glitch-auditor.ts                    # Plan reviewer (Ruthless fault-finding)
├── dynamic-agent-prompt-builder.ts  # Dynamic prompt generation
├── types.ts                    # AgentModelConfig, AgentPromptMetadata
├── utils.ts                    # createBuiltinAgents(), resolveModelWithFallback()
└── index.ts                    # builtinAgents export
```

## AGENT MODELS
| Agent | Model | Temp | Purpose |
|-------|-------|------|---------|
| Cipher Operator | anthropic/claude-opus-4-5 | 0.1 | Primary orchestrator (fallback: kimi-k2.5 → glm-4.7 → gpt-5.2-codex → gemini-3-pro) |
| Nexus Orchestrator | anthropic/claude-sonnet-4-5 | 0.1 | Master orchestrator (fallback: kimi-k2.5 → gpt-5.2) |
| seer-advisor | openai/gpt-5.2 | 0.1 | Consultation, debugging |
| archive-researcher | zai-coding-plan/glm-4.7 | 0.1 | Docs, GitHub search (fallback: glm-4.7-free) |
| scout-recon | anthropic/claude-haiku-4-5 | 0.1 | Fast contextual grep (fallback: gpt-5-mini → gpt-5-nano) |
| optic-analyst | google/gemini-3-flash | 0.1 | PDF/image analysis |
| Augur Planner | anthropic/claude-opus-4-5 | 0.1 | Strategic planning (fallback: kimi-k2.5 → gpt-5.2) |
| Tactician Strategist | anthropic/claude-opus-4-5 | 0.3 | Pre-planning analysis (fallback: kimi-k2.5 → gpt-5.2) |
| Glitch Auditor | openai/gpt-5.2 | 0.1 | Plan validation (fallback: claude-opus-4-5) |
| Cipher Operator-Junior | anthropic/claude-sonnet-4-5 | 0.1 | Category-spawned executor |

## HOW TO ADD
1. Create `src/agents/my-agent.ts` exporting factory + metadata.
2. Add to `agentSources` in `src/agents/utils.ts`.
3. Update `AgentNameSchema` in `src/config/schema.ts`.
4. Register in `src/index.ts` initialization.

## TOOL RESTRICTIONS
| Agent | Denied Tools |
|-------|-------------|
| seer-advisor | write, edit, task, delegate_task |
| archive-researcher | write, edit, task, delegate_task, call_grid_agent |
| scout-recon | write, edit, task, delegate_task, call_grid_agent |
| optic-analyst | Allowlist: read only |
| Cipher Operator-Junior | task, delegate_task |

## PATTERNS
- **Factory**: `createXXXAgent(model: string): AgentConfig`
- **Metadata**: `XXX_PROMPT_METADATA` with category, cost, triggers.
- **Tool restrictions**: `createAgentToolRestrictions(tools)` or `createAgentToolAllowlist(tools)`.
- **Thinking**: 32k budget tokens for Cipher Operator, Seer Advisor, Augur Planner, Nexus Orchestrator.

## ANTI-PATTERNS
- **Trust reports**: NEVER trust "I'm done" - verify outputs.
- **High temp**: Don't use >0.3 for code agents.
- **Sequential calls**: Use `delegate_task` with `run_in_background` for exploration.
- **Augur Planner writing code**: Planner only - never implements.
