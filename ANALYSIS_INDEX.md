# COMPLETE AGENT NAMING ANALYSIS - INDEX
**Comprehensive Documentation of All 27 Ghostwire Agents**

---

## DOCUMENTS IN THIS ANALYSIS

### 1. **COMPLETE_AGENT_INVENTORY.md** (16 KB)
The master reference document containing:
- **Master Table**: All 27 agents with current filenames, export names, purposes, categories
- **Category Groupings**: Agents organized by function (8 categories)
- **Naming Pattern Analysis**: Detailed breakdown of existing naming conventions
- **Legacy Name Mapping**: PromptAlias names and internal IDs
- **Naming Consistency Assessment**: Strengths and issues identified
- **Naming Strategy Options**: 3 proposed semantic naming approaches

**Use this for:** Deep understanding of the complete agent landscape, detailed comparison between current and proposed names

---

### 2. **AGENT_NAMING_REFERENCE.md** (6 KB)
Quick lookup cards organized by:
- **By Category**: All 27 agents organized into 8 functional groups
- **By Naming Pattern**: Agents grouped by naming convention (void-*, zen-*, -*scan, etc.)
- **Quick Lookup by Purpose**: Find the right agent for your task
- **Migration Notes**: What changes when renaming agents
- **File Locations**: Where agent files live

**Use this for:** Quick reference, finding agents by function, understanding migration impact

---

### 3. **NAMING_ANALYSIS_SUMMARY.txt** (9 KB)
Executive summary and next steps:
- **Key Findings**: 27-agent inventory breakdown and naming pattern landscape
- **Naming Analysis by Category**: Issue identification for each of 8 categories
- **Consistency Issues**: 5 major problems identified
- **Strengths to Preserve**: 7 good practices to maintain
- **Recommendations**: 4-step approach for next phase
- **Scope Clarification**: Why 27 agents, not 28

**Use this for:** Executive overview, identifying problem areas, planning next steps

---

## QUICK START PATHS

### I want to understand all 27 agents
1. Start with **NAMING_ANALYSIS_SUMMARY.txt** (5 min read)
2. Review **AGENT_NAMING_REFERENCE.md** (quick lookup)
3. Dive into **COMPLETE_AGENT_INVENTORY.md** (comprehensive)

### I want to know what needs to be renamed
1. Open **NAMING_ANALYSIS_SUMMARY.txt**
2. Jump to "Naming Consistency Issues" section
3. Review "Unclear Distinctions" subsection

### I want to propose new names
1. Read **NAMING_ANALYSIS_SUMMARY.txt** (understand current state)
2. Study **COMPLETE_AGENT_INVENTORY.md** naming strategies
3. Create mapping of current → proposed names
4. Use **AGENT_NAMING_REFERENCE.md** for migration impact

### I need to migrate/refactor agents
1. Review **AGENT_NAMING_REFERENCE.md** migration notes
2. Understand impact scope (7 layers per agent)
3. Plan phased migration using **COMPLETE_AGENT_INVENTORY.md** groupings

---

## KEY STATISTICS

### Agent Inventory
- **Total Agents**: 27 fully implemented
- **Agent Categories**: 8 functional groups
- **Naming Patterns**: 7 different schemes used
- **Largest Category**: Research & Discovery (6 agents)
- **Smallest Categories**: Audit, Documentation (1 each)

### Naming Patterns
- **Prefix-based**: 8 agents (void-*, zen-*, eye-*)
- **Suffix-based**: 14 agents (-scan, -check, -review, -loop, -sync)
- **Descriptive**: 5 agents (multi-word explicit names)

### Consistency Issues Found
- **Pattern Inconsistencies**: 3 major areas
- **Naming Logic Conflicts**: void- vs dark- runners, data-dive vs -scan pattern, etc.
- **Category Ambiguity**: Cannot determine function from name alone
- **Name Layers**: 4-5 different names per agent (filename, export, alias, ID, metaphor)

---

## AGENT CATEGORIES (QUICK REFERENCE)

| Category | Count | Key Agents | Pattern |
|----------|-------|-----------|---------|
| Orchestration & Execution | 4 | zen-planner, grid-sync | zen-*, void-* |
| Code Review | 5 | void-review-rails, mono-review | void-review-*, zen-, mono |
| Research & Discovery | 6 | data-dive, *-scan | mostly -*scan |
| Design & Frontend | 4 | figma-sync, design-* | design-*, -sync |
| Architecture & Workflow | 3 | agent-arch, flow-check, deploy-check | descriptive |
| Advisory & Analysis | 3 | eye-ops, eye-scan, war-mind | eye-*, descriptive |
| Audit | 1 | null-audit | descriptive |
| Documentation | 1 | docs-write-readme | compound |

---

## NAMING PATTERNS IDENTIFIED

### Prefix Schemes
- **void-** (4 agents): Execution/action without constraints
- **zen-** (2 agents): Strategic thinking/wisdom
- **eye-** (2 agents): Perception/observation
- **design-** (4 agents): Design-related functions

### Suffix Schemes
- **-scan** (5 agents): Research/discovery
- **-check** (3 agents): Verification/validation
- **-review** (5 agents): Code quality evaluation
- **-loop** (1 agent): Iteration
- **-sync** (1 agent): Synchronization

### Descriptive (6 agents)
- agent-arch, war-mind, null-audit, dark-runner, ui-build, docs-write-readme

---

## NAMING ISSUES SUMMARY

### Issue 1: Pattern Inconsistency
Agents don't follow a single naming logic. Some use prefixes, some suffixes, some are fully descriptive.

### Issue 2: Category Ambiguity
Cannot tell what an agent does just from its name. Examples:
- Is "dark-runner" different from "void-runner"? How?
- Why is "mono-review" not "void-review-simplicity"?
- Why is "data-dive" not "archive-scan"?

### Issue 3: Multiple Name Layers
Each agent has 4-5 different names (filename, export function, PromptAlias, internal ID, metaphorical origin), requiring context to understand full identity.

### Issue 4: Inconsistent Metadata
PromptAlias names don't follow a standard format ("Kieran Rails Reviewer" vs "Best Practices Researcher" vs "Figma Design Sync").

### Issue 5: Unclear Distinctions
Related agents lack consistent naming:
- void-runner vs dark-runner (both executors)
- design-check vs design-loop (both design-related)
- best-practices-scan vs docs-scan (both research)

---

## PROPOSED SOLUTIONS

Three naming strategies are detailed in COMPLETE_AGENT_INVENTORY.md:

### Option 1: Category-First Prefixes
Use category prefix for all agents:
- `orch-planner`, `exec-runner`, `code-rails-review`
- **Benefit**: Category immediately clear
- **Cost**: Less metaphorical, new prefix scheme

### Option 2: Thematic Consistency
Keep existing metaphors but standardize patterns:
- `zen-strategy`, `void-execute`, `sage-review`
- **Benefit**: Maintains flavor, adds consistency
- **Cost**: Requires rethinking some names

### Option 3: Hybrid Approach
Combine category prefix with thematic suffix:
- `planner-zen`, `executor-void`, `reviewer-{lang}`
- **Benefit**: Best of both worlds
- **Cost**: Longer names, reverse search order

---

## MIGRATION IMPACT

Each agent rename requires updates to:

1. **Filename**: `zen-planner.ts` → `new-name.ts`
2. **Export Function**: `createZenPlannerAgent` → `createNewNameAgent`
3. **System Prompt**: `AUGUR_PLANNER_SYSTEM_PROMPT` → `NEW_SYSTEM_PROMPT`
4. **Metadata**: `augurPromptMetadata` → `newPromptMetadata`
5. **Compound Mapping**: `"zen.planner"` → `"category.new-name"`
6. **Documentation**: All references in docs, AGENTS.md, etc.
7. **Tests**: Agent factory test files

**Total touch points per agent**: 7-10 locations

**Total locations to update**: ~270+ references across all files

---

## RECOMMENDATIONS FOR NEXT PHASE

1. **Define Principles**: What matters most to your team?
   - Clarity over metaphor?
   - Category visibility?
   - Name length/brevity?

2. **Choose Strategy**: Pick Option 1, 2, 3, or a hybrid

3. **Create Mapping**: Use master table to assign new names

4. **Plan Migration**: 
   - Phase 1: Update critical primary agents
   - Phase 2: Update code review agents
   - Phase 3: Update research agents
   - Phase 4: Update remaining agents
   - Phase 5: Documentation updates

5. **Test Migration**: Run full test suite after each phase

---

## FILE STRUCTURE

All analysis documents are in the repository root:
```
/Users/charlesponti/Developer/agents/
├── ANALYSIS_INDEX.md (this file)
├── COMPLETE_AGENT_INVENTORY.md (master reference)
├── AGENT_NAMING_REFERENCE.md (quick lookup)
├── NAMING_ANALYSIS_SUMMARY.txt (executive summary)
└── src/orchestration/agents/ (agent implementations)
```

---

## CONTACTS & NEXT STEPS

1. **Review Documents**: Start with NAMING_ANALYSIS_SUMMARY.txt
2. **Discuss Strategy**: Which naming approach fits your philosophy?
3. **Create Proposal**: Map current→proposed names using COMPLETE_AGENT_INVENTORY.md
4. **Plan Execution**: Use AGENT_NAMING_REFERENCE.md migration notes
5. **Implement**: Execute phased migration with test coverage

---

**Generated**: 2026-02-19
**Scope**: Complete 27-agent naming analysis
**Status**: Ready for strategy selection and naming proposal

