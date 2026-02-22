# Agents, Commands, and Skills: The Unified Model

## The Problem

Users are confused because ghostwire has **three overlapping concepts** that seem to do similar things:

- **Agents** - Autonomous AI workers
- **Commands** - Structured workflows  
- **Skills** - Knowledge/tool providers

This document explains what each is, how they differ, and when to use each one.

---

## Quick Definitions

### Agent
**An autonomous AI entity that reasons, makes decisions, and executes work.**

- Thinks independently
- Makes strategic decisions
- Can delegate to other agents
- Can load skills for specialized knowledge
- Examples: `planner`, `researcher-codebase`, `reviewer-rails`

### Command
**A structured workflow that orchestrates agents to accomplish a goal.**

- Defines a sequence of steps
- Invokes agents at specific points
- Verifies results
- Handles errors and retries
- Examples: `/ghostwire:workflows:plan`, `/ghostwire:code:review`

### Skill
**Passive knowledge or tool access that enhances agents.**

- Provides specialized knowledge
- Enables tool access
- Cannot act independently
- Must be loaded into an agent
- Examples: `git-master`, `playwright`, `frontend-ui-ux`

---

## The Autonomy Spectrum

```
┌─────────────────────────────────────────────────────────┐
│                   AUTONOMY SPECTRUM                     │
└─────────────────────────────────────────────────────────┘

PASSIVE                                              ACTIVE
  │                                                    │
  ▼                                                    ▼
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ SKILLS   │    │ COMMANDS │    │ AGENTS   │    │ORCHESTR. │
│          │    │          │    │          │    │ AGENTS   │
│Passive   │    │Semi-Auto │    │Autonomous│    │Master    │
│Knowledge │    │Workflows │    │Reasoning │    │Coord.    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

---

## Side-by-Side Comparison

| Aspect | Skill | Command | Agent |
|--------|-------|---------|-------|
| **Autonomy** | None (passive) | Semi (scripted) | Full (reasoning) |
| **Invocation** | Loaded into agent | `/command-name` | `@agent-name` or `delegate_task()` |
| **Decision Making** | No | Limited (scripted) | Yes (autonomous) |
| **Can Delegate** | No | Yes (to agents) | Yes (to other agents) |
| **Can Load Skills** | No | Yes | Yes |
| **Persistence** | Temporary | Per invocation | Per invocation |
| **Examples** | git-master, playwright | /plan, /review | planner, reviewer-rails |
| **Use When** | Need specialized knowledge | Need structured workflow | Need autonomous reasoning |

---

## The Relationship Model

### How They Interact

```
┌─────────────────────────────────────────────────────────┐
│                    COMMAND                              │
│              (Orchestrator/Workflow)                    │
│                                                         │
│  1. Parse user intent                                   │
│  2. Decide which agents to invoke                       │
│  3. Load skills for agents                              │
│  4. Invoke agents with context                          │
│  5. Verify results                                      │
│  6. Report to user                                      │
└────────────────┬────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
    ┌────────┐        ┌────────┐
    │ AGENT  │        │ AGENT  │
    │        │        │        │
    │ Reason │        │ Reason │
    │ Decide │        │ Decide │
    │ Execute│        │ Execute│
    └────┬───┘        └────┬───┘
         │                 │
         ▼                 ▼
    ┌────────┐        ┌────────┐
    │ SKILL  │        │ SKILL  │
    │        │        │        │
    │ Provide│        │ Provide│
    │ Tools  │        │ Tools  │
    └────────┘        └────────┘
```

### Dependency Graph

```
COMMAND
  ├─ Invokes → AGENT 1
  │             ├─ Loads → SKILL A
  │             ├─ Loads → SKILL B
  │             └─ Delegates → AGENT 2
  │                            └─ Loads → SKILL C
  │
  └─ Invokes → AGENT 3
               └─ Loads → SKILL D
```

---

## The Three Types of Agents

### Type 1: Orchestration Agents
**Coordinate other agents and manage workflows.**

| Agent | Purpose |
|-------|---------|
| `operator` | Primary orchestrator with obsession for todos |
| `orchestrator` | Master coordinator for all agents |
| `planner` | Strategic planning consultant |
| `executor` | Execution specialist (Dark Runner) |

**Characteristics:**
- Can delegate to other agents
- Maintain state via `.ghostwire/` files
- Verify results from delegated agents
- Handle errors and retries

**When Used:**
- `/jack-in-work` command (operator)
- `/ghostwire:workflows:plan` command (planner)
- `/ghostwire:workflows:work` command (executor)

---

### Type 2: Specialist Agents
**Execute focused work in specific domains.**

| Category | Agents |
|----------|--------|
| Code Review | reviewer-rails, reviewer-python, reviewer-typescript, reviewer-security, etc. |
| Research | researcher-codebase, researcher-docs, researcher-data, researcher-git, etc. |
| Design | designer-flow, designer-builder, designer-sync, etc. |
| Advisory | advisor-architecture, advisor-strategy, advisor-plan |
| Validation | validator-audit, validator-deployment, validator-bugs |
| Specialized | expert-migrations, guardian-data, resolver-pr, oracle-performance |
| Documentation | writer-readme, writer-gem, editor-style |

**Characteristics:**
- Focused expertise in one domain
- Cannot delegate to other agents (blocked)
- Can call researcher agents for context
- Verify with tools (lsp_diagnostics, bash, etc.)

**When Used:**
- Invoked by commands via `delegate_task()`
- Invoked by orchestration agents
- Invoked directly via `@agent-name`

---

### Type 3: Category-Based Agents
**Ephemeral agents created on-the-fly with specific configurations.**

| Category | Purpose |
|----------|---------|
| `visual-engineering` | Frontend/UI work |
| `business-logic` | Backend/core logic |
| `ultrabrain` | Complex reasoning |
| `quick` | Simple, fast tasks |
| `writing` | Documentation/content |

**Characteristics:**
- Created dynamically when needed
- Configured with specific skills
- Temporary (exist only for the task)
- Routed to appropriate agent based on category

**When Used:**
- `delegate_task(category="visual-engineering", ...)`
- `delegate_task(category="business-logic", ...)`
- `delegate_task(category="ultrabrain", ...)`

---

## The Two Types of Commands

### Type 1: Workflow Commands
**Structured workflows that orchestrate agents.**

| Command | Purpose | Agents |
|---------|---------|--------|
| `/ghostwire:workflows:plan` | Plan a feature | planner, researcher-* |
| `/ghostwire:workflows:work` | Execute a plan | executor, researcher-*, reviewer-* |
| `/ghostwire:workflows:brainstorm` | Brainstorm ideas | advisor-*, researcher-* |
| `/ghostwire:code:review` | Review code | reviewer-* |
| `/ghostwire:code:refactor` | Refactor code | reviewer-*, researcher-* |

**Characteristics:**
- Define multi-phase workflows
- Invoke agents at specific points
- Verify results between phases
- Handle errors and retries
- Maintain state

**When Used:**
- User wants a structured workflow
- Multiple agents need coordination
- Results need verification

---

### Type 2: Utility Commands
**Simple commands that don't invoke agents.**

| Command | Purpose |
|---------|---------|
| `/ghostwire:git:smart-commit` | Smart commits |
| `/ghostwire:project:build` | Build project |
| `/ghostwire:project:test` | Run tests |
| `/ghostwire:util:clean` | Clean project |

**Characteristics:**
- No agent invocation
- Direct tool execution
- Simple, focused tasks
- Fast execution

**When Used:**
- User wants direct action
- No reasoning needed
- Simple, well-defined task

---

## The Two Types of Skills

### Type 1: Knowledge Skills
**Inject specialized knowledge into agents.**

| Skill | Knowledge |
|-------|-----------|
| `git-master` | Git expertise and atomic commits |
| `frontend-ui-ux` | Frontend design and UX patterns |
| `dev-browser` | Browser automation and testing |
| `playwright` | Playwright browser automation |

**Characteristics:**
- Provide domain expertise
- Enable specialized reasoning
- Enhance agent decision-making
- Loaded via `load_skills=["..."]`

**When Used:**
- Agent needs specialized knowledge
- Task requires domain expertise
- Want to enhance agent capabilities

---

### Type 2: Tool Skills
**Enable access to specialized tools.**

| Skill | Tools |
|-------|-------|
| `playwright` | Browser automation (Playwright MCP) |
| `git-master` | Git operations (atomic commits, rebase) |
| `dev-browser` | Browser interaction and testing |

**Characteristics:**
- Provide tool access
- Enable specialized operations
- Loaded via `load_skills=["..."]`
- Can be combined

**When Used:**
- Agent needs specialized tools
- Task requires tool access
- Want to enable specific capabilities

---

## Decision Tree: What Should I Use?

```
START: "I want to accomplish something"
  │
  ├─ "I want a structured workflow"
  │   └─ USE COMMAND
  │       ├─ /ghostwire:workflows:plan (planning)
  │       ├─ /ghostwire:workflows:work (execution)
  │       ├─ /ghostwire:code:review (code review)
  │       └─ /ghostwire:code:refactor (refactoring)
  │
  ├─ "I want autonomous reasoning"
  │   └─ USE AGENT
  │       ├─ @planner (planning)
  │       ├─ @reviewer-rails (code review)
  │       ├─ @researcher-codebase (exploration)
  │       └─ @advisor-plan (debugging)
  │
  ├─ "I want to enhance an agent"
  │   └─ USE SKILL
  │       ├─ git-master (git expertise)
  │       ├─ frontend-ui-ux (design expertise)
  │       └─ playwright (browser automation)
  │
  └─ "I'm not sure"
      └─ START HERE: Use a COMMAND
          (Commands know which agents to invoke)
```

---

## Real-World Scenarios

### Scenario 1: "I want to plan a feature"

**Wrong Approach:**
```
"Use the planner agent to plan my feature"
```

**Why It Fails:**
- Planner is passive without a command
- Doesn't know what to research
- Can't coordinate with other agents
- Results aren't synthesized

**Right Approach:**
```
/ghostwire:workflows:plan Add user authentication
```

**What Happens:**
1. Command invokes planner agent
2. Planner researches existing patterns
3. Planner creates work plan
4. Command synthesizes results
5. User gets actionable plan

---

### Scenario 2: "I want to review code"

**Wrong Approach:**
```
"Use the reviewer-rails agent to review my code"
```

**Why It Fails:**
- Agent doesn't know what code to review
- Can't coordinate with other reviewers
- Results aren't synthesized
- No actionable recommendations

**Right Approach:**
```
/ghostwire:code:review
```

**What Happens:**
1. Command identifies code to review
2. Command invokes multiple review agents in parallel
3. Agents review from different perspectives
4. Command synthesizes findings
5. User gets comprehensive review with todos

---

### Scenario 3: "I want to execute a plan"

**Wrong Approach:**
```
"Use the executor agent to execute my plan"
```

**Why It Fails:**
- Agent doesn't know the plan
- Can't manage git operations
- Can't track progress
- Can't verify results

**Right Approach:**
```
/ghostwire:workflows:work path/to/plan.md
```

**What Happens:**
1. Command reads the plan
2. Command invokes executor agent
3. Executor executes each task
4. Command verifies results
5. Command manages git commits
6. User gets completed work

---

### Scenario 4: "I want to refactor code"

**Wrong Approach:**
```
"Use the refactor agent to refactor my code"
```

**Why It Fails:**
- No "refactor agent" exists
- Refactoring requires multiple specialists
- Needs research + planning + execution + verification

**Right Approach:**
```
/ghostwire:code:refactor
```

**What Happens:**
1. Command launches parallel researchers (background)
2. Command uses LSP tools for analysis
3. Command collects research results
4. Command invokes executor agent
5. Command verifies with tests
6. User gets refactored code

---

### Scenario 5: "I want to use git-master skill"

**Wrong Approach:**
```
"Load the git-master skill"
```

**Why It Fails:**
- Skills don't work alone
- Need an agent to use the skill
- Need a command to invoke the agent

**Right Approach:**
```
/ghostwire:git:smart-commit
```

**What Happens:**
1. Command invokes operator agent
2. Operator loads git-master skill
3. Operator uses git expertise to create smart commit
4. User gets well-structured commit

---

## Common Mistakes and How to Avoid Them

### Mistake 1: Using Agents Without Commands

**Wrong:**
```
"Use the planner agent to plan my feature"
```

**Why It Fails:**
- Agents are passive
- Need commands to provide context
- Need commands to coordinate

**Right:**
```
/ghostwire:workflows:plan Add feature
```

---

### Mistake 2: Using Skills Without Agents

**Wrong:**
```
"Load the git-master skill"
```

**Why It Fails:**
- Skills are passive
- Need agents to use them
- Need commands to invoke agents

**Right:**
```
/ghostwire:git:smart-commit
```

---

### Mistake 3: Trying to Coordinate Agents Manually

**Wrong:**
```
"First use researcher-codebase, then use reviewer-rails"
```

**Why It Fails:**
- Agents can't coordinate each other
- Results aren't synthesized
- No verification

**Right:**
```
/ghostwire:code:review
```

---

### Mistake 4: Assuming Agents Know the Context

**Wrong:**
```
"Use the executor agent to implement the feature"
```

**Why It Fails:**
- Agent doesn't know what feature
- Agent doesn't know the plan
- Agent doesn't know the codebase

**Right:**
```
/ghostwire:workflows:work path/to/plan.md
```

---

### Mistake 5: Using the Wrong Agent Type

**Wrong:**
```
"Use the planner agent to review code"
```

**Why It Fails:**
- Planner is for planning, not reviewing
- Doesn't have review expertise
- Will produce a plan, not a review

**Right:**
```
/ghostwire:code:review
```

---

## Mental Model: The Restaurant Analogy

### The Wrong Mental Model

> "I'll just tell the chef (agent) to cook dinner"

**Problem:**
- Chef doesn't know what dinner means
- Chef doesn't know what ingredients are available
- Chef doesn't know how many people to cook for
- Chef can't coordinate with other chefs

### The Right Mental Model

> "I'll use the head chef (command) to coordinate the kitchen (agents) using recipes (skills)"

**How It Works:**

1. **Head Chef (Command)** receives the order: "Cook dinner for 10 people"
2. **Head Chef** decides what to cook and coordinates:
   - **Sous Chef (Planner)** plans the menu
   - **Prep Cook (Researcher)** finds ingredients
   - **Line Cook (Executor)** cooks the dishes
   - **Pastry Chef (Designer)** plates the food
3. **Head Chef** uses **Recipes (Skills)** to guide each chef
4. **Head Chef** verifies each dish before serving
5. **Guests** enjoy the complete meal

**Key Insight:** Each chef is specialized. The head chef coordinates. The order (command) drives everything.

---

## Summary: The Golden Rules

### Rule 1: Commands Are Entry Points
- Always start with a command
- Commands know which agents to invoke
- Commands handle coordination

### Rule 2: Agents Are Specialists
- Each agent has a specific purpose
- Use the right agent for the job
- Agents can't coordinate themselves

### Rule 3: Skills Enhance Agents
- Skills provide specialized knowledge
- Skills enable tool access
- Skills must be loaded into agents

### Rule 4: Let Commands Decide
- Commands are smart about when to invoke agents
- Don't try to manually coordinate agents
- Trust the command to do the right thing

### Rule 5: Understand the Autonomy Spectrum
- Skills are passive (knowledge only)
- Commands are semi-autonomous (scripted workflows)
- Agents are fully autonomous (reasoning)
- Orchestration agents coordinate everything

---

## Next Steps

1. **Read the full guides:**
   - [Agents and Commands Explained](./agents-and-commands-explained.md)
   - [Quick Reference](./agents-commands-quick-reference.md)

2. **Try a command:**
   - `/ghostwire:workflows:plan Add a feature`
   - Watch how the command invokes agents

3. **Explore agents:**
   - Check `src/orchestration/agents/` for agent definitions
   - Understand agent constraints and capabilities

4. **Create custom commands:**
   - Build workflows that fit your needs
   - Coordinate agents effectively

---

## Related Documentation

- [Agents and Commands Explained](./agents-and-commands-explained.md) - Deep dive
- [Quick Reference](./agents-commands-quick-reference.md) - Cheat sheet
- [Commands Reference](../reference/commands.md) - All commands
- [Agents Reference](../reference/agents.md) - All agents
- [Skills Reference](../reference/skills.md) - All skills
- [Workflows Guide](./workflows.md) - Workflow patterns
