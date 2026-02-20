import { describe, expect, test } from "bun:test";
import { getHookBudgetMs, runHookWithTelemetry } from "./hook-telemetry";

describe("hook telemetry", () => {
  test("uses per-hook override budget when available", () => {
    //#given
    const phase = "tool.execute.after";
    const hookName = "grid-sync";

    //#when
    const budget = getHookBudgetMs(phase, hookName);

    //#then
    expect(budget).toBe(250);
  });

  test("uses phase default budget when no override exists", () => {
    //#given
    const phase = "chat.message";
    const hookName = "grid-keyword-detector";

    //#when
    const budget = getHookBudgetMs(phase, hookName);

    //#then
    expect(budget).toBe(100);
  });

  test("records telemetry and emits warning when over budget", async () => {
    //#given
    const logs: Array<{ message: string; data?: unknown }> = [];
    const nowValues = [100, 240];
    const now = () => nowValues.shift() ?? 240;

    //#when
    await runHookWithTelemetry({
      phase: "tool.execute.before",
      hookName: "grid-keyword-detector",
      invoke: async () => {},
      logger: (message, data) => logs.push({ message, data }),
      now,
    });

    //#then
    expect(logs.length).toBe(2);
    expect(logs[0].message).toContain("[hook-telemetry] tool.execute.before:grid-keyword-detector");
    expect(logs[1].message).toContain(
      "[hook-budget-exceeded] tool.execute.before:grid-keyword-detector",
    );
  });
});
