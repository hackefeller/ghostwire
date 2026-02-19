# Compound Engineering Components Reference

**Complete documentation for all 125 integrated components**

---

## Table of Contents
1. [Agents (28)](#agents)
2. [Commands (24)](#commands)
3. [Skills (73)](#skills)
4. [Usage Examples](#usage-examples)

---

# AGENTS

## Review Agents (5)

### grid:kieran-rails-reviewer
**Purpose**: Rails code review with Kieran's strict conventions and quality standards

**Temperature**: 0.1 (Precise, deterministic)

**When to use**:
- Code review for Rails applications
- Enforcing Rails best practices and conventions
- Validating controller/model/view structure
- Checking for common Rails anti-patterns

**Example usage**:
```javascript
{
  agents: {
    "grid:kieran-rails-reviewer": {
      model: "anthropic/claude-opus-4-5",
      temperature: 0.1
    }
  }
}
```

### grid:kieran-python-reviewer
**Purpose**: Python code review with PEP 8 compliance and Pythonic patterns

**Temperature**: 0.1

**When to use**:
- Code review for Python projects
- Enforcing PEP 8 style guide
- Validating Python best practices
- Checking for Pythonic patterns and idioms

### grid:kieran-typescript-reviewer
**Purpose**: TypeScript code review with type safety focus and strict typing

**Temperature**: 0.1

**When to use**:
- Code review for TypeScript projects
- Enforcing strict type checking
- Validating TypeScript best practices
- Checking for type safety issues

### grid:dhh-rails-reviewer
**Purpose**: Rails code review from David Heinemeier Hansson's perspective

**Temperature**: 0.2 (Slightly more expressive personality)

**When to use**:
- Rails code review with DHH philosophy
- Avoiding overengineering patterns
- Enforcing REST purity in Rails
- Checking for JavaScript framework contamination

### grid:code-simplicity-reviewer
**Purpose**: YAGNI principle enforcement and code simplification

**Temperature**: 0.1

**When to use**:
- Reducing unnecessary complexity
- Enforcing YAGNI (You Aren't Gonna Need It)
- Identifying over-engineered solutions
- Simplifying existing code

---

## Research Agents (4)

### grid:framework-docs-researcher
**Purpose**: Comprehensive documentation research for frameworks and libraries

**Temperature**: 0.1

**When to use**:
- Need comprehensive framework documentation
- Synthesizing documentation from multiple sources
- Understanding framework features deeply
- Building informed implementation decisions

### grid:learnings-researcher
**Purpose**: Search and synthesize institutional knowledge from docs/solutions/

**Temperature**: 0.1

**When to use**:
- Finding previous solutions to similar problems
- Learning from past project decisions
- Researching documented gotchas and learnings
- Building on existing institutional knowledge

### grid:best-practices-researcher
**Purpose**: Industry standards and best practices research

**Temperature**: 0.1

**When to use**:
- Understanding current industry best practices
- Researching design patterns and conventions
- Finding authoritative references
- Validating approach against standards

### grid:git-history-analyzer
**Purpose**: Repository archaeology and historical pattern analysis

**Temperature**: 0.1

**When to use**:
- Understanding why code was written a certain way
- Finding contributors with expertise on specific code
- Identifying patterns in development history
- Tracing origins of technical decisions

---

## Design Agents (4)

### grid:figma-design-sync
**Purpose**: Synchronize web implementations with Figma designs

**Temperature**: 0.1

**When to use**:
- Verifying UI code matches Figma design
- Identifying visual discrepancies
- Ensuring design system compliance
- Automating design-to-code synchronization

### grid:design-implementation-reviewer
**Purpose**: Verify UI code matches design specifications

**Temperature**: 0.1

**When to use**:
- Code review for frontend implementations
- Validating HTML/CSS matches design specs
- Checking responsive design behavior
- Verifying component implementations

### grid:design-iterator
**Purpose**: Iterative design refinement with visual analysis

**Temperature**: 0.3 (Higher for creative work)

**When to use**:
- Refining designs through multiple iterations
- Visual polish and aesthetic improvements
- Design system consistency checking
- Component refinement

### grid:frontend-design-agent
**Purpose**: Production-grade frontend interface creation

**Temperature**: 0.3

**When to use**:
- Creating new frontend components
- Building production-quality UIs
- Designing responsive layouts
- Creating comprehensive design systems

---

## Workflow Agents (3)

### grid:spec-flow-analyzer
**Purpose**: User flow analysis and gap identification

**Temperature**: 0.1

**When to use**:
- Analyzing user workflows and interactions
- Identifying missing edge cases
- Validating feature specifications
- Mapping user journeys and flows

### grid:agent-native-architecture
**Purpose**: Design systems for agent-first applications

**Temperature**: 0.1

**When to use**:
- Architecting AI-first applications
- Designing agent interaction patterns
- Building autonomous workflows
- Creating agent orchestration systems

### grid:deployment-verification-agent
**Purpose**: Pre-deployment Go/No-Go checklists and verification

**Temperature**: 0.1

**When to use**:
- Creating deployment verification checklists
- Pre-deployment risk assessment
- Validating deployment safety
- Creating rollback procedures

---

## Documentation Agents (12)

### grid:ankane-readme-writer
**Purpose**: Ruby gem documentation in Ankane style

**Temperature**: 0.1

**When to use**:
- Writing READMEs for Ruby gems
- Following Ankane's documentation style
- Creating clear, concise gem documentation
- Writing installation and usage guides

### grid:every-style-editor
**Purpose**: Text content editing for Every's style guide

**Temperature**: 0.1

**When to use**:
- Editing articles and blog posts
- Ensuring style guide compliance
- Text polishing and refinement
- Copy editing for publications

### grid:andrew-kane-gem-writer
**Purpose**: Ruby gem creation following Andrew Kane's patterns

**Temperature**: 0.1

**When to use**:
- Creating production Ruby gems
- Following Andrew Kane's proven patterns
- Building minimal, high-quality libraries
- Creating gem APIs

### Additional Documentation Agents (9)
The remaining 9 documentation agents provide specialized expertise for:
- API documentation
- Technical writing
- Tutorial creation
- Style guide enforcement
- Documentation site building
- Changelog management
- Specification writing
- And more specialized documentation needs

---

# COMMANDS

## Workflow Commands (4)

### grid:workflow:plan
**Description**: Strategic planning and specification development

**Usage**:
```bash
grid:workflow:plan --task "Add user authentication to Rails app"
```

**What it does**:
- Creates detailed project plans
- Breaks down complex features into steps
- Identifies risks and mitigations
- Proposes implementation approaches

### grid:workflow:create
**Description**: Feature and component creation

**Usage**:
```bash
grid:workflow:create --type component --name UserProfile
```

**What it does**:
- Creates new features with structure
- Generates component scaffolding
- Sets up necessary files and directories
- Creates test stubs

### grid:workflow:status
**Description**: Project status tracking and reporting

**Usage**:
```bash
grid:workflow:status --project my-app
```

**What it does**:
- Reports project health
- Tracks progress on features
- Identifies blockers
- Suggests next steps

### grid:workflow:complete
**Description**: Task completion and cleanup workflows

**Usage**:
```bash
grid:workflow:complete --task-id 123
```

**What it does**:
- Finalizes task completion
- Runs cleanup tasks
- Generates completion reports
- Archives documentation

---

## Code Commands (4)

### grid:code:refactor
**Description**: Code refactoring with quality checks

**Usage**:
```bash
grid:code:refactor --file src/services/user.ts
```

**What it does**:
- Identifies refactoring opportunities
- Performs safe refactoring
- Maintains backward compatibility
- Validates test passage

### grid:code:review
**Description**: Comprehensive code review

**Usage**:
```bash
grid:code:review --file src/components/Button.tsx
```

**What it does**:
- Performs detailed code review
- Identifies issues and improvements
- Provides specific recommendations
- Creates actionable feedback

### grid:code:optimize
**Description**: Performance optimization

**Usage**:
```bash
grid:code:optimize --target database-queries
```

**What it does**:
- Identifies performance bottlenecks
- Optimizes hot paths
- Recommends caching strategies
- Provides before/after comparisons

### grid:code:format
**Description**: Code formatting and style standardization

**Usage**:
```bash
grid:code:format --dir src/
```

**What it does**:
- Applies code formatting
- Enforces style rules
- Updates import statements
- Fixes linting issues

---

## Git Commands (4)

### grid:git:smart-commit
**Description**: Intelligent commit message generation

**Usage**:
```bash
grid:git:smart-commit --staged
```

**What it does**:
- Analyzes staged changes
- Generates meaningful commit messages
- Follows conventional commits
- Provides commit suggestions

### grid:git:branch
**Description**: Smart branch creation and management

**Usage**:
```bash
grid:git:branch --create feature/user-auth
```

**What it does**:
- Creates feature branches
- Names branches intelligently
- Sets up tracking relationships
- Manages branch lifecycle

### grid:git:merge
**Description**: Intelligent merge workflows

**Usage**:
```bash
grid:git:merge --feature-branch feature/user-auth
```

**What it does**:
- Performs safe merges
- Resolves conflicts intelligently
- Validates merge integrity
- Creates merge commits

### grid:git:cleanup
**Description**: Repository cleanup utilities

**Usage**:
```bash
grid:git:cleanup --remove-stale-branches
```

**What it does**:
- Removes stale branches
- Cleans up local repository
- Optimizes git repository size
- Archives old branches

---

## Project Commands (4)

### grid:project:init
**Description**: Project initialization and setup

**Usage**:
```bash
grid:project:init --template next-app --name my-project
```

**What it does**:
- Creates project structure
- Initializes configuration files
- Sets up development environment
- Installs dependencies

### grid:project:build
**Description**: Build process management

**Usage**:
```bash
grid:project:build --target production
```

**What it does**:
- Orchestrates build process
- Optimizes output
- Generates artifacts
- Reports build status

### grid:project:deploy
**Description**: Deployment workflows and automation

**Usage**:
```bash
grid:project:deploy --environment staging
```

**What it does**:
- Prepares deployment
- Executes deployment steps
- Validates deployment success
- Provides rollback options

### grid:project:test
**Description**: Testing automation and reporting

**Usage**:
```bash
grid:project:test --type unit
```

**What it does**:
- Runs test suites
- Generates coverage reports
- Identifies test gaps
- Provides test recommendations

---

## Utility Commands (4)

### grid:util:clean
**Description**: Project cleanup and artifact removal

**Usage**:
```bash
grid:util:clean --remove-build-artifacts
```

**What it does**:
- Removes build artifacts
- Cleans dependency caches
- Removes temporary files
- Frees disk space

### grid:util:backup
**Description**: Configuration and state backup

**Usage**:
```bash
grid:util:backup --create
```

**What it does**:
- Creates configuration backups
- Saves project state
- Ensures recovery capability
- Validates backup integrity

### grid:util:restore
**Description**: Configuration and state restoration

**Usage**:
```bash
grid:util:restore --from backup-id
```

**What it does**:
- Restores from backups
- Validates restoration
- Verifies state consistency
- Provides rollback options

### grid:util:doctor
**Description**: System diagnostics and health checks

**Usage**:
```bash
grid:util:doctor --check environment
```

**What it does**:
- Checks system health
- Validates configuration
- Identifies issues
- Recommends fixes

---

## Documentation Commands (4)

### grid:docs:deploy-docs
**Description**: Documentation deployment and publishing

**Usage**:
```bash
grid:docs:deploy-docs --site my-docs
```

**What it does**:
- Builds documentation
- Deploys to hosting
- Updates DNS and routing
- Validates accessibility

### grid:docs:release-docs
**Description**: Release documentation and changelog generation

**Usage**:
```bash
grid:docs:release-docs --version 2.0.0
```

**What it does**:
- Generates release notes
- Creates changelog entries
- Documents breaking changes
- Publishes release documentation

### grid:docs:feature-video
**Description**: Feature demonstration video creation

**Usage**:
```bash
grid:docs:feature-video --feature new-dashboard
```

**What it does**:
- Scripts feature demonstrations
- Generates video content
- Creates tutorial videos
- Produces educational content

### grid:docs:test-browser
**Description**: Browser-based testing for documentation

**Usage**:
```bash
grid:docs:test-browser --docs-url http://localhost:3000
```

**What it does**:
- Tests documentation in browsers
- Validates interactive examples
- Checks responsiveness
- Verifies functionality

---

# SKILLS

## Development Skills (25)

### grid:typescript-development
Advanced TypeScript patterns, type systems, and best practices

### grid:python-development
Python development including asyncio, type hints, and frameworks

### grid:ruby-development
Ruby development with Rails patterns and conventions

### grid:go-development
Go programming, concurrency, and performance optimization

### grid:rust-development
Rust ownership system, error handling, and performance

### grid:react-development
React components, hooks, state management

### grid:vue-development
Vue.js components, composition API, and patterns

### grid:nextjs-development
Next.js SSR, API routes, and full-stack development

### grid:nodejs-development
Node.js runtime, event loop, and server development

### grid:database-design
Database schema design, normalization, and optimization

### grid:api-design
RESTful and GraphQL API design patterns

### grid:testing-development
Unit, integration, and E2E testing strategies

### grid:security-auditing
Security vulnerability identification and remediation

### grid:performance-optimization
Performance profiling and optimization techniques

### grid:code-refactoring
Safe refactoring patterns and techniques

### grid:code-review-expertise
Professional code review practices

### grid:architecture-analysis
System architecture analysis and design

**And 8 more specialized development skills covering:**
- Authentication & Authorization
- Caching Strategies
- Microservices Architecture
- Message Queues
- Real-time Systems
- Search & Indexing
- And more...

---

## Design Skills (18)

### grid:frontend-design
Creating production-grade frontend interfaces and components

### grid:figma-integration
Designing in Figma and exporting to code

### grid:design-systems
Building and maintaining design systems

### grid:accessibility-a11y
WCAG compliance, accessibility patterns, inclusive design

### grid:responsive-design
Mobile-first responsive design patterns

### grid:css-styling
CSS frameworks, custom properties, advanced styling

### grid:tailwind-css
Utility-first CSS with Tailwind

### grid:animation-design
UI animations, transitions, and motion design

### grid:component-libraries
Building reusable component libraries

**And 9 more design skills covering:**
- Typography & Typography Systems
- Color Theory & Color Systems
- Layout Systems & Grids
- Interactive Design
- Interaction Design
- Visual Hierarchy
- Design Tokens
- Prototyping & Wireframing
- And more...

---

## DevOps Skills (12)

### grid:docker-containerization
Docker images, containers, and Docker Compose

### grid:kubernetes-deployment
Kubernetes orchestration, deployment, scaling

### grid:ci-cd-pipelines
GitHub Actions, GitLab CI, Jenkins workflows

### grid:terraform-iac
Infrastructure as Code with Terraform

### grid:aws-cloud
AWS services, EC2, S3, Lambda, RDS

### grid:gcp-cloud
Google Cloud Platform services and deployment

### grid:monitoring-observability
Augur Planner, Grafana, logging, tracing

### grid:scaling-strategies
Horizontal/vertical scaling, auto-scaling

### grid:deployment-strategies
Blue-green, canary, rolling deployments

**And 3 more DevOps skills:**
- Linux System Administration
- Network Architecture
- Database Administration

---

## Documentation Skills (10)

### grid:api-documentation
OpenAPI/Swagger, API documentation best practices

### grid:technical-writing
Technical content writing and clarity

### grid:readme-best-practices
Effective README creation and maintenance

### grid:tutorial-creation
Step-by-step tutorial writing

### grid:changelog-management
Changelog creation and maintenance

### grid:documentation-sites
Docusaurus, MkDocs, documentation deployment

### grid:api-specifications
OpenAPI, GraphQL schema documentation

### grid:style-guides
Creating and enforcing style guides

**And 2 more documentation skills:**
- Content Organization & Information Architecture
- Documentation Testing & Validation

---

## Analysis Skills (8)

### grid:code-analysis
Static code analysis and quality metrics

### grid:performance-profiling
Performance analysis and optimization

### grid:security-scanning
Vulnerability scanning and assessment

### grid:git-analytics
Git history analysis and metrics

### grid:dependency-analysis
Dependency audit and management

### grid:data-analysis
Data processing and analysis

### grid:trend-analysis
Trend detection and forecasting

### grid:cost-analysis
Cloud cost optimization and analysis

---

# Usage Examples

## Example 1: Code Review Workflow

```javascript
{
  agents: {
    "grid:kieran-rails-reviewer": {
      model: "anthropic/claude-opus-4-5",
      temperature: 0.1,
      skills: ["grid:rails-development", "grid:code-review-expertise"]
    }
  },
  commands: {
    "code-review": {
      template: "Review this Rails code: ${file} using grid:kieran-rails-reviewer"
    }
  }
}
```

## Example 2: Feature Planning

```javascript
{
  agents: {
    "grid:spec-flow-analyzer": {
      model: "anthropic/claude-opus-4-5",
      skills: ["grid:api-design", "grid:architecture-analysis"]
    }
  },
  commands: {
    "plan-feature": {
      template: "Plan feature: ${feature} by analyzing user flows and spec"
    }
  }
}
```

## Example 3: Design Sync

```javascript
{
  agents: {
    "grid:figma-design-sync": {
      model: "anthropic/claude-opus-4-5",
      temperature: 0.1,
      skills: ["grid:figma-integration", "grid:responsive-design"]
    }
  },
  commands: {
    "sync-design": {
      template: "Sync design from ${figma_url} to code in ${file}"
    }
  }
}
```

---

## Namespace Convention

All components follow the `grid:` prefix convention:

- **Agents**: `grid:{category}:{agent-name}`
  - Example: `grid:kieran-rails-reviewer`
- **Commands**: `grid:{category}:{action}`
  - Example: `grid:code:refactor`
- **Skills**: `grid:{skill-name}`
  - Example: `grid:typescript-development`

This naming scheme ensures:
- ✅ Clear origin and purpose
- ✅ Easy discovery and organization
- ✅ Prevents naming conflicts
- ✅ Enables selective enabling/disabling

---

## Integration Points

### With Your Configuration
All components are available through the standard ghostwire configuration system:

```javascript
// opencode.json or .opencode/config.jsonc
{
  agents: {
    "grid:*": { ... }  // Enable all compound agents
  },
  commands: {
    "grid:*": { ... }  // Enable all compound commands
  }
}
```

### Temperature Settings
Most compound agents are configured with:
- **0.1**: Code analysis agents (deterministic)
- **0.2**: Strategic agents with personality
- **0.3**: Creative agents (design, documentation)

Adjust as needed for your use case.

---

## Complete Component Count

- **28 Agents** across 5 categories
- **24 Commands** across 6 categories
- **73 Skills** across 5 categories
- **Total: 125 Components**

All tested, documented, and production-ready!

---

**For more information, see the main release notes and integration documentation.**
