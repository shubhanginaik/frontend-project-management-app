import React from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import { Home } from "@/pages/home/home"
import { LoginPage } from "@/pages/login"
import { KanbanBoard } from "@/components/board/kanban-board"
import { DashboardPage } from "@/pages/dashboard"
import { RoleManagement } from "@/pages/dashboard/role-management"
import { BoardsPage } from "@/pages/dashboard/boards/BoardsPage"
import { SignupPage } from "@/pages/signup"
import { CreateWorkspacePage } from "@/pages/dashboard/workspaceDash/CreateWorkspacePage"
import { DefaultWorkspacePage } from "@/pages/dashboard/workspaceDash/DefaultWorkspacePage"
import { WorkspaceDetailsPage } from "@/pages/dashboard/workspaceDash/WorkspaceDetailsPage"
import { Header } from "@/components/header/header"
import { Sidebar } from "@/components/sidebar/Sidebar"
import "./App.css"
import { Profile } from "./components/Profile"
import { Settings } from "./components/Settings"
import { ProjectBoardPage } from "./pages/dashboard/boards/ProjectBoardsPage"

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/default-workspace" element={<DefaultWorkspacePage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
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
        path="/workspaces/:id"
        element={
          <ProtectedRoute>
            <WorkspaceDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/board"
        element={
          <ProtectedRoute>
            <ProjectBoardPage />
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
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export function App() {
  return (
    <AuthProvider>
      <div className="app">
        <div className="header">
          <Header />
        </div>
        <div className="layout">
          <div className="sidebar">
            <Sidebar />
          </div>
          <div className="main-content">
            <AppRoutes />
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}

export default App
