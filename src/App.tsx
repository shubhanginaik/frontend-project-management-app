import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Home } from "./pages/home/home"
import { Header } from "./components/header/header"
import { Sidebar } from "./components/sidebar/Sidebar"
import { LoginPage } from "./pages/login"
import { DashboardPage } from "./pages/dashboard"
import { RoleManagement } from "./pages/dashboard/role-management"

function App() {
  return (
    <Router>
      <Header />
      <div className="App">
        <Sidebar />
        <div className="main-content">
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/role" element={<RoleManagement />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
