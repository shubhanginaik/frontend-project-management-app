import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addComment, deleteComment, fetchComments, Comment, CommentResponse } from "@/api/comments"

export const useComments = (taskId: string) => {
  return useQuery<Comment[], Error>({
    queryKey: ["comments", taskId],
    queryFn: async () => {
      const allComments = await fetchComments()
      return allComments.filter((comment) => comment.taskId === taskId)
    },
    enabled: !!taskId // Only run the query if taskId is provided
  })
}

export const useAddComment = () => {
  const queryClient = useQueryClient()

  return useMutation<CommentResponse, Error, Omit<Comment, "id">>({
    mutationFn: addComment,
    onSuccess: (newComment) => {
      queryClient.invalidateQueries({ queryKey: ["comments"], newComment })
    }
  })
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    }
  })
}
