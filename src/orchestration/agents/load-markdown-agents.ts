import { readFileSync, readdirSync } from "fs";
import path from "path";
import { parseFrontmatter } from "../../integration/shared/frontmatter";
import {
  safeValidateAgentMetadata,
  AgentMetadata,
} from "./agent-schema";

/**
 * Agent loaded from markdown file with parsed content
 */
export interface LoadedAgent extends AgentMetadata {
  prompt: string; // Full markdown content (everything after frontmatter)
}

/**
 * Load all markdown agent definitions from a directory
 *
 * Scans the directory for .md files, parses YAML frontmatter,
 * validates metadata, and returns agents in format compatible
 * with createBuiltinAgents()
 *
 * @param agentsDir - Path to directory containing agent .md files
 * @returns Array of loaded agents
 * @throws Error if agent definitions are invalid or duplicate IDs found
 */
export async function loadMarkdownAgents(
  agentsDir: string,
): Promise<LoadedAgent[]> {
  const agents: LoadedAgent[] = [];
  const agentIds = new Set<string>();

  try {
    // Read all files from directory
    const files = readdirSync(agentsDir, { encoding: "utf-8" });

    // Filter for .md files
  const markdownFiles = files.filter((file) => file.endsWith(".md"));

    if (markdownFiles.length === 0) {
      return agents; // No agents found, return empty array
    }

    // Process each markdown file
    for (const filename of markdownFiles) {
      const filePath = path.join(agentsDir, filename);
      let agent: LoadedAgent;

      try {
        agent = loadAgentFromFile(filePath);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        throw new Error(`Error loading agent from ${filename}: ${errorMsg}`);
      }

      // Check for duplicate IDs
      if (agentIds.has(agent.id)) {
        throw new Error(
          `Duplicate agent ID found: "${agent.id}" (in files with different names)`,
        );
      }

      agentIds.add(agent.id);
      agents.push(agent);
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Failed to load markdown agents from ${agentsDir}: ${errorMsg}`,
    );
  }

  return agents;
}

/**
 * Load and parse a single agent markdown file
 *
 * @param filePath - Path to agent .md file
 * @returns Parsed LoadedAgent
 * @throws Error if file is invalid or unreadable
 */
function loadAgentFromFile(filePath: string): LoadedAgent {
  // Read file content
  let content: string;
  try {
    content = readFileSync(filePath, "utf-8");
  } catch (err) {
    throw new Error(
      `Cannot read file: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  // Parse frontmatter and body
    const parsed = parseFrontmatter<Record<string, unknown>>(content);
    if (!parsed.hadFrontmatter) {
      throw new Error("Markdown file is missing YAML frontmatter");
    }
    if (parsed.parseError) {
      throw new Error("Invalid YAML in frontmatter");
    }

  const rawMetadata = parsed.data;
  const body = parsed.body;

  // Validate metadata
  const validation = safeValidateAgentMetadata(rawMetadata);
  if (!validation.success) {
    const issueSummary = validation.error.issues
      .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Metadata validation failed: ${issueSummary}`);
  }

  const metadata: AgentMetadata = validation.data;

  // Ensure markdown body has content
  if (!body.trim()) {
    throw new Error("Markdown body is empty");
  }

  // Return loaded agent with prompt content (body only)
  return {
    ...metadata,
    prompt: body,
  };
}

/**
 * Load agents and handle errors gracefully (for CLI/non-critical paths)
 *
 * @param agentsDir - Path to directory containing agent .md files
 * @returns Array of loaded agents, empty array if errors occur
 */
export async function loadMarkdownAgentsSafe(
  agentsDir: string,
): Promise<LoadedAgent[]> {
  try {
    return await loadMarkdownAgents(agentsDir);
  } catch (err) {
    console.error(
      "Error loading markdown agents:",
      err instanceof Error ? err.message : String(err),
    );
    return [];
  }
}
