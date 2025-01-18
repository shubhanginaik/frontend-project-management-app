import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
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

export function MembersPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isAuthenticated, userId } = useAuth()
  const { mutate: deleteUser, isPending: isDeletingUser } = useDeleteUserFromWorkspaceUsers()
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

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

  const handleDelete = async (memberId: string) => {
    const loggedInUser = detailedMembers?.find((member) => member.userId === userId)
    if (!loggedInUser || loggedInUser.roleName !== "ADMIN") {
      return <h1>You do not have permission to delete members.</h1>
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
            alert("You cannot delete yourself as the only admin. Please contact a superadmin.")
            return
          }

          deleteUser(workspaceUser.id, {
            onSuccess: () => {
              setMessage({ type: "success", text: "Successfully deleted the workspace user." })
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
      setMessage({
        type: "error",
        text: "Error while fetching the workspace user. Please try again."
      })
      console.error("Error fetching workspace user:", error)
    }
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
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </Button>
            </Alert>
          </div>
        </div>
      )}
      <Button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Create New Member
      </Button>
      <Table className="table mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {detailedMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{`${member.firstName} ${member.lastName}`}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.roleName}</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(member.userId)}
                  disabled={isDeletingUser}
                >
                  {isDeletingUser ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
