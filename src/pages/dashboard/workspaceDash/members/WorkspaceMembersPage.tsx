import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/Modal"
import { CreateMemberForm } from "@/components/members/CreateMember-form"
import { fetchRoleDetails } from "@/hooks/useRole"
import {
  fetchUserDetails,
  getWorkspaceUserByWorkspaceIdAndUserId,
  useWorkspaceMembersByWorkspace,
  WorkspaceUserWithDetails
} from "@/api/WorkspaceUsers"
import { useDeleteUserFromWorkspaceUsers } from "@/hooks/useDeleteUser"
import { useWorkspace } from "@/context/WokspaceContext"
import { toast } from "@/components/ui/use-toast"

export function MembersPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isAuthenticated, userId } = useAuth()
  const { mutate: deleteUser, isPending: isDeletingUser } = useDeleteUserFromWorkspaceUsers()
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const { refetchMembers } = useWorkspace()

  if (!isAuthenticated) {
    return <div>Not authenticated</div>
  } else if (!workspaceId) {
    return <div>Select a workspace to view Members!</div>
  }

  const { data: members, isLoading, error, refetch } = useWorkspaceMembersByWorkspace(workspaceId)
  const [detailedMembers, setDetailedMembers] = useState<WorkspaceUserWithDetails[]>([])
  const [isLoadingDetails, setIsLoadingDetails] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      if (members) {
        const membersWithDetails = await Promise.all(
          members.map(async (member) => {
            const userDetails = await fetchUserDetails(member.userId)
            const roleDetails = await fetchRoleDetails(member.roleId)
            return {
              ...member,
              ...userDetails.data,
              roleName: roleDetails.data.name
            }
          })
        )
        setDetailedMembers(membersWithDetails)
        setIsLoadingDetails(false)
      }
    }

    fetchDetails()
  }, [members])

  useEffect(() => {
    refetchMembers()
  }, [refetchMembers])

  const handleDelete = async (memberId: string) => {
    const loggedInUser = detailedMembers?.find((member) => member.userId === userId)
    if (!loggedInUser || loggedInUser.roleName !== "ADMIN") {
      return toast({
        title: "Error",
        description: "You are not authorized to delete members from this workspace.",
        variant: "destructive"
      })
    }

    try {
      const { data: workspaceUser } = await getWorkspaceUserByWorkspaceIdAndUserId(
        memberId,
        workspaceId
      )
      if (workspaceUser) {
        const memberToDelete = detailedMembers?.find((member) => member.userId === memberId)
        if (memberToDelete) {
          const isAdmin = memberToDelete.roleName === "ADMIN"
          const adminCount = detailedMembers?.filter((member) => member.roleName === "ADMIN").length

          if (isAdmin && adminCount === 1) {
            toast({
              title: "Error",
              description: "You cannot delete the last admin of a workspace.",
              variant: "destructive"
            })
            return
          }

          deleteUser(workspaceUser.id, {
            onSuccess: () => {
              toast({
                title: "Success",
                description: "User deleted from workspace",
                variant: "success"
              })
              refetch()
            },
            onError: (error) => {
              setMessage({
                type: "error",
                text: "Error while deleting the workspace user. Please try again."
              })
              console.error("Error deleting user:", error)
            }
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error fetching workspace user. Please try again.",
        variant: "destructive"
      })
      console.error("Error fetching workspace user:", error)
    }
  }

  const handleCreateMemberClick = () => {
    const loggedInUser = detailedMembers?.find((member) => member.userId === userId)
    if (!loggedInUser || loggedInUser.roleName !== "ADMIN") {
      toast({
        title: "Error",
        description: "You are not authorized to create a new member for this workspace.",
        variant: "destructive"
      })
      return
    }
    setIsModalOpen(true)
  }

  if (isLoading || isLoadingDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
        <span>Loading members...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {(error as Error).message}
          <Button onClick={() => refetch()} className="mt-2">
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (detailedMembers.length === 0) {
    return <h1>No members found</h1>
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Members</h2>
      {message && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <Alert variant={message.type === "success" ? "default" : "destructive"}>
              <AlertTitle>{message.type === "success" ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
              <Button
                onClick={() => setMessage(null)}
                className="mt-4 bg-[#efb6c8] text-white px-4 py-2 rounded hover:bg-[#dba4b3]"
                variant="blue"
              >
                Close
              </Button>
            </Alert>
          </div>
        </div>
      )}
      <Button
        onClick={() => handleCreateMemberClick()}
        variant="ghost"
        className="mt-4 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Create New Member
      </Button>
      <div className="member-table" style={{ marginTop: "1rem" }}>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {detailedMembers.map((member) => (
                <tr key={member.id}>
                  <td className="py-2 px-4 border-b">{`${member.firstName} ${member.lastName}`}</td>
                  <td className="py-2 px-4 border-b">{member.email}</td>
                  <td className="py-2 px-4 border-b">{member.roleName}</td>
                  <td className="py-2 px-4 border-b">Active</td>
                  <td className="py-2 px-4 border-b">
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(member.userId)}
                      disabled={isDeletingUser}
                    >
                      {isDeletingUser ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <CreateMemberForm
            workspaceId={workspaceId}
            onClose={() => setIsModalOpen(false)}
            refetchMembers={refetch}
          />
        </Modal>
      )}
    </div>
  )
}
