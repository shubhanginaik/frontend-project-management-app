import { createUser, CreateUserRequest, UserResponseSchema } from "@/api/members"
import { useMutation } from "@tanstack/react-query"

export const useCreateMember = () => {
  return useMutation<UserResponseSchema, Error, CreateUserRequest>({
    mutationFn: (data: CreateUserRequest) => createUser(data)
  })
}
