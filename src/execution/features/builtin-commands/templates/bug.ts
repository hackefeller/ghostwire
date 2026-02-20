export const REPRODUCE_BUG_TEMPLATE = `# Reproduce:Bug Command

Reproduce and investigate a bug using logs, console inspection, and browser screenshots.

## Input

**Issue:** GitHub issue #$ARGUMENTS

## Process

### Phase 1: Log Investigation

Run these agents in parallel to investigate the bug:

1. Task researcher-learnings($ARGUMENTS)
2. Task researcher-docs($ARGUMENTS)

Think about the places it could go wrong looking at the codebase. Look for logging output we can look for.

Run the agents again to find any logs that could help us reproduce the bug.

Keep running these agents until you have a good idea of what is going on.

### Phase 2: Visual Reproduction with agent-browser

If the bug is UI-related or involves user flows, use agent-browser CLI to visually reproduce it:

### Step 1: Verify Server is Running
\`\`\`bash
agent-browser open http://localhost:3000
agent-browser snapshot -i
\`\`\`

If server not running, inform user to start \`bin/dev\`.

### Step 2: Navigate to Affected Area

Based on the issue description, navigate to the relevant page:
\`\`\`bash
agent-browser open http://localhost:3000/[affected_route]
agent-browser snapshot -i
\`\`\`

### Step 3: Capture Screenshots

Take screenshots at each step of reproducing the bug:
\`\`\`bash
agent-browser screenshot bug-[issue]-step-1.png
\`\`\`

### Step 4: Follow User Flow

Reproduce the exact steps from the issue:
1. Read the issue's reproduction steps
2. Execute each step using agent-browser
3. Check for console errors

### Phase 3: Document Findings

Create a reproduction report with:
- Steps to reproduce
- Screenshots
- Console errors
- Root cause analysis
`;

export const REPORT_BUG_TEMPLATE = `# Report:Bug Command

Report a bug in the ghostwire plugin.

## Process

### Step 1: Gather Bug Information

Use the AskUserQuestion tool to collect:

**Question 1: Bug Category**
- What type of issue are you experiencing?
- Options: Agent not working, Command not working, Skill not working, MCP server issue, Installation problem, Other

**Question 2: Specific Component**
- Which specific component is affected?

**Question 3: What Happened (Actual Behavior)**
- What happened when you used this component?

**Question 4: What Should Have Happened (Expected Behavior)**
- What did you expect to happen instead?

**Question 5: Steps to Reproduce**
- What steps did you take before the bug occurred?

**Question 6: Error Messages**
- Did you see any error messages?

### Step 2: Collect Environment Information

Automatically gather:
\`\`\`bash
# Get ghostwire version
cat package.json | grep version

# Get OpenCode version
claude --version

# Get OS info
uname -a
\`\`\`

### Step 3: Format the Bug Report

Create a well-structured bug report in markdown format.
`;
