import { useQuery } from "@tanstack/react-query"
import {
  getAllUsers,
  getUserById,
  UserGelAllResponseSchema,
  UserResponseSchema
} from "@/api/members"

export const useGetUserById = (userId: string) => {
  return useQuery<UserResponseSchema, Error>({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId)
  })
}

export const useGetAllUsers = () => {
  return useQuery<UserGelAllResponseSchema, Error>({
    queryKey: ["users"],
    queryFn: getAllUsers
  })
}
