/**
 * MCP Server Approval Workflow
 * 
 * Manages user approval for MCP servers imported from feature bundles.
 * Provides security by requiring explicit user confirmation before activation.
 */

export interface McpServerApproval {
  serverName: string
  bundleName: string
  description?: string
  approved: boolean
  approvedAt?: number
  approvedBy?: string
  deniedAt?: number
  deniedReason?: string
}

export interface McpApprovalConfig {
  requireApproval: boolean
  autoApproveBuiltins: boolean
  persistApprovals: boolean
}

export const DEFAULT_MCP_APPROVAL_CONFIG: McpApprovalConfig = {
  requireApproval: true,
  autoApproveBuiltins: true,
  persistApprovals: true,
}

/**
 * Manages MCP server approvals for imported bundles
 */
export class McpApprovalManager {
  private approvals: Map<string, McpServerApproval> = new Map()
  private config: McpApprovalConfig

  constructor(config: Partial<McpApprovalConfig> = {}) {
    this.config = { ...DEFAULT_MCP_APPROVAL_CONFIG, ...config }
  }

  /**
   * Request approval for an MCP server
   */
  requestApproval(
    serverName: string,
    bundleName: string,
    description?: string
  ): McpServerApproval {
    const key = this.getApprovalKey(serverName, bundleName)
    
    // Check if already approved
    const existing = this.approvals.get(key)
    if (existing?.approved) {
      return existing
    }

    const approval: McpServerApproval = {
      serverName,
      bundleName,
      description,
      approved: false,
    }

    this.approvals.set(key, approval)

    // Generate approval prompt
    const prompt = this.generateApprovalPrompt(approval)
    console.log("[MCP Approval Required]")
    console.log(prompt)

    return approval
  }

  /**
   * Approve an MCP server
   */
  approve(serverName: string, bundleName: string, approvedBy?: string): McpServerApproval {
    const key = this.getApprovalKey(serverName, bundleName)
    const approval = this.approvals.get(key) ?? {
      serverName,
      bundleName,
      approved: false,
    }

    approval.approved = true
    approval.approvedAt = Date.now()
    approval.approvedBy = approvedBy

    this.approvals.set(key, approval)

    console.log(`[MCP Approval] Approved: ${serverName} from ${bundleName}`)

    return approval
  }

  /**
   * Deny an MCP server
   */
  deny(
    serverName: string,
    bundleName: string,
    reason?: string
  ): McpServerApproval {
    const key = this.getApprovalKey(serverName, bundleName)
    const approval = this.approvals.get(key) ?? {
      serverName,
      bundleName,
      approved: false,
    }

    approval.approved = false
    approval.deniedAt = Date.now()
    approval.deniedReason = reason

    this.approvals.set(key, approval)

    console.log(`[MCP Approval] Denied: ${serverName} from ${bundleName}${reason ? ` - ${reason}` : ""}`)

    return approval
  }

  /**
   * Check if an MCP server is approved
   */
  isApproved(serverName: string, bundleName: string): boolean {
    const key = this.getApprovalKey(serverName, bundleName)
    return this.approvals.get(key)?.approved ?? false
  }

  /**
   * Get approval status for an MCP server
   */
  getApproval(serverName: string, bundleName: string): McpServerApproval | undefined {
    const key = this.getApprovalKey(serverName, bundleName)
    return this.approvals.get(key)
  }

  /**
   * Get all pending approvals
   */
  getPendingApprovals(): McpServerApproval[] {
    return Array.from(this.approvals.values()).filter(
      (a) => !a.approved && !a.deniedAt
    )
  }

  /**
   * Get all approved servers
   */
  getApprovedServers(): McpServerApproval[] {
    return Array.from(this.approvals.values()).filter((a) => a.approved)
  }

  /**
   * Get all denied servers
   */
  getDeniedServers(): McpServerApproval[] {
    return Array.from(this.approvals.values()).filter((a) => a.deniedAt)
  }

  /**
   * Revoke a previous approval
   */
  revokeApproval(serverName: string, bundleName: string): boolean {
    const key = this.getApprovalKey(serverName, bundleName)
    const approval = this.approvals.get(key)
    
    if (!approval) return false

    approval.approved = false
    approval.approvedAt = undefined
    approval.approvedBy = undefined

    console.log(`[MCP Approval] Revoked: ${serverName} from ${bundleName}`)
    return true
  }

  /**
   * Check if approval is required for a server
   */
  isApprovalRequired(serverName: string, isBuiltin: boolean = false): boolean {
    if (!this.config.requireApproval) return false
    if (isBuiltin && this.config.autoApproveBuiltins) return false
    return true
  }

  /**
   * Batch approve multiple servers
   */
  batchApprove(
    servers: Array<{ serverName: string; bundleName: string }>,
    approvedBy?: string
  ): McpServerApproval[] {
    return servers.map(({ serverName, bundleName }) =>
      this.approve(serverName, bundleName, approvedBy)
    )
  }

  /**
   * Clear all approvals
   */
  clear(): void {
    this.approvals.clear()
    console.log("[MCP Approval] All approvals cleared")
  }

  /**
   * Get approval statistics
   */
  getStats(): {
    total: number
    approved: number
    pending: number
    denied: number
  } {
    const all = Array.from(this.approvals.values())
    return {
      total: all.length,
      approved: all.filter((a) => a.approved).length,
      pending: all.filter((a) => !a.approved && !a.deniedAt).length,
      denied: all.filter((a) => a.deniedAt).length,
    }
  }

  private getApprovalKey(serverName: string, bundleName: string): string {
    return `${bundleName}:${serverName}`
  }

  private generateApprovalPrompt(approval: McpServerApproval): string {
    const lines = [
      "=".repeat(60),
      "MCP Server Approval Required",
      "=".repeat(60),
      "",
      `Server: ${approval.serverName}`,
      `Bundle: ${approval.bundleName}`,
    ]

    if (approval.description) {
      lines.push(`Description: ${approval.description}`)
    }

    lines.push(
      "",
      "MCP servers can execute code, access files, and make network requests.",
      "Please review the server configuration before approving.",
      "",
      "To approve: Call approveMcpServer()",
      "To deny: Call denyMcpServer()",
      "=".repeat(60)
    )

    return lines.join("\n")
  }
}

// Singleton instance
let globalApprovalManager: McpApprovalManager | null = null

/**
 * Get or create the global MCP approval manager
 */
export function getMcpApprovalManager(config?: Partial<McpApprovalConfig>): McpApprovalManager {
  if (!globalApprovalManager) {
    globalApprovalManager = new McpApprovalManager(config)
  }
  return globalApprovalManager
}

/**
 * Reset the global approval manager (mainly for testing)
 */
export function resetMcpApprovalManager(): void {
  globalApprovalManager = null
}
