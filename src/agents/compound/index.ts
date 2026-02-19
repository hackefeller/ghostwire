// Ghostwire Agents - Unified Export
// This file exports all ghostwire agents integrated into ghostwire plugin

import { createKieranRailsReviewerAgent } from "./review/kieran-rails-reviewer"
import { createKieranPythonReviewerAgent } from "./review/kieran-python-reviewer"
import { createKieranTypeScriptReviewerAgent } from "./review/kieran-typescript-reviewer"
import { createDHHRailsReviewerAgent } from "./review/dhh-rails-reviewer"
import { createCodeSimplicityReviewerAgent } from "./review/code-simplicity-reviewer"
import { createFrameworkDocsResearcherAgent } from "./research/framework-docs-researcher"
import { createLearningsResearcherAgent } from "./research/learnings-researcher"
import { createBestPracticesResearcherAgent } from "./research/best-practices-researcher"
import { createGitHistoryAnalyzerAgent } from "./research/git-history-analyzer"
import { createFigmaDesignSyncAgent } from "./design/figma-design-sync"
import { createDesignImplementationReviewerAgent } from "./design/design-implementation-reviewer"
import { createDesignIteratorAgent } from "./design/design-iterator"
import { createFrontendDesignAgent } from "./design/frontend-design"
import { createSpecFlowAnalyzerAgent } from "./workflow/spec-flow-analyzer"
import { createAgentNativeArchitectureAgent } from "./workflow/agent-native-architecture"
import { createDeploymentVerificationAgent } from "./workflow/deployment-verification-agent"
import { createAnkaneReadmeWriterAgent } from "./docs/ankane-readme-writer"

// Review Agents (5)
export { createKieranRailsReviewerAgent, KIERAN_RAILS_REVIEWER_METADATA } from "./review/kieran-rails-reviewer"
export { createKieranPythonReviewerAgent, KIERAN_PYTHON_REVIEWER_METADATA } from "./review/kieran-python-reviewer"
export { createKieranTypeScriptReviewerAgent, KIERAN_TYPESCRIPT_REVIEWER_METADATA } from "./review/kieran-typescript-reviewer" 
export { createDHHRailsReviewerAgent, DHH_RAILS_REVIEWER_METADATA } from "./review/dhh-rails-reviewer"
export { createCodeSimplicityReviewerAgent, CODE_SIMPLICITY_REVIEWER_METADATA } from "./review/code-simplicity-reviewer"

// Research Agents (4)
export { createFrameworkDocsResearcherAgent, FRAMEWORK_DOCS_RESEARCHER_METADATA } from "./research/framework-docs-researcher"
export { createLearningsResearcherAgent, LEARNINGS_RESEARCHER_METADATA } from "./research/learnings-researcher"
export { createBestPracticesResearcherAgent, BEST_PRACTICES_RESEARCHER_METADATA } from "./research/best-practices-researcher"
export { createGitHistoryAnalyzerAgent, GIT_HISTORY_ANALYZER_METADATA } from "./research/git-history-analyzer"

// Design Agents (4)  
export { createFigmaDesignSyncAgent, FIGMA_DESIGN_SYNC_METADATA } from "./design/figma-design-sync"
export { createDesignImplementationReviewerAgent, DESIGN_IMPLEMENTATION_REVIEWER_METADATA } from "./design/design-implementation-reviewer"
export { createDesignIteratorAgent, DESIGN_ITERATOR_METADATA } from "./design/design-iterator"
export { createFrontendDesignAgent, FRONTEND_DESIGN_METADATA } from "./design/frontend-design"

// Workflow Agents (3)
export { createSpecFlowAnalyzerAgent, SPEC_FLOW_ANALYZER_METADATA } from "./workflow/spec-flow-analyzer"
export { createAgentNativeArchitectureAgent, AGENT_NATIVE_ARCHITECTURE_METADATA } from "./workflow/agent-native-architecture"
export { createDeploymentVerificationAgent, DEPLOYMENT_VERIFICATION_AGENT_METADATA } from "./workflow/deployment-verification-agent"

// Documentation Agents (12) - Simplified implementations following established patterns
export { createAnkaneReadmeWriterAgent, ANKANE_README_WRITER_METADATA } from "./docs/ankane-readme-writer"

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
  // Review Agents
  "grid:kieran-rails-reviewer": createKieranRailsReviewerAgent,
  "grid:kieran-python-reviewer": createKieranPythonReviewerAgent,
  "grid:kieran-typescript-reviewer": createKieranTypeScriptReviewerAgent,
  "grid:dhh-rails-reviewer": createDHHRailsReviewerAgent,
  "grid:code-simplicity-reviewer": createCodeSimplicityReviewerAgent,
  
  // Research Agents  
  "grid:framework-docs-researcher": createFrameworkDocsResearcherAgent,
  "grid:learnings-researcher": createLearningsResearcherAgent,
  "grid:best-practices-researcher": createBestPracticesResearcherAgent,
  "grid:git-history-analyzer": createGitHistoryAnalyzerAgent,
  
  // Design Agents
  "grid:figma-design-sync": createFigmaDesignSyncAgent,
  "grid:design-implementation-reviewer": createDesignImplementationReviewerAgent,
  "grid:design-iterator": createDesignIteratorAgent,
  "grid:frontend-design": createFrontendDesignAgent,
  
  // Workflow Agents
  "grid:spec-flow-analyzer": createSpecFlowAnalyzerAgent,
  "grid:agent-native-architecture": createAgentNativeArchitectureAgent,
  "grid:deployment-verification-agent": createDeploymentVerificationAgent,
  
  // Documentation Agents (12 - showing pattern, full implementation would include all)
  "grid:ankane-readme-writer": createAnkaneReadmeWriterAgent,
  "grid:every-style-editor": createEveryStyleEditorAgent,
  "grid:andrew-kane-gem-writer": createAndrewKaneGemWriterAgent,
  // ... additional 9 documentation agents would follow the same pattern
}
