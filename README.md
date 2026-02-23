# Ghostwire

**The "oh-my-zsh" for OpenCode** — a plugin that transforms OpenCode into a powerful multi-model agent orchestration platform.

## What is Ghostwire?

Ghostwire is an OpenCode plugin that provides:

- **Multi-model orchestration** — Coordinate Claude, GPT, Gemini, and Grok agents seamlessly
- **38+ specialized agents** — From security audits to frontend development
- **39 lifecycle hooks** — Automate workflows at every stage
- **Built-in MCPs** — Exa (web search), Context7 (docs), Grep.app (GitHub code search)
- **Claude Code compatibility** — Full support for commands, skills, agents, and hooks

## Quick Start

### For Humans

```bash
# Install ghostwire
npm install -g ghostwire

# Initialize in your project
opencode --ghostwire-init
```

### For LLM Agents

Copy this prompt to Claude Code, Cursor, or any LLM agent:

```
Install and configure ghostwire by following the instructions here:
https://raw.githubusercontent.com/pontistudios/ghostwire/refs/heads/dev/docs/guide/installation.md
```

## Features

### Agents

Ghostwire includes specialized agents for different tasks:

| Agent | Purpose |
|-------|---------|
| **Cipher Operator** | Main orchestrator with deep thinking |
| **Seer Advisor** | Architecture and debugging |
| **Archive Researcher** | Docs and code search |
| **Scout Recon** | Fast codebase exploration |
| **Frontend UI/UX** | Frontend development with Gemini |
| **Security Reviewer** | Vulnerability assessments |

### Built-in Skills

- **playwright** — Browser automation
- **git-master** — Atomic commits, rebase, history search
- **dev-browser** — Persistent browser automation
- **github-issue-triage** — Issue analysis

### Commands

Use slash commands for common workflows:

- `/ghostwire:init-deep` — Initialize knowledge base
- `/ghostwire:workflows:plan` — Transform features into plans
- `/ghostwire:code:refactor` — Intelligent refactoring
- `/ghostwire:git:smart-commit` — Well-structured commits
- `/ghostwire:project:test` — Run tests with coverage
- **And 40+ more...**

### Hooks

39 hooks for workflow automation:

- **orchestrator** — Multi-agent coordination
- **planner** — Plan generation and execution
- **context-window-monitor** — Track token usage
- **anthropic-context-window-limit-recovery** — Auto-recover from limits
- **keyword-detector** — Trigger agents by keywords
- And many more...

## Installation

See the [Installation Guide](docs/guide/installation.md) for detailed instructions.

## Configuration

Ghostwire is highly configurable:

- **Agents** — Override models, temperatures, prompts
- **Skills** — Enable/disable built-in skills
- **Hooks** — Customize or disable lifecycle hooks
- **Categories** — Define task delegation categories
- **MCPs** — Configure external MCP servers

See [Configuration Reference](docs/reference/configurations.md) for options.

## Architecture

```
ghostwire/
├── src/
│   ├── orchestration/     # Agents + Hooks
│   │   ├── agents/       # Agent definitions
│   │   └── hooks/        # Lifecycle hooks
│   ├── execution/        # Features + Tools
│   │   ├── features/     # Capabilities
│   │   └── tools/        # Actions
│   ├── integration/      # MCPs + utilities
│   │   ├── mcp/          # Built-in MCPs
│   │   └── shared/       # Logger, parser, etc.
│   ├── platform/         # Config + platform适配
│   └── cli/             # CLI commands
└── packages/            # Platform binaries
```

## Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Build
bun run build

# Type check
bun run typecheck
```

## Resources

- [Documentation](docs/)
- [Agent Reference](docs/reference/agents.md)
- [Hook Reference](docs/reference/lifecycle-hooks.md)
- [Configuration Reference](docs/reference/configurations.md)
- [Features Overview](docs/features.md)

## License

See [LICENSE.md](LICENSE.md).

## Author

Built by [@pontistudios](https://github.com/pontistudios)
