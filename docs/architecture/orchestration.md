# Ghostwire Orchestration Guide

## TL;DR - When to Use What

| Complexity | Approach | When to Use |
|------------|----------|-------------|
| **Simple** | Just prompt | Simple tasks, quick fixes, single-file changes |
| **Complex + Lazy** | Just type `ulw` or `ultrawork` | Complex tasks where explaining context is tedious. Agent figures it out. |
| **Complex + Precise** | `@plan` → `/jack-in-work` | Precise, multi-step work requiring true orchestration. Augur Planner plans, Nexus Orchestrator executes. |

**Decision Flow:**

```
Is it a quick fix or simple task?
  └─ YES → Just prompt normally
  └─ NO  → Is explaining the full context tedious?
             └─ YES → Type "ulw" and let the agent figure it out
             └─ NO  → Do you need precise, verifiable execution?
                        └─ YES → Use @plan for Augur Planner planning, then /jack-in-work
                        └─ NO  → Just use "ulw"
```

---

This document provides a comprehensive guide to the orchestration system that implements Ghostwire's core philosophy: **"Separation of Planning and Execution"**.

## 1. Overview

Traditional AI agents often mix planning and execution, leading to context pollution, goal drift, and AI slop (low-quality code).

Ghostwire solves this by clearly separating two roles:

1. **Augur Planner (Planner)**: A pure strategist who never writes code. Establishes perfect plans through interviews and analysis.
2. **Nexus Orchestrator (Executor)**: An orchestrator who executes plans. Delegates work to specialized agents and never stops until completion.

---

## 2. Overall Architecture

```mermaid
flowchart TD
    User[User Request] --> Augur Planner
    
    subgraph Planning Phase
        Augur Planner[Augur Planner<br>Planner] --> Tactician Strategist[Tactician Strategist<br>Consultant]
        Tactician Strategist --> Augur Planner
        Augur Planner --> Glitch Auditor[Glitch Auditor<br>Reviewer]
        Glitch Auditor --> Augur Planner
        Augur Planner --> PlanFile["/.ghostwire/plans/{name}.md"]
    end
    
    PlanFile --> StartWork[//jack-in-work/]
    StartWork --> BoulderState[boulder.json]
    
    subgraph Execution Phase
        BoulderState --> Nexus Orchestrator[Nexus Orchestrator<br>Orchestrator]
        Nexus Orchestrator --> Seer Advisor[Seer Advisor]
        Nexus Orchestrator --> Frontend[Frontend<br>Engineer]
        Nexus Orchestrator --> Scout Recon[Scout Recon]
    end
```

---

## 3. Key Components

### 🔮 Augur Planner (The Planner)

- **Model**: `anthropic/claude-opus-4-5`
- **Role**: Strategic planning, requirements interviews, work plan creation
- **Constraint**: **READ-ONLY**. Can only create/modify markdown files within `.ghostwire/` directory.
- **Characteristic**: Never writes code directly, focuses solely on "how to do it".

### 🦉 Tactician Strategist (The Plan Consultant)

- **Role**: Pre-analysis and gap detection
- **Function**: Identifies hidden user intent, prevents AI over-engineering, eliminates ambiguity.
- **Workflow**: Tactician Strategist consultation is mandatory before plan creation.

### ⚖️ Glitch Auditor (The Plan Reviewer)

- **Role**: High-precision plan validation (High Accuracy Mode)
- **Function**: Rejects and demands revisions until the plan is perfect.
- **Trigger**: Activated when user requests "high accuracy".

### ⚡ Nexus Orchestrator (The Plan Executor)

- **Model**: `anthropic/claude-opus-4-5` (Extended Thinking 32k)
- **Role**: Execution and delegation
- **Characteristic**: Doesn't do everything directly, actively delegates to specialized agents (Frontend, Archive Researcher, etc.).

---

## 4. Workflow

### Phase 1: Interview and Planning (Interview Mode)

Augur Planner starts in **interview mode** by default. Instead of immediately creating a plan, it collects sufficient context.

1. **Intent Identification**: Classifies whether the user's request is Refactoring or New Feature.
2. **Context Collection**: Investigates codebase and external documentation through `scout-recon` and `archive-researcher` agents.
3. **Draft Creation**: Continuously records discussion content in `.ghostwire/drafts/`.

### Phase 2: Plan Generation

When the user requests "Make it a plan", plan generation begins.

1. **Tactician Strategist Consultation**: Confirms any missed requirements or risk factors.
2. **Plan Creation**: Writes a single plan in `.ghostwire/plans/{name}.md` file.
3. **Handoff**: Once plan creation is complete, guides user to use `/jack-in-work` command.

### Phase 3: Execution

When the user enters `/jack-in-work`, the execution phase begins.

1. **State Management**: Creates `boulder.json` file to track current plan and session ID.
2. **Task Execution**: Nexus Orchestrator reads the plan and processes TODOs one by one.
3. **Delegation**: UI work is delegated to Frontend agent, complex logic to Seer Advisor.
4. **Continuity**: Even if the session is interrupted, work continues in the next session through `boulder.json`.

---

## 5. Commands and Usage

### `@plan [request]`

Invokes Augur Planner to start a planning session.

- Example: `@plan "I want to refactor the authentication system to NextAuth"`

### `/jack-in-work`

Executes the generated plan.

- Function: Finds plan in `.ghostwire/plans/` and enters execution mode.
- If there's interrupted work, automatically resumes from where it left off.

---

## 6. Configuration Guide

You can control related features in `ghostwire.json`.

```jsonc
{
  "cipher_agent": {
    "disabled": false,           // Enable Nexus Orchestrator orchestration (default: false)
    "planner_enabled": true,     // Enable Augur Planner (default: true)
    "replace_plan": true         // Replace default plan agent with Augur Planner (default: true)
  },
  
  // Hook settings (add to disable)
  "disabled_hooks": [
    // "jack-in-work",             // Disable execution trigger
    // "augur-planner-md-only"      // Remove Augur Planner write restrictions (not recommended)
  ]
}
```

## 7. Best Practices

1. **Don't Rush**: Invest sufficient time in the interview with Augur Planner. The more perfect the plan, the faster the execution.
2. **Single Plan Principle**: No matter how large the task, contain all TODOs in one plan file (`.md`). This prevents context fragmentation.
3. **Active Delegation**: During execution, delegate to specialized agents via `delegate_task` rather than modifying code directly.
