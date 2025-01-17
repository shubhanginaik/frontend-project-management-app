import api from "@/api"
import { useQuery } from "@tanstack/react-query"

// "data": {
//     "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//     "name": "string",
//     "createdDate": "2025-01-17T05:16:08.438Z",
//     "companyId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
//   },
//   "status": "string",
//   "code": 0,
//   "errors": [
//     {
//       "message": "string",
//       "errorCode": "string"
//     }
//   ]
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

export const useGetRole = (roleId: string) => {
  return useQuery({
    queryKey: ["role", roleId],
    queryFn: () => fetchRoleDetails(roleId)
  })
}
