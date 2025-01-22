import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteUserFromWorkspaceUsers, deleteWorkspaceUserResponse } from "@/api/WorkspaceUsers"

export const useDeleteUserFromWorkspaceUsers = () => {
  const queryClient = useQueryClient()
  return useMutation<deleteWorkspaceUserResponse, Error, string>({
    mutationFn: (id: string) => deleteUserFromWorkspaceUsers(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaceMembers"] })
    }
  })
}
