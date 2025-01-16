import React from "react"
import "./Sidebar.css"
import { FaTrello } from "react-icons/fa"
import { Link } from "react-router-dom"

export function Sidebar() {
  //const { workspaceId } = useParams<{ workspaceId: string }>()

  return (
    <div className="sidebar">
      <h2>Sidebar</h2>

      <p>Workspce: Which will show all the projects onclick(Allow 2-3 projects in a workspace)</p>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        {sessionStorage.getItem("membersVisible") == "true" && (
          <li>
            <Link to={`/workspaces/${sessionStorage.getItem("currentWorkspaceIdDd")}/members`}>
              Members
            </Link>
          </li>
        )}
        <li>
          <h2>Boards</h2>
          <Link to="/boards" className="sidebar-link">
            <FaTrello className="sidebar-icon" />
            Boards
          </Link>
        </li>
        <li>
          <Link to="/role">Role Management</Link>
        </li>

        <li>
          Your Projects:
          <p>
            1.It will have ... dots with options, 2.add button to add new project(board if u are
            owner of the workspace) 3.Below this Which will show all the project a logged in user is
            part of in that workspace
          </p>
          <ul>
            <li>project a</li>
            <li>project b</li>
          </ul>
        </li>
      </ul>
    </div>
  )
}
