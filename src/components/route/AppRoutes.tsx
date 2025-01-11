import { Route, Routes, Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Home } from "@/pages/home/home"
import { LoginPage } from "@/pages/login"
import { KanbanBoard } from "../board/kanban-board"
import { DashboardPage } from "@/pages/dashboard"
import { RoleManagement } from "@/pages/dashboard/role-management"
import { BoardsPage } from "@/pages/dashboard/BoardsPage"
import { SignupPage } from "@/pages/signup"
import { CreateWorkspacePage } from "@/pages/dashboard/workspaceDash/createWorkspacePage"

import { DefaultWorkspacePage } from "@/pages/dashboard/workspaceDash/DefaultWorkspacePage"

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/default-workspace" element={<DefaultWorkspacePage />} />
      <Route
        path="/workspaces/:id"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* add the protected routes here */}
      <Route
        path="/create-workspace"
        element={
          <ProtectedRoute>
            <CreateWorkspacePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/board/:id"
        element={
          <ProtectedRoute>
            <KanbanBoard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/role"
        element={
          <ProtectedRoute>
            <RoleManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/boards"
        element={
          <ProtectedRoute>
            <BoardsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
