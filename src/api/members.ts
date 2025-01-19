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

export interface UserGelAllResponseSchema {
  data: CreateUserResponse[]
  status: string
  code: number
  errors: []
}

export const createUser = async (data: CreateUserRequest): Promise<UserResponseSchema> => {
  const response = await api.post<UserResponseSchema>("/users", data)
  return response.data
}
export interface DeleteUserResponse {
  data: Record<string, never>
  status: string
  code: number
  errors: []
}

export const getUserById = async (userId: string): Promise<UserResponseSchema> => {
  const response = await api.get<UserResponseSchema>(`/users/${userId}`)
  return response.data
}

export const deleteUserById = async (userId: string): Promise<DeleteUserResponse> => {
  const response = await api.delete<DeleteUserResponse>(`/users/${userId}`)
  return response.data
}

export const getAllUsers = async (): Promise<UserGelAllResponseSchema> => {
  const response = await api.get<UserGelAllResponseSchema>("/users")
  return response.data
}
