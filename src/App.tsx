import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Home } from "./pages/home/home"
import { Header } from "./components/header/header"
import { Sidebar } from "./components/sidebar/Sidebar"
import { LoginPage } from "./pages/login"
import { DashboardPage } from "./pages/dashboard"
import { RoleManagement } from "./pages/dashboard/role-management"
import { KanbanBoard } from "./components/board/kanban-board"
import { BoardsPage } from "./pages/dashboard/BoardsPage"
import "./App.css"

function App() {
  return (
    <Router>
      <Header />
      <div className="app">
        <div className="sidebar-content">
          <Sidebar />
        </div>
        <div className="main-content">
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/board/:id" element={<KanbanBoard />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/role" element={<RoleManagement />} />
            <Route path="/boards" element={<BoardsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
