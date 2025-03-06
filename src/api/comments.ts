import { z } from "zod"
import api from "."

export const commentSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  content: z.string(),
  createdDate: z.string(),
  createdBy: z.string()
})

export const addCommentRequestSchema = z.object({
  taskId: z.string(),
  content: z.string(),
  createdBy: z.string()
})

export const commentResponseSchema = z.object({
  data: commentSchema,
  status: z.string(),
  code: z.number(),
  errors: z.null()
})

export const commentsResponseSchema = z.object({
  data: z.array(commentSchema),
  status: z.string(),
  code: z.number(),
  errors: z.array(z.unknown())
})

export const deleteCommentResponseSchema = z.object({
  data: z.null(),
  status: z.string(),
  code: z.number(),
  errors: z.array(z.unknown())
})

export const addComment = async (
  comment: z.infer<typeof addCommentRequestSchema>
): Promise<z.infer<typeof commentResponseSchema>> => {
  const response = await api.post("/comments", comment)
  return commentResponseSchema.parse(response.data)
}

export const deleteComment = async (commentId: string): Promise<void> => {
  await api.delete(`/comments/${commentId}`)
}

export const fetchComments = async (): Promise<z.infer<typeof commentSchema>[]> => {
  const response = await api.get("/comments")
  return commentsResponseSchema.parse(response.data).data
}
