import React from "react"

export function HelpInfoForm() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Who is the tool for?</h2>
      <p>
        <strong>Project Managers:</strong> To manage projects, tasks, and teams efficiently.
      </p>
      <p>
        <strong>Developers & Teams:</strong> For organizing tasks and tracking progress.
      </p>
      <p>
        <strong>Businesses:</strong> Needing a scalable project management solution similar to
        Trello, Jira, or Monday.
      </p>
      <h2 className="text-xl font-bold mt-4 mb-4">Key Steps in the User Journey:</h2>
      <p>
        <strong>Registration</strong> Users register and login using their email and password. If a
        user is logged in for the first time, they are prompted to create a profile(click on your
        name to update your profile). Start creating new workspaces, Compeny, projects, and tasks.
        User can create new members and assign them to the workspaces through the members page.
      </p>
      <p>
        <strong>Login</strong> Users can log in using their email and password. He can see all his
        workspaces and projects. He is allowed to add new workspaces, projects, and tasks. He is
        allowed to add new members and assign them to the workspaces(he is owner of).
      </p>
      <p>
        <strong>User Management:</strong> Users can manage their profiles, update personal
        information, and Admin user can set custom roles (Admin, Dev, PM).
      </p>
      <p>
        <strong>Project & Workspace Creation:</strong> Users create and manage multiple
        projects/workspaces, providing details such as name, description, start/end dates, and
        status.
      </p>
      <p>
        <strong>Task/Issue Management:</strong> Users create tasks/issues with titles, descriptions,
        priorities, and deadlines. Track task/issue status updates (To-Do, In Progress, Done).
      </p>
      <p>
        <strong>Activity Tracking:</strong> Users track activity logs and progress for tasks and
        projects.
      </p>
      <p>
        <strong>Notifications:</strong> Users receive notifications related to tasks (comment).
      </p>
    </div>
  )
}
