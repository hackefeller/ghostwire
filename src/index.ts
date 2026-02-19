import type { Plugin } from "@opencode-ai/plugin";
import {
  createTodoContinuationEnforcer,
  createContextWindowMonitorHook,
  createSessionRecoveryHook,
  createSessionNotification,
  createCommentCheckerHooks,
  createToolOutputTruncatorHook,
  createDirectoryAgentsInjectorHook,
  createDirectoryReadmeInjectorHook,
  createEmptyTaskResponseDetectorHook,
  createThinkModeHook,
  createClaudeCodeHooksHook,
  createAnthropicContextWindowLimitRecoveryHook,
  createCompactionContextInjector,
  createRulesInjectorHook,
  createBackgroundNotificationHook,
  createAutoUpdateCheckerHook,
  createKeywordDetectorHook,
  createAgentUsageReminderHook,
  createNonInteractiveEnvHook,
  createInteractiveBashSessionHook,
  createThinkingBlockValidatorHook,
  createCategorySkillReminderHook,
  createRalphLoopHook,
  createAutoSlashCommandHook,
  createEditErrorRecoveryHook,
  createDelegateTaskRetryHook,
  createTaskResumeInfoHook,
  createStartWorkHook,
  createAtlasHook,
  createAugurPlannerMdOnlyHook,
  createSisyphusJuniorNotepadHook,
  createQuestionLabelTruncatorHook,
  createSubagentQuestionBlockerHook,
  createStopContinuationGuardHook,
} from "./hooks";
import {
  contextCollector,
  createContextInjectorMessagesTransformHook,
} from "./features/context-injector";
import {
  applyAgentVariant,
  resolveAgentVariant,
  resolveVariantForModel,
} from "./shared/agent-variant";
import { createFirstMessageVariantGate } from "./shared/first-message-variant";
import {
  discoverUserClaudeSkills,
  discoverProjectClaudeSkills,
  discoverOpencodeGlobalSkills,
  discoverOpencodeProjectSkills,
  mergeSkills,
} from "./features/opencode-skill-loader";
import { createBuiltinSkills } from "./features/builtin-skills";
import { getSystemMcpServerNames } from "./features/claude-code-mcp-loader";
import {
  setMainSession,
  getMainSessionID,
  setSessionAgent,
  updateSessionAgent,
  clearSessionAgent,
} from "./features/claude-code-session-state";
import {
  builtinTools,
  createCallOmoAgent,
  createBackgroundTools,
  createLookAt,
  createSkillTool,
  createSkillMcpTool,
  createSlashcommandTool,
  discoverCommandsSync,
  sessionExists,
  createDelegateTask,
  interactive_bash,
  startTmuxCheck,
  lspManager,
} from "./tools";
import { BackgroundManager } from "./features/background-agent";
import { SkillMcpManager } from "./features/skill-mcp-manager";
import { initTaskToastManager } from "./features/task-toast-manager";
import { TmuxSessionManager } from "./features/tmux-subagent";
import { clearBoulderState } from "./features/boulder-state";
import { type HookName } from "./config";
import {
  log,
  resetMessageCursor,
  includesCaseInsensitive,
  runHookWithTelemetry,
} from "./shared";
import {
  detectExternalNotificationPlugin,
  getNotificationConflictWarning,
} from "./platform/opencode/external-plugin-detector";
import { hasConnectedProvidersCache } from "./platform/opencode/connected-providers-cache";
import {
  getOpenCodeVersion,
  isOpenCodeVersionAtLeast,
  OPENCODE_NATIVE_AGENTS_INJECTION_VERSION,
} from "./platform/opencode/version";
import { loadPluginConfig } from "./plugin-config";
import { createModelCacheState, getModelLimit } from "./plugin-state";
import { createConfigHandler } from "./platform/opencode/config-composer";

const GhostwirePlugin: Plugin = async (ctx) => {
  log("[GhostwirePlugin] ENTRY - plugin loading", { directory: ctx.directory });
  // Start background tmux check immediately
  startTmuxCheck();

  const pluginConfig = loadPluginConfig(ctx.directory, ctx);
  const disabledHooks = new Set(pluginConfig.disabled_hooks ?? []);
  const firstMessageVariantGate = createFirstMessageVariantGate();

  const tmuxConfig = {
    enabled: pluginConfig.tmux?.enabled ?? false,
    layout: pluginConfig.tmux?.layout ?? "main-vertical",
    main_pane_size: pluginConfig.tmux?.main_pane_size ?? 60,
    main_pane_min_width: pluginConfig.tmux?.main_pane_min_width ?? 120,
    agent_pane_min_width: pluginConfig.tmux?.agent_pane_min_width ?? 40,
  } as const;
  const isHookEnabled = (hookName: HookName) => !disabledHooks.has(hookName);
  const runHook = <T>(
    phase:
      | "chat.message"
      | "tool.execute.before"
      | "tool.execute.after"
      | "event"
      | "experimental.chat.messages.transform",
    hookName: string,
    invoke: () => Promise<T> | T,
  ) =>
    runHookWithTelemetry({
      phase,
      hookName,
      invoke,
    });

  const modelCacheState = createModelCacheState();

  const contextWindowMonitor = isHookEnabled("grid-context-window-monitor")
    ? createContextWindowMonitorHook(ctx)
    : null;
  const sessionRecovery = isHookEnabled("grid-session-recovery")
    ? createSessionRecoveryHook(ctx, {
        experimental: pluginConfig.experimental,
      })
    : null;

  // Check for conflicting notification plugins before creating grid-session-notification
  let sessionNotification = null;
  if (isHookEnabled("grid-session-notification")) {
    const forceEnable = pluginConfig.notification?.force_enable ?? false;
    const externalNotifier = detectExternalNotificationPlugin(ctx.directory);

    if (externalNotifier.detected && !forceEnable) {
      // External notification plugin detected - skip our notification to avoid conflicts
      log(getNotificationConflictWarning(externalNotifier.pluginName!));
      log(
        "grid-session-notification disabled due to external notifier conflict",
        {
          detected: externalNotifier.pluginName,
          allPlugins: externalNotifier.allPlugins,
        },
      );
    } else {
      sessionNotification = createSessionNotification(ctx);
    }
  }

  const commentChecker = isHookEnabled("grid-comment-checker")
    ? createCommentCheckerHooks(pluginConfig.comment_checker)
    : null;
  const toolOutputTruncator = isHookEnabled("grid-tool-output-truncator")
    ? createToolOutputTruncatorHook(ctx, {
        experimental: pluginConfig.experimental,
      })
    : null;
  // Check for native OpenCode AGENTS.md injection support before creating hook
  let directoryAgentsInjector = null;
  if (isHookEnabled("grid-directory-agents-injector")) {
    const currentVersion = getOpenCodeVersion();
    const hasNativeSupport =
      currentVersion !== null &&
      isOpenCodeVersionAtLeast(OPENCODE_NATIVE_AGENTS_INJECTION_VERSION);

    if (hasNativeSupport) {
      log(
        "grid-directory-agents-injector auto-disabled due to native OpenCode support",
        {
          currentVersion,
          nativeVersion: OPENCODE_NATIVE_AGENTS_INJECTION_VERSION,
        },
      );
    } else {
      directoryAgentsInjector = createDirectoryAgentsInjectorHook(ctx);
    }
  }
  const directoryReadmeInjector = isHookEnabled(
    "grid-directory-readme-injector",
  )
    ? createDirectoryReadmeInjectorHook(ctx)
    : null;
  const emptyTaskResponseDetector = isHookEnabled(
    "grid-empty-task-response-detector",
  )
    ? createEmptyTaskResponseDetectorHook(ctx)
    : null;
  const thinkMode = isHookEnabled("grid-think-mode")
    ? createThinkModeHook()
    : null;
  const claudeCodeHooks = createClaudeCodeHooksHook(
    ctx,
    {
      disabledHooks:
        (pluginConfig.claude_code?.hooks ?? true) ? undefined : true,
      keywordDetectorDisabled: !isHookEnabled("grid-keyword-detector"),
    },
    contextCollector,
  );
  const anthropicContextWindowLimitRecovery = isHookEnabled(
    "grid-anthropic-context-window-limit-recovery",
  )
    ? createAnthropicContextWindowLimitRecoveryHook(ctx, {
        experimental: pluginConfig.experimental,
      })
    : null;
  const compactionContextInjector = isHookEnabled(
    "grid-compaction-context-injector",
  )
    ? createCompactionContextInjector()
    : undefined;
  const rulesInjector = isHookEnabled("grid-rules-injector")
    ? createRulesInjectorHook(ctx)
    : null;
  const autoUpdateChecker = isHookEnabled("grid-auto-update-checker")
    ? createAutoUpdateCheckerHook(ctx, {
        showStartupToast: isHookEnabled("grid-startup-toast"),
        isSisyphusEnabled: pluginConfig.cipher_agent?.disabled !== true,
        autoUpdate: pluginConfig.auto_update ?? true,
      })
    : null;
  const keywordDetector = isHookEnabled("grid-keyword-detector")
    ? createKeywordDetectorHook(ctx, contextCollector)
    : null;
  const contextInjectorMessagesTransform =
    createContextInjectorMessagesTransformHook(contextCollector);
  const agentUsageReminder = isHookEnabled("grid-agent-usage-reminder")
    ? createAgentUsageReminderHook(ctx)
    : null;
  const nonInteractiveEnv = isHookEnabled("grid-non-interactive-env")
    ? createNonInteractiveEnvHook(ctx)
    : null;
  const interactiveBashSession = isHookEnabled("grid-interactive-bash-session")
    ? createInteractiveBashSessionHook(ctx)
    : null;

  const thinkingBlockValidator = isHookEnabled("grid-thinking-block-validator")
    ? createThinkingBlockValidatorHook()
    : null;

  const categorySkillReminder = isHookEnabled("grid-category-skill-reminder")
    ? createCategorySkillReminderHook(ctx)
    : null;

  const ralphLoop = isHookEnabled("overclock-loop")
    ? createRalphLoopHook(ctx, {
        config: pluginConfig.ralph_loop,
        checkSessionExists: async (sessionId) => sessionExists(sessionId),
      })
    : null;

  const editErrorRecovery = isHookEnabled("grid-edit-error-recovery")
    ? createEditErrorRecoveryHook(ctx)
    : null;

  const delegateTaskRetry = isHookEnabled("grid-delegate-task-retry")
    ? createDelegateTaskRetryHook(ctx)
    : null;

  const startWork = isHookEnabled("jack-in-work")
    ? createStartWorkHook(ctx)
    : null;

  const augurMdOnly = isHookEnabled("zen-planner-md-only")
    ? createAugurPlannerMdOnlyHook(ctx)
    : null;

  const cipherJuniorNotepad = isHookEnabled("dark-runner-notepad")
    ? createSisyphusJuniorNotepadHook(ctx)
    : null;

  const questionLabelTruncator = createQuestionLabelTruncatorHook();
  const subagentQuestionBlocker = createSubagentQuestionBlockerHook();

  const taskResumeInfo = createTaskResumeInfoHook();

  const tmuxSessionManager = new TmuxSessionManager(ctx, tmuxConfig);

  const backgroundManager = new BackgroundManager(
    ctx,
    pluginConfig.background_task,
    {
      tmuxConfig,
      onSubagentSessionCreated: async (event) => {
        log("[index] onSubagentSessionCreated callback received", {
          sessionID: event.sessionID,
          parentID: event.parentID,
          title: event.title,
        });
        await tmuxSessionManager.onSessionCreated({
          type: "session.created",
          properties: {
            info: {
              id: event.sessionID,
              parentID: event.parentID,
              title: event.title,
            },
          },
        });
        log("[index] onSubagentSessionCreated callback completed");
      },
      onShutdown: () => {
        tmuxSessionManager.cleanup().catch((error) => {
          log("[index] tmux cleanup error during shutdown:", error);
        });
      },
    },
  );

  const nexusHook = isHookEnabled("grid-sync")
    ? createAtlasHook(ctx, { directory: ctx.directory, backgroundManager })
    : null;

  initTaskToastManager(ctx.client);

  const stopContinuationGuard = isHookEnabled("grid-stop-continuation-guard")
    ? createStopContinuationGuardHook(ctx)
    : null;

  const todoContinuationEnforcer = isHookEnabled(
    "grid-todo-continuation-enforcer",
  )
    ? createTodoContinuationEnforcer(ctx, {
        backgroundManager,
        isContinuationStopped: stopContinuationGuard?.isStopped,
      })
    : null;

  if (sessionRecovery && todoContinuationEnforcer) {
    sessionRecovery.setOnAbortCallback(todoContinuationEnforcer.markRecovering);
    sessionRecovery.setOnRecoveryCompleteCallback(
      todoContinuationEnforcer.markRecoveryComplete,
    );
  }

  const backgroundNotificationHook = isHookEnabled(
    "grid-background-notification",
  )
    ? createBackgroundNotificationHook(backgroundManager)
    : null;
  const backgroundTools = createBackgroundTools(backgroundManager, ctx.client);

  const callOmoAgent = createCallOmoAgent(ctx, backgroundManager);
  const isMultimodalLookerEnabled = !includesCaseInsensitive(
    pluginConfig.disabled_agents ?? [],
    "eye-scan",
  );
  const lookAt = isMultimodalLookerEnabled ? createLookAt(ctx) : null;
  const browserProvider =
    pluginConfig.browser_automation_engine?.provider ?? "playwright";
  const delegateTask = createDelegateTask({
    manager: backgroundManager,
    client: ctx.client,
    directory: ctx.directory,
    userCategories: pluginConfig.categories,
    gitMasterConfig: pluginConfig.git_master,
    cipherJuniorModel: pluginConfig.agents?.["dark-runner"]?.model,
    browserProvider,
    onSyncSessionCreated: async (event) => {
      log("[index] onSyncSessionCreated callback", {
        sessionID: event.sessionID,
        parentID: event.parentID,
        title: event.title,
      });
      await tmuxSessionManager.onSessionCreated({
        type: "session.created",
        properties: {
          info: {
            id: event.sessionID,
            parentID: event.parentID,
            title: event.title,
          },
        },
      });
    },
  });
  const disabledSkills = new Set(pluginConfig.disabled_skills ?? []);
  const systemMcpNames = getSystemMcpServerNames();
  const builtinSkills = createBuiltinSkills({ browserProvider }).filter(
    (skill) => {
      if (disabledSkills.has(skill.name as never)) return false;
      if (skill.mcpConfig) {
        for (const mcpName of Object.keys(skill.mcpConfig)) {
          if (systemMcpNames.has(mcpName)) return false;
        }
      }
      return true;
    },
  );
  const includeClaudeSkills = pluginConfig.claude_code?.skills !== false;
  const [userSkills, globalSkills, projectSkills, opencodeProjectSkills] =
    await Promise.all([
      includeClaudeSkills ? discoverUserClaudeSkills() : Promise.resolve([]),
      discoverOpencodeGlobalSkills(),
      includeClaudeSkills ? discoverProjectClaudeSkills() : Promise.resolve([]),
      discoverOpencodeProjectSkills(),
    ]);
  const mergedSkills = mergeSkills(
    builtinSkills,
    pluginConfig.skills,
    userSkills,
    globalSkills,
    projectSkills,
    opencodeProjectSkills,
  );
  const skillMcpManager = new SkillMcpManager();
  const getSessionIDForMcp = () => getMainSessionID() || "";
  const skillTool = createSkillTool({
    skills: mergedSkills,
    mcpManager: skillMcpManager,
    getSessionID: getSessionIDForMcp,
    gitMasterConfig: pluginConfig.git_master,
  });
  const skillMcpTool = createSkillMcpTool({
    manager: skillMcpManager,
    getLoadedSkills: () => mergedSkills,
    getSessionID: getSessionIDForMcp,
  });

  const commands = discoverCommandsSync();
  const slashcommandTool = createSlashcommandTool({
    commands,
    skills: mergedSkills,
  });

  const autoSlashCommand = isHookEnabled("grid-auto-slash-command")
    ? createAutoSlashCommandHook({ skills: mergedSkills })
    : null;

  const configHandler = createConfigHandler({
    ctx: { directory: ctx.directory, client: ctx.client },
    pluginConfig,
    modelCacheState,
  });

  return {
    tool: {
      ...builtinTools,
      ...backgroundTools,
      call_grid_agent: callOmoAgent,
      ...(lookAt ? { look_at: lookAt } : {}),
      delegate_task: delegateTask,
      skill: skillTool,
      skill_mcp: skillMcpTool,
      slashcommand: slashcommandTool,
      interactive_bash,
    },

    "chat.message": async (input, output) => {
      if (input.agent) {
        setSessionAgent(input.sessionID, input.agent);
      }

      const message = (output as { message: { variant?: string } }).message;
      if (firstMessageVariantGate.shouldOverride(input.sessionID)) {
        const variant =
          input.model && input.agent
            ? resolveVariantForModel(pluginConfig, input.agent, input.model)
            : resolveAgentVariant(pluginConfig, input.agent);
        if (variant !== undefined) {
          message.variant = variant;
        }
        firstMessageVariantGate.markApplied(input.sessionID);
      } else {
        if (input.model && input.agent && message.variant === undefined) {
          const variant = resolveVariantForModel(
            pluginConfig,
            input.agent,
            input.model,
          );
          if (variant !== undefined) {
            message.variant = variant;
          }
        } else {
          applyAgentVariant(pluginConfig, input.agent, message);
        }
      }

      await runHook("chat.message", "grid-stop-continuation-guard", () =>
        stopContinuationGuard?.["chat.message"]?.(input),
      );
      await runHook("chat.message", "grid-keyword-detector", () =>
        keywordDetector?.["chat.message"]?.(input, output),
      );
      await runHook("chat.message", "grid-claude-code-hooks", () =>
        claudeCodeHooks["chat.message"]?.(input, output),
      );
      await runHook("chat.message", "grid-auto-slash-command", () =>
        autoSlashCommand?.["chat.message"]?.(input, output),
      );
      await runHook("chat.message", "jack-in-work", () =>
        startWork?.["chat.message"]?.(input, output),
      );

      if (!hasConnectedProvidersCache()) {
        ctx.client.tui
          .showToast({
            body: {
              title: "⚠️ Provider Cache Missing",
              message:
                "Model filtering disabled. RESTART OpenCode to enable full functionality.",
              variant: "warning" as const,
              duration: 6000,
            },
          })
          .catch(() => {});
      }

      if (ralphLoop) {
        const parts = (
          output as { parts?: Array<{ type: string; text?: string }> }
        ).parts;
        const promptText =
          parts
            ?.filter((p) => p.type === "text" && p.text)
            .map((p) => p.text)
            .join("\n")
            .trim() || "";

        const isRalphLoopTemplate =
          promptText.includes("You are starting a Ralph Loop") &&
          promptText.includes("<user-task>");
        const isCancelRalphTemplate = promptText.includes(
          "Cancel the currently active Ralph Loop",
        );

        if (isRalphLoopTemplate) {
          const taskMatch = promptText.match(
            /<user-task>\s*([\s\S]*?)\s*<\/user-task>/i,
          );
          const rawTask = taskMatch?.[1]?.trim() || "";

          const quotedMatch = rawTask.match(/^["'](.+?)["']/);
          const prompt =
            quotedMatch?.[1] ||
            rawTask.split(/\s+--/)[0]?.trim() ||
            "Complete the task as instructed";

          const maxIterMatch = rawTask.match(/--max-iterations=(\d+)/i);
          const promiseMatch = rawTask.match(
            /--completion-promise=["']?([^"'\s]+)["']?/i,
          );

          log("[overclock-loop] Starting loop from chat.message", {
            sessionID: input.sessionID,
            prompt,
          });
          ralphLoop.startLoop(input.sessionID, prompt, {
            maxIterations: maxIterMatch
              ? parseInt(maxIterMatch[1], 10)
              : undefined,
            completionPromise: promiseMatch?.[1],
          });
        } else if (isCancelRalphTemplate) {
          log("[overclock-loop] Cancelling loop from chat.message", {
            sessionID: input.sessionID,
          });
          ralphLoop.cancelLoop(input.sessionID);
        }
      }
    },

    "experimental.chat.messages.transform": async (
      input: Record<string, never>,
      output: { messages: Array<{ info: unknown; parts: unknown[] }> },
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await runHook(
        "experimental.chat.messages.transform",
        "context-injector",
        () =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          contextInjectorMessagesTransform?.[
            "experimental.chat.messages.transform"
          ]?.(input, output as any),
      );
      await runHook(
        "experimental.chat.messages.transform",
        "grid-thinking-block-validator",
        () =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          thinkingBlockValidator?.["experimental.chat.messages.transform"]?.(
            input,
            output as any,
          ),
      );
    },

    config: configHandler,

    event: async (input) => {
      await runHook("event", "grid-auto-update-checker", () =>
        autoUpdateChecker?.event(input),
      );
      await runHook("event", "grid-claude-code-hooks", () =>
        claudeCodeHooks.event(input),
      );
      await runHook("event", "grid-background-notification", () =>
        backgroundNotificationHook?.event(input),
      );
      await runHook("event", "grid-session-notification", () =>
        sessionNotification?.(input),
      );
      await runHook("event", "grid-todo-continuation-enforcer", () =>
        todoContinuationEnforcer?.handler(input),
      );
      await runHook("event", "grid-context-window-monitor", () =>
        contextWindowMonitor?.event(input),
      );
      await runHook("event", "grid-directory-agents-injector", () =>
        directoryAgentsInjector?.event(input),
      );
      await runHook("event", "grid-directory-readme-injector", () =>
        directoryReadmeInjector?.event(input),
      );
      await runHook("event", "grid-rules-injector", () =>
        rulesInjector?.event(input),
      );
      await runHook("event", "grid-think-mode", () => thinkMode?.event(input));
      await runHook(
        "event",
        "grid-anthropic-context-window-limit-recovery",
        () => anthropicContextWindowLimitRecovery?.event(input),
      );
      await runHook("event", "grid-agent-usage-reminder", () =>
        agentUsageReminder?.event(input),
      );
      await runHook("event", "grid-category-skill-reminder", () =>
        categorySkillReminder?.event(input),
      );
      await runHook("event", "grid-interactive-bash-session", () =>
        interactiveBashSession?.event(input),
      );
      await runHook("event", "overclock-loop", () => ralphLoop?.event(input));
      await runHook("event", "grid-stop-continuation-guard", () =>
        stopContinuationGuard?.event(input),
      );
      await runHook("event", "grid-sync", () =>
        nexusHook?.handler(input),
      );

      const { event } = input;
      const props = event.properties as Record<string, unknown> | undefined;

      if (event.type === "session.created") {
        const sessionInfo = props?.info as
          | { id?: string; title?: string; parentID?: string }
          | undefined;
        log("[event] session.created", { sessionInfo, props });
        if (!sessionInfo?.parentID) {
          setMainSession(sessionInfo?.id);
        }
        firstMessageVariantGate.markSessionCreated(sessionInfo);
        await tmuxSessionManager.onSessionCreated(
          event as {
            type: string;
            properties?: {
              info?: { id?: string; parentID?: string; title?: string };
            };
          },
        );
      }

      if (event.type === "session.deleted") {
        const sessionInfo = props?.info as { id?: string } | undefined;
        if (sessionInfo?.id === getMainSessionID()) {
          setMainSession(undefined);
        }
        if (sessionInfo?.id) {
          clearSessionAgent(sessionInfo.id);
          resetMessageCursor(sessionInfo.id);
          firstMessageVariantGate.clear(sessionInfo.id);
          await skillMcpManager.disconnectSession(sessionInfo.id);
          await lspManager.cleanupTempDirectoryClients();
          await tmuxSessionManager.onSessionDeleted({
            sessionID: sessionInfo.id,
          });
        }
      }

      if (event.type === "message.updated") {
        const info = props?.info as Record<string, unknown> | undefined;
        const sessionID = info?.sessionID as string | undefined;
        const agent = info?.agent as string | undefined;
        const role = info?.role as string | undefined;
        if (sessionID && agent && role === "user") {
          updateSessionAgent(sessionID, agent);
        }
      }

      if (event.type === "session.error") {
        const sessionID = props?.sessionID as string | undefined;
        const error = props?.error;

        if (sessionRecovery?.isRecoverableError(error)) {
          const messageInfo = {
            id: props?.messageID as string | undefined,
            role: "assistant" as const,
            sessionID,
            error,
          };
          const recovered =
            await sessionRecovery.handleSessionRecovery(messageInfo);

          if (
            recovered &&
            sessionID &&
            sessionID === getMainSessionID() &&
            !stopContinuationGuard?.isStopped(sessionID)
          ) {
            await ctx.client.session
              .prompt({
                path: { id: sessionID },
                body: { parts: [{ type: "text", text: "continue" }] },
                query: { directory: ctx.directory },
              })
              .catch(() => {});
          }
        }
      }
    },

    "tool.execute.before": async (input, output) => {
      await runHook("tool.execute.before", "subagent-question-blocker", () =>
        subagentQuestionBlocker["tool.execute.before"]?.(input, output),
      );
      await runHook("tool.execute.before", "question-label-truncator", () =>
        questionLabelTruncator["tool.execute.before"]?.(input, output),
      );
      await runHook("tool.execute.before", "grid-claude-code-hooks", () =>
        claudeCodeHooks["tool.execute.before"](input, output),
      );
      await runHook("tool.execute.before", "grid-non-interactive-env", () =>
        nonInteractiveEnv?.["tool.execute.before"](input, output),
      );
      await runHook("tool.execute.before", "grid-comment-checker", () =>
        commentChecker?.["tool.execute.before"](input, output),
      );
      await runHook(
        "tool.execute.before",
        "grid-directory-agents-injector",
        () => directoryAgentsInjector?.["tool.execute.before"]?.(input, output),
      );
      await runHook(
        "tool.execute.before",
        "grid-directory-readme-injector",
        () => directoryReadmeInjector?.["tool.execute.before"]?.(input, output),
      );
      await runHook("tool.execute.before", "grid-rules-injector", () =>
        rulesInjector?.["tool.execute.before"]?.(input, output),
      );
      await runHook("tool.execute.before", "zen-planner-md-only", () =>
        augurMdOnly?.["tool.execute.before"]?.(input, output),
      );
      await runHook("tool.execute.before", "dark-runner-notepad", () =>
        cipherJuniorNotepad?.["tool.execute.before"]?.(input, output),
      );
      await runHook("tool.execute.before", "grid-sync", () =>
        nexusHook?.["tool.execute.before"]?.(input, output),
      );

      if (input.tool === "task") {
        const args = output.args as Record<string, unknown>;
        const subagentType = args.subagent_type as string;
        const isExploreOrLibrarian = includesCaseInsensitive(
          ["scan-ops", "data-dive"],
          subagentType ?? "",
        );

        args.tools = {
          ...(args.tools as Record<string, boolean> | undefined),
          delegate_task: false,
          ...(isExploreOrLibrarian ? { call_grid_agent: false } : {}),
        };
      }

      if (ralphLoop && input.tool === "slashcommand") {
        const args = output.args as { command?: string } | undefined;
        const command = args?.command?.replace(/^\//, "").toLowerCase();
        const sessionID = input.sessionID || getMainSessionID();

        if (command === "overclock-loop" && sessionID) {
          const rawArgs =
            args?.command?.replace(/^\/?(overclock-loop)\s*/i, "") || "";
          const taskMatch = rawArgs.match(/^["'](.+?)["']/);
          const prompt =
            taskMatch?.[1] ||
            rawArgs.split(/\s+--/)[0]?.trim() ||
            "Complete the task as instructed";

          const maxIterMatch = rawArgs.match(/--max-iterations=(\d+)/i);
          const promiseMatch = rawArgs.match(
            /--completion-promise=["']?([^"'\s]+)["']?/i,
          );

          ralphLoop.startLoop(sessionID, prompt, {
            maxIterations: maxIterMatch
              ? parseInt(maxIterMatch[1], 10)
              : undefined,
            completionPromise: promiseMatch?.[1],
          });
        } else if (command === "cancel-overclock" && sessionID) {
          ralphLoop.cancelLoop(sessionID);
        } else if (command === "ulw-overclock" && sessionID) {
          const rawArgs =
            args?.command?.replace(/^\/?(ulw-overclock)\s*/i, "") || "";
          const taskMatch = rawArgs.match(/^["'](.+?)["']/);
          const prompt =
            taskMatch?.[1] ||
            rawArgs.split(/\s+--/)[0]?.trim() ||
            "Complete the task as instructed";

          const maxIterMatch = rawArgs.match(/--max-iterations=(\d+)/i);
          const promiseMatch = rawArgs.match(
            /--completion-promise=["']?([^"'\s]+)["']?/i,
          );

          ralphLoop.startLoop(sessionID, prompt, {
            ultrawork: true,
            maxIterations: maxIterMatch
              ? parseInt(maxIterMatch[1], 10)
              : undefined,
            completionPromise: promiseMatch?.[1],
          });
        }
      }

      if (input.tool === "slashcommand") {
        const args = output.args as { command?: string } | undefined;
        const command = args?.command?.replace(/^\//, "").toLowerCase();
        const sessionID = input.sessionID || getMainSessionID();

        if (command === "stop-continuation" && sessionID) {
          stopContinuationGuard?.stop(sessionID);
          todoContinuationEnforcer?.cancelAllCountdowns();
          ralphLoop?.cancelLoop(sessionID);
          clearBoulderState(ctx.directory);
          log("[stop-continuation] All continuation mechanisms stopped", {
            sessionID,
          });
        }
      }
    },

    "tool.execute.after": async (input, output) => {
      // Guard against undefined output (e.g., from /review command - see issue #1035)
      if (!output) {
        return;
      }
      await runHook("tool.execute.after", "grid-claude-code-hooks", () =>
        claudeCodeHooks["tool.execute.after"](input, output),
      );
      await runHook("tool.execute.after", "grid-tool-output-truncator", () =>
        toolOutputTruncator?.["tool.execute.after"](input, output),
      );
      await runHook("tool.execute.after", "grid-context-window-monitor", () =>
        contextWindowMonitor?.["tool.execute.after"](input, output),
      );
      await runHook("tool.execute.after", "grid-comment-checker", () =>
        commentChecker?.["tool.execute.after"](input, output),
      );
      await runHook(
        "tool.execute.after",
        "grid-directory-agents-injector",
        () => directoryAgentsInjector?.["tool.execute.after"](input, output),
      );
      await runHook(
        "tool.execute.after",
        "grid-directory-readme-injector",
        () => directoryReadmeInjector?.["tool.execute.after"](input, output),
      );
      await runHook("tool.execute.after", "grid-rules-injector", () =>
        rulesInjector?.["tool.execute.after"](input, output),
      );
      await runHook(
        "tool.execute.after",
        "grid-empty-task-response-detector",
        () => emptyTaskResponseDetector?.["tool.execute.after"](input, output),
      );
      await runHook("tool.execute.after", "grid-agent-usage-reminder", () =>
        agentUsageReminder?.["tool.execute.after"](input, output),
      );
      await runHook("tool.execute.after", "grid-category-skill-reminder", () =>
        categorySkillReminder?.["tool.execute.after"](input, output),
      );
      await runHook("tool.execute.after", "grid-interactive-bash-session", () =>
        interactiveBashSession?.["tool.execute.after"](input, output),
      );
      await runHook("tool.execute.after", "grid-edit-error-recovery", () =>
        editErrorRecovery?.["tool.execute.after"](input, output),
      );
      await runHook("tool.execute.after", "grid-delegate-task-retry", () =>
        delegateTaskRetry?.["tool.execute.after"](input, output),
      );
      await runHook("tool.execute.after", "grid-sync", () =>
        nexusHook?.["tool.execute.after"]?.(input, output),
      );
      await runHook("tool.execute.after", "task-resume-info", () =>
        taskResumeInfo["tool.execute.after"](input, output),
      );
    },
  };
};

export default GhostwirePlugin;

export type {
  GhostwireConfig,
  AgentName,
  AgentOverrideConfig,
  AgentOverrides,
  McpName,
  HookName,
  BuiltinCommandName,
} from "./config";

// NOTE: Do NOT export functions from main index.ts!
// OpenCode treats ALL exports as plugin instances and calls them.
// Config error utilities are available via "./shared/config-errors" for internal use only.
export type { ConfigLoadError } from "./shared/config-errors";
