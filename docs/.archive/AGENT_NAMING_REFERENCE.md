# AGENT NAMING REFERENCE CARD
Quick lookup for all 27 agents in Ghostwire

---

## BY CATEGORY

### Orchestration & Execution (4)
| Name | Export | Role | Mode |
|------|--------|------|------|
| zen-planner | createZenPlannerAgent | Strategic planning | primary |
| grid-sync | createGridSyncAgent | Master orchestrator | primary |
| void-runner | createVoidRunnerAgent | General executor | primary |
| dark-runner | createDarkRunnerAgent | Focused executor | subagent |

### Code Review (5)
| Name | Export | Role | Focus |
|------|--------|------|-------|
| void-review-rails | createKieranRailsReviewerAgent | Senior Rails dev | DHH philosophy |
| void-review-ts | createKieranTypeScriptReviewerAgent | Senior TS dev | Type safety |
| void-review-python | createKieranPythonReviewerAgent | Senior Python dev | Pythonic patterns |
| zen-review-rails | createDHHRailsReviewerAgent | DHH philosophy | Architecture |
| mono-review | createCodeSimplicityReviewerAgent | Simplicity gate | YAGNI principles |

### Research & Discovery (6)
| Name | Export | Role | Research Type |
|------|--------|------|---|
| data-dive | createLibrarianAgent | Archive Researcher | External libraries |
| scan-ops | createExploreAgent | Scout Recon | Codebase patterns |
| best-practices-scan | createBestPracticesResearcherAgent | Best Practices | External knowledge |
| docs-scan | createFrameworkDocsResearcherAgent | Framework Docs | Library docs |
| learnings-scan | createLearningsResearcherAgent | Learnings | Institutional solutions |
| git-scan | createGitHistoryAnalyzerAgent | Git History | Code archaeology |

### Design & Frontend (4)
| Name | Export | Role | Focus |
|------|--------|------|-------|
| figma-sync | createFigmaDesignSyncAgent | Design Sync | Pixel-perfect |
| design-check | createDesignImplementationReviewerAgent | Design QA | Spec compliance |
| design-loop | createDesignIteratorAgent | Design Iteration | Refinement cycles |
| ui-build | createFrontendDesignAgent | Frontend Design | Production UI |

### Architecture & Workflow (3)
| Name | Export | Role | Focus |
|------|--------|------|-------|
| agent-arch | createAgentNativeArchitectureAgent | Agent parity | User-agent parity |
| flow-check | createSpecFlowAnalyzerAgent | Flow analyzer | UX flows & gaps |
| deploy-check | createDeploymentVerificationAgent | Deploy safety | Data protection |

### Advisory & Analysis (3)
| Name | Export | Role | Focus |
|------|--------|------|-------|
| eye-ops | createEyeOpsAgent | Seer Advisor | Architecture guidance |
| eye-scan | createMultimodalLookerAgent | Multimodal | Media analysis |
| war-mind | createWarMindAgent | Tactician | Pre-planning |

### Audit (1)
| Name | Export | Role | Focus |
|------|--------|------|-------|
| null-audit | createNullAuditAgent | Glitch Auditor | Plan validation |

### Documentation (1)
| Name | Export | Role | Focus |
|------|--------|------|-------|
| docs-write-readme | createAnkaneReadmeWriterAgent | Ankane Style | Ruby gem docs |

---

## BY NAMING PATTERN

### void-* (4 agents)
- void-runner
- void-review-rails
- void-review-ts
- void-review-python

**Theme**: Absence of constraints, direct action, execution

### zen-* (2 agents)
- zen-planner
- zen-review-rails

**Theme**: Wisdom, strategic thinking, enlightenment

### -*scan (5 agents)
- best-practices-scan
- docs-scan
- learnings-scan
- git-scan
- scan-ops

**Theme**: Research, discovery, analysis

### -*check (3 agents)
- design-check
- flow-check
- deploy-check

**Theme**: Verification, validation, quality gatekeeping

### eye-* (2 agents)
- eye-ops
- eye-scan

**Theme**: Perception, vision, observation

### -*review (5 agents)
- void-review-rails
- void-review-ts
- void-review-python
- zen-review-rails
- mono-review

**Theme**: Code quality evaluation

### Descriptive (6 agents)
- agent-arch
- war-mind
- null-audit
- dark-runner
- ui-build
- docs-write-readme

**Theme**: Explicit purpose naming

---

## QUICK LOOKUP BY PURPOSE

### Need a Planner?
→ **zen-planner** (interview mode, work plan generation)

### Need an Executor?
→ **void-runner** (general purpose) or **dark-runner** (focused, no delegation)

### Need Code Review?
→ **void-review-rails**, **void-review-ts**, **void-review-python**, **zen-review-rails**, **mono-review**

### Need Research?
→ **data-dive**, **scan-ops**, **best-practices-scan**, **docs-scan**, **learnings-scan**, **git-scan**

### Need Design Help?
→ **figma-sync**, **design-check**, **design-loop**, **ui-build**

### Need Architecture Review?
→ **agent-arch**, **flow-check**, **deploy-check**

### Need Strategic Advice?
→ **eye-ops**, **war-mind**

### Need to Analyze Media?
→ **eye-scan**

### Need Plan Validation?
→ **null-audit**

### Need Orchestration?
→ **grid-sync** (master orchestrator via delegate_task)

---

## MIGRATION NOTES

### What Would Need to Change When Renaming:

1. **Filename**: zen-planner.ts → proposed-name.ts
2. **Export function**: createZenPlannerAgent → createProposedNameAgent
3. **Constant exports**: AUGUR_PLANNER_SYSTEM_PROMPT → NEW_SYSTEM_PROMPT
4. **Metadata exports**: glitchPromptMetadata → newPromptMetadata
5. **Compound mappings**: "zen.planner" → "category.new-name"
6. **Documentation**: References in AGENTS.md, README, etc.
7. **Tests**: Agent factory test references
8. **User docs**: Public-facing agent descriptions

### Export Pattern to Maintain:
```typescript
export { createXxxAgent, XXX_PROMPT_METADATA } from "../file-name";
```

### Registry Pattern (compound/index.ts):
```typescript
COMPOUND_AGENT_MAPPINGS: {
  "category.name": createXxxAgent,
  ...
}
```

---

## FILE LOCATIONS

All agent implementations: `/Users/charlesponti/Developer/agents/src/orchestration/agents/`

Key files:
- Agent implementations: `{name}.ts`
- Compound exports: `compound/index.ts`
- Type definitions: `types.ts`
- Utilities: `utils.ts`
- Tests: `{name}.test.ts`

---

## NEXT: NAMING STRATEGIES

See COMPLETE_AGENT_INVENTORY.md for:
- Option 1: Category-First Prefixes
- Option 2: Thematic Consistency
- Option 3: Hybrid Approach

