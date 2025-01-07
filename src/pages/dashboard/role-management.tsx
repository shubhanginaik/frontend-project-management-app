import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RoleMatrix } from "../../components/role-matrix"
import { APP_PERMISSION, AppPermission, Role } from "../../types"
import { mockRoles } from "../../lib/role-mock"

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const handleUpdatePermissions = (roleId: string, updatedPermissions: AppPermission[]) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === roleId ? { ...role, permissions: updatedPermissions } : role
      )
    )
  }
  return (
    <Card className="w-full mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Role-Based Permission Matrix
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RoleMatrix roles={roles} onUpdatePermissions={handleUpdatePermissions} />
      </CardContent>
    </Card>
  )
}
