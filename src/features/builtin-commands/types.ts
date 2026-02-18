import type { CommandDefinition } from "../claude-code-command-loader"

export type BuiltinCommandName =
  | "init-deep"
  | "ralph-loop"
  | "cancel-ralph"
  | "ulw-loop"
  | "refactor"
  | "start-work"
  | "stop-continuation"
  | "compound:workflows:plan"
  | "compound:workflows:create"
  | "compound:workflows:status"
  | "compound:workflows:complete"
  | "compound:code:refactor"
  | "compound:code:review"
  | "compound:code:optimize"
  | "compound:code:format"
  | "compound:git:smart-commit"
  | "compound:git:branch"
  | "compound:git:merge"
  | "compound:git:cleanup"
  | "compound:project:init"
  | "compound:project:build"
  | "compound:project:deploy"
  | "compound:project:test"
  | "compound:util:clean"
  | "compound:util:backup"
  | "compound:util:restore"
  | "compound:util:doctor"
  | "compound:docs:deploy-docs"
  | "compound:docs:release-docs"
  | "compound:docs:feature-video"
  | "compound:docs:test-browser"

export interface BuiltinCommandConfig {
  disabled_commands?: BuiltinCommandName[]
}

export type BuiltinCommands = Record<string, CommandDefinition>
