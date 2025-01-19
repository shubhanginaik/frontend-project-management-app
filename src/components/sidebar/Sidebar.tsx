import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom"
import { Home } from "lucide-react"
import { FaTrello } from "react-icons/fa"
import "./Sidebar.css"
import { useWorkspace } from "@/context/WokspaceContext"
import { Button } from "../ui/button"

export function Sidebar() {
  const { workspaceId, pinnedProjects } = useWorkspace()
  const navigate = useNavigate()

  const handleMembersClick = () => {
    if (workspaceId) {
      navigate(`/workspaces/${workspaceId}/members`)
    } else {
      alert("No workspace ID found")
    }
  }

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
          <button onClick={handleMembersClick}>Workspace Members</button>
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
          <div className="pinned-projects">
            <div className="flex items-center">
              <FaTrello className="sidebar-icon" />
              <h3 className="ml-2">Boards</h3>
            </div>
            {pinnedProjects.map((project) => (
              <NavLink
                key={project.id}
                to={`/projects/${project.id}`}
                className={({ isActive }) => (isActive ? "active sidebar-link" : "sidebar-link")}
              >
                {project.name}
              </NavLink>
            ))}
          </div>
        </li>
      </ul>
    </div>
  )
}
