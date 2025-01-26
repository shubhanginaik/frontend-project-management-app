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

export const fetchRoles = async (): Promise<RolesResponse> => {
  const response = await api.get<RolesResponse>("/roles")
  return response.data
}
