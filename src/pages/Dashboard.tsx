import React from "react"
import { WorkspacePage } from "@/pages/dashboard/workspaceDash/WorkspacesDashPage"

export function DashboardPage() {
  return (
    <div className="max-w-screen-lg mx-auto space-y-8 p-6">
      <div
        className="dashboard-container"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-dark" style={{ marginBottom: "1rem" }}>
            Dashboard
          </h1>
          <h3 className="text-3xl font-bold tracking-tight">Workspaces</h3>
          <p className="text-muted-foreground">Manage your workspaces and their details.</p>
        </div>
      </div>

      {/* Workspaces Section */}
      <div>
        <WorkspacePage />
      </div>
    </div>
  )
}
