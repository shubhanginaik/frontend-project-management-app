import React, { createContext, useContext, useState, ReactNode, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"

interface WorkspaceContextProps {
  workspaceId: string | null
  setWorkspaceId: (id: string) => void
  refetchMembers: () => void
}

const WorkspaceContext = createContext<WorkspaceContextProps | undefined>(undefined)

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const refetchMembers = useCallback(() => {
    if (workspaceId) {
      queryClient.invalidateQueries({ queryKey: ["workspaceMembers", workspaceId] })
    }
  }, [queryClient, workspaceId])

  return (
    <WorkspaceContext.Provider value={{ workspaceId, setWorkspaceId, refetchMembers }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider")
  }
  return context
}
