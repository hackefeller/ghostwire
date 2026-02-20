import type { CommandDefinition } from "../claude-code-command-loader";
import type { BuiltinCommandName, BuiltinCommands } from "./types";
import { INIT_DEEP_TEMPLATE } from "./templates/init-deep";
import { RALPH_LOOP_TEMPLATE, CANCEL_RALPH_TEMPLATE } from "./templates/ralph-loop";
import { STOP_CONTINUATION_TEMPLATE } from "./templates/stop-continuation";
import { REFACTOR_TEMPLATE } from "./templates/refactor";
import { START_WORK_TEMPLATE } from "./templates/start-work";
import {
  WORKFLOWS_CREATE_TEMPLATE,
  WORKFLOWS_STATUS_TEMPLATE,
  WORKFLOWS_COMPLETE_TEMPLATE,
  WORKFLOWS_PLAN_TEMPLATE,
} from "./templates/workflows";
import {
  CODE_REFACTOR_TEMPLATE,
  CODE_REVIEW_TEMPLATE,
  CODE_OPTIMIZE_TEMPLATE,
  CODE_FORMAT_TEMPLATE,
} from "./templates/code";
import {
  GIT_SMART_COMMIT_TEMPLATE,
  GIT_BRANCH_TEMPLATE,
  GIT_MERGE_TEMPLATE,
  GIT_CLEANUP_TEMPLATE,
} from "./templates/git";
import {
  PROJECT_INIT_TEMPLATE,
  PROJECT_BUILD_TEMPLATE,
  PROJECT_DEPLOY_TEMPLATE,
  PROJECT_TEST_TEMPLATE,
} from "./templates/project";
import {
  UTIL_CLEAN_TEMPLATE,
  UTIL_BACKUP_TEMPLATE,
  UTIL_RESTORE_TEMPLATE,
  UTIL_DOCTOR_TEMPLATE,
} from "./templates/util";
import {
  DOCS_DEPLOY_DOCS_TEMPLATE,
  DOCS_RELEASE_DOCS_TEMPLATE,
  DOCS_FEATURE_VIDEO_TEMPLATE,
  DOCS_TEST_BROWSER_TEMPLATE,
} from "./templates/docs";

const BUILTIN_COMMAND_DEFINITIONS: Record<BuiltinCommandName, Omit<CommandDefinition, "name">> = {
  "init-deep": {
    description: "(builtin) Initialize hierarchical AGENTS.md knowledge base",
    template: `<command-instruction>
${INIT_DEEP_TEMPLATE}
</command-instruction>

<user-request>
$ARGUMENTS
</user-request>`,
    argumentHint: "[--create-new] [--max-depth=N]",
  },
  "overclock-loop": {
    description: "(builtin) Start self-referential development loop until completion",
    template: `<command-instruction>
${RALPH_LOOP_TEMPLATE}
</command-instruction>

<user-task>
$ARGUMENTS
</user-task>`,
    argumentHint: '"task description" [--completion-promise=TEXT] [--max-iterations=N]',
  },
  "ulw-overclock": {
    description: "(builtin) Start ultrawork loop - continues until completion with ultrawork mode",
    template: `<command-instruction>
${RALPH_LOOP_TEMPLATE}
</command-instruction>

<user-task>
$ARGUMENTS
</user-task>`,
    argumentHint: '"task description" [--completion-promise=TEXT] [--max-iterations=N]',
  },
  "cancel-overclock": {
    description: "(builtin) Cancel active Ralph Loop",
    template: `<command-instruction>
${CANCEL_RALPH_TEMPLATE}
</command-instruction>`,
  },
  refactor: {
    description:
      "(builtin) Intelligent refactoring command with LSP, AST-grep, architecture analysis, codemap, and TDD verification.",
    template: `<command-instruction>
${REFACTOR_TEMPLATE}
</command-instruction>`,
    argumentHint:
      "<refactoring-target> [--scope=<file|module|project>] [--strategy=<safe|aggressive>]",
  },
  "jack-in-work": {
    description: "(builtin) Start void-runner work session from zen-planner plan",
    agent: "grid-sync",
    template: `<command-instruction>
${START_WORK_TEMPLATE}
</command-instruction>

<session-context>
Session ID: $SESSION_ID
Timestamp: $TIMESTAMP
</session-context>

<user-request>
$ARGUMENTS
</user-request>`,
    argumentHint: "[plan-name]",
  },
  "stop-continuation": {
    description:
      "(builtin) Stop all continuation mechanisms (ralph loop, todo continuation, boulder) for this session",
    template: `<command-instruction>
${STOP_CONTINUATION_TEMPLATE}
</command-instruction>`,
  },
  "ghostwire:workflows:plan": {
    description: "(compound) Transform feature descriptions into implementation plans",
    template: `<command-instruction>
${WORKFLOWS_PLAN_TEMPLATE}
</command-instruction>

<feature-description>
$ARGUMENTS
</feature-description>`,
    argumentHint: "[feature description, bug report, or improvement idea]",
  },
  "ghostwire:workflows:create": {
    description: "(compound) Execute plan by breaking into tasks and coordinating implementation",
    template: `<command-instruction>
${WORKFLOWS_CREATE_TEMPLATE}
</command-instruction>

<plan-reference>
$ARGUMENTS
</plan-reference>`,
    argumentHint: "[plan-name or plan-file-path]",
  },
  "ghostwire:workflows:status": {
    description: "(compound) Check status of in-progress workflow or plan",
    template: `<command-instruction>
${WORKFLOWS_STATUS_TEMPLATE}
</command-instruction>

<workflow-reference>
$ARGUMENTS
</workflow-reference>`,
    argumentHint: "[workflow-id or plan-name]",
  },
  "ghostwire:workflows:complete": {
    description: "(compound) Finalize and archive completed workflow",
    template: `<command-instruction>
${WORKFLOWS_COMPLETE_TEMPLATE}
</command-instruction>

<workflow-reference>
$ARGUMENTS
</workflow-reference>`,
    argumentHint: "[workflow-id or plan-name]",
  },
  "ghostwire:code:refactor": {
    description: "(compound) Systematically refactor code while maintaining functionality",
    template: `<command-instruction>
${CODE_REFACTOR_TEMPLATE}
</command-instruction>

<refactoring-target>
$ARGUMENTS
</refactoring-target>`,
    argumentHint: "<target> [--scope=file|module|project] [--strategy=safe|aggressive]",
  },
  "ghostwire:code:review": {
    description: "(compound) Conduct comprehensive code reviews with specialist agents",
    template: `<command-instruction>
${CODE_REVIEW_TEMPLATE}
</command-instruction>

<code-context>
$ARGUMENTS
</code-context>`,
    argumentHint: "[file-path or PR-number] [--type=architecture|security|performance]",
  },
  "ghostwire:code:optimize": {
    description: "(compound) Improve performance, reduce bundle size, or enhance efficiency",
    template: `<command-instruction>
${CODE_OPTIMIZE_TEMPLATE}
</command-instruction>

<optimization-target>
$ARGUMENTS
</optimization-target>`,
    argumentHint: "[target] [--area=algorithmic|memory|cpu|network|build]",
  },
  "ghostwire:code:format": {
    description: "(compound) Apply consistent formatting and style standards",
    template: `<command-instruction>
${CODE_FORMAT_TEMPLATE}
</command-instruction>

<format-scope>
$ARGUMENTS
</format-scope>`,
    argumentHint: "[path-to-format] [--dry-run]",
  },
  "ghostwire:git:smart-commit": {
    description: "(compound) Generate well-structured commits following conventions",
    template: `<command-instruction>
${GIT_SMART_COMMIT_TEMPLATE}
</command-instruction>

<commit-context>
$ARGUMENTS
</commit-context>`,
    argumentHint: '[--message="custom message"]',
  },
  "ghostwire:git:branch": {
    description: "(compound) Create and manage feature branches with naming conventions",
    template: `<command-instruction>
${GIT_BRANCH_TEMPLATE}
</command-instruction>

<branch-context>
$ARGUMENTS
</branch-context>`,
    argumentHint: "[feature-description] [--type=feature|fix|refactor]",
  },
  "ghostwire:git:merge": {
    description: "(compound) Merge branches safely with conflict resolution",
    template: `<command-instruction>
${GIT_MERGE_TEMPLATE}
</command-instruction>

<merge-context>
$ARGUMENTS
</merge-context>`,
    argumentHint: "[branch-name] [--strategy=fast-forward|squash|rebase]",
  },
  "ghostwire:git:cleanup": {
    description: "(compound) Remove stale branches and optimize repository",
    template: `<command-instruction>
${GIT_CLEANUP_TEMPLATE}
</command-instruction>

<cleanup-options>
$ARGUMENTS
</cleanup-options>`,
    argumentHint: "[--days=N] [--dry-run]",
  },
  "ghostwire:project:init": {
    description: "(compound) Initialize new project with structure and tooling",
    template: `<command-instruction>
${PROJECT_INIT_TEMPLATE}
</command-instruction>

<project-context>
$ARGUMENTS
</project-context>`,
    argumentHint: "[project-name] [--type=web|api|library|cli|monorepo]",
  },
  "ghostwire:project:build": {
    description: "(compound) Compile, transpile, and bundle project code",
    template: `<command-instruction>
${PROJECT_BUILD_TEMPLATE}
</command-instruction>

<build-context>
$ARGUMENTS
</build-context>`,
    argumentHint: "[--mode=development|production|staging]",
  },
  "ghostwire:project:deploy": {
    description: "(compound) Deploy project to specified environment",
    template: `<command-instruction>
${PROJECT_DEPLOY_TEMPLATE}
</command-instruction>

<deploy-context>
$ARGUMENTS
</deploy-context>`,
    argumentHint: "[environment] [--strategy=blue-green|canary|standard]",
  },
  "ghostwire:project:test": {
    description: "(compound) Run test suites and measure code coverage",
    template: `<command-instruction>
${PROJECT_TEST_TEMPLATE}
</command-instruction>

<test-context>
$ARGUMENTS
</test-context>`,
    argumentHint: "[--type=unit|integration|e2e|all] [--coverage]",
  },
  "ghostwire:util:clean": {
    description: "(compound) Remove build artifacts and temporary files",
    template: `<command-instruction>
${UTIL_CLEAN_TEMPLATE}
</command-instruction>

<clean-context>
$ARGUMENTS
</clean-context>`,
    argumentHint: "[--level=light|standard|deep|aggressive] [--dry-run]",
  },
  "ghostwire:util:backup": {
    description: "(compound) Create backups of project state and files",
    template: `<command-instruction>
${UTIL_BACKUP_TEMPLATE}
</command-instruction>

<backup-context>
$ARGUMENTS
</backup-context>`,
    argumentHint: "[--type=snapshot|config|database|selective]",
  },
  "ghostwire:util:restore": {
    description: "(compound) Restore project from backup",
    template: `<command-instruction>
${UTIL_RESTORE_TEMPLATE}
</command-instruction>

<restore-context>
$ARGUMENTS
</restore-context>`,
    argumentHint: "[backup-name] [--selective] [--dry-run]",
  },
  "ghostwire:util:doctor": {
    description: "(compound) Diagnose project health and configuration",
    template: `<command-instruction>
${UTIL_DOCTOR_TEMPLATE}
</command-instruction>

<doctor-context>
$ARGUMENTS
</doctor-context>`,
    argumentHint: "[--fix] [--verbose]",
  },
  "ghostwire:docs:deploy-docs": {
    description: "(compound) Build and deploy documentation to hosting",
    template: `<command-instruction>
${DOCS_DEPLOY_DOCS_TEMPLATE}
</command-instruction>

<docs-context>
$ARGUMENTS
</docs-context>`,
    argumentHint: "[--target=github-pages|vercel|netlify|s3] [--version=latest|stable]",
  },
  "ghostwire:docs:release-docs": {
    description: "(compound) Create versioned documentation release",
    template: `<command-instruction>
${DOCS_RELEASE_DOCS_TEMPLATE}
</command-instruction>

<release-context>
$ARGUMENTS
</release-context>`,
    argumentHint: "[version] [--create-migration-guide]",
  },
  "ghostwire:docs:feature-video": {
    description: "(compound) Create demonstration video for feature",
    template: `<command-instruction>
${DOCS_FEATURE_VIDEO_TEMPLATE}
</command-instruction>

<video-context>
$ARGUMENTS
</video-context>`,
    argumentHint: "[feature-name] [--type=demo|tutorial|comparison|tip]",
  },
  "ghostwire:docs:test-browser": {
    description: "(compound) Test documentation in browser environment",
    template: `<command-instruction>
${DOCS_TEST_BROWSER_TEMPLATE}
</command-instruction>

<test-context>
$ARGUMENTS
</test-context>`,
    argumentHint:
      "[--browsers=chrome,firefox,safari] [--test-types=visual,functional,accessibility]",
  },
};

export function loadBuiltinCommands(disabledCommands?: BuiltinCommandName[]): BuiltinCommands {
  const disabled = new Set(disabledCommands ?? []);
  const commands: BuiltinCommands = {};

  for (const [name, definition] of Object.entries(BUILTIN_COMMAND_DEFINITIONS)) {
    if (!disabled.has(name as BuiltinCommandName)) {
      const { argumentHint: _argumentHint, ...openCodeCompatible } = definition;
      commands[name] = { ...openCodeCompatible, name } as CommandDefinition;
    }
  }

  return commands;
}
