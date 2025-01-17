import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateMember } from "@/hooks/useCreateMember"
import "./createMember.css" // Import the CSS file
import { useNavigate } from "react-router-dom"

interface CreateMemberFormProps {
  workspaceId: string
  onClose: () => void
}

export function CreateMemberForm({ workspaceId, onClose }: CreateMemberFormProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { mutate: createUser, isPending, isError, error } = useCreateMember()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createUser(
      { firstName, lastName, email, password, phone: "4053642524", profileImage: "", url: "" },
      {
        onSuccess: () => {
          onClose()
          navigate(`/workspaces/${workspaceId}/members`)
        },
        onError: (error: unknown) => {
          console.error("Error creating user:", error)
        }
      }
    )
  }

  return (
    <div className="create-member-form">
      <h2 className="text-2xl font-bold mb-4">Create New Member</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="memberFirstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="memberLastName">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="memberEmail">Email</Label>
          <Input
            id="memberEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter member email"
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="memberPassword">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter member password"
            required
          />
        </div>
        <Button type="submit" className="create-member-button" disabled={isPending}>
          {isPending ? "Creating..." : "Create Member"}
        </Button>
        {isError && <p className="error-message">{error?.message}</p>}
      </form>
    </div>
  )
}
