---
title: DevOps Setup Guide for Compound Engineering Components
type: chore
date: 2026-02-07
---

# DevOps Setup Guide for Compound Engineering Components

## Overview

Comprehensive setup guide for teams to leverage the 125 integrated compound engineering components (28 agents, 24 commands, 73 skills) in oh-my-opencode v3.2.0. This guide covers environment setup, configuration patterns, development workflows, and CI/CD integration.

## Target Audience

- **DevOps Engineers** - Setting up development environments
- **Team Leads** - Establishing development standards
- **Senior Developers** - Understanding compound capabilities  
- **Technical Writers** - Creating internal documentation
- **QA Engineers** - Testing compound-based workflows

## Prerequisites

### Environment Requirements
- **Node.js**: v18+ (required for oh-my-opencode)
- **Bun**: v1.3+ (package manager)
- **TypeScript**: v5.7+ (for type safety)
- **Git**: v2.30+ (for version control)

### Platform Support
- ✅ **macOS**: Full support (arm64/x64)
- ✅ **Linux**: Full support (arm64/x64)  
- ✅ **Windows**: Full support (x64)
- ✅ **WSL**: Full support (Linux kernel)

---

## Quick Setup Commands

```bash
# Clone and setup
git clone <your-repo>
cd oh-my-opencode
bun install

# Quick configuration validation
opencode doctor

# Enable all compound components
opencode config --enable-agents compound:* --enable-commands compound:* --enable-skills compound:*

# Start development server
opencode start --dev
```

---

## 1. Environment Setup

### Development Environment

#### Installation Commands
```bash
# Using npm
npm install -g oh-my-opencode@3.2.0

# Using yarn  
yarn global add oh-my-opencode@3.2.0

# Using bun (recommended)
bun install -g oh-my-opencode@3.2.0
```

#### Development Server Setup

```bash
# Start with all compound components enabled
opencode start --agents compound:* --commands compound:* --skills compound:*

# Or start with specific agent configuration
opencode start --agents compound:kieran-rails-reviewer,compound:figma-design-sync

# Start with hot reload for development
opencode start --agents compound:* --commands compound:* --skills compound:* --hot-reload

# Start with debug mode for troubleshooting
opencode start --agents compound:* --debug
```

#### IDE Integration

#### VS Code Setup
```json
// .vscode/settings.json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.formatOnSave": true,
  "files.associations": {
    "*.ts": "typescript",
    "*.tsx": "typescriptreact"
  }
}
```

#### Git Configuration
```bash
# Configure git for development
git config --global core.editor "code --wait"
git config --global core.autocrlf false
git config --global pull.rebase false

# Set up .gitignore for compound development
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
bun_modules/
.nyc_output/
dist/
.env
.env.local

# Logs
*.log
logs/

# Development artifacts
*.tmp
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Build artifacts
packages/
*.tsbuildinfo
EOF
```

---

## 2. Configuration Patterns

### Team Configuration Standard

#### Recommended Global Config
```json
// ~/.config/opencode/config.jsonc
{
  // Core agents
  agents: {
    "sisyphus": {
      model: "anthropic/claude-opus-4-5"
    },
    
    // Compound agents - enable by team preference
    "compound:kieran-rails-reviewer": {
      model: "anthropic/claude-opus-4-5",
      temperature: 0.1
    },
    "compound:kieran-python-reviewer": {
      model: "anthropic/claude-opus-4-5", 
      temperature: 0.1
    },
    "compound:figma-design-sync": {
      model: "anthropic/claude-opus-4-5",
      temperature: 0.1
    },
    "compound:deployment-verification-agent": {
      model: "anthropic/claude-opus-4-5",
      temperature: 0.1
    }
  },

  // Commands - enable all compound commands
  commands: {
    "compound:*": {
      enabled: true
    }
  },

  // Skills - enable all compound skills  
  skills: {
    "compound:*": {
      enabled: true
    }
  }
}
```

#### Project-Level Configuration

```json
// .opencode/config.jsonc (project-specific)
{
  // Override specific agents for project needs
  agents: {
    "compound:kieran-rails-reviewer": {
      model: "anthropic/claude-opus-4-5",
      skills: [
        "compound:ruby-development",
        "compound:testing-development",
        "compound:code-review-expertise"
      ]
    }
  },

  // Project-specific commands
  commands: {
    "compound:code:refactor": {
      template: "Refactor with Kieran Rails review standards"
    }
  },

  // Project skills for specific domains
  skills: {
    "compound:docker-containerization": {
      enabled: true
    },
    "compound:kubernetes-deployment": {
      enabled: true
    }
  }
}
```

---

## 3. Development Workflows

### Code Review Workflow

#### Using Kieran Rails Reviewer
```bash
# Review entire Rails project
opencode --agent compound:kieran-rails-reviewer --review app/

# Review specific files
opencode --agent compound:kieran-rails-reviewer --review app/models/ app/controllers/ app/views/

# Review with custom temperature
opencode --agent compound:kieran-rails-reviewer --temperature 0.05 --review lib/

# Generate review report
opencode --agent compound:kieran-rails-reviewer --review --output-format markdown --output-file review-report.md
```

#### Automated Code Review Pipeline
```bash
# Pre-commit hook with Kieran review
opencode --agent compound:kieran-rails-reviewer --pre-commit --staged-only

# PR review automation
opencode --agent compound:kieran-rails-reviewer --review --pr --comment "Please focus on Rails conventions"

# Continuous review in CI/CD
opencode --agent compound:kieran-rails-reviewer --review --ci --fail-threshold 5
```

### Design Sync Workflow

#### Figma Design Synchronization
```bash
# Sync Figma designs to code
opencode --agent compound:figma-design-sync --figma-url https://figma.com/file/abc123 --target ./src/components/

# Verify implementation matches design
opencode --agent compound:figma-design-sync --verify --figma-url https://figma.com/file/abc123 --source ./src/components/

# Continuous sync service
opencode start --agent compound:figma-design-sync --sync-service --figma-webhook-url https://api.figma.com/webhooks/xyz
```

### Documentation Generation Workflow

#### Using Ankane README Writer
```bash
# Generate README for Ruby gem
opencode --agent compound:ankane-readme-writer --input src/gem/ --output README.md

# Update existing README
opencode --agent compound:ankane-readme-writer --update ./README.md --gem-info name=MyGem version=1.2.3

# Generate docs for entire project
opencode --agent compound:ankane-readme-writer --project-level --output docs/
```

### Deployment Verification Workflow

#### Pre-deployment Checklist
```bash
# Run Go/No-Go deployment verification
opencode --agent compound:deployment-verification-agent --checklist-type pre-deploy --target production

# Verify staging deployment
opencode --agent compound:deployment-verification-agent --verify --target staging

# Production deployment with verification
opencode --agent compound:deployment-verification-agent --deploy --target production --verify-after-deploy
```

---

## 4. Agent Specializations

### Review Agent Configurations

#### Code Quality Focus
```json
{
  "compound:kieran-rails-reviewer": {
    "model": "anthropic/claude-opus-4-5",
    "temperature": 0.05,
    "skills": [
      "compound:ruby-development",
      "compound:testing-development",
      "compound:code-review-expertise"
    ],
    "prompt_append": "Focus on security vulnerabilities and performance issues"
  }
}
```

#### Security-First Configuration
```json
{
  "compound:code-simplicity-reviewer": {
    "model": "anthropic/claude-opus-4-5",
    "temperature": 0.1,
    "skills": [
      "compound:security-auditing",
      "compound:performance-optimization"
    ],
    "prompt_append": "Always suggest simpler alternatives"
  }
}
```

### Research Agent Configurations

#### Framework Documentation Research
```json
{
  "compound:framework-docs-researcher": {
    "model": "anthropic/claude-opus-4-5",
    "temperature": 0.1,
    "skills": [
      "compound:typescript-development",
      "compound:api-documentation"
    ],
    "prompt_append": "Include real-world examples and gotchas"
  }
}
```

#### Git History Analysis
```json
{
  "compound:git-history-analyzer": {
    "model": "anthropic/claude-opus-4-5",
    "temperature": 0.1,
    "skills": [
      "compound:git-analytics"
    ],
    "prompt_append": "Focus on architectural decisions and their impacts"
  }
}
```

---

## 5. Command Workflows

### Workflow Planning

#### Strategic Planning
```bash
# Plan new feature with agent flow analysis
opencode compound:workflow:plan --feature "User authentication system" --analyze-flows --create-checklist

# Include technical considerations
opencode compound:workflow:plan --feature "API rate limiting" --technical-considerations --create-implementation-plan

# Generate comprehensive specification
opencode compound:workflow:plan --comprehensive --output user-auth-system-spec.md
```

#### Feature Creation
```bash
# Create new Rails service with best practices
opencode compound:workflow:create --type service --language ruby --framework rails --name UserService

# Create React component with design system
opencode compound:workflow:create --type component --framework react --design-system "my-company"

# Generate full feature skeleton
opencode compound:workflow:create --scaffold --type feature --template complex --include-tests --include-docs
```

### Code Operations

#### Refactoring with Quality Assurance
```bash
# Refactor code with multiple review agents
opencode compound:code:refactor --file src/services/payment.js --reviewers kieran-rails,kieran-python,code-simplicity --max-depth 3

# Refactor with safety checks
opencode compound:code:refactor --file src/utils/ --safe --backup --create-tests

# Performance-focused refactoring
opencode compound:code:refactor --file src/api/ --focus performance --profile-before --profile-after
```

#### Code Review Automation
```bash
# Run comprehensive review with multiple perspectives
opencode compound:code:review --file src/ --reviewers kieran-rails,dhh-rails,code-simplicity --format detailed --output-file review.html

# Security-focused review
opencode compound:code:review --file src/ --security-focus --vulnerability-scan --output security-report.json

# Quick tactical review
opencode compound:code:review --file src/agent.rb --quick --focus maintainability
```

### Git Operations

#### Smart Commit Generation
```bash
# Analyze staged changes and generate commit
opencode compound:git:smart-commit --staged --convention conventional --typefeat --scope src/

# Commit with message template
opencode compound:git:smart-commit --template "feat(scope): description" --staged

# Include JIRA ticket
opencode compound:git:smart-commit --jira-ticket PROJ-123 --staged

# Generate release commit
opencode compound:git:smart-commit --release --version 1.2.0 --staged
```

#### Branch Management
```bash
# Create feature branch with naming convention
opencode compound:git:branch --create feature/user-auth --base main --sync-with-remote

# Create hotfix branch
opencode compound:git:branch --create hotfix/security-patch --base main

# List and switch branches
opencode compound:git:branch --list --current
opencode compound:git:branch --switch develop

# Clean up branches
opencode compound:git:cleanup --remove-merged --remove-stale --older-than 30d
```

---

## 6. Skill Integration

### Development Skills

#### Multi-Language Development
```json
{
  "agents": {
    "full-stack-developer": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.2,
      "skills": [
        "compound:typescript-development",
        "compound:python-development", 
        "compound:ruby-development",
        "compound:react-development",
        "compound:nodejs-development",
        "compound:database-design"
      ]
    }
  }
}
```

#### Specialized Expertise
```json
{
  "agents": {
    "security-specialist": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.1,
      "skills": [
        "compound:security-auditing",
        "compound:performance-optimization",
        "compound:code-analysis"
      ]
    },
    "performance-engineer": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.1,
      "skills": [
        "compound:performance-optimization",
        "compound:performance-profiling",
        "compound:kubernetes-deployment"
      ]
    }
  }
}
```

### Design Skills Integration

```json
{
  "agents": {
    "frontend-architect": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.3,
      "skills": [
        "compound:frontend-design",
        "compound:figma-integration",
        "compound:design-systems",
        "compound:accessibility-a11y"
      ]
    },
    "ui-ux-designer": {
      "model": "anthropic/claude-opus-4-5", 
      "temperature": 0.3,
      "skills": [
        "compound:frontend-design",
        "compound:css-styling",
        "compound:animation-design"
      ]
    }
  }
}
```

---

## 7. CI/CD Integration

### GitHub Actions Pipeline

#### Development Pipeline
```yaml
# .github/workflows/dev.yml
name: Development Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  compound-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - name: Install dependencies
        run: bun install
      - name: Run compound tests
        run: bun test tests/compound/ --reporter=github
      - name: Verify no regressions
        run: bun run build:validate

  compound-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup compound agents
        run: opencode config --enable-agents compound:kieran-rails-reviewer,compound:dhh-rails-reviewer,compound:code-simplicity-reviewer
      - name: Run multi-agent review
        run: |
          opencode --agent compound:kieran-rails-reviewer --review ${{ github.event.pull_request.head.sha }}
          opencode --agent compound:dhh-rails-reviewer --review ${{ github.event.pull_request.head.sha }}
          opencode --agent compound:code-simplicity-reviewer --review ${{ github.event.pull_request.head.sha }}
```

#### Release Pipeline
```yaml
# .github/workflows/release.yml
name: Release Pipeline
on:
  push:
    tags: ['v*']

jobs:
  compound-validation:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Setup environment
        run: opencode doctor --validate
      - name: Run compound tests
        run: bun test tests/compound/
      - name: Validate components
        run: opencode agent list --include compound:*

  create-release:
    needs: compound-validation
    runs-on: ubuntu-latest
    steps:
      - name: Create GitHub release
        uses: actions/create-release@v1
        with:
          tag_name: ${{ github.ref }}
          release_name: ${{ github.ref_name }}
          body_path: RELEASE_NOTES_v3.2.0.md
          draft: false
      - name: Update documentation
        run: |
          npm run build:docs
          git add docs/
          git commit -m "docs: Update for ${{ github.ref_name }}"
          git push
```

### Docker Development Environment

#### Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app

# Install oh-my-opencode globally
RUN npm install -g oh-my-opencode@3.2.0

# Copy project files
COPY . .

# Install project dependencies
RUN npm install

# Expose port
EXPOSE 3000

# Start development server
CMD ["opencode", "start", "--agents", "compound:*", "--host", "0.0.0.0"]
```

#### Docker Compose
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  opencode-dev:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV: development
      - DEBUG: opencode:*
    command: opencode start --agents compound:* --hot-reload

  # Database service if needed
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB: myapp_dev
    ports:
      - "5432:5432"
```

---

## 8. Monitoring & Observability

### Compound Component Monitoring

#### Agent Performance Metrics
```bash
# Monitor agent performance
opencode metrics --agents compound:* --time-frame 24h --output agent-performance.json

# Check skill usage statistics
opencode metrics --skills compound:* --usage --time-frame 7d

# Agent error tracking
opencode logs --agents compound:* --level error --time-frame 24h --alert-threshold 5
```

#### Health Checks

```bash
# Comprehensive health check
opencode doctor --check-all --include-compound

# Validate compound configuration
opencode config --validate --focus compound

# Check agent availability
opencode agent status --filter compound:*
```

#### Logging Configuration

```json
// .opencode/config.jsonc
{
  "logging": {
    "level": "info",
    "include_compound_metrics": true,
    "agent_performance_tracking": true,
    "skill_usage_logging": true
  }
}
```

---

## 9. Troubleshooting

### Common Issues & Solutions

#### Agent Not Found
```bash
# Check if agent is available
opencode agent status --agent compound:kieran-rails-reviewer

# Available agents list
opencode agent list --include compound:*

# Enable missing agent
opencode config --enable-agent compound:kieran-rails-reviewer

# Restart with specific agent
opencode restart --agent compound:kieran-rails-reviewer
```

#### Performance Issues
```bash
# Check agent response times
opencode metrics --agents compound:* --response-time --threshold 5s

# Optimize configuration for performance
opencode config --optimize --focus compound:*

# Clear cache if slow
opencode cache clear --agents compound:*
```

#### Configuration Issues
```bash
# Validate configuration
opencode config --validate --verbose --focus compound

# Check for conflicting configurations
opencode config --check-conflicts

# Reset to defaults if needed
opencode config --reset --compound-only
```

#### Integration Problems
```bash
# Test compound integration
opencode test tests/compound/ --integration-test

# Verify component availability
opencode doctor --check-compound-integration

# Recreate agent cache
opencode restart --rebuild-agents compound:*
```

---

## 10. Best Practices

### Team Development Standards

#### Code Quality Standards
- Always run compound agents for code review
- Use appropriate temperature settings (0.1-0.3 for code work)
- Include relevant compound skills for domain expertise
- Document agent decisions and configuration changes
- Test compound command workflows before production use

#### Configuration Management
- Use version control for all configuration changes
- Document custom agent configurations in team wiki
- Use environment-specific configs (dev/staging/prod)
- Regular backup of configuration files

#### Performance Optimization
- Monitor agent resource usage and response times
- Use lazy loading for skills when appropriate
- Optimize agent model selection for task complexity
- Implement caching for frequently used skills and commands

#### Security Considerations
- Validate all agent inputs and outputs
- Use secure model configurations for sensitive domains
- Regularly update compound agents for security patches
- Audit skill implementations for vulnerabilities
- Use principle of least privilege for agent access

---

## 11. Training Resources

### Team Onboarding
- **Component Reference Guide**: `COMPONENTS_REFERENCE.md`
- **Migration Guide**: `MIGRATION_GUIDE.md`
- **Architecture Documentation**: `oh-my-opencode/docs/architecture-unified-plugin.md`
- **Agent System Docs**: `oh-my-opencode/docs/AGENTS.md`

### Learning Path
1. **Start with Basic Agent**: Use `compound:kieran-rails-reviewer` for code review
2. **Explore Research Agents**: Try `compound:framework-docs-researcher` for documentation
3. **Master Design Sync**: Use `compound:figma-design-sync` for UI work
4. **Advanced Workflows**: Combine multiple agents with `compound:workflow:*` commands

### Practice Projects
- **Code Review Practice**: Review existing codebase with multiple compound agents
- **Documentation Generation**: Use `compound:ankane-readme-writer` to improve project docs
- **Deployment Automation**: Use `compound:deployment-verification-agent` for safer releases
- **Performance Analysis**: Use `compound:performance-optimization` skills with research agents

---

## 12. Quick Reference

### Essential Commands
```bash
# Start development with all compound components
opencode start --agents compound:* --commands compound:* --skills compound:*

# Quick agent status check
opencode agent status --filter compound:*

# List all available compound components
opencode list --agents compound:*
opencode list --commands compound:*
opencode list --skills compound:*

# Configuration help
opencode config --help --compound
```

### Agent Temperature Guide
| Agent Type | Temperature | Use Case |
|-------------|------------|----------|
| Code Review | 0.1 | Deterministic, focus on correctness |
| Research | 0.1 | Factual, documentation synthesis |
| Design | 0.3 | Creative, visual work |
| Documentation | 0.1 | Factual, consistent formatting |
| Workflow | 0.1 | Process-oriented, clear steps |

### Skill Selection by Domain
| Domain | Primary Skills | Examples |
|--------|----------------|----------|
| Backend Development | typescript, python, ruby, go, rust | compound:typescript-development, compound:python-development |
| Frontend Development | react, vue, next, node | compound:react-development, compound:vue-development |
| DevOps | docker, kubernetes, ci-cd, terraform | compound:docker-containerization, compound:kubernetes-deployment |
| Documentation | api-docs, technical-writing, readme | compound:api-documentation, compound:technical-writing |
| Design Systems | figma, design-systems, a11y | compound:figma-integration, compound:design-systems |

---

## Conclusion

The 125 compound engineering components provide a comprehensive toolkit for modern development teams. By following this setup guide, teams can:

✅ **Accelerate Development** with specialized agents and skills
✅ **Improve Code Quality** through multi-perspective code review
✅ **Streamline Workflows** with intelligent commands and automation
✅ **Enhance Design** with Figma sync and design review capabilities
✅ **Ensure Robust Deployments** with verification and best practice integration
✅ **Scale Effectively** with DevOps skills and automation

All components are now natively available in oh-my-opencode v3.2.0 with the `compound:` namespace prefix, ready for production use!

---

**For additional help, see:**
- `COMPONENTS_REFERENCE.md` - Complete component documentation
- `MIGRATION_GUIDE.md` - Upgrade instructions
- `oh-my-opencode/docs/AGENTS.md` - Agent system documentation
- Or run: `opencode --help` for command reference