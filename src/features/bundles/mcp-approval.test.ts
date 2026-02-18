/**
 * MCP Approval tests
 */

import { describe, it, expect, beforeEach } from "bun:test"
import { McpApprovalManager, resetMcpApprovalManager } from "./mcp-approval"

describe("McpApprovalManager", () => {
  let manager: McpApprovalManager

  beforeEach(() => {
    resetMcpApprovalManager()
    manager = new McpApprovalManager()
  })

  it("requests approval for MCP server", () => {
    //#given server needing approval
    const approval = manager.requestApproval("test-server", "test-bundle", "Test description")

    //#then pending approval
    expect(approval.serverName).toBe("test-server")
    expect(approval.bundleName).toBe("test-bundle")
    expect(approval.description).toBe("Test description")
    expect(approval.approved).toBe(false)
  })

  it("approves an MCP server", () => {
    //#given pending approval
    manager.requestApproval("test-server", "test-bundle")

    //#when approving
    const approval = manager.approve("test-server", "test-bundle", "user@example.com")

    //#then approved
    expect(approval.approved).toBe(true)
    expect(approval.approvedBy).toBe("user@example.com")
    expect(approval.approvedAt).toBeDefined()
  })

  it("denies an MCP server", () => {
    //#given pending approval
    manager.requestApproval("test-server", "test-bundle")

    //#when denying
    const approval = manager.deny("test-server", "test-bundle", "Security concerns")

    //#then denied
    expect(approval.approved).toBe(false)
    expect(approval.deniedAt).toBeDefined()
    expect(approval.deniedReason).toBe("Security concerns")
  })

  it("checks approval status correctly", () => {
    //#given approved server
    manager.requestApproval("approved-server", "bundle")
    manager.approve("approved-server", "bundle")

    //#and denied server
    manager.requestApproval("denied-server", "bundle")
    manager.deny("denied-server", "bundle")

    //#and pending server
    manager.requestApproval("pending-server", "bundle")

    //#when checking statuses
    expect(manager.isApproved("approved-server", "bundle")).toBe(true)
    expect(manager.isApproved("denied-server", "bundle")).toBe(false)
    expect(manager.isApproved("pending-server", "bundle")).toBe(false)
    expect(manager.isApproved("unknown-server", "bundle")).toBe(false)
  })

  it("returns existing approval if already approved", () => {
    //#given approved server
    manager.requestApproval("test-server", "bundle")
    const firstApproval = manager.approve("test-server", "bundle")
    const approvedAt = firstApproval.approvedAt

    //#when requesting again
    const secondApproval = manager.requestApproval("test-server", "bundle")

    //#then returns existing
    expect(secondApproval.approved).toBe(true)
    expect(secondApproval.approvedAt).toBe(approvedAt)
  })

  it("lists pending approvals", () => {
    //#given mixed approvals
    manager.requestApproval("pending1", "bundle")
    manager.requestApproval("pending2", "bundle")
    manager.approve("approved", "bundle")
    manager.deny("denied", "bundle")

    //#when getting pending
    const pending = manager.getPendingApprovals()

    //#then only pending
    expect(pending.length).toBe(2)
    expect(pending.every((a) => !a.approved && !a.deniedAt)).toBe(true)
  })

  it("lists approved servers", () => {
    //#given mixed approvals
    manager.approve("approved1", "bundle")
    manager.approve("approved2", "bundle")
    manager.requestApproval("pending", "bundle")

    //#when getting approved
    const approved = manager.getApprovedServers()

    //#then only approved
    expect(approved.length).toBe(2)
    expect(approved.every((a) => a.approved)).toBe(true)
  })

  it("lists denied servers", () => {
    //#given mixed approvals
    manager.deny("denied1", "bundle")
    manager.deny("denied2", "bundle")
    manager.approve("approved", "bundle")

    //#when getting denied
    const denied = manager.getDeniedServers()

    //#then only denied
    expect(denied.length).toBe(2)
    expect(denied.every((a) => a.deniedAt)).toBe(true)
  })

  it("revokes previous approval", () => {
    //#given approved server
    manager.approve("test-server", "bundle")
    expect(manager.isApproved("test-server", "bundle")).toBe(true)

    //#when revoking
    const revoked = manager.revokeApproval("test-server", "bundle")

    //#then revoked
    expect(revoked).toBe(true)
    expect(manager.isApproved("test-server", "bundle")).toBe(false)
  })

  it("returns false when revoking unknown approval", () => {
    //#when revoking unknown
    const revoked = manager.revokeApproval("unknown", "bundle")

    //#then false
    expect(revoked).toBe(false)
  })

  it("batch approves multiple servers", () => {
    //#given servers
    const servers = [
      { serverName: "server1", bundleName: "bundle1" },
      { serverName: "server2", bundleName: "bundle1" },
      { serverName: "server3", bundleName: "bundle2" },
    ]

    //#when batch approving
    const approvals = manager.batchApprove(servers, "admin")

    //#then all approved
    expect(approvals.length).toBe(3)
    expect(approvals.every((a) => a.approved)).toBe(true)
    expect(approvals.every((a) => a.approvedBy === "admin")).toBe(true)
  })

  it("provides accurate statistics", () => {
    //#given mixed state
    manager.approve("approved1", "bundle")
    manager.approve("approved2", "bundle")
    manager.requestApproval("pending1", "bundle")
    manager.requestApproval("pending2", "bundle")
    manager.deny("denied", "bundle")

    //#when getting stats
    const stats = manager.getStats()

    //#then accurate
    expect(stats.total).toBe(5)
    expect(stats.approved).toBe(2)
    expect(stats.pending).toBe(2)
    expect(stats.denied).toBe(1)
  })

  it("clears all approvals", () => {
    //#given approvals
    manager.approve("server1", "bundle")
    manager.approve("server2", "bundle")

    //#when clearing
    manager.clear()

    //#then empty
    expect(manager.getStats().total).toBe(0)
    expect(manager.isApproved("server1", "bundle")).toBe(false)
  })

  it("respects approval configuration", () => {
    //#given disabled approval requirement
    const noApprovalManager = new McpApprovalManager({ requireApproval: false })

    //#when checking if required
    expect(noApprovalManager.isApprovalRequired("any-server")).toBe(false)
  })

  it("auto-approves builtins when configured", () => {
    //#given manager with auto-approve
    const autoManager = new McpApprovalManager({
      requireApproval: true,
      autoApproveBuiltins: true,
    })

    //#when checking builtin
    expect(autoManager.isApprovalRequired("builtin-server", true)).toBe(false)

    //#when checking non-builtin
    expect(autoManager.isApprovalRequired("custom-server", false)).toBe(true)
  })
})
