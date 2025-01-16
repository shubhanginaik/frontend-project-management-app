import { NavLink, useLocation } from "react-router-dom"
import { Home, Users } from "lucide-react"
import { FaTrello } from "react-icons/fa"
import "./Sidebar.css"

export function Sidebar() {
  const currentWorkspaceIdDd = sessionStorage.getItem("currentWorkspaceIdDd")

  return (
    <div className="sidebar">
      <h2>Sidebar</h2>

      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            <Home className="sidebar-icon" />
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>
        </li>
        {currentWorkspaceIdDd && (
          <li>
            <NavLink
              to={`/workspaces/${currentWorkspaceIdDd}/members`}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Users className="mr-2 h-4 w-4" />
              Members
            </NavLink>
          </li>
        )}
        <li>
          <h2>Boards</h2>
          <NavLink
            to="/boards"
            className={({ isActive }) => (isActive ? "active sidebar-link" : "sidebar-link")}
          >
            <FaTrello className="sidebar-icon" />
            Boards
          </NavLink>
        </li>
        <li>
          <NavLink to="/role" className={({ isActive }) => (isActive ? "active" : "")}>
            Role Management
          </NavLink>
        </li>
        <li>
          <h2>Your Projects</h2>
          <ul>
            <li>Project A</li>
            <li>Project B</li>
          </ul>
        </li>
      </ul>
    </div>
  )
}
