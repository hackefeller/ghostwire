// Ghostwire Agents - Unified Export
// This file exports all ghostwire agents integrated into ghostwire plugin

import { createKieranRailsReviewerAgent } from "../void-review-rails"
import { createKieranPythonReviewerAgent } from "../void-review-python"
import { createKieranTypeScriptReviewerAgent } from "../void-review-ts"
import { createDHHRailsReviewerAgent } from "../zen-review-rails"
import { createCodeSimplicityReviewerAgent } from "../mono-review"
import { createFrameworkDocsResearcherAgent } from "../docs-scan"
import { createLearningsResearcherAgent } from "../learnings-scan"
import { createBestPracticesResearcherAgent } from "../best-practices-scan"
import { createGitHistoryAnalyzerAgent } from "../git-scan"
import { createFigmaDesignSyncAgent } from "../figma-sync"
import { createDesignImplementationReviewerAgent } from "../design-check"
import { createDesignIteratorAgent } from "../design-loop"
import { createFrontendDesignAgent } from "../ui-build"
import { createSpecFlowAnalyzerAgent } from "../flow-check"
import { createAgentNativeArchitectureAgent } from "../agent-arch"
import { createDeploymentVerificationAgent } from "../deploy-check"
import { createAnkaneReadmeWriterAgent } from "../docs-write-readme"

// Review Agents (5)
export { createKieranRailsReviewerAgent, KIERAN_RAILS_REVIEWER_METADATA } from "../void-review-rails"
export { createKieranPythonReviewerAgent, KIERAN_PYTHON_REVIEWER_METADATA } from "../void-review-python"
export { createKieranTypeScriptReviewerAgent, KIERAN_TYPESCRIPT_REVIEWER_METADATA } from "../void-review-ts"
export { createDHHRailsReviewerAgent, DHH_RAILS_REVIEWER_METADATA } from "../zen-review-rails"
export { createCodeSimplicityReviewerAgent, CODE_SIMPLICITY_REVIEWER_METADATA } from "../mono-review"

// Research Agents (4)
export { createFrameworkDocsResearcherAgent, FRAMEWORK_DOCS_RESEARCHER_METADATA } from "../docs-scan"
export { createLearningsResearcherAgent, LEARNINGS_RESEARCHER_METADATA } from "../learnings-scan"
export { createBestPracticesResearcherAgent, BEST_PRACTICES_RESEARCHER_METADATA } from "../best-practices-scan"
export { createGitHistoryAnalyzerAgent, GIT_HISTORY_ANALYZER_METADATA } from "../git-scan"

// Design Agents (4)
export { createFigmaDesignSyncAgent, FIGMA_DESIGN_SYNC_METADATA } from "../figma-sync"
export { createDesignImplementationReviewerAgent, DESIGN_IMPLEMENTATION_REVIEWER_METADATA } from "../design-check"
export { createDesignIteratorAgent, DESIGN_ITERATOR_METADATA } from "../design-loop"
export { createFrontendDesignAgent, FRONTEND_DESIGN_METADATA } from "../ui-build"

// Workflow Agents (3)
export { createSpecFlowAnalyzerAgent, SPEC_FLOW_ANALYZER_METADATA } from "../flow-check"
export { createAgentNativeArchitectureAgent, AGENT_NATIVE_ARCHITECTURE_METADATA } from "../agent-arch"
export { createDeploymentVerificationAgent, DEPLOYMENT_VERIFICATION_AGENT_METADATA } from "../deploy-check"

// Documentation Agents (12) - Simplified implementations following established patterns
export { createAnkaneReadmeWriterAgent, ANKANE_README_WRITER_METADATA } from "../docs-write-readme"

// Note: Remaining documentation agents (11) would be implemented following the same pattern
// For now, creating placeholder exports to maintain structure
export const createEveryStyleEditorAgent = (model: string) => ({
  description: "Review and edit text content to conform to Every's style guide with systematic line-by-line review",
  model, temperature: 0.1, prompt: "You are Every's style editor...", 
})
export const EVERY_STYLE_EDITOR_METADATA = { category: "documentation", cost: "LOW", promptAlias: "Every Style Editor", triggers: [], useWhen: [], avoidWhen: [] }

// Additional documentation agent placeholders...
export const createAndrewKaneGemWriterAgent = (model: string) => ({ description: "Write Ruby gems following Andrew Kane's patterns", model, temperature: 0.1, prompt: "You write Ruby gems..." })
export const ANDREW_KANE_GEM_WRITER_METADATA = { category: "documentation", cost: "LOW", promptAlias: "Andrew Kane Gem Writer", triggers: [], useWhen: [], avoidWhen: [] }

// Placeholder for remaining 9 documentation agents...
// These would be fully implemented following the same detailed pattern as above

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
  "docs.edit-style": createEveryStyleEditorAgent,
  "docs.write-gem": createAndrewKaneGemWriterAgent,
}
