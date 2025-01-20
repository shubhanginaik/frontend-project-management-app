import api from "."

export interface Comment {
  id: string
  taskId: string
  content: string
  createdBy: string
}

export interface AddCommentRequest {
  taskId: string
  content: string
  createdBy: string
}

export interface CommentResponse {
  data: Comment[]
  status: string
  code: number
  errors: []
}
export interface DeleteCommentResponse {
  data: null
  status: string
  code: number
  errors: []
}

export const addComment = async (comment: Omit<Comment, "id">): Promise<CommentResponse> => {
  const response = await api.post<CommentResponse>("/comments", comment)
  return response.data
}

export const deleteComment = async (commentId: string): Promise<void> => {
  await api.delete(`/comments/${commentId}`)
}

export const fetchComments = async (): Promise<Comment[]> => {
  const response = await api.get<CommentResponse>(`/comments`)
  return response.data.data
}
