import { PermissionGroupProps, AppPermission } from "../types"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
export function PermissionGroup({
  groupName,
  permissions,
  role,
  onTogglePermission
}: PermissionGroupProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">{groupName}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {permissions.map((permission) => (
          <div key={permission} className="flex items-center space-x-2">
            <Checkbox
              id={`${role.id}-${permission}`}
              checked={role.permissions.includes(permission)}
              onCheckedChange={() => onTogglePermission(permission)}
            />
            <Label
              htmlFor={`${role.id}-${permission}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {permission}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}
