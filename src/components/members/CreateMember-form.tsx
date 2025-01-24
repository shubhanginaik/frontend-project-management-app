import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateMember } from "@/hooks/useCreateMember"
import { useFetchRoles } from "@/hooks/useFetchRoles"

import { Loader2 } from "lucide-react"
import "./createMember.css"
import { useAddUserToWorkspace } from "@/hooks/useAddUserToworkspace"
import { useAuth } from "@/context/AuthContext"
import { useGetWorkspaceUser } from "@/hooks/useWorkspaces"
import { useToast } from "../ui/use-toast"

interface CreateMemberFormProps {
  workspaceId: string
  onClose: () => void
  refetchMembers: () => void
}

export function CreateMemberForm({ workspaceId, onClose, refetchMembers }: CreateMemberFormProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { userId } = useAuth()
  const { toast } = useToast()
  const {
    mutate: createUser,
    isPending: isCreatingUser,
    isError: isCreateUserError,
    error: createUserError
  } = useCreateMember()
  const { data: rolesData, isLoading: isFetchingRoles } = useFetchRoles()
  const { mutate: addUserToWorkspace, isPending: isAddingUserToWorkspace } = useAddUserToWorkspace()

  const {
    data: workspaceUserData,
    isLoading: isCheckingAdmin,
    error: adminError
  } = useGetWorkspaceUser(userId!, workspaceId)

  const adminRole = rolesData?.data?.find((role) => role.name === "ADMIN")
  const adminRoleId = adminRole?.id
  const isAdmin = workspaceUserData?.data?.roleId === adminRoleId
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // if (!isAdmin) {
    //   toast({
    //     title: "Permission Denied",
    //     description: "Only admins can add members",
    //     variant: "destructive"
    //   })
    //   return
    // }

    createUser(
      { firstName, lastName, email, password, phone: "4053642524", profileImage: "", url: "" },
      {
        onSuccess: (user) => {
          const memberRole = rolesData?.data.find((role) => role.name === "MEMBER")
          if (memberRole) {
            addUserToWorkspace(
              { userId: user.data.id, workspaceId, roleId: memberRole.id },
              {
                onSuccess: () => {
                  toast({
                    title: "Success",
                    description: "User added to workspace",
                    variant: "success"
                  })
                  refetchMembers()
                  onClose()
                  navigate(`/workspaces/${workspaceId}/members`)
                },
                onError: (error) => {
                  toast({
                    title: "Error",
                    description: "Error adding user to workspace",
                    variant: "destructive"
                  })
                  console.error("Error adding user to workspace:", error)
                }
              }
            )
          }
        },
        onError: (error) => {
          console.error("Error creating user:", error)
        }
      }
    )
  }

  const isLoading = isCreatingUser || isFetchingRoles || isAddingUserToWorkspace

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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="create-member-button" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Create Member"
          )}
        </Button>
        {isCreateUserError && <p className="error-message">{(createUserError as Error).message}</p>}
      </form>
    </div>
  )
}
