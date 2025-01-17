import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom"
import { Home, Users } from "lucide-react"
import { FaTrello } from "react-icons/fa"
import "./Sidebar.css"
import { useAuth } from "@/context/AuthContext"
import { useWorkspace } from "@/context/WokspaceContext"
import { Plus } from "lucide-react"

export function Sidebar() {
  const { workspaceId } = useWorkspace()
  const navigate = useNavigate()

  const handleMembersClick = () => {
    if (workspaceId) {
      navigate(`/workspaces/${workspaceId}/members`)
    } else {
      alert("No workspace ID found")
    }
  }
  //const currentWorkspaceIdDd = sessionStorage.getItem("currentWorkspaceIdDd")

  return (
    <div className="sidebar">
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

        <li>
          <button onClick={handleMembersClick}>workspace Members</button>
        </li>

        <li>
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
