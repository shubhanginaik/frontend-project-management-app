import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { useEffect } from "react"

export function WorkspacePage() {
  const { workspaces } = useAuth()
  sessionStorage.setItem("membersVisible", "false")

  return (
    <div className="container mx-auto py-8">
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workspaces.map((workspace) => (
          <Card key={workspace.data.id}>
            <CardHeader>
              <CardTitle>{workspace.data.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{workspace.data.description}</p>
              <div className="mt-4">
                <Link to={`/workspaces/${workspace.data.id}`} state={{ workspace: workspace.data }}>
                  <button>View Details</button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
