import React, { createContext, useContext, useState, ReactNode, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"

interface Project {
  id: string
  name: string
}

interface WorkspaceContextProps {
  workspaceId: string | null
  setWorkspaceId: (id: string) => void
  refetchMembers: () => void
  pinnedProjects: Project[]
  pinProject: (project: Project) => void
}

const WorkspaceContext = createContext<WorkspaceContextProps | undefined>(undefined)

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [pinnedProjects, setPinnedProjects] = useState<Project[]>([])
  const queryClient = useQueryClient()

  const refetchMembers = useCallback(() => {
    if (workspaceId) {
      queryClient.invalidateQueries({ queryKey: ["workspaceMembers", workspaceId] })
    }
  }, [queryClient, workspaceId])

  const pinProject = (project: Project) => {
    setPinnedProjects((prev) => {
      const existingProject = prev.find((p) => p.id === project.id)
      if (existingProject) {
        // If the project is already pinned, move it to the end of the list
        return [...prev.filter((p) => p.id !== project.id), project]
      } else {
        // Otherwise, add the project to the list
        return [...prev, project]
      }
    })
  }

  return (
    <WorkspaceContext.Provider
      value={{ workspaceId, setWorkspaceId, refetchMembers, pinnedProjects, pinProject }}
    >
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
