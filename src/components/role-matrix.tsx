import { AppPermission, RoleMatrixProps } from "../types"
import { PermissionGroup } from "./permission-group"
import { mockRoles } from "../lib/role-mock"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
export function RoleMatrix({ roles, onUpdatePermissions }: RoleMatrixProps) {
  const handleTogglePermission = (roleId: string, permission: AppPermission) => {
    const role = roles.find((r) => r.id === roleId)
    if (role) {
      const updatedPermissions = role.permissions.includes(permission)
        ? role.permissions.filter((p) => p !== permission)
        : [...role.permissions, permission]
      onUpdatePermissions(roleId, updatedPermissions)
    }
  }
  return (
    <Tabs defaultValue={roles[0].id} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        {roles.map((role) => (
          <TabsTrigger key={role.id} value={role.id}>
            {role.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {roles.map((role) => (
        <TabsContent key={role.id} value={role.id}>
          <div className="space-y-6">
            {mockRoles.map((group) => (
              <PermissionGroup
                key={group.name}
                groupName={group.name}
                permissions={group.permissions}
                role={role}
                onTogglePermission={(permission) => handleTogglePermission(role.id, permission)}
              />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
