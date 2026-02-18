# Run Help

## Examples

```bash
$ bunx ruach run "Fix the bug in index.ts"
$ bunx ruach run --agent Sisyphus "Implement feature X"
$ bunx ruach run --timeout 3600000 "Large refactoring task"
```

## Notes

Unlike `opencode run`, this command waits until:
- All todos are completed or cancelled
- All child sessions (background tasks) are idle
