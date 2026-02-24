# Workflow Stage Diagram & User Journey

## Current State: Confusing Command Names

```
User's mental model:
  
  What do I want?
    ├─ I have a vague idea      → ???  (ultrawork-loop? workflows:plan?)
    ├─ I want to plan it out    → workflows:plan (✓ clear)
    ├─ I want to execute it     → ???  (jack-in-work? workflows:work? ultrawork-loop?)
    └─ I want to review it      → workflows:review (✓ clear)

Problem: Execution phase has TWO confusing options
```

## Proposed State: Clear Workflow Stages

```
User's journey (CLEAR):

Step 1: PLAN (Define what to build)
  └─ /ghostwire:workflows:plan "implement dark mode"
      Output: .ghostwire/plans/implement-dark-mode.md

Step 2: BREAKDOWN (Optional - structure the plan)
  └─ /ghostwire:workflows:breakdown
      Output: Updated plan with tasks/subtasks

Step 3: EXECUTE (Choose your path)
  ├─ PATH A: Execute the plan
  │   └─ /ghostwire:workflows:execute
  │       Reads plan → Executes tasks → Cross-session tracking
  │
  └─ PATH B: Quick ad-hoc work (no plan needed)
      └─ /ghostwire:work:loop "fix this bug"
          Iterative loop → Completion promise → No plan

Step 4: REVIEW (Verify & document)
  ├─ /ghostwire:workflows:review
  ├─ /ghostwire:workflows:learnings
  └─ (optional) Code review, QA, etc.

Step 5: COMPLETE (Wrap up)
  └─ /ghostwire:workflows:complete

Helper Commands:
  ├─ /ghostwire:work:cancel        (Cancel current work loop)
  ├─ /ghostwire:workflows:stop     (Stop all continuation)
  └─ /ghostwire:workflows:status   (Check workflow status)
```

## Command Namespace Visualization

```
/ghostwire/
├── workflows/                    ← Planning & coordinated work
│   ├── plan                      (NEW: Phase 1 - Plan)
│   ├── breakdown                 (NEW: Phase 2 - Breakdown)
│   ├── execute                   (NEW: Phase 3a - Execute planned)
│   ├── review                    (EXISTING: Phase 4 - Review)
│   ├── learnings                 (EXISTING: Phase 4 - Document)
│   ├── complete                  (EXISTING: Phase 5 - Complete)
│   ├── stop                      (NEW: Helper - Stop continuation)
│   └── status                    (EXISTING: Helper - Check status)
│
├── work/                         ← Ad-hoc, exploration, quick tasks
│   ├── loop                      (NEW: Phase 3b - Execute ad-hoc)
│   └── cancel                    (NEW: Helper - Cancel loop)
│
├── git/                          ← Git operations
│   ├── smart-commit
│   ├── branch
│   ├── merge
│   └── cleanup
│
├── code/                         ← Code quality
│   ├── refactor
│   ├── review
│   ├── optimize
│   └── format
│
└── [other namespaces...]
```

## User Decision Tree

```
I want to work on something
    │
    ├─ Do I have a plan?
    │   │
    │   ├─ YES
    │   │   └─ /ghostwire:workflows:execute
    │   │       (Reads plan → Executes tasks → Tracks progress)
    │   │
    │   └─ NO
    │       ├─ Do I want to create one first?
    │       │   │
    │       │   ├─ YES
    │       │   │   └─ /ghostwire:workflows:plan "do this thing"
    │       │   │       └─ Then: /ghostwire:workflows:execute
    │       │   │
    │       │   └─ NO
    │       │       └─ /ghostwire:work:loop "do this thing"
    │       │           (Iterative loop, no plan)
    │       │
    │       └─ For quick fixes or exploration
    │           └─ /ghostwire:work:loop "fix that bug"
    │
    └─ When done, review and complete
        └─ /ghostwire:workflows:review
        └─ /ghostwire:workflows:learnings
        └─ /ghostwire:workflows:complete
```

## Migration Matrix: Old vs New

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        COMMAND RENAMING MATRIX                          │
├──────────────────────┬──────────────────────┬──────────────────┬────────┤
│   OLD COMMAND        │    NEW COMMAND       │  WORKFLOW PHASE  │ STATUS │
├──────────────────────┼──────────────────────┼──────────────────┼────────┤
│ /ghostwire:          │ /ghostwire:          │ Phase 1: Plan    │ KEEP   │
│ workflows:plan       │ workflows:plan       │ (Unchanged)      │ ✓      │
├──────────────────────┼──────────────────────┼──────────────────┼────────┤
│ /ghostwire:          │ /ghostwire:          │ Phase 2:         │ RENAME │
│ workflows:create     │ workflows:breakdown  │ Breakdown        │ [+ALI] │
├──────────────────────┼──────────────────────┼──────────────────┼────────┤
│ /ghostwire:          │ /ghostwire:          │ Phase 3a:        │ RENAME │
│ jack-in-work         │ workflows:execute    │ Execute Planned  │ [+ALI] │
├──────────────────────┼──────────────────────┼──────────────────┼────────┤
│ /ghostwire:          │ /ghostwire:          │ Phase 3b:        │ RENAME │
│ ultrawork-loop       │ work:loop            │ Execute Ad-hoc   │ [+ALI] │
├──────────────────────┼──────────────────────┼──────────────────┼────────┤
│ /ghostwire:          │ /ghostwire:          │ Phase 4: Review  │ KEEP   │
│ workflows:review     │ workflows:review     │ (Unchanged)      │ ✓      │
├──────────────────────┼──────────────────────┼──────────────────┼────────┤
│ /ghostwire:          │ /ghostwire:          │ Phase 4: Docs    │ KEEP   │
│ workflows:learnings  │ workflows:learnings  │ (Unchanged)      │ ✓      │
├──────────────────────┼──────────────────────┼──────────────────┼────────┤
│ /ghostwire:          │ /ghostwire:          │ Phase 5:         │ KEEP   │
│ workflows:complete   │ workflows:complete   │ Complete         │ ✓      │
├──────────────────────┼──────────────────────┼──────────────────┼────────┤
│ /ghostwire:          │ /ghostwire:          │ Helper:          │ RENAME │
│ cancel-ultrawork     │ work:cancel          │ Cancel Loop      │ [+ALI] │
├──────────────────────┼──────────────────────┼──────────────────┼────────┤
│ /ghostwire:          │ /ghostwire:          │ Helper:          │ RENAME │
│ stop-continuation    │ workflows:stop       │ Stop All         │ [+ALI] │
└──────────────────────┴──────────────────────┴──────────────────┴────────┘

Legend:
  KEEP = Command name unchanged
  RENAME = Command renamed, [+ALI] = old name kept as alias for backward compat
```

## Example User Journeys

### Journey 1: Planned Work (Complex Feature)

```
User: "I want to implement authentication with JWT"

Step 1: Create a plan
  /ghostwire:workflows:plan "Add JWT authentication to API"
  ↓
  Agent generates: .ghostwire/plans/add-jwt-auth.md
  [✓] Set up database schema
  [ ] Create auth middleware
  [ ] Add login endpoint
  [ ] Add token refresh logic
  [ ] Write tests

Step 2: Execute the plan
  /ghostwire:workflows:execute
  ↓
  Agent reads plan → Executes tasks → Checks off completed items
  (User can invoke this command multiple times across sessions)

Step 3: Review and document
  /ghostwire:workflows:review
  /ghostwire:workflows:learnings
  ↓
  Agent reviews code changes and documents what was learned

Step 4: Complete workflow
  /ghostwire:workflows:complete
  ↓
  Workflow finalized, state cleaned up
```

### Journey 2: Quick Ad-hoc Work (Bug Fix)

```
User: "Fix this bug quickly"

Path: Skip planning, go straight to work
  /ghostwire:work:loop "Fix the null pointer exception in PaymentService"
  ↓
  Agent iterates until: <promise>DONE</promise>
  ↓
  No plan created, no cross-session tracking needed
  Simple and quick
```

### Journey 3: Mid-workflow Resume (Across Sessions)

```
Session 1: Start execution
  /ghostwire:workflows:execute
  (works on 3 tasks, then stops)

Session 2: Resume from same point
  /ghostwire:workflows:execute
  (picks up where Session 1 left off, reads ultrawork.json)
  (continues with remaining tasks)
```

## Clarity Improvements

### Before (Confusing)

```
User's questions:
  "What does 'jack-in-work' mean?"          ❌ Jargon, unclear
  "Should I use ultrawork-loop or jack-in-work?"  ❌ No guidance
  "What phase am I in?"                      ❌ Not obvious
  "How do I resume a workflow?"               ❌ Not obvious
```

### After (Clear)

```
User's questions:
  "What does 'workflows:execute' mean?"     ✓ Clear: Execute workflow
  "Should I use work:loop or workflows:execute?"  ✓ Clear: Has plan? Use execute. No plan? Use loop.
  "What phase am I in?"                      ✓ Clear: Phase in command name (workflows/work)
  "How do I resume a workflow?"               ✓ Clear: Use workflows:execute again
```

## Benefits of This Naming Scheme

1. **Self-documenting**: Command name tells you the workflow phase
2. **Predictable**: All workflow commands under `workflows:`, all ad-hoc under `work:`
3. **Progressive**: Names guide user from Plan → Breakdown → Execute → Review → Complete
4. **Familiar**: Matches real-world workflow terminology
5. **Flexible**: Keeps both planned and ad-hoc paths clear and separate
6. **Backward compatible**: Old names can work as aliases during transition
