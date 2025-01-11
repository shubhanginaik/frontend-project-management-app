import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function DefaultWorkspacePage() {
  const navigate = useNavigate()
  // Placeholder for navigation function
  const handleCreateWorkspace = () => {
    console.log("Navigate to create workspace page")

    navigate("/create-workspace")
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Welcome to Your Workspace</CardTitle>
          <CardDescription>
            This is your default workspace. Get started by creating tasks or a new workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-2">Active Tasks: 3</p>
          <p className="mb-4">Team Members: 1 (You)</p>
          <Button onClick={handleCreateWorkspace}>
            Create New Workspace
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>To Do</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="p-2 bg-gray-200 rounded">Create project plan</li>
              <li className="p-2 bg-gray-200 rounded">Set up team meeting</li>
            </ul>
            <Button variant="ghost" className="w-full mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add a task
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="p-2 bg-gray-100 rounded">Design user interface</li>
            </ul>
            <Button variant="ghost" className="w-full mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add a task
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Done</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="p-2 bg-gray-100 rounded line-through">
                Set up development environment
              </li>
            </ul>
            <Button variant="ghost" className="w-full mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add a task
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
