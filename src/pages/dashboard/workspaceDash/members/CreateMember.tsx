import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWorkspace } from "@/context/WokspaceContext"

export function CreateMemberPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { setWorkspaceId } = useWorkspace()
  const [memberName, setMemberName] = useState("")
  const [memberEmail, setMemberEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement the logic to create a new member
    console.log(`Creating member: ${memberName}, ${memberEmail} in workspace: ${workspaceId}`)
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Member</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="memberName">Name</Label>
          <Input
            id="memberName"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            placeholder="Enter member name"
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="memberEmail">Email</Label>
          <Input
            id="memberEmail"
            type="email"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            placeholder="Enter member email"
            required
          />
        </div>
        <Button type="submit">Create Member</Button>
      </form>
    </div>
  )
}
