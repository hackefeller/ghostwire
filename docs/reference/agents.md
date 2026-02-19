# Agents

Ghostwire provides a team of specialized AI agents, each optimized for specific tasks with distinct models, capabilities, and tool permissions.

## Core Agents

### Cipher Operator
- **Model**: `anthropic/claude-opus-4-5`
- **Temperature**: 0.1
- **Fallback Chain**: kimi-k2.5 → glm-4.7 → gpt-5.2-codex → gemini-3-pro

**The default orchestrator.** Plans, delegates, and executes complex tasks using specialized subagents with aggressive parallel execution. Features todo-driven workflow with extended thinking (32k budget). Embodies an SF Bay Area engineer identity.

### Nexus Orchestrator
- **Model**: `anthropic/claude-sonnet-4-5`
- **Temperature**: 0.1
- **Fallback Chain**: kimi-k2.5 → gpt-5.2

**Master orchestrator** that holds the todo list and manages complex multi-agent workflows. Works in tandem with Augur Planner to execute planned work systematically.

### Seer Advisor
- **Model**: `openai/gpt-5.2`
- **Temperature**: 0.1

**Strategic advisor** for architecture decisions, code review, and debugging. Read-only consultation agent with stellar logical reasoning and deep analysis capabilities. Inspired by AmpCode.

**Tool Restrictions**: Read-only (cannot write, edit, task, or delegate)

### Archive Researcher
- **Model**: `zai-coding-plan/glm-4.7`
- **Temperature**: 0.1
- **Fallback Chain**: glm-4.7-free → claude-sonnet-4-5

**Multi-repo research specialist.** Performs documentation lookup, finds OSS implementation examples, and provides deep codebase understanding with evidence-based answers.

**Tool Restrictions**: Cannot write, edit, task, delegate, or call grid agents

### Scout Recon
- **Model**: `anthropic/claude-haiku-4-5`
- **Temperature**: 0.1
- **Fallback Chain**: gpt-5-mini → gpt-5-nano

**Fast codebase explorer.** Performs blazing fast contextual grep and codebase exploration. Optimized for speed over depth.

**Tool Restrictions**: Cannot write, edit, task, delegate, or call grid agents

### Optic Analyst
- **Model**: `google/gemini-3-flash`
- **Temperature**: 0.1
- **Fallback Chain**: gpt-5.2 → glm-4.6v → kimi-k2.5 → claude-haiku-4-5 → gpt-5-nano

**Visual content specialist.** Analyzes PDFs, images, diagrams, and other media to extract information and insights.

**Tool Restrictions**: Allowlist only (read, glob, grep)

## Planning Agents

### Augur Planner
- **Model**: `anthropic/claude-opus-4-5`
- **Temperature**: 0.1
- **Fallback Chain**: kimi-k2.5 → gpt-5.2 → gemini-3-pro

**Strategic planner** with interview mode. Creates detailed work plans through iterative questioning and consultation. Never implements—only plans.

### Tactician Strategist
- **Model**: `anthropic/claude-opus-4-5`
- **Temperature**: 0.3
- **Fallback Chain**: kimi-k2.5 → gpt-5.2 → gemini-3-pro

**Pre-planning analyst** that identifies hidden intentions, ambiguities, and potential AI failure points before planning begins.

### Glitch Auditor
- **Model**: `openai/gpt-5.2`
- **Temperature**: 0.1
- **Fallback Chain**: gpt-5.2 → claude-opus-4-5 → gemini-3-pro

**Plan reviewer** that validates plans against clarity, verifiability, and completeness standards. Ruthlessly finds faults in plans.

## Execution Agents

### Cipher Operator-Junior
- **Model**: `anthropic/claude-sonnet-4-5`
- **Temperature**: 0.1

**Category-spawned task executor.** Delegated to by the main Cipher Operator for specific category-based tasks (frontend, business logic, etc.).

**Tool Restrictions**: Cannot spawn subtasks (task, delegate_task)

## Using Agents

### Direct Invocation
Invoke agents explicitly for specialized tasks:

```
Ask @seer-advisor to review this design and propose an architecture
Ask @archive-researcher how this is implemented - why does the behavior keep changing?
Ask @scout-recon for the policy on this feature
Ask @optic-analyst to analyze this screenshot
```

### Background Execution
Run agents in the background while you continue working:

```
delegate_task(agent="scout-recon", background=true, prompt="Find auth implementations")
```

### Agent Thinking Budget
The following agents have 32k thinking budget tokens enabled by default:
- Cipher Operator
- Seer Advisor
- Augur Planner
- Nexus Orchestrator

## Configuration

Override agent settings in your `ghostwire.json`:

```json
{
  "agents": {
    "seer-advisor": {
      "model": "openai/gpt-5.2",
      "temperature": 0.1
    },
    "scout-recon": {
      "model": "opencode/gpt-5-nano"
    },
    "optic-analyst": {
      "disable": true
    }
  }
}
```

## Agent Model Resolution

Ghostwire automatically selects the best available model for each agent based on your configured providers. The resolution follows this priority:

1. User-configured model in `ghostwire.json`
2. Fallback chain (tries each provider in order)
3. Default model for available providers

Run `opencode models` to see available models in your environment.
