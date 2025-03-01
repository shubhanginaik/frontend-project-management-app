import api from "."

export interface Role {
  id: string
  name: string
}

export interface RolesResponse {
  data: Role[]
  status: string
  code: number
  errors: []
}

export interface Role {
  id: string
  name: string
  createdDate: string
  companyId: string
}

export interface RoleGetResponse {
  data: Role
  status: string
  code: number
  errors: []
}

export const fetchRoleDetails = async (roleId: string): Promise<RoleGetResponse> => {
  const response = await api.get<RoleGetResponse>(`/roles/${roleId}`)
  return response.data
}

export const fetchRoles = async (): Promise<RolesResponse> => {
  const response = await api.get<RolesResponse>("/roles")
  return response.data
}

export const fetchAllRoles = async (): Promise<RolesResponse> => {
  const response = await api.get<RolesResponse>("/roles")
  return response.data
}
