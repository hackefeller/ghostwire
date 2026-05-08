import type { Command } from "commander";
import { captureKnowledgeNote } from "./knowledge-capture.js";
import {
  knowledgeStatus,
  listKnowledge,
} from "../../core/project-os/index.js";
import { printOutput } from "./output.js";

export function registerKnowledgeCommands(program: Command): void {
  const knowledge = program
    .command("knowledge")
    .description("Manage project knowledge notes under .kernel/knowledge/notes/");

  knowledge
    .command("new <title>")
    .description("Create a new knowledge note (structured form)")
    .option("--tag <tags>", "Comma-separated tags")
    .option("--work <ids>", "Comma-separated linked work IDs")
    .action(async (title: string, options: { tag?: string; work?: string }) => {
      await captureKnowledgeNote(program, title, options);
    });

  knowledge.command("list").description("List knowledge notes").action(async () => {
    printOutput(await listKnowledge(), program.opts() as { json?: boolean });
  });

  knowledge
    .command("status <id>")
    .description("Show status for a knowledge note")
    .action(async (id: string) => {
      printOutput(await knowledgeStatus(id), program.opts() as { json?: boolean });
    });
}
