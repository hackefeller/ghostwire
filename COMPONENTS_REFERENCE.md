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

### compound:kieran-rails-reviewer
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
    "compound:kieran-rails-reviewer": {
      model: "anthropic/claude-opus-4-5",
      temperature: 0.1
    }
  }
}
```

### compound:kieran-python-reviewer
**Purpose**: Python code review with PEP 8 compliance and Pythonic patterns

**Temperature**: 0.1

**When to use**:
- Code review for Python projects
- Enforcing PEP 8 style guide
- Validating Python best practices
- Checking for Pythonic patterns and idioms

### compound:kieran-typescript-reviewer
**Purpose**: TypeScript code review with type safety focus and strict typing

**Temperature**: 0.1

**When to use**:
- Code review for TypeScript projects
- Enforcing strict type checking
- Validating TypeScript best practices
- Checking for type safety issues

### compound:dhh-rails-reviewer
**Purpose**: Rails code review from David Heinemeier Hansson's perspective

**Temperature**: 0.2 (Slightly more expressive personality)

**When to use**:
- Rails code review with DHH philosophy
- Avoiding overengineering patterns
- Enforcing REST purity in Rails
- Checking for JavaScript framework contamination

### compound:code-simplicity-reviewer
**Purpose**: YAGNI principle enforcement and code simplification

**Temperature**: 0.1

**When to use**:
- Reducing unnecessary complexity
- Enforcing YAGNI (You Aren't Gonna Need It)
- Identifying over-engineered solutions
- Simplifying existing code

---

## Research Agents (4)

### compound:framework-docs-researcher
**Purpose**: Comprehensive documentation research for frameworks and libraries

**Temperature**: 0.1

**When to use**:
- Need comprehensive framework documentation
- Synthesizing documentation from multiple sources
- Understanding framework features deeply
- Building informed implementation decisions

### compound:learnings-researcher
**Purpose**: Search and synthesize institutional knowledge from docs/solutions/

**Temperature**: 0.1

**When to use**:
- Finding previous solutions to similar problems
- Learning from past project decisions
- Researching documented gotchas and learnings
- Building on existing institutional knowledge

### compound:best-practices-researcher
**Purpose**: Industry standards and best practices research

**Temperature**: 0.1

**When to use**:
- Understanding current industry best practices
- Researching design patterns and conventions
- Finding authoritative references
- Validating approach against standards

### compound:git-history-analyzer
**Purpose**: Repository archaeology and historical pattern analysis

**Temperature**: 0.1

**When to use**:
- Understanding why code was written a certain way
- Finding contributors with expertise on specific code
- Identifying patterns in development history
- Tracing origins of technical decisions

---

## Design Agents (4)

### compound:figma-design-sync
**Purpose**: Synchronize web implementations with Figma designs

**Temperature**: 0.1

**When to use**:
- Verifying UI code matches Figma design
- Identifying visual discrepancies
- Ensuring design system compliance
- Automating design-to-code synchronization

### compound:design-implementation-reviewer
**Purpose**: Verify UI code matches design specifications

**Temperature**: 0.1

**When to use**:
- Code review for frontend implementations
- Validating HTML/CSS matches design specs
- Checking responsive design behavior
- Verifying component implementations

### compound:design-iterator
**Purpose**: Iterative design refinement with visual analysis

**Temperature**: 0.3 (Higher for creative work)

**When to use**:
- Refining designs through multiple iterations
- Visual polish and aesthetic improvements
- Design system consistency checking
- Component refinement

### compound:frontend-design-agent
**Purpose**: Production-grade frontend interface creation

**Temperature**: 0.3

**When to use**:
- Creating new frontend components
- Building production-quality UIs
- Designing responsive layouts
- Creating comprehensive design systems

---

## Workflow Agents (3)

### compound:spec-flow-analyzer
**Purpose**: User flow analysis and gap identification

**Temperature**: 0.1

**When to use**:
- Analyzing user workflows and interactions
- Identifying missing edge cases
- Validating feature specifications
- Mapping user journeys and flows

### compound:agent-native-architecture
**Purpose**: Design systems for agent-first applications

**Temperature**: 0.1

**When to use**:
- Architecting AI-first applications
- Designing agent interaction patterns
- Building autonomous workflows
- Creating agent orchestration systems

### compound:deployment-verification-agent
**Purpose**: Pre-deployment Go/No-Go checklists and verification

**Temperature**: 0.1

**When to use**:
- Creating deployment verification checklists
- Pre-deployment risk assessment
- Validating deployment safety
- Creating rollback procedures

---

## Documentation Agents (12)

### compound:ankane-readme-writer
**Purpose**: Ruby gem documentation in Ankane style

**Temperature**: 0.1

**When to use**:
- Writing READMEs for Ruby gems
- Following Ankane's documentation style
- Creating clear, concise gem documentation
- Writing installation and usage guides

### compound:every-style-editor
**Purpose**: Text content editing for Every's style guide

**Temperature**: 0.1

**When to use**:
- Editing articles and blog posts
- Ensuring style guide compliance
- Text polishing and refinement
- Copy editing for publications

### compound:andrew-kane-gem-writer
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

### compound:workflow:plan
**Description**: Strategic planning and specification development

**Usage**:
```bash
compound:workflow:plan --task "Add user authentication to Rails app"
```

**What it does**:
- Creates detailed project plans
- Breaks down complex features into steps
- Identifies risks and mitigations
- Proposes implementation approaches

### compound:workflow:create
**Description**: Feature and component creation

**Usage**:
```bash
compound:workflow:create --type component --name UserProfile
```

**What it does**:
- Creates new features with structure
- Generates component scaffolding
- Sets up necessary files and directories
- Creates test stubs

### compound:workflow:status
**Description**: Project status tracking and reporting

**Usage**:
```bash
compound:workflow:status --project my-app
```

**What it does**:
- Reports project health
- Tracks progress on features
- Identifies blockers
- Suggests next steps

### compound:workflow:complete
**Description**: Task completion and cleanup workflows

**Usage**:
```bash
compound:workflow:complete --task-id 123
```

**What it does**:
- Finalizes task completion
- Runs cleanup tasks
- Generates completion reports
- Archives documentation

---

## Code Commands (4)

### compound:code:refactor
**Description**: Code refactoring with quality checks

**Usage**:
```bash
compound:code:refactor --file src/services/user.ts
```

**What it does**:
- Identifies refactoring opportunities
- Performs safe refactoring
- Maintains backward compatibility
- Validates test passage

### compound:code:review
**Description**: Comprehensive code review

**Usage**:
```bash
compound:code:review --file src/components/Button.tsx
```

**What it does**:
- Performs detailed code review
- Identifies issues and improvements
- Provides specific recommendations
- Creates actionable feedback

### compound:code:optimize
**Description**: Performance optimization

**Usage**:
```bash
compound:code:optimize --target database-queries
```

**What it does**:
- Identifies performance bottlenecks
- Optimizes hot paths
- Recommends caching strategies
- Provides before/after comparisons

### compound:code:format
**Description**: Code formatting and style standardization

**Usage**:
```bash
compound:code:format --dir src/
```

**What it does**:
- Applies code formatting
- Enforces style rules
- Updates import statements
- Fixes linting issues

---

## Git Commands (4)

### compound:git:smart-commit
**Description**: Intelligent commit message generation

**Usage**:
```bash
compound:git:smart-commit --staged
```

**What it does**:
- Analyzes staged changes
- Generates meaningful commit messages
- Follows conventional commits
- Provides commit suggestions

### compound:git:branch
**Description**: Smart branch creation and management

**Usage**:
```bash
compound:git:branch --create feature/user-auth
```

**What it does**:
- Creates feature branches
- Names branches intelligently
- Sets up tracking relationships
- Manages branch lifecycle

### compound:git:merge
**Description**: Intelligent merge workflows

**Usage**:
```bash
compound:git:merge --feature-branch feature/user-auth
```

**What it does**:
- Performs safe merges
- Resolves conflicts intelligently
- Validates merge integrity
- Creates merge commits

### compound:git:cleanup
**Description**: Repository cleanup utilities

**Usage**:
```bash
compound:git:cleanup --remove-stale-branches
```

**What it does**:
- Removes stale branches
- Cleans up local repository
- Optimizes git repository size
- Archives old branches

---

## Project Commands (4)

### compound:project:init
**Description**: Project initialization and setup

**Usage**:
```bash
compound:project:init --template next-app --name my-project
```

**What it does**:
- Creates project structure
- Initializes configuration files
- Sets up development environment
- Installs dependencies

### compound:project:build
**Description**: Build process management

**Usage**:
```bash
compound:project:build --target production
```

**What it does**:
- Orchestrates build process
- Optimizes output
- Generates artifacts
- Reports build status

### compound:project:deploy
**Description**: Deployment workflows and automation

**Usage**:
```bash
compound:project:deploy --environment staging
```

**What it does**:
- Prepares deployment
- Executes deployment steps
- Validates deployment success
- Provides rollback options

### compound:project:test
**Description**: Testing automation and reporting

**Usage**:
```bash
compound:project:test --type unit
```

**What it does**:
- Runs test suites
- Generates coverage reports
- Identifies test gaps
- Provides test recommendations

---

## Utility Commands (4)

### compound:util:clean
**Description**: Project cleanup and artifact removal

**Usage**:
```bash
compound:util:clean --remove-build-artifacts
```

**What it does**:
- Removes build artifacts
- Cleans dependency caches
- Removes temporary files
- Frees disk space

### compound:util:backup
**Description**: Configuration and state backup

**Usage**:
```bash
compound:util:backup --create
```

**What it does**:
- Creates configuration backups
- Saves project state
- Ensures recovery capability
- Validates backup integrity

### compound:util:restore
**Description**: Configuration and state restoration

**Usage**:
```bash
compound:util:restore --from backup-id
```

**What it does**:
- Restores from backups
- Validates restoration
- Verifies state consistency
- Provides rollback options

### compound:util:doctor
**Description**: System diagnostics and health checks

**Usage**:
```bash
compound:util:doctor --check environment
```

**What it does**:
- Checks system health
- Validates configuration
- Identifies issues
- Recommends fixes

---

## Documentation Commands (4)

### compound:docs:deploy-docs
**Description**: Documentation deployment and publishing

**Usage**:
```bash
compound:docs:deploy-docs --site my-docs
```

**What it does**:
- Builds documentation
- Deploys to hosting
- Updates DNS and routing
- Validates accessibility

### compound:docs:release-docs
**Description**: Release documentation and changelog generation

**Usage**:
```bash
compound:docs:release-docs --version 2.0.0
```

**What it does**:
- Generates release notes
- Creates changelog entries
- Documents breaking changes
- Publishes release documentation

### compound:docs:feature-video
**Description**: Feature demonstration video creation

**Usage**:
```bash
compound:docs:feature-video --feature new-dashboard
```

**What it does**:
- Scripts feature demonstrations
- Generates video content
- Creates tutorial videos
- Produces educational content

### compound:docs:test-browser
**Description**: Browser-based testing for documentation

**Usage**:
```bash
compound:docs:test-browser --docs-url http://localhost:3000
```

**What it does**:
- Tests documentation in browsers
- Validates interactive examples
- Checks responsiveness
- Verifies functionality

---

# SKILLS

## Development Skills (25)

### compound:typescript-development
Advanced TypeScript patterns, type systems, and best practices

### compound:python-development
Python development including asyncio, type hints, and frameworks

### compound:ruby-development
Ruby development with Rails patterns and conventions

### compound:go-development
Go programming, concurrency, and performance optimization

### compound:rust-development
Rust ownership system, error handling, and performance

### compound:react-development
React components, hooks, state management

### compound:vue-development
Vue.js components, composition API, and patterns

### compound:nextjs-development
Next.js SSR, API routes, and full-stack development

### compound:nodejs-development
Node.js runtime, event loop, and server development

### compound:database-design
Database schema design, normalization, and optimization

### compound:api-design
RESTful and GraphQL API design patterns

### compound:testing-development
Unit, integration, and E2E testing strategies

### compound:security-auditing
Security vulnerability identification and remediation

### compound:performance-optimization
Performance profiling and optimization techniques

### compound:code-refactoring
Safe refactoring patterns and techniques

### compound:code-review-expertise
Professional code review practices

### compound:architecture-analysis
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

### compound:frontend-design
Creating production-grade frontend interfaces and components

### compound:figma-integration
Designing in Figma and exporting to code

### compound:design-systems
Building and maintaining design systems

### compound:accessibility-a11y
WCAG compliance, accessibility patterns, inclusive design

### compound:responsive-design
Mobile-first responsive design patterns

### compound:css-styling
CSS frameworks, custom properties, advanced styling

### compound:tailwind-css
Utility-first CSS with Tailwind

### compound:animation-design
UI animations, transitions, and motion design

### compound:component-libraries
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

### compound:docker-containerization
Docker images, containers, and Docker Compose

### compound:kubernetes-deployment
Kubernetes orchestration, deployment, scaling

### compound:ci-cd-pipelines
GitHub Actions, GitLab CI, Jenkins workflows

### compound:terraform-iac
Infrastructure as Code with Terraform

### compound:aws-cloud
AWS services, EC2, S3, Lambda, RDS

### compound:gcp-cloud
Google Cloud Platform services and deployment

### compound:monitoring-observability
Prometheus, Grafana, logging, tracing

### compound:scaling-strategies
Horizontal/vertical scaling, auto-scaling

### compound:deployment-strategies
Blue-green, canary, rolling deployments

**And 3 more DevOps skills:**
- Linux System Administration
- Network Architecture
- Database Administration

---

## Documentation Skills (10)

### compound:api-documentation
OpenAPI/Swagger, API documentation best practices

### compound:technical-writing
Technical content writing and clarity

### compound:readme-best-practices
Effective README creation and maintenance

### compound:tutorial-creation
Step-by-step tutorial writing

### compound:changelog-management
Changelog creation and maintenance

### compound:documentation-sites
Docusaurus, MkDocs, documentation deployment

### compound:api-specifications
OpenAPI, GraphQL schema documentation

### compound:style-guides
Creating and enforcing style guides

**And 2 more documentation skills:**
- Content Organization & Information Architecture
- Documentation Testing & Validation

---

## Analysis Skills (8)

### compound:code-analysis
Static code analysis and quality metrics

### compound:performance-profiling
Performance analysis and optimization

### compound:security-scanning
Vulnerability scanning and assessment

### compound:git-analytics
Git history analysis and metrics

### compound:dependency-analysis
Dependency audit and management

### compound:data-analysis
Data processing and analysis

### compound:trend-analysis
Trend detection and forecasting

### compound:cost-analysis
Cloud cost optimization and analysis

---

# Usage Examples

## Example 1: Code Review Workflow

```javascript
{
  agents: {
    "compound:kieran-rails-reviewer": {
      model: "anthropic/claude-opus-4-5",
      temperature: 0.1,
      skills: ["compound:rails-development", "compound:code-review-expertise"]
    }
  },
  commands: {
    "code-review": {
      template: "Review this Rails code: ${file} using compound:kieran-rails-reviewer"
    }
  }
}
```

## Example 2: Feature Planning

```javascript
{
  agents: {
    "compound:spec-flow-analyzer": {
      model: "anthropic/claude-opus-4-5",
      skills: ["compound:api-design", "compound:architecture-analysis"]
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
    "compound:figma-design-sync": {
      model: "anthropic/claude-opus-4-5",
      temperature: 0.1,
      skills: ["compound:figma-integration", "compound:responsive-design"]
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

All components follow the `compound:` prefix convention:

- **Agents**: `compound:{category}:{agent-name}`
  - Example: `compound:kieran-rails-reviewer`
- **Commands**: `compound:{category}:{action}`
  - Example: `compound:code:refactor`
- **Skills**: `compound:{skill-name}`
  - Example: `compound:typescript-development`

This naming scheme ensures:
- ✅ Clear origin and purpose
- ✅ Easy discovery and organization
- ✅ Prevents naming conflicts
- ✅ Enables selective enabling/disabling

---

## Integration Points

### With Your Configuration
All components are available through the standard ruach configuration system:

```javascript
// opencode.json or .opencode/config.jsonc
{
  agents: {
    "compound:*": { ... }  // Enable all compound agents
  },
  commands: {
    "compound:*": { ... }  // Enable all compound commands
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
