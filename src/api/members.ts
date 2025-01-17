import api from "."

export interface CreateUserRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  profileImage: string
  url: string
}

export interface CreateUserResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  Phone: string
  profileImage: string
  url: string
}

export interface UserResponseSchema {
  data: CreateUserResponse
  status: string
  code: number
  errors: []
}

export const createUser = async (data: CreateUserRequest): Promise<UserResponseSchema> => {
  const response = await api.post<UserResponseSchema>("/users", data)
  return response.data
}
