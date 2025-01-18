import { useQuery } from "@tanstack/react-query"
import { getUserById, UserResponseSchema } from "@/api/members"

export const useGetUserById = (userId: string) => {
  return useQuery<UserResponseSchema, Error>({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId)
  })
}
