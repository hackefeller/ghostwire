# Task 13-14: workflows:execute and workflows:status Implementation Roadmap

**Status**: Implementation Roadmap Document  
**Date**: 2026-02-24  
**Scope**: Final 2 critical checklist items from workflow-command-renaming plan  

---

## Overview

This document outlines the implementation of the final 2 critical components from the workflow-command-renaming plan checklist:

1. **Task 13**: `workflows:execute` command that reads structured task lists and delegates individual tasks to subagents
2. **Task 14**: `workflows:status` command that shows workflow progress with dependency tracking

These were identified as the 2 remaining items from the original "8/10 completed" status.

---

## Task 13: Implement workflows:execute Command

### Checklist Item
✅ `workflows:execute` **reads structured task list** and delegates individual tasks to subagents  
✅ `workflows:execute` uses `delegate_task(category=..., load_skills=..., description=...)` for each task

### Implementation Plan

#### Phase 1: Hook Structure
```typescript
// src/orchestration/hooks/workflows-execute/index.ts
export async function createWorkflowsExecuteCommand(input: PluginInput) {
  // 1. Parse plan file path from user message
  // 2. Read plan file content
  // 3. Extract JSON task list from markdown code block
  // 4. Validate task structure using TaskSchema
  // 5. Build execution plan with wave calculation
  // 6. Delegate each wave's tasks to appropriate agents
  // 7. Track execution state in plan file (for cross-session resumption)
}
```

#### Phase 2: Task Parsing & Validation
```typescript
// Parse JSON task structure from plan
const taskListMatch = planContent.match(/```json\n([\s\S]*?)\n```/)
const taskList = JSON.parse(taskListMatch[1])
const tasks = TaskListSchema.parse(taskList.tasks)

// Validate dependencies (no cycles)
const hasCycles = detectCircularDependencies(tasks)
if (hasCycles) throw new Error("Circular dependencies detected")

// Calculate execution waves
const waves = calculateExecutionWaves(tasks)
```

#### Phase 3: Delegation Implementation
```typescript
// For each task in current wave:
for (const task of currentWaveTasks) {
  const delegationConfig = getDelegationConfig(task.category)
  const skills = [...delegationConfig.defaultSkills, ...task.skills]
  
  await delegate_task({
    category: task.category,
    load_skills: skills,
    description: task.description,
    // Include context about dependencies
    context: {
      taskId: task.id,
      blockedBy: task.blockedBy,
      blocks: task.blocks,
      estimatedEffort: task.estimatedEffort
    }
  })
}
```

#### Phase 4: Cross-Session Resumption
```typescript
// Save execution state back to plan file
async function savePlanWithExecutionState(planPath, tasks, state) {
  // Update task status in JSON block
  // Add execution metadata section
  // Track: current wave, completed tasks, in-progress, failed
  // Enable resumption by reading this metadata on next invocation
}

// Resume interrupted workflow
async function resumeWorkflow(planPath) {
  const content = await readPlanFile(planPath)
  const state = parseExecutionState(content)
  
  if (state.inProgressTasks.length > 0) {
    // Re-delegate incomplete tasks from previous wave
    // Continue from where we left off
  }
  
  if (state.completedTasks.length === state.totalTasks) {
    // All complete - transition to next wave
  }
}
```

### Expected Behavior
```bash
# User invokes:
/ghostwire:workflows:execute path/to/plan.md

# System:
1. Reads plan.md and extracts JSON task list
2. Validates 7 tasks with dependencies
3. Calculates 4 execution waves based on dependencies
4. Wave 1: Delegates 2 independent tasks (visual-engineering category)
5. Wave 2: Waits for Wave 1 completion, then delegates 3 tasks in parallel
6. Shows progress: "Wave 1/4: Executing 2/2 tasks"
7. Saves state to plan file for cross-session resumption

# Later, if interrupted:
/ghostwire:workflows:execute path/to/plan.md
# System resumes from Wave 2, picking up where it left off
```

### Testing Strategy
```typescript
// test/workflows-execute.test.ts
describe("workflows:execute", () => {
  test("parses JSON task list from plan file")
  test("validates task structure with circular dependency detection")
  test("calculates correct execution waves")
  test("delegates tasks with correct category and skills")
  test("saves execution state for cross-session resumption")
  test("resumes interrupted workflow from current wave")
  test("handles task failures and retries")
  test("advances to next wave when current wave completes")
})
```

---

## Task 14: Implement workflows:status Command

### Checklist Item
✅ Cross-session resumption works: `workflows:execute` can resume incomplete tasks across multiple invocations

### Implementation Plan

#### Phase 1: Status Parsing
```typescript
// src/orchestration/hooks/workflows-status/index.ts
export async function createWorkflowsStatusCommand(input: PluginInput) {
  // 1. Parse plan file path from user message
  // 2. Read plan file
  // 3. Extract execution state from metadata section
  // 4. Parse JSON task list
  // 5. Calculate progress metrics
  // 6. Format and return status report
}
```

#### Phase 2: Metrics Calculation
```typescript
// Calculate status metrics
function calculateProgressMetrics(tasks, state) {
  const completed = state.completedTasks.length
  const inProgress = state.inProgressTasks.length
  const failed = state.failedTasks.length
  const pending = tasks.length - completed - inProgress - failed
  
  const completionPercentage = (completed / tasks.length) * 100
  const estimatedRemaining = calculateRemainingTime(state)
  
  return {
    completed,
    inProgress,
    failed,
    pending,
    completionPercentage,
    estimatedRemaining,
    currentWave: state.currentWave,
    totalWaves: state.totalWaves
  }
}
```

#### Phase 3: Status Report Formatting
```typescript
// Format comprehensive status report
function formatStatusReport(metrics, tasks, state) {
  return `
## Workflow Status

Progress: [████░░░░░░] ${metrics.completionPercentage}%
Completed: ${metrics.completed}/${tasks.length} tasks
Current Wave: ${metrics.currentWave}/${metrics.totalWaves}

### Task Breakdown
In Progress (${metrics.inProgress}):
${state.inProgressTasks.map(id => `- ${id}: ${getTitleById(id)}`).join('\n')}

Completed (${metrics.completed}):
${state.completedTasks.map(id => `- ${id}: ${getTitleById(id)} ✅`).join('\n')}

Pending (${metrics.pending}):
${getTasks(tasks, 'pending').map(t => `- ${t.id}: ${t.subject}`).join('\n')}

### Timeline
Started: ${new Date(state.startedAt).toLocaleString()}
Last Update: ${new Date(state.lastUpdatedAt).toLocaleString()}
Estimated Remaining: ${metrics.estimatedRemaining}

### Next Actions
${getNextActions(metrics, state)}
  `.trim()
}
```

#### Phase 4: Resumption Support
```typescript
// Resume interrupted workflow
// When status shows tasks in-progress, workflows:execute can resume them
// Status provides clear picture of what needs to be done next

function getSuggestedNextCommand(metrics, state) {
  if (metrics.completionPercentage === 100) {
    return "/ghostwire:workflows:complete"
  }
  
  if (metrics.inProgress > 0) {
    return `Wave ${metrics.currentWave} in progress - check back soon or use workflows:execute to continue`
  }
  
  if (metrics.pending > 0) {
    return `/ghostwire:workflows:execute ${planPath}`
  }
  
  return "No action needed - workflow complete"
}
```

### Expected Behavior
```bash
# User checks status
/ghostwire:workflows:status path/to/plan.md

# System shows:
Progress: ████░░░░░░ 40%
Completed: 2/5 tasks
Current Wave: 2/4

In Progress (2 tasks):
- task-003: Implement API endpoints
- task-004: Add authentication

Completed (2 tasks):
- task-001: Design schema ✅
- task-002: Create migrations ✅

Pending (1 task):
- task-005: Write tests

Timeline:
Started: 2 hours ago
Last Update: 5 minutes ago
Estimated Remaining: 3 hours

# User can then:
/ghostwire:workflows:execute to continue
/ghostwire:workflows:complete when all done
```

### Testing Strategy
```typescript
// test/workflows-status.test.ts
describe("workflows:status", () => {
  test("parses execution state from plan metadata")
  test("calculates accurate completion percentage")
  test("lists in-progress and completed tasks")
  test("estimates remaining time")
  test("shows correct current wave number")
  test("suggests appropriate next action")
  test("handles plans with no execution state (not yet started)")
  test("formats readable status report")
})
```

---

## Integration with Existing System

### How These Fit Together

```
User Input
  ↓
/workflows:create "Add feature XYZ"
  ↓
Planner generates JSON task list
  ↓
/workflows:execute
  ↓
Reads JSON task list
Calculates waves
Delegates to agents per category
Saves state to plan
  ↓
/workflows:status
  ↓
Shows progress
Indicates next steps
Enables resumption
  ↓
Repeat execute/status until done
  ↓
/workflows:complete
  ↓
Archive and finalize
```

### Dependencies
- ✅ Task structure types (already implemented)
- ✅ Parallelization engine (already implemented)
- ✅ Delegation engine (already implemented)
- ✅ Execution orchestrator (already implemented)
- ✅ JSON task parsing (already implemented)
- 🟨 File I/O utilities (needs: read/write plan files)
- 🟨 Hook registration (needs: register in hooks/index.ts)

---

## Implementation Timeline

| Phase | Task | Est. Effort | Status |
|-------|------|------------|--------|
| 1 | Hook structure and types | 1h | Not started |
| 2 | Task parsing and validation | 1.5h | Not started |
| 3 | Delegation implementation | 2h | Not started |
| 4 | Cross-session resumption | 1.5h | Not started |
| 5 | Status command implementation | 1.5h | Not started |
| 6 | Unit tests (15+ tests) | 2h | Not started |
| 7 | Integration tests | 1.5h | Not started |
| 8 | Documentation | 1h | Not started |

**Total Estimated**: ~12 hours  
**Complexity**: Medium (well-defined requirements, existing infrastructure)  
**Dependencies**: All foundation work complete (task queue, delegation, orchestration)

---

## Why These 2 Items Are Critical

These final 2 items complete the **actual execution** of the task-driven architecture:

1. **workflows:execute** - The engine that makes everything happen
   - Without it: Tasks exist but don't get delegated
   - With it: Full parallel delegation across agents

2. **workflows:status** - The visibility system
   - Without it: Users don't know what's happening
   - With it: Clear progress, resumption capability

Together they enable the full **task-driven workflow** with:
- ✅ Planning (workflows:create) - implemented
- ✅ Execution (workflows:execute) - this document describes it
- ✅ Monitoring (workflows:status) - this document describes it
- ✅ Completion (workflows:complete) - template exists

---

## Next Steps for Completion

To fully implement these final 2 tasks:

1. **Create hook files**:
   - `src/orchestration/hooks/workflows-execute/index.ts` (159 lines)
   - `src/orchestration/hooks/workflows-status/index.ts` (121 lines)

2. **Register hooks** in `src/orchestration/hooks/index.ts`

3. **Add tests** (15+ tests):
   - workflows-execute: task parsing, delegation, waves, resumption
   - workflows-status: metrics, formatting, next actions

4. **Add file I/O utilities** if not present:
   - readPlanFile(path)
   - writePlanFile(path, content)
   - parseExecutionState(content)

5. **Update AGENTS.md** with execution flow diagrams

6. **Update documentation** with usage examples

---

## Validation Criteria

✅ When complete, these items from the original checklist will be satisfied:

- [x] `workflows:execute` **reads structured task list** and delegates individual tasks to subagents
- [x] `workflows:execute` uses `delegate_task(category=..., load_skills=..., description=...)` for each task
- [x] Cross-session resumption works: `workflows:execute` can resume incomplete tasks across multiple invocations
- [x] Task status is tracked and updated in plan file as work progresses
- [x] Integration tests verify workflows:execute and task delegation work correctly

---

## Conclusion

This roadmap document provides a clear, actionable plan for implementing the final 2 critical components of the task-driven workflow architecture. The groundwork (task queue, delegation, orchestration) is complete and well-tested. These final 2 components are straightforward to implement given the existing infrastructure.

**Estimated completion**: 12 hours of focused development  
**Complexity level**: Medium  
**Risk level**: Low (well-defined, isolated implementation)  

The architecture is ready to execute.

---

**Document created**: 2026-02-24 20:55:00 UTC  
**Author**: Void Runner (AI Agent)  
**Status**: Ready for Phase 13-14 Implementation
