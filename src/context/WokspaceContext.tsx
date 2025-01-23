import React, { createContext, useContext, useState, ReactNode, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useAuth } from "./AuthContext"
import { Workspace } from "@/api/WorkspaceUsers"

export interface PinnedProject {
  id: string
  name: string
}

interface WorkspaceContextProps {
  workspaceId: string | null
  setWorkspaceId: (id: string) => void
  refetchMembers: () => void
  pinnedProjects: PinnedProject[]
  pinProject: (project: PinnedProject) => void
  unpinProject: (projectId: string) => void
  projects: ProjectType[]
  workspaces: Workspace[]
}

const WorkspaceContext = createContext<WorkspaceContextProps | undefined>(undefined)

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [pinnedProjects, setPinnedProjects] = useState<PinnedProject[]>([])
  const queryClient = useQueryClient()
  const { workspaces } = useAuth()

  const refetchMembers = useCallback(() => {
    if (workspaceId) {
      queryClient.invalidateQueries({ queryKey: ["workspaceMembers", workspaceId] })
    }
  }, [queryClient, workspaceId])

  const pinProject = (project: PinnedProject) => {
    setPinnedProjects((prev) => {
      if (!prev.some((p) => p.id === project.id)) {
        return [...prev, project]
      }
      return prev
    })
  }

  const unpinProject = (projectId: string) => {
    setPinnedProjects((prev) => prev.filter((p) => p.id !== projectId))
  }

  return (
    <WorkspaceContext.Provider
      value={{
        workspaceId,
        workspaces,
        setWorkspaceId,
        refetchMembers,
        pinnedProjects,
        pinProject,
        unpinProject
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext)
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider")
  }
  return context
}
