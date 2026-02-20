import type { CommandDefinition } from "../claude-code-command-loader";

export type BuiltinCommandName =
  | "init-deep"
  | "overclock-loop"
  | "cancel-overclock"
  | "ulw-overclock"
  | "refactor"
  | "jack-in-work"
  | "stop-continuation"
  | "ghostwire:workflows:plan"
  | "ghostwire:workflows:create"
  | "ghostwire:workflows:status"
  | "ghostwire:workflows:complete"
  | "ghostwire:code:refactor"
  | "ghostwire:code:review"
  | "ghostwire:code:optimize"
  | "ghostwire:code:format"
  | "ghostwire:git:smart-commit"
  | "ghostwire:git:branch"
  | "ghostwire:git:merge"
  | "ghostwire:git:cleanup"
  | "ghostwire:project:init"
  | "ghostwire:project:build"
  | "ghostwire:project:deploy"
  | "ghostwire:project:test"
  | "ghostwire:util:clean"
  | "ghostwire:util:backup"
  | "ghostwire:util:restore"
  | "ghostwire:util:doctor"
  | "ghostwire:docs:deploy-docs"
  | "ghostwire:docs:release-docs"
  | "ghostwire:docs:feature-video"
  | "ghostwire:docs:test-browser";

export interface BuiltinCommandConfig {
  disabled_commands?: BuiltinCommandName[];
}

export type BuiltinCommands = Record<string, CommandDefinition>;
