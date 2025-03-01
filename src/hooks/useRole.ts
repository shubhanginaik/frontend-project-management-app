import { fetchRoleDetails } from "@/api/roles"
import { useQuery } from "@tanstack/react-query"

export const useGetRole = (roleId: string) => {
  return useQuery({
    queryKey: ["role", roleId],
    queryFn: () => fetchRoleDetails(roleId)
  })
}
