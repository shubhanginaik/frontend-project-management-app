import { NavLink, useNavigate } from "react-router-dom"
import { Home } from "lucide-react"
import { FaTrello } from "react-icons/fa"
import "./Sidebar.css"
import { useWorkspace } from "@/context/WokspaceContext"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function Sidebar() {
  const { workspaceId, pinnedProjects, unpinProject } = useWorkspace()
  const navigate = useNavigate()

  const handleUnpinProject = (projectId: string) => {
    unpinProject(projectId)
  }

  const handleMembersClick = () => {
    if (workspaceId) {
      navigate(`/workspaces/${workspaceId}/members`)
    } else {
      console.error("No workspace found")
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
          <div className="pinned-projects">
            <div className="flex items-center">
              <FaTrello className="sidebar-icon" />
              <h3 className="ml-2">Boards</h3>
            </div>
            {pinnedProjects.map((project) => (
              <Card key={project.id} className="card mb-4">
                <CardHeader className="card-header flex justify-between items-center">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <CardTitle className="card-title">{project.name}</CardTitle>
                      <CardDescription className="card-description"></CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="close-button"
                      onClick={() => handleUnpinProject(project.id)}
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="card-content">
                  <Button
                    className="view-project-button"
                    onClick={() => navigate(`/workspaces/${workspaceId}/${project.id}/projects`)}
                  >
                    View Board
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </li>
      </ul>
    </div>
  )
}
