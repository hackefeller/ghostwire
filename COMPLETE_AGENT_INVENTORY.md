# COMPLETE AGENT NAMING ANALYSIS
**Comprehensive Inventory of ALL 27 Agents in Ghostwire Repository**

---

## MASTER TABLE: ALL 27 AGENTS

| # | Current Filename | Current Export Name | PromptAlias / Role | Category | Agent Mode | Purpose/Description | Legacy Keywords |
|---|---|---|---|---|---|---|---|
| 1 | zen-planner.ts | createZenPlannerAgent | zen-planner | Planning | primary | Strategic planning consultant - interviews users, creates work plans | Augur, Planner, Interview mode |
| 2 | grid-sync.ts | createGridSyncAgent | grid-sync | Orchestration | primary | Master orchestrator - conducts work via delegate_task to complete todo lists | Nexus, Grid Sync, Conductor |
| 3 | void-runner.ts | createVoidRunnerAgent | void-runner | Execution | primary | Powerful AI agent - rolls forward with code implementation (SF Bay engineer style) | Void Runner, Code executor |
| 4 | dark-runner.ts | createDarkRunnerAgent | dark-runner | Execution | subagent | Focused executor - implements tasks directly without delegation | Dark Runner, Direct executor |
| 5 | void-review-rails.ts | createKieranRailsReviewerAgent | Kieran Rails Reviewer | Code Review | subagent | Super senior Rails developer reviewing code (DHH philosophy) | Kieran Rails, Rails expert |
| 6 | void-review-ts.ts | createKieranTypeScriptReviewerAgent | Kieran TypeScript Reviewer | Code Review | subagent | Super senior TypeScript developer reviewing code quality | Kieran TypeScript, TS expert |
| 7 | void-review-python.ts | createKieranPythonReviewerAgent | Kieran Python Reviewer | Code Review | subagent | Super senior Python developer reviewing code conventions | Kieran Python, Python expert |
| 8 | zen-review-rails.ts | createDHHRailsReviewerAgent | DHH Rails Reviewer | Code Review | subagent | David Heinemeier Hansson reviewing Rails architectural decisions | DHH Rails, Architecture reviewer |
| 9 | data-dive.ts | createLibrarianAgent | Archive Researcher | Research/Discovery | subagent | Researches external libraries, frameworks, documentation | Librarian, Archive Researcher, Data dive |
| 10 | eye-ops.ts | createEyeOpsAgent | Seer Advisor | Advisory | subagent | Advises on architecture, self-review, hard debugging | Eye Ops, Seer, Advisor |
| 11 | eye-scan.ts | createMultimodalLookerAgent | Multimodal Looker | Analysis | subagent | Analyzes media files (PDFs, images, diagrams) | Eye Scan, Multimodal, Media analyzer |
| 12 | scan-ops.ts | createExploreAgent | Scout Recon | Research/Discovery | subagent | Explores codebase structure, patterns, multi-module discovery | Scout Recon, Explore, Scan ops |
| 13 | war-mind.ts | createWarMindAgent | Tactician Strategist | Planning/Advisory | subagent | Pre-planning consultant - analyzes requests, identifies intent, flags ambiguities | War Mind, Tactician, Strategy |
| 14 | null-audit.ts | createNullAuditAgent | Glitch Auditor | Review/Audit | subagent | Work plan reviewer - validates executability, catches gaps | Null Audit, Glitch Auditor |
| 15 | agent-arch.ts | createAgentNativeArchitectureAgent | Agent-Native Architecture | Architecture | subagent | Ensures features are agent-native (parity with users) | Agent Arch, Agent-Native |
| 16 | best-practices-scan.ts | createBestPracticesResearcherAgent | Best Practices Researcher | Research | subagent | Researches external best practices, documentation, examples | Best Practices, Researcher |
| 17 | docs-scan.ts | createFrameworkDocsResearcherAgent | Framework Docs Researcher | Research | subagent | Gathers comprehensive framework/library documentation | Framework Docs, Docs researcher |
| 18 | learnings-scan.ts | createLearningsResearcherAgent | Learnings Researcher | Research | subagent | Searches institutional learnings (docs/solutions/) for past solutions | Learnings, Solutions finder |
| 19 | git-scan.ts | createGitHistoryAnalyzerAgent | Git History Analyzer | Analysis | subagent | Analyzes git history, code evolution, contributor patterns | Git History, Archaeological analysis |
| 20 | figma-sync.ts | createFigmaDesignSyncAgent | Figma Design Sync | Design | subagent | Synchronizes web implementations with Figma designs (pixel-perfect) | Figma Sync, Design sync |
| 21 | design-check.ts | createDesignImplementationReviewerAgent | Design Implementation Reviewer | Design | subagent | Verifies UI implementations match Figma specifications | Design Check, Implementation review |
| 22 | design-loop.ts | createDesignIteratorAgent | Design Iterator | Design | subagent | Iteratively refines designs through visual analysis (5x-10x iterations) | Design Loop, Design iterator |
| 23 | ui-build.ts | createFrontendDesignAgent | Frontend Design | Design | subagent | Creates distinctive, production-grade frontend interfaces | UI Build, Frontend Designer |
| 24 | flow-check.ts | createSpecFlowAnalyzerAgent | Spec Flow Analyzer | Analysis/Flow | subagent | Maps user flows, identifies gaps, validates specifications | Flow Check, Flow analyzer |
| 25 | deploy-check.ts | createDeploymentVerificationAgent | Deployment Verification Agent | Deployment | subagent | Creates pre/post-deploy checklists for risky data changes | Deploy Check, Data safety |
| 26 | docs-write-readme.ts | createAnkaneReadmeWriterAgent | Ankane README Writer | Documentation | subagent | Writes Ruby gem READMEs (Andrew Kane style) | Ankane, README writer |
| 27 | mono-review.ts | createCodeSimplicityReviewerAgent | Code Simplicity Reviewer | Code Review | subagent | Enforces simplicity and YAGNI principles in code | Mono Review, Simplicity reviewer |

---

## AGENTS GROUPED BY CATEGORY

### PRIMARY ORCHESTRATORS & EXECUTORS (4)
These agents coordinate work or execute implementation:
- **zen-planner** → Strategic planning consultant
- **grid-sync** → Master orchestrator (delegates via delegate_task)
- **void-runner** → General purpose executor
- **dark-runner** → Focused executor (no delegation)

### CODE REVIEW SPECIALISTS (5)
Language-specific and philosophy-driven code reviewers:
- **void-review-rails** → Kieran Rails (DHH philosophy)
- **void-review-ts** → Kieran TypeScript
- **void-review-python** → Kieran Python
- **zen-review-rails** → DHH Rails (architectural)
- **mono-review** → Code Simplicity (YAGNI)

### RESEARCH & DISCOVERY (6)
Agents that gather context and external knowledge:
- **data-dive** → Archive Researcher (library docs)
- **scan-ops** → Scout Recon (codebase exploration)
- **best-practices-scan** → Best Practices Researcher
- **docs-scan** → Framework Docs Researcher
- **learnings-scan** → Learnings Researcher (institutional knowledge)
- **git-scan** → Git History Analyzer

### DESIGN & FRONTEND (4)
UI/UX specialists:
- **figma-sync** → Figma Design Sync (pixel-perfect alignment)
- **design-check** → Design Implementation Reviewer
- **design-loop** → Design Iterator (iterative refinement)
- **ui-build** → Frontend Design (production interfaces)

### ARCHITECTURE & FLOW ANALYSIS (3)
System-level design and validation:
- **agent-arch** → Agent-Native Architecture
- **flow-check** → Spec Flow Analyzer
- **deploy-check** → Deployment Verification

### ADVISORY & ANALYSIS (3)
Strategic guidance and plan review:
- **eye-ops** → Seer Advisor (architecture, debugging)
- **eye-scan** → Multimodal Looker (media analysis)
- **war-mind** → Tactician Strategist (pre-planning analysis)

### REVIEW & AUDIT (1)
- **null-audit** → Glitch Auditor (plan validation)

### DOCUMENTATION (1)
- **docs-write-readme** → Ankane README Writer

---

## NAMING PATTERNS ANALYSIS

### Existing Name Prefixes (Themes):
1. **void-** (3 agents): void-runner, void-review-rails, void-review-ts, void-review-python
   - Theme: "emptiness/nothingness" → absence of constraints, direct action
   
2. **zen-** (2 agents): zen-planner, zen-review-rails
   - Theme: "wisdom/enlightenment" → strategic thinking, pure philosophy
   
3. **-scan** (5 agents): best-practices-scan, docs-scan, learnings-scan, git-scan
   - Theme: "searching/analyzing" → discovery-oriented research agents
   
4. **-check** (2 agents): design-check, flow-check, deploy-check
   - Theme: "verification/validation" → quality gatekeepers
   
5. **-loop** (1 agent): design-loop
   - Theme: "iteration" → refinement through cycles
   
6. **-ops** (2 agents): eye-ops, scan-ops
   - Theme: "operations/execution" → tactical execution
   
7. **-sync** (1 agent): figma-sync
   - Theme: "synchronization" → alignment/conformance

8. **eye-** (2 agents): eye-ops, eye-scan
   - Theme: "perception/vision" → looking/analyzing

9. **-review** (5 agents): void-review-*, zen-review-rails, mono-review
   - Theme: "code evaluation" → code quality gatekeepers

10. **Multi-word descriptive** (6 agents): 
    - agent-arch, war-mind, null-audit, dark-runner, ui-build, docs-write-readme
    - Theme: Explicit descriptive naming (no unified pattern)

### Keywords Extracted from Agent Purposes:
- **Strategic**: zen-planner, war-mind, grid-sync, flow-check
- **Execution**: void-runner, dark-runner, ui-build
- **Research**: data-dive, scan-ops, docs-scan, best-practices-scan, learnings-scan, git-scan
- **Review/Quality**: void-review-*, zen-review-*, mono-review, null-audit, design-check
- **Design**: figma-sync, design-loop, design-check, ui-build
- **Advisory**: eye-ops, war-mind, agent-arch
- **Documentation**: docs-write-readme
- **Specialized**: deploy-check (data safety), flow-check (UX flows), eye-scan (media)

---

## NAMING CONSISTENCY OBSERVATIONS

### Strengths:
1. Consistent use of **kebab-case** across all filenames
2. Themed prefixes help group related agents (void-*, zen-*, -scan, -check, -review)
3. File names are descriptive and searchable
4. Export function names follow **createXxxAgent** factory pattern

### Inconsistencies/Gaps:
1. **Naming logic varies**: Some prefix-based (void-*, zen-*), some suffix-based (-scan, -check, -review), some descriptive (agent-arch, war-mind)
2. **Generic descriptor words**: "dark-runner" vs "void-runner" (unclear distinction)
3. **Multiple name layers**: filename ≠ export name ≠ promptAlias (requires context-switching)
4. **Metadata aliases long**: "Kieran Rails Reviewer" vs "Kieran TypeScript Reviewer" vs "Code Simplicity Reviewer" (inconsistent pattern)
5. **No clear categorization in names**: Can't tell category from filename alone

---

## LEGACY NAME MAPPING (FROM PROMPT ALIASES & COMMENTS)

| Current Name | PromptAlias | Internal IDs | Notes |
|---|---|---|---|
| zen-planner | zen-planner | augurPlanner | Planner, Interview mode |
| grid-sync | grid-sync | nexusOrchestrator | Conductor of agents |
| void-runner | void-runner | cipherOperator | SF Bay engineer style |
| dark-runner | dark-runner | — | Direct executor |
| void-review-rails | Kieran Rails Reviewer | — | Code quality gate |
| void-review-ts | Kieran TypeScript Reviewer | — | Code quality gate |
| void-review-python | Kieran Python Reviewer | — | Code quality gate |
| zen-review-rails | DHH Rails Reviewer | — | Architecture gate |
| data-dive | Archive Researcher | — | Library researcher |
| eye-ops | Seer Advisor | — | Architecture advisor |
| eye-scan | Multimodal Looker | — | Media analyzer |
| scan-ops | Scout Recon | — | Codebase explorer |
| war-mind | Tactician Strategist | — | Pre-planning analyst |
| null-audit | Glitch Auditor | — | Plan validator |
| agent-arch | Agent-Native Architecture | — | Agent parity reviewer |
| best-practices-scan | Best Practices Researcher | — | External knowledge |
| docs-scan | Framework Docs Researcher | — | Library docs |
| learnings-scan | Learnings Researcher | — | Institutional knowledge |
| git-scan | Git History Analyzer | — | Code archaeology |
| figma-sync | Figma Design Sync | — | Design alignment |
| design-check | Design Implementation Reviewer | — | Design QA |
| design-loop | Design Iterator | — | Iterative refinement |
| ui-build | Frontend Design | — | UI production |
| flow-check | Spec Flow Analyzer | — | UX flow validation |
| deploy-check | Deployment Verification Agent | — | Deployment safety |
| docs-write-readme | Ankane README Writer | — | Gem documentation |
| mono-review | Code Simplicity Reviewer | — | Simplicity gate |

---

## SCOPE CLARIFICATION: "28 AGENTS" vs ACTUAL INVENTORY

**What the user likely thought they were asking about:** 18 production agents + 10 from placeholder/stub implementations

**Actual situation:**
- **27 actual implementation files** in src/orchestration/agents/
- **Of these, ~20 are fully implemented** (rest are utils, types, configs)
- **Compound folder** shows planned agent categories with some stubs
- **Not yet implemented** (stubs only): every-style-editor, andrew-kane-gem-writer + ~9 documentation agents

**Breaking down the 27:**
1. **5 Primary agents** (grid-sync, zen-planner, void-runner) + execution (dark-runner)
2. **5 Code Review** agents (Kieran Rails/TS/Python, DHH Rails, Simplicity)
3. **6 Research** agents (Archive, Scout, Best Practices, Docs, Learnings, Git)
4. **4 Design** agents (Figma Sync, Design Check, Design Loop, Frontend)
5. **3 Workflow/Architecture** agents (Agent Native, Flow Check, Deploy Check)
6. **3 Advisory** agents (Seer, Multimodal, Tactician)
7. **1 Audit** agent (Glitch Auditor)
8. **1 Documentation** agent (Ankane README)

**Missing/Placeholder implementations:**
- every-style-editor
- andrew-kane-gem-writer
- 9 additional documentation agents (indicated in compound/index.ts comment)

---

## RECOMMENDED ANALYSIS SCOPE FOR NAMING

The user should focus on renaming these **27 existing agents**, grouped as:

**Group A: Orchestration & Execution (4)**
- zen-planner, grid-sync, void-runner, dark-runner

**Group B: Code Review (5)**
- void-review-rails, void-review-ts, void-review-python, zen-review-rails, mono-review

**Group C: Research & Discovery (6)**
- data-dive, scan-ops, best-practices-scan, docs-scan, learnings-scan, git-scan

**Group D: Design & Frontend (4)**
- figma-sync, design-check, design-loop, ui-build

**Group E: Workflow & Architecture (3)**
- agent-arch, flow-check, deploy-check

**Group F: Advisory & Analysis (3)**
- eye-ops, eye-scan, war-mind

**Group G: Review & Audit (1)**
- null-audit

**Group H: Documentation (1)**
- docs-write-readme

---

## KEY INSIGHTS FOR NAMING SCHEME

1. **Current system is inconsistent but functional** - each agent has a clear role
2. **File names don't reveal category** - need semantic naming to understand function
3. **Export names follow createXxxAgent pattern** - good, keep this
4. **PromptAlias names are often longer and clearer** - good reference point
5. **No prefix/suffix scheme covers all categories** - multiple naming patterns coexist

### Potential Naming Strategies:

**Option 1: Category-First Prefixes**
```
orch-{name}    → orch-planner, orch-gridmaster
exec-{name}    → exec-runner, exec-dark
code-{name}    → code-rails-review, code-ts-review
research-{name} → research-archive, research-docs
design-{name}  → design-sync, design-check
workflow-{name} → workflow-deploy, workflow-flow
```

**Option 2: Thematic Consistency (Mythological/Natural)**
Keep zen-, void-, eye- prefixes but standardize suffixes:
```
zen-strategy  (planner)
void-execute  (runner)
eye-observe   (advisor, scan)
sage-review   (code review agents)
scout-explore (research agents)
```

**Option 3: Hybrid (Prefix for Role + Suffix for Action)**
```
planner-zen
executor-void
reviewer-{lang}
researcher-{type}-scan
designer-{tool}-sync
```

---

## NEXT STEPS

To proceed with comprehensive naming proposal, you should:

1. ✓ Understand the complete 27-agent inventory (THIS DOCUMENT)
2. Define naming principles and constraints for the org
3. Create semantic naming scheme covering all 8 categories
4. Map current→proposed names for all 27 agents
5. Identify migration impact (exports, docs, registration)
6. Create gradual migration plan if needed

