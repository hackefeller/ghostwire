export const XCODE_TEST_TEMPLATE = `# Xcode:Test Command

Build, install, and test iOS apps on the simulator using XcodeBuildMCP.

## Prerequisites

- Xcode installed with command-line tools
- XcodeBuildMCP server connected
- Valid Xcode project or workspace
- At least one iOS Simulator available

## Process

### Step 1: Verify XcodeBuildMCP is Installed

Check if XcodeBuildMCP tools are available:
\`\`\`bash
mcp__xcodebuildmcp__list_simulators({})
\`\`\`

If not available, instruct user to install:
\`\`\`bash
claude mcp add XcodeBuildMCP -- npx xcodebuildmcp@latest
\`\`\`

### Step 2: Discover Project and Scheme

Find available projects:
\`\`\`bash
mcp__xcodebuildmcp__discover_projs({})
\`\`\`

List schemes for the project:
\`\`\`bash
mcp__xcodebuildmcp__list_schemes({ project_path: "/path/to/Project.xcodeproj" })
\`\`\`

### Step 3: Boot Simulator

List available simulators:
\`\`\`bash
mcp__xcodebuildmcp__list_simulators({})
\`\`\`

Boot preferred simulator:
\`\`\`bash
mcp__xcodebuildmcp__boot_simulator({ simulator_id: "iPhone 15 Pro" })
\`\`\`

### Step 4: Build Project

Build for simulator:
\`\`\`bash
mcp__xcodebuildmcp__build_project({ project_path: "...", scheme: "...", destination: "platform=iOS Simulator,name=iPhone 15 Pro" })
\`\`\`

### Step 5: Run Tests

Install and launch app, then run tests:
\`\`\`bash
mcp__xcodebuildmcp__run_tests({ project_path: "...", scheme: "..." })
\`\`\`

### Step 6: Capture Results

Take screenshots and capture logs for verification.
`;
