import { useMutation } from "@tanstack/react-query"
import {
  AddUserToWorkspaceRequest,
  AddUserToWorkspaceResponse,
  addWorkspaceUserWithRoleRole
} from "@/api/WorkspaceUsers"

export const useAddUserToWorkspace = () => {
  return useMutation<AddUserToWorkspaceResponse, Error, AddUserToWorkspaceRequest>({
    mutationFn: (data: AddUserToWorkspaceRequest) => addWorkspaceUserWithRoleRole(data)
  })
}
