import React from "react"
import "./Sidebar.css"

export function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Sidebar</h2>
      <ul>
        <li>
          Workspce: Which will show all the projects onclick(Allow 2-3 projects in a workspace)
        </li>
        <li>Projects: has same functionality as Workspace</li>
        <li>Members: Which will show allthe members of the workpaces</li>
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
