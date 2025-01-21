import api from "@/api"
import { useQuery } from "@tanstack/react-query"

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

export interface RoleGetAllResponse {
  data: Role[]
  status: string
  code: number
  errors: []
}

export const fetchRoleDetails = async (roleId: string): Promise<RoleGetResponse> => {
  const response = await api.get<RoleGetResponse>(`/roles/${roleId}`)
  return response.data
}

export const useGetRole = (roleId: string) => {
  return useQuery({
    queryKey: ["role", roleId],
    queryFn: () => fetchRoleDetails(roleId)
  })
}

export const fetchAllRoles = async (): Promise<RoleGetAllResponse> => {
  const response = await api.get<RoleGetAllResponse>("/roles")
  return response.data
}
