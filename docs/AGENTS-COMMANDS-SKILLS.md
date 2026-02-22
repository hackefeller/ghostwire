# Ghostwire Agent, Command, and Skill Map

## Overview

| Category | Count | Source |
|---------|-------|--------|
| Agents | 31 | `src/orchestration/agents/*.md` |
| Commands | 26 | `src/execution/features/builtin-commands/types.ts` |
| Skills | 19 | `src/execution/features/builtin-skills/` |

---

## Agents (31 total)

Organized by functional category.

### Orchestration (4 agents)
| Agent ID | Model | Purpose |
|----------|-------|---------|
| operator | claude-opus-4-5 | Primary orchestrator with obsession for todos, strategic delegation, and parallel execution |
| orchestrator | claude-sonnet-4-5 | Master orchestrator that coordinates all agents and tasks until completion |
| planner | claude-opus-4-5 | Strategic planning consultant that interviews users and generates work plans |
| executor | claude-opus-4-5 | Execution specialist that implements tasks with focus on completion |

### Code Review (7 agents)
| Agent ID | Model | Purpose |
|----------|-------|---------|
| reviewer-rails | claude-opus-4-5 | Kieran-style Rails code review specialist |
| reviewer-python | claude-opus-4-5 | Python code review specialist with strict quality standards |
| reviewer-typescript | claude-opus-4-5 | TypeScript code review specialist with high quality bar |
| reviewer-rails-dh | claude-sonnet-4-5 | DHH-style Rails code review with 37signals philosophy |
| reviewer-simplicity | claude-sonnet-4-5 | Code simplicity reviewer focusing on YAGNI principles |
| reviewer-security | gpt-5.3-codex | Security audits and vulnerability assessments |
| reviewer-races | gpt-5.3-codex | JavaScript and Stimulus race condition reviewer |

### Research (8 agents)
| Agent ID | Model | Purpose |
|----------|-------|---------|
| researcher-docs | claude-sonnet-4-5 | Framework documentation researcher for official docs and examples |
| researcher-learnings | claude-sonnet-4-5 | Internal learnings researcher for institutional knowledge |
| researcher-practices | claude-sonnet-4-5 | Best practices researcher for industry standards and patterns |
| researcher-git | claude-sonnet-4-5 | Git history analyzer for understanding code evolution |
| researcher-codebase | claude-haiku-4.5 | Codebase search specialist finding files and code patterns |
| researcher-data | glm-4.7 | External library and documentation researcher |
| researcher-repo | gpt-5.3-codex | Repository structure and convention researcher |
| analyzer-media | gemini-3-flash | Media file analyzer for PDFs, images, diagrams |

### Design (5 agents)
| Agent ID | Model | Purpose |
|----------|-------|---------|
| designer-flow | claude-sonnet-4-5 | Spec flow analyzer for user journey and feature validation |
| designer-sync | claude-opus-4-5 | Figma design synchronization specialist |
| designer-iterator | claude-opus-4-5 | Design iterator for systematic visual improvements |
| analyzer-design | claude-sonnet-4-5 | Design implementation reviewer comparing UI to Figma |
| designer-builder | claude-opus-4-5 | Frontend design implementation specialist |

### Advisory (3 agents)
| Agent ID | Model | Purpose |
|----------|-------|---------|
| advisor-architecture | claude-opus-4-5 | Agent native architecture specialist |
| advisor-strategy | claude-opus-4-5 | Pre-planning consultant preventing AI failures |
| advisor-plan | claude-opus-4-5 | High-IQ read-only consultation for debugging and architecture |

### Validation (4 agents)
| Agent ID | Model | Purpose |
|----------|-------|---------|
| validator-audit | claude-opus-4-5 | Expert reviewer for evaluating work plans |
| validator-deployment | claude-sonnet-4-5 | Deployment verification specialist |
| validator-bugs | gpt-5.3-codex | Bug reproduction and validation specialist |
| analyzer-patterns | gpt-5.3-codex | Design pattern recognition specialist |

### Specialized (4 agents)
| Agent ID | Model | Purpose |
|----------|-------|---------|
| expert-migrations | gpt-5.3-codex | Data migration and backfill expert |
| guardian-data | gpt-5.3-codex | Database migration and data integrity expert |
| resolver-pr | gpt-5.3-codex | PR comment resolution specialist |
| oracle-performance | gpt-5.3-codex | Performance analysis and optimization specialist |

### Documentation (3 agents)
| Agent ID | Model | Purpose |
|----------|-------|---------|
| writer-readme | claude-sonnet-4-5 | Ankane-style README writer |
| writer-gem | claude-sonnet-4-5 | Ruby gem documentation writer |
| editor-style | claude-sonnet-4-5 | Style guide editor |

---

## Commands (26 total)

### Built-in Core Commands (8 commands)
| Command | Description |
|---------|-------------|
| init-deep | Initialize new projects with deep thinking |
| overclock-loop | Run task completion enforcement loop |
| cancel-overclock | Cancel overclock loop |
| ulw-overclock | Ultra-work mode with relentless execution |
| refactor | Code refactoring assistance |
| jack-in-work | Jump into work mode |
| stop-continuation | Stop continuation mode |

### Ghostwire Workflow Commands (4 commands)
| Command | Description |
|---------|-------------|
| ghostwire:workflows:plan | Create implementation plans |
| ghostwire:workflows:create | Create new workflows |
| ghostwire:workflows:status | Check workflow status |
| ghostwire:workflows:complete | Complete workflow |

### Ghostwire Code Commands (4 commands)
| Command | Description |
|---------|-------------|
| ghostwire:code:refactor | Code refactoring |
| ghostwire:code:review | Code review |
| ghostwire:code:optimize | Code optimization |
| ghostwire:code:format | Code formatting |

### Ghostwire Git Commands (4 commands)
| Command | Description |
|---------|-------------|
| ghostwire:git:smart-commit | Smart commit with context |
| ghostwire:git:branch | Branch management |
| ghostwire:git:merge | Merge assistance |
| ghostwire:git:cleanup | Cleanup branches |

### Ghostwire Project Commands (4 commands)
| Command | Description |
|---------|-------------|
| ghostwire:project:init | Initialize project |
| ghostwire:project:build | Build project |
| ghostwire:project:deploy | Deploy project |
| ghostwire:project:test | Run tests |

### Ghostwire Utility Commands (4 commands)
| Command | Description |
|---------|-------------|
| ghostwire:util:clean | Clean project |
| ghostwire:util:backup | Backup files |
| ghostwire:util:restore | Restore files |
| ghostwire:util:doctor | Run diagnostics |

### Ghostwire Docs Commands (4 commands)
| Command | Description |
|---------|-------------|
| ghostwire:docs:deploy-docs | Deploy documentation |
| ghostwire:docs:release-docs | Release documentation |
| ghostwire:docs:feature-video | Create feature video |
| ghostwire:docs:test-browser | Browser testing |

### Migrated Plugin Commands - Regular (21 commands)
| Command | Description |
|---------|-------------|
| plan-review | Review implementation plans |
| changelog | Create changelogs |
| create-agent-skill | Create new agent skills |
| deepen-plan | Enhance plans with research |
| deploy-docs | Deploy documentation to GitHub Pages |
| feature-video | Record feature walkthroughs |
| generate-command | Generate custom commands |
| heal-skill | Fix broken skills |
| lfg | Looking for group - find help |
| quiz-me | Interactive quizzes |
| release-docs | Create versioned releases |
| report-bug | Report bugs |
| reproduce-bug | Reproduce bugs |
| resolve-parallel | Resolve multiple items in parallel |
| resolve-pr-parallel | Resolve PRs in parallel |
| resolve-todo-parallel | Resolve todos in parallel |
| sync-tutorials | Sync tutorials |
| teach-me | Interactive learning |
| test-browser | Browser testing |
| triage | Triage issues |
| xcode-test | Xcode testing |

### Migrated Plugin Commands - Workflow (5 commands)
| Command | Description |
|---------|-------------|
| workflows:brainstorm | Brainstorming workflow |
| workflows:compound | Compounding workflow |
| workflows:plan | Planning workflow |
| workflows:review | Review workflow |
| workflows:work | Work execution workflow |

---

## Skills (19 total)

### Core Skills (4 skills)
| Skill | Description |
|-------|-------------|
| agent-browser | Browser automation via Playwright |
| frontend-ui-ux | Frontend design and UI/UX |
| git-master | Git mastery |
| dev-browser | Development browser |

### Migrated Plugin Skills (15 skills)
| Skill | Description |
|-------|-------------|
| andrew-kane-gem-writer | Andrew Kane gem documentation style |
| brainstorming | Brainstorming assistance |
| coding-tutor | Coding tutorials |
| compound-docs | Compound documentation |
| create-agent-skills | Create agent skills |
| dhh-rails-style | DHH Rails style |
| dspy-ruby | DSpY Ruby |
| every-style-editor | Every style editor |
| file-todos | File-based todos |
| frontend-design | Frontend design |
| gemini-imagegen | Gemini image generation |
| git-worktree | Git worktree management |
| ralph-loop | Ralph Loop |
| rclone | Rclone cloud sync |
| skill-creator | Skill creation |

---

## File Locations

| Category | Location |
|----------|----------|
| Agents | `src/orchestration/agents/*.md` |
| Commands | `src/execution/features/builtin-commands/` |
| Command Templates | `src/execution/features/builtin-commands/templates/*.ts` |
| Skills | `src/execution/features/builtin-skills/*/SKILL.md` |

---

## Usage

### Running Commands
Commands are accessed via the `slashcommand` tool:
```
Use slashcommand tool to run /plan-review
```

### Loading Skills
Skills are loaded on-demand via the `skill` tool:
```
skill({ name: "coding-tutor" })
```

### Using Agents
Agents are invoked via the `delegate_task` tool with the agent name:
```
delegate_task({ subagent_type: "planner", prompt: "..." })
```
