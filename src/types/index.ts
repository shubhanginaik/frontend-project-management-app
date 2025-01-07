export const APP_PERMISSION = {
  ROLE_CREATE: "ROLE_CREATE",
  ROLE_DELETE: "ROLE_DELETE",
  ROLE_UPDATE: "ROLE_UPDATE",
  ROLE_GET_ALL: "ROLE_GET_ALL",
  PERMISSION_CREATE: "PERMISSION_CREATE",
  PERMISSION_DELETE: "PERMISSION_DELETE",
  PERMISSION_UPDATE: "PERMISSION_UPDATE",
  PERMISSION_GET_ONE: "PERMISSION_GET_ONE",
  PERMISSION_GET_ALL: "PERMISSION_GET_ALL",
  ROLE_PERMISSION_ASSIGN: "ROLE_PERMISSION_ASSIGN",
  ROLE_PERMISSION_UNASSIGNED: "ROLE_PERMISSION_UNASSIGNED",
  TASK_CREATE: "TASK_CREATE",
  TASK_UPDATE: "TASK_UPDATE",
  TASK_DELETE: "TASK_DELETE",
  TASK_GET_ONE: "TASK_GET_ONE",
  TASK_GET_ALL: "TASK_GET_ALL",
  USER_GET_ONE: "USER_GET_ONE",
  USER_GET_ALL: "USER_GET_ALL"
} as const

export type AppPermission = keyof typeof APP_PERMISSION
export type Role = {
  id: string
  name: string
  permissions: AppPermission[]
}

export type RoleMatrixProps = {
  roles: Role[]
  onUpdatePermissions: (roleId: string, updatedPermissions: AppPermission[]) => void
}

export type PermissionGroupProps = {
  groupName: string
  permissions: AppPermission[]
  role: Role
  onTogglePermission: (permission: AppPermission) => void
}
