import { useQuery } from "@tanstack/react-query"
import { fetchWorkspaceDetails } from "@/api/WorkspaceUsers"

export const useWorkspaceDetails = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace-details", workspaceId],
    queryFn: () => fetchWorkspaceDetails(workspaceId),
    enabled: !!workspaceId
  })
}
