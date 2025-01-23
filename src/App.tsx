import React from "react"
import { Route, Routes, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import { Home } from "@/pages/home/home"
import { WorkspaceProvider } from "@/context/WokspaceContext"
import { LoginPage } from "@/pages/login"
import { DashboardPage } from "@/pages/Dashboard"
import { RoleManagement } from "@/pages/dashboard/role-management"
import { SignupPage } from "@/pages/signup"
import { CreateWorkspacePage } from "@/pages/dashboard/workspaceDash/CreateWorkspacePage"
import { WorkspaceDetailsPage } from "@/pages/dashboard/workspaceDash/WorkspaceDetailsPage"
import { Header } from "@/components/header/header"
import { Sidebar } from "@/components/sidebar/Sidebar"
import "./App.css"
import { Profile } from "./components/Profile"
import { ProjectBoardPage } from "./pages/dashboard/boards/ProjectBoardsPage"
import { MembersPage } from "./pages/dashboard/workspaceDash/members/WorkspaceMembersPage"
import { Toaster } from "./components/ui/toaster"

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
        path="/workspaces/:workspaceId"
        element={
          <ProtectedRoute>
            <WorkspaceDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspaces/:workspaceId/members"
        element={
          <ProtectedRoute>
            <MembersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspaces/:workspaceId/:projectId/projects"
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
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
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
              <Toaster />
            </div>
          </div>
        </div>
      </WorkspaceProvider>
    </AuthProvider>
  )
}

export default App
