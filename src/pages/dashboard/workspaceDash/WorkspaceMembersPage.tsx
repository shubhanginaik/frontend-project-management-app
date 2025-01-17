import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
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
import {
  fetchUserDetails,
  useWorkspaceMembersByWorkspace,
  WorkspaceUserWithDetails
} from "@/api/WorkspaceUsers"
import { fetchRoleDetails } from "@/hooks/useRole"

export function MembersPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()

  if (!workspaceId) {
    return <div>No workspace ID found</div>
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {detailedMembers.map((member) => (
          <TableRow key={member.id}>
            <TableCell>{`${member.firstName} ${member.lastName}`}</TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell>{member.roleName}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
