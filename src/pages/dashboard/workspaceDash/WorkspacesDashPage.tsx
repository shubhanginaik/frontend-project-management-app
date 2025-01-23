import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import "./styles/workspaceDashPage.css"

export function WorkspacePage() {
  const { workspaces } = useAuth()

  return (
    <div className="container mx-auto py-8">
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {workspaces.map((workspace) => (
          <Card className="workspace-card" key={workspace.data.id}>
            <CardHeader>
              <CardTitle>{workspace.data.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{workspace.data.description}</p>
              <div className="mt-4">
                <Link to={`/workspaces/${workspace.data.id}`} state={{ workspace: workspace.data }}>
                  <button>Go to Workspace</button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
