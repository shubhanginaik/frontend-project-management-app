import api from "."

export interface activities {
  id: string
  entityType: string
  entityId: string
  action: string
  createdDate: string
  userId: string
}

export interface ActivitiesResponse {
  data: activities[]
  status: string
  code: number
  errors: []
}
export const fetchActivityLogs = async (entityId: string): Promise<ActivitiesResponse> => {
  const response = await api.get<ActivitiesResponse>(`/activity-logs/${entityId}/history`)
  return response.data
}
