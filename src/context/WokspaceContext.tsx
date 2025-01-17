import React, { createContext, useContext, useState, ReactNode } from "react"

interface WorkspaceContextProps {
  workspaceId: string | null
  setWorkspaceId: (id: string) => void
}

const WorkspaceContext = createContext<WorkspaceContextProps | undefined>(undefined)

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)

  return (
    <WorkspaceContext.Provider value={{ workspaceId, setWorkspaceId }}>
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
