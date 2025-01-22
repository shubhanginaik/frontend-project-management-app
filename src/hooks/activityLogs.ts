import { ActivitiesResponse, fetchActivityLogs } from "@/api/activities"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"

export const useActivityLogs = (
  entityId: string,
  options?: UseQueryOptions<ActivitiesResponse, Error>
) => {
  return useQuery<ActivitiesResponse, Error>({
    queryKey: ["activityLogs", entityId],
    queryFn: () => fetchActivityLogs(entityId),
    ...options
  })
}
