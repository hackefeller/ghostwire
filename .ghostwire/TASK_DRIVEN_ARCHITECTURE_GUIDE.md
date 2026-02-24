# Task-Driven Workflow Architecture - Migration Guide

**Version**: 1.0  
**Date**: February 23, 2026  
**Status**: Implementation Complete (Phase 1-6)

## Overview

This guide explains the new task-driven workflow architecture that has been added to Ghostwire. The system enables:

1. **Structured task breakdown** - Plans are decomposed into concrete, JSON-specified tasks
2. **Automatic parallelization** - Task dependencies determine execution waves
3. **Intelligent delegation** - Tasks are routed to appropriate subagents by category
4. **Execution orchestration** - Workflow state is tracked through completion

## What Changed

### New Commands

| Old Command | New Command | Behavior |
|-------------|------------|----------|
| `jack-in-work` | `workflows:execute` | Execute pre-made plan with tasks (old name still works) |
| `ultrawork-loop` | `work:loop` | Continuous execution with retry (old name still works) |
| `cancel-ultrawork` | `work:cancel` | Cancel active loop (old name still works) |
| `stop-continuation` | `workflows:stop` | Stop all continuation (old name still works) |
| N/A | `workflows:create` | **NEW** - Break feature into tasks with JSON structure |
| N/A | `workflows:status` | **NEW** - Check workflow progress |
| N/A | `workflows:complete` | **NEW** - Finalize completed workflow |

**Backward Compatibility**: Old command names still work and route to the same handlers.

### New Task Structure

Tasks now have a standardized JSON structure with delegation metadata:

```json
{
  "id": "task-1",
  "subject": "Task title",
  "description": "Detailed description",
  "category": "visual-engineering | ultrabrain | quick | deep | artistry | writing | unspecified-low | unspecified-high",
  "skills": ["skill1", "skill2"],
  "estimatedEffort": "30m" | "2h",
  "status": "pending | in_progress | completed",
  "blocks": ["task-2", "task-3"],
  "blockedBy": ["task-1"],
  "wave": 1,
  "metadata": { "custom": "values" }
}
```

**Key Fields**:
- `blocks` / `blockedBy` - Define task dependencies
- `category` - Determines which agent type handles the task
- `skills` - Additional skills needed beyond category defaults
- `wave` - Auto-assigned execution wave (1, 2, 3, ...)

### Plan File Format

Plans now embed a JSON task list in a code fence:

```markdown
# Feature: Dark Mode

## Overview
Add dark mode support to the application.

## Workflow Tasks

```json
{
  "plan_id": "plan_123",
  "plan_name": "Feature: Dark Mode",
  "tasks": [
    { "id": "task-1", ... },
    { "id": "task-2", ... }
  ],
  "created_at": "2026-02-23T...",
  "auto_parallelization": true
}
```

## Implementation Details

### Core Modules Added

#### 1. **Task Queue System** (`src/execution/features/task-queue/`)

**Types** (`types.ts`)
- `Task` - Task definition with delegation metadata
- `WorkflowTaskList` - Complete plan structure
- `DelegationCategory` - 8 category enum

**Plan Parser** (`plan-parser.ts`)
- `parsePlanFile()` - Extract JSON from markdown
- `validateTaskDependencies()` - Check for circular deps
- `findTaskDependencies()` - Get blocking tasks

**Parallelization** (`parallelization.ts`)
- `calculateExecutionWaves()` - Kahn's algorithm for topological sort
- `applyAutoWaves()` - Assign waves to tasks
- `applyManualWaves()` - Override with validation
- `estimateExecutionDuration()` - Calculate total time with parallelization

**Delegation Engine** (`delegation-engine.ts`)
- `DELEGATION_CONFIGS` - Category → skills mapping
- `buildTaskDelegationPrompt()` - Create detailed delegation prompt
- `buildTaskDelegationPlan()` - Summarize all delegations

**Execution Orchestrator** (`execution-orchestrator.ts`)
- `ExecutionState` - Track workflow progress
- `initializeExecutionState()` - Create state
- `buildExecutionPlan()` - Organize tasks by wave
- `getExecutionSummary()` - Generate stats

#### 2. **Workflows:Create Hook** (`src/orchestration/hooks/workflows-create/`)

Handles the `workflows:create` command:
1. Extracts feature description from prompt
2. Delegates to planner agent for task breakdown
3. Parses planner response
4. Generates JSON task structure
5. Saves plan file with embedded tasks

### Execution Flow

```
1. User Request
   └─> /workflows:create "Add authentication"

2. workflows-create Hook
   ├─> Extract feature description
   └─> Inject planner delegation prompt

3. Planner Agent (delegated)
   ├─> Analyze feature
   └─> Generate JSON task breakdown

4. Task List Creation
   ├─> Parse task JSON from planner response
   ├─> Apply automatic parallelization (calculateExecutionWaves)
   ├─> Validate all tasks
   └─> Save plan file to .ghostwire/plans/

5. User sees execution plan formatted by wave
```

### Delegation Categories

| Category | Skills | Purpose |
|----------|--------|---------|
| `visual-engineering` | `frontend-ui-ux` | React/Vue, styling, animations |
| `ultrabrain` | (none) | Complex logic, architecture |
| `quick` | (none) | Trivial fixes, typos |
| `deep` | (none) | Thorough analysis, research |
| `artistry` | (none) | Creative solutions |
| `writing` | (none) | Documentation, prose |
| `unspecified-low` | (none) | Fallback for simple work |
| `unspecified-high` | (none) | Fallback for complex work |

## Usage Examples

### Example 1: Create a workflow from feature description

```
/workflows:create

Implement user authentication:
- User registration with email verification
- JWT-based login
- Password reset flow
- Remember me functionality
```

**Result**: Plan file created with 4-5 tasks, dependencies identified, waves calculated.

### Example 2: Execute workflow with automatic parallelization

```
/workflows:execute plans/2026-02-23-authentication.md
```

**Result**: 
- Wave 1: Setup database schema (quick)
- Wave 2: Auth controller + Email service (parallel, ultrabrain)
- Wave 3: Integration tests (deep)

### Example 3: Check workflow status

```
/workflows:status plans/2026-02-23-authentication.md
```

**Result**: Shows completed/pending tasks, estimated time remaining, next executable tasks.

## File Locations

| Item | Location |
|------|----------|
| Task queue module | `src/execution/features/task-queue/` |
| Workflows-create hook | `src/orchestration/hooks/workflows-create/` |
| Tests | `src/execution/features/task-queue/*.test.ts` |
| Integration tests | `src/execution/features/task-queue/integration.test.ts` |
| Example plans | `.ghostwire/plans/` |

## API Reference

### Key Functions

**Parallelization**
```typescript
// Calculate waves based on dependencies
const waveMap = calculateExecutionWaves(tasks);

// Estimate total duration with parallelization
const { perWave, total } = estimateExecutionDuration(tasks);

// Check if task can run
const canRun = canExecuteTask(taskId, tasks, completedIds);
```

**Delegation**
```typescript
// Get delegation config for task
const config = getTaskDelegationConfig(task);

// Build prompt for subagent
const prompt = buildTaskDelegationPrompt(task, context);

// Validate task before delegation
const { valid, errors } = validateTaskForDelegation(task);
```

**Execution**
```typescript
// Initialize workflow state
const state = initializeExecutionState(workflowId, tasks);

// Get next executable tasks
const ready = getNextTasksToExecute(tasks, state);

// Track completion
markTaskCompleted(taskId, state);

// Get progress summary
const summary = getExecutionSummary(state);
```

## Testing

### Test Coverage

- **89 tests total** across 7 files
- **Unit tests**: 82 tests for individual modules
- **Integration tests**: 7 tests for end-to-end workflows
- **Hook tests**: 12 tests for workflows:create command

### Running Tests

```bash
# All task-queue tests
bun test src/execution/features/task-queue/

# Workflows-create hook tests
bun test src/orchestration/hooks/workflows-create/

# Integration tests only
bun test src/execution/features/task-queue/integration.test.ts

# Full test suite
bun test
```

## Design Principles

### 1. Dependency-Driven Parallelization

Tasks specify `blocks` and `blockedBy` arrays. The system automatically:
- Detects circular dependencies
- Calculates optimal execution waves
- Allows manual override with validation

### 2. Category-Based Delegation

Each task specifies a category (visual-engineering, ultrabrain, etc.), which maps to:
- Recommended subagent type
- Default skills (merged with custom skills)
- Execution context and tone

### 3. Mandatory Validation

All tasks must have:
- `id`, `subject`, `description` (required fields)
- Valid `category` (defaults to unspecified-high)
- Valid dependency references (no missing IDs)
- No circular dependencies

### 4. Failure Detection

Execution halts if:
- More than 50% of tasks fail (configurable)
- Unrecoverable error in critical task

## Migration Checklist

For existing Ghostwire projects:

- [x] Command names updated (old names still work)
- [x] Task structure defined and validated
- [x] Parallelization engine implemented
- [x] Delegation engine routing tasks
- [x] Execution orchestrator tracking state
- [x] Workflows:create hook processing features
- [x] Comprehensive tests added (89 tests)
- [x] Build verified (all modules compile)

**No breaking changes** - Old workflows still work with existing command names.

## Future Enhancements

Potential improvements identified:

1. **Task retry logic** - Automatic retry on failure with backoff
2. **Dynamic task creation** - Create new tasks during execution
3. **Custom constraints** - User-defined wave overrides
4. **Progress persistence** - Resume interrupted workflows
5. **Analytics** - Track task duration and agent performance
6. **Template library** - Pre-built task breakdowns for common features

## Troubleshooting

### Issue: "Circular dependency detected"

**Cause**: Task A blocks B, B blocks C, C blocks A.  
**Solution**: Review `blocks`/`blockedBy` arrays. One must be removed.

### Issue: "Invalid delegation category"

**Cause**: Used unsupported category.  
**Solution**: Use one of 8 valid categories. Defaults to `unspecified-high`.

### Issue: Task never executes

**Cause**: Blocked by non-existent task.  
**Solution**: Check `blockedBy` array references valid task IDs.

## References

- **Types**: `src/execution/features/task-queue/types.ts`
- **Algorithms**: `src/execution/features/task-queue/parallelization.ts`
- **Tests**: `src/execution/features/task-queue/*.test.ts`
- **Hook**: `src/orchestration/hooks/workflows-create/`

## Support

For issues or questions:
1. Check test examples in `*.test.ts` files
2. Review integration test for complete workflow example
3. Check AGENTS.md for project conventions

---

**Implementation Status**: ✅ Complete (Phase 1-6)  
**Test Coverage**: ✅ 89 tests passing  
**Build Status**: ✅ All modules compile successfully
