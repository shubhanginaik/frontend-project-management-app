import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addComment, deleteComment, fetchComments, commentResponseSchema } from "@/api/comments"

export const useComments = (taskId: string) => {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: async () => {
      const allComments = await fetchComments()
      return allComments.filter((comment) => comment.taskId === taskId)
    },
    enabled: !!taskId
  })
}

export const useAddComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addComment,
    onSuccess: (newComment) => {
      // Validate the new comment using the zod schema
      const validatedComment = commentResponseSchema.parse(newComment)
      queryClient.invalidateQueries({ queryKey: ["comments"], validatedComment })
    }
  })
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    }
  })
}
