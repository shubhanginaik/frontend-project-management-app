import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addComment, deleteComment, fetchComments, commentResponseSchema } from "@/api/comments"
import { toast } from "@/components/ui/use-toast"

export const useComments = (taskId: string) => {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: async () => {
      const allComments = await fetchComments()

      if (!Array.isArray(allComments)) {
        return []
      }

      const filteredComments = allComments.filter((comment) => {
        return comment.taskId === taskId
      })

      return filteredComments
    },
    enabled: !!taskId // Make sure this is true when taskId is valid
  })
}

export const useAddComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addComment,
    onSuccess: (newComment) => {
      try {
        const validatedComment = commentResponseSchema.parse(newComment)

        queryClient.invalidateQueries({ queryKey: ["comments", validatedComment.data.taskId] })
      } catch (error) {
        console.error("Validation failed:", error)
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment. Please try again.",
        variant: "destructive"
      })
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
