import React from "react"
import { WorkspacePage } from "@/pages/dashboard/workspaceDash/WorkspacesDashPage"

export function DashboardPage() {
  return (
    <div className="max-w-screen-lg mx-auto space-y-8 p-6">
      <h1 className="text-3xl font-bold tracking-dark">Dashboard</h1>
      <div className="space-y-2">
        <h3 className="text-3xl font-bold tracking-tight">Workspaces</h3>
        <p className="text-muted-foreground">Manage your workspaces and their details.</p>
      </div>

      {/* Workspaces Section */}
      <div>
        <WorkspacePage />
      </div>
    </div>
    //   {/* User Management Section (Optional) */}
    //   {/* Uncomment this section if needed */}
    //   {/*
    //   <div className="space-y-2">
    //     <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
    //     <p className="text-muted-foreground">Manage your users and their permissions.</p>
    //   </div>
    //   <Card>
    //     <CardHeader>
    //       <CardTitle>Users</CardTitle>
    //       <CardDescription>
    //         A list of all users including their name, email, role, and status.
    //       </CardDescription>
    //     </CardHeader>
    //     <CardContent>
    //       <UserTable />
    //     </CardContent>
    //   </Card>
    //   */}
    // {/* </div> */}
  )
}
