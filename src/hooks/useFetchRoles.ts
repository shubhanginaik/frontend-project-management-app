import { useQuery } from "@tanstack/react-query"
import { fetchRoles, RolesResponse } from "@/api/roles"

export const useFetchRoles = () => {
  return useQuery<RolesResponse, Error>({
    queryKey: ["roles"],
    queryFn: fetchRoles
  })
}
