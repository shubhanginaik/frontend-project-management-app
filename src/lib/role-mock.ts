import { APP_PERMISSION, Role } from "../types"
export const mockRoles: Role[] = [
  {
    id: "1",
    name: "Admin",
    permissions: Object.values(APP_PERMISSION)
  },
  {
    id: "2",
    name: "Manager",
    permissions: [
      APP_PERMISSION.TASK_CREATE,
      APP_PERMISSION.TASK_UPDATE,
      APP_PERMISSION.TASK_DELETE,
      APP_PERMISSION.TASK_GET_ONE,
      APP_PERMISSION.TASK_GET_ALL,
      APP_PERMISSION.USER_GET_ONE,
      APP_PERMISSION.USER_GET_ALL
    ]
  },
  {
    id: "3",
    name: "User",
    permissions: [
      APP_PERMISSION.TASK_GET_ONE,
      APP_PERMISSION.TASK_GET_ALL,
      APP_PERMISSION.USER_GET_ONE
    ]
  }
]
export const permissionGroups = [
  {
    name: "Role Management",
    permissions: [
      APP_PERMISSION.ROLE_CREATE,
      APP_PERMISSION.ROLE_DELETE,
      APP_PERMISSION.ROLE_UPDATE,
      APP_PERMISSION.ROLE_GET_ALL
    ]
  },
  {
    name: "Permission Management",
    permissions: [
      APP_PERMISSION.PERMISSION_CREATE,
      APP_PERMISSION.PERMISSION_DELETE,
      APP_PERMISSION.PERMISSION_UPDATE,
      APP_PERMISSION.PERMISSION_GET_ONE,
      APP_PERMISSION.PERMISSION_GET_ALL
    ]
  },
  {
    name: "Role-Permission Management",
    permissions: [APP_PERMISSION.ROLE_PERMISSION_ASSIGN, APP_PERMISSION.ROLE_PERMISSION_UNASSIGNED]
  },
  {
    name: "Task Management",
    permissions: [
      APP_PERMISSION.TASK_CREATE,
      APP_PERMISSION.TASK_UPDATE,
      APP_PERMISSION.TASK_DELETE,
      APP_PERMISSION.TASK_GET_ONE,
      APP_PERMISSION.TASK_GET_ALL
    ]
  },
  {
    name: "User Management",
    permissions: [APP_PERMISSION.USER_GET_ONE, APP_PERMISSION.USER_GET_ALL]
  }
]
