export const AGENT_NATIVE_AUDIT_TEMPLATE = `# Agent-Native Audit Command

Run comprehensive agent-native architecture review with scored principles.

## Core Principles to Audit

1. **Action Parity** - "Whatever the user can do, the agent can do"
2. **Tools as Primitives** - "Tools provide capability, not behavior"
3. **Context Injection** - "System prompt includes dynamic context about app state"
4. **Shared Workspace** - "Agent and user work in the same data space"
5. **CRUD Completeness** - "Every entity has full CRUD (Create, Read, Update, Delete)"
6. **UI Integration** - "Agent actions immediately reflected in UI"
7. **Capability Discovery** - "Users can discover what the agent can do"
8. **Prompt-Native Features** - "Features are prompts defining outcomes, not code"

## Process

### Step 1: Load the Agent-Native Skill

Invoke the agent-native-architecture skill to understand all principles:
\`\`\`
skill: agent-native-architecture
\`\`\`

### Step 2: Launch Parallel Sub-Agents

Launch 8 parallel sub-agents using the Task tool, one for each principle. Each agent should:

1. Enumerate ALL instances in the codebase
2. Check compliance against the principle
3. Provide a SPECIFIC SCORE like "X out of Y (percentage%)"
4. List specific gaps and recommendations

### Step 3: Synthesize Results

Combine all agent results into a scored report:
- Overall compliance score
- Per-principle scores
- Critical gaps identified
- Recommended actions

### Step 4: Present Report

Present a comprehensive audit report with:
- Executive summary
- Detailed findings per principle
- Priority-ordered recommendations
- Next steps
`;
