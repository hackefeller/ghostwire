// Ghostwire Agents - Unified Export
// This file exports all ghostwire agents integrated into ghostwire plugin

import { createKieranRailsReviewerAgent } from "../reviewer-rails";
import { createKieranPythonReviewerAgent } from "../reviewer-python";
import { createKieranTypeScriptReviewerAgent } from "../reviewer-typescript";
import { createDHHRailsReviewerAgent } from "../reviewer-rails-dh";
import { createCodeSimplicityReviewerAgent } from "../reviewer-simplicity";
import { createFrameworkDocsResearcherAgent } from "../researcher-docs";
import { createLearningsResearcherAgent } from "../researcher-learnings";
import { createBestPracticesResearcherAgent } from "../researcher-practices";
import { createGitHistoryAnalyzerAgent } from "../researcher-git";
import { createFigmaDesignSyncAgent } from "../designer-sync";
import { createDesignImplementationReviewerAgent } from "../analyzer-design";
import { createDesignIteratorAgent } from "../designer-iterator";
import { createFrontendDesignAgent } from "../designer-builder";
import { createSpecFlowAnalyzerAgent } from "../designer-flow";
import { createAgentNativeArchitectureAgent } from "../advisor-architecture";
import { createDeploymentVerificationAgent } from "../validator-deployment";
import { createAnkaneReadmeWriterAgent } from "../writer-readme";
// New agents from export
import { createSecurityReviewerAgent, SECURITY_REVIEWER_METADATA } from "../reviewer-security";
import { createBugValidatorAgent, BUG_VALIDATOR_METADATA } from "../validator-bugs";
import { createDataGuardianAgent, DATA_GUARDIAN_METADATA } from "../guardian-data";
import { createExpertMigrationsAgent, EXPERT_MIGRATIONS_METADATA } from "../expert-migrations";
import { createPRResolverAgent, PR_RESOLVER_METADATA } from "../resolver-pr";
import { createPerformanceOracleAgent, PERFORMANCE_ORACLE_METADATA } from "../oracle-performance";
import { createRacesReviewerAgent, RACES_REVIEWER_METADATA } from "../reviewer-races";
import { createPatternsAnalyzerAgent, PATTERNS_ANALYZER_METADATA } from "../analyzer-patterns";
import { createRepoResearcherAgent, REPO_RESEARCHER_METADATA } from "../researcher-repo";

// Review Agents (5)
export {
  createKieranRailsReviewerAgent,
  KIERAN_RAILS_REVIEWER_METADATA,
} from "../reviewer-rails";
export {
  createKieranPythonReviewerAgent,
  KIERAN_PYTHON_REVIEWER_METADATA,
} from "../reviewer-python";
export {
  createKieranTypeScriptReviewerAgent,
  KIERAN_TYPESCRIPT_REVIEWER_METADATA,
} from "../reviewer-typescript";
export { createDHHRailsReviewerAgent, DHH_RAILS_REVIEWER_METADATA } from "../reviewer-rails-dh";
export {
  createCodeSimplicityReviewerAgent,
  CODE_SIMPLICITY_REVIEWER_METADATA,
} from "../reviewer-simplicity";

// Research Agents (4)
export {
  createFrameworkDocsResearcherAgent,
  FRAMEWORK_DOCS_RESEARCHER_METADATA,
} from "../researcher-docs";
export { createLearningsResearcherAgent, LEARNINGS_RESEARCHER_METADATA } from "../researcher-learnings";
export {
  createBestPracticesResearcherAgent,
  BEST_PRACTICES_RESEARCHER_METADATA,
} from "../researcher-practices";
export { createGitHistoryAnalyzerAgent, GIT_HISTORY_ANALYZER_METADATA } from "../researcher-git";

// Design Agents (4)
export { createFigmaDesignSyncAgent, FIGMA_DESIGN_SYNC_METADATA } from "../designer-sync";
export {
  createDesignImplementationReviewerAgent,
  DESIGN_IMPLEMENTATION_REVIEWER_METADATA,
} from "../analyzer-design";
export { createDesignIteratorAgent, DESIGN_ITERATOR_METADATA } from "../designer-iterator";
export { createFrontendDesignAgent, FRONTEND_DESIGN_METADATA } from "../designer-builder";

// Workflow Agents (3)
export { createSpecFlowAnalyzerAgent, SPEC_FLOW_ANALYZER_METADATA } from "../designer-flow";
export {
  createAgentNativeArchitectureAgent,
  AGENT_NATIVE_ARCHITECTURE_METADATA,
} from "../advisor-architecture";
export {
  createDeploymentVerificationAgent,
  DEPLOYMENT_VERIFICATION_AGENT_METADATA,
} from "../validator-deployment";

// Documentation Agents (12) - Simplified implementations following established patterns
export { createAnkaneReadmeWriterAgent, ANKANE_README_WRITER_METADATA } from "../writer-readme";

// Note: Remaining documentation agents (11) would be implemented following the same pattern
// For now, creating placeholder exports to maintain structure
export const createEditorStyleAgent = (model: string) => ({
  description:
    "Review and edit text content to conform to Every's style guide with systematic line-by-line review",
  model,
  temperature: 0.1,
  prompt: "You are Every's style editor...",
});
export const EDITOR_STYLE_METADATA = {
  category: "documentation",
  cost: "LOW",
  promptAlias: "Every Style Editor",
  triggers: [],
  useWhen: [],
  avoidWhen: [],
};

// Additional documentation agent placeholders...
export const createWriterGemAgent = (model: string) => ({
  description: "Write Ruby gems following Andrew Kane's patterns",
  model,
  temperature: 0.1,
  prompt: "You write Ruby gems...",
});
export const WRITER_GEM_METADATA = {
  category: "documentation",
  cost: "LOW",
  promptAlias: "Andrew Kane Gem Writer",
  triggers: [],
  useWhen: [],
  avoidWhen: [],
};

// Placeholder for remaining 9 documentation agents...
// These would be fully implemented following the same detailed pattern as above

// New Agents (Phase 16) - From Export
export {
  createSecurityReviewerAgent,
  SECURITY_REVIEWER_METADATA,
} from "../reviewer-security";
export { createBugValidatorAgent, BUG_VALIDATOR_METADATA } from "../validator-bugs";
export { createDataGuardianAgent, DATA_GUARDIAN_METADATA } from "../guardian-data";
export {
  createExpertMigrationsAgent,
  EXPERT_MIGRATIONS_METADATA,
} from "../expert-migrations";
export { createPRResolverAgent, PR_RESOLVER_METADATA } from "../resolver-pr";
export {
  createPerformanceOracleAgent,
  PERFORMANCE_ORACLE_METADATA,
} from "../oracle-performance";
export { createRacesReviewerAgent, RACES_REVIEWER_METADATA } from "../reviewer-races";
export {
  createPatternsAnalyzerAgent,
  PATTERNS_ANALYZER_METADATA,
} from "../analyzer-patterns";
export { createRepoResearcherAgent, REPO_RESEARCHER_METADATA } from "../researcher-repo";

// Agent name mappings for registration system
export const COMPOUND_AGENT_MAPPINGS = {
  // Review Agents (Phase 11)
  "void.review-rails": createKieranRailsReviewerAgent,
  "void.review-python": createKieranPythonReviewerAgent,
  "void.review-ts": createKieranTypeScriptReviewerAgent,
  "zen.review-rails": createDHHRailsReviewerAgent,
  "mono.review": createCodeSimplicityReviewerAgent,

  // Research Agents (Phase 12)
  "docs.scan": createFrameworkDocsResearcherAgent,
  "learnings.scan": createLearningsResearcherAgent,
  "best-practices.scan": createBestPracticesResearcherAgent,
  "git.scan": createGitHistoryAnalyzerAgent,

  // Design Agents (Phase 13)
  "figma.sync": createFigmaDesignSyncAgent,
  "design.check": createDesignImplementationReviewerAgent,
  "design.loop": createDesignIteratorAgent,
  "ui.build": createFrontendDesignAgent,

  // Workflow Agents (Phase 14)
  "flow.check": createSpecFlowAnalyzerAgent,
  "agent.arch": createAgentNativeArchitectureAgent,
  "deploy.check": createDeploymentVerificationAgent,

  // Documentation Agents (Phase 15)
  "docs.write-readme": createAnkaneReadmeWriterAgent,
  "editor-style": createEditorStyleAgent,
  "writer-gem": createWriterGemAgent,

  // New Agents (Phase 16) - From Export
  "reviewer-security": createSecurityReviewerAgent,
  "validator-bugs": createBugValidatorAgent,
  "guardian-data": createDataGuardianAgent,
  "expert-migrations": createExpertMigrationsAgent,
  "resolver-pr": createPRResolverAgent,
  "oracle-performance": createPerformanceOracleAgent,
  "reviewer-races": createRacesReviewerAgent,
  "analyzer-patterns": createPatternsAnalyzerAgent,
  "researcher-repo": createRepoResearcherAgent,
};
