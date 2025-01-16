import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  fetchUserDetails,
  Users,
  useWorkspaceMembersByWorkspace,
  WorkspaceUsersByWorkspaceId
} from "@/api/WorkspaceUsers"

export function MembersPage() {
  let workspaceIdDd = sessionStorage.getItem("currentWorkspaceIdDd")
  if (sessionStorage.getItem("membersVisible") === "false") {
    workspaceIdDd = sessionStorage.getItem("currentWorkspaceId")
  } else {
    workspaceIdDd = sessionStorage.getItem("currentWorkspaceIdDd")
  }
  //const { workspaceId } = useParams<{ workspaceId: string }>()
  if (workspaceIdDd === null) {
    return
  }
  const {
    data: members,
    isLoading,
    error,
    refetch
  } = useWorkspaceMembersByWorkspace(workspaceIdDd!)
  const [detailedMembers, setDetailedMembers] = useState<(WorkspaceUsersByWorkspaceId & Users)[]>(
    []
  )
  console.log("From members page: members", workspaceIdDd)
  const [isLoadingDetails, setIsLoadingDetails] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      if (members) {
        const membersWithDetails = await Promise.all(
          members.map(async (member) => {
            const userDetails = await fetchUserDetails(member.userId)
            return {
              ...member,
              ...userDetails.data
            }
          })
        )
        setDetailedMembers(membersWithDetails)
        setIsLoadingDetails(false)
      }
    }

    fetchDetails()
  }, [members])

  if (isLoading || isLoadingDetails)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
        <span>Loading members...</span>
      </div>
    )

  if (error)
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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {detailedMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <CardTitle>{`${member.firstName} ${member.lastName}`}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{member.email}</p>
              <div className="text-xs text-gray-500">
                <p>Role ID: {member.roleId}</p>
                <p>Workspace ID: {member.workspaceId}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
