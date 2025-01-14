import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useCompanies, useCreateCompany, Company } from "@/hooks/useCompanies"
import { useCreateWorkspace } from "@/hooks/useWorkspaces"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import "./createWorkspace.css"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Plus } from "lucide-react"

export function CreateWorkspacePage() {
  const navigate = useNavigate()
  const { userId } = useAuth()
  const {
    data: companiesData,
    isLoading: isLoadingCompanies,
    error: companiesError
  } = useCompanies()
  console.log("From create workspace: companiesData", companiesData)
  const createCompanyMutation = useCreateCompany()
  const createWorkspaceMutation = useCreateWorkspace()

  const [workspaceName, setWorkspaceName] = useState("")
  const [workspaceDescription, setWorkspaceDescription] = useState("")
  const [workspaceType, setWorkspaceType] = useState<"PRIVATE" | "PUBLIC" | "SHARED">("PUBLIC")
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)
  const [newCompanyName, setNewCompanyName] = useState("")
  const [isCreatingNewCompany, setIsCreatingNewCompany] = useState(false)

  const handleCreateWorkspace = async () => {
    if (!userId || (!selectedCompanyId && !newCompanyName)) return

    let companyId = selectedCompanyId

    if (isCreatingNewCompany && newCompanyName) {
      try {
        const newCompany = await createCompanyMutation.mutateAsync({
          name: newCompanyName,
          createdBy: userId
        })
        companyId = newCompany.data.id
      } catch (error) {
        console.error("Error creating company:", error)
        return
      }
    }

    if (!companyId) return

    createWorkspaceMutation.mutate(
      {
        name: workspaceName,
        description: workspaceDescription,
        type: workspaceType,
        createdBy: userId,
        companyId: companyId
      },
      {
        onSuccess: () => {
          navigate("/create-workspace")
        },
        onError: (error) => {
          console.error("Error creating workspace:", error)
        }
      }
    )
  }

  if (isLoadingCompanies) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
        <span>Loading companies...</span>
      </div>
    )
  }

  if (companiesError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{(companiesError as Error).message}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Workspace</CardTitle>
          <CardDescription>Fill in the details to create a new workspace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workspace-name">Workspace Name</Label>
            <Input
              id="workspace-name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Enter workspace name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workspace-description">Description</Label>
            <Input
              id="workspace-description"
              value={workspaceDescription}
              onChange={(e) => setWorkspaceDescription(e.target.value)}
              placeholder="Enter workspace description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workspace-type">Workspace Type</Label>
            <Select
              value={workspaceType}
              onValueChange={(value: "PRIVATE" | "PUBLIC" | "SHARED") => setWorkspaceType(value)}
            >
              <SelectTrigger className="border border-gray-300 focus:border-black focus:ring-black dark:focus:border-white dark:focus:ring-white">
                <SelectValue placeholder="Select workspace type" />
              </SelectTrigger>
              <SelectContent className="border border-gray-300 focus:border-black focus:ring-black dark:focus:border-white dark:focus:ring-white">
                <SelectItem value="PRIVATE">Private</SelectItem>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="SHARED">Shared</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            {isCreatingNewCompany ? (
              <div className="flex items-center space-x-2">
                <Input
                  id="new-company-name"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="Enter new company name"
                />
                <Button variant="outline" onClick={() => setIsCreatingNewCompany(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Select value={selectedCompanyId || ""} onValueChange={setSelectedCompanyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companiesData?.data.map((company: Company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" onClick={() => setIsCreatingNewCompany(true)}>
                  <Plus className="mr-2 h-4 w-4" /> New Company
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="space-x-4">
          <Button
            onClick={handleCreateWorkspace}
            disabled={createWorkspaceMutation.isPending}
            variant="ghost"
          >
            {createWorkspaceMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Workspace
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
