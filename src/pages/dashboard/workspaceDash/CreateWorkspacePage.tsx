import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useCompanies, useCreateCompany, useUpdateCompany, Company } from "@/hooks/useCompanies"
import { useCreateWorkspace } from "@/hooks/useWorkspaces"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Loader2, Plus, Edit } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useQueryClient } from "@tanstack/react-query"

export function CreateWorkspacePage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { userId, fetchWorkspaceData } = useAuth()
  const { toast } = useToast()

  const {
    data: companiesData,
    isLoading: isLoadingCompanies,
    error: companiesError,
    refetch: refetchCompanies
  } = useCompanies()
  const createCompanyMutation = useCreateCompany()
  const updateCompanyMutation = useUpdateCompany()
  const createWorkspaceMutation = useCreateWorkspace()

  const [workspaceName, setWorkspaceName] = useState("")
  const [workspaceDescription, setWorkspaceDescription] = useState("")
  const [workspaceType, setWorkspaceType] = useState<"PRIVATE" | "PUBLIC" | "SHARED">("PUBLIC")
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)
  const [newCompanyName, setNewCompanyName] = useState("")
  const [updatingCompanyName, setUpdatingCompanyName] = useState("")
  const [isCreatingNewCompany, setIsCreatingNewCompany] = useState(false)
  const [isUpdatingCompany, setIsUpdatingCompany] = useState(false)
  const [error, setError] = useState("")

  const validateWorkspaceForm = () => {
    if (!workspaceName) {
      setError("Workspace name is required.")
      return false
    }
    if (!workspaceDescription) {
      setError("Workspace description is required.")
      return false
    }
    if (!workspaceType) {
      setError("Workspace type is required.")
      return false
    }
    if (!selectedCompanyId) {
      setError("Company selection is required.")
      return false
    }
    setError("")
    return true
  }

  const handleCreateWorkspace = async () => {
    if (!validateWorkspaceForm()) {
      return
    }
    if (!userId || !selectedCompanyId) return

    createWorkspaceMutation.mutate(
      {
        name: workspaceName,
        description: workspaceDescription,
        type: workspaceType,
        createdBy: userId,
        companyId: selectedCompanyId
      },
      {
        onSuccess: async () => {
          toast({
            title: "Success",
            description: "Workspace created successfully.",
            variant: "success"
          })
          await fetchWorkspaceData(userId)
          queryClient.invalidateQueries({ queryKey: ["workspaces"] })
          navigate("/dashboard")
        },
        onError: (error) => {
          console.error("Error creating workspace:", error)
          toast({
            title: "Error",
            description:
              (error as Error).message || "Failed to create workspace. Please try again.",
            variant: "destructive"
          })
        }
      }
    )
  }

  const handleCreateCompany = async () => {
    if (!newCompanyName) {
      toast({
        title: "Error",
        description: "Company name is required.",
        variant: "destructive"
      })
      return
    }

    try {
      const newCompany = await createCompanyMutation.mutateAsync({
        name: newCompanyName,
        createdBy: userId!
      })
      setNewCompanyName("")
      setIsCreatingNewCompany(false)
      toast({
        title: "Success",
        description: "Company created successfully.",
        variant: "success"
      })
      await refetchCompanies()
      setSelectedCompanyId(newCompany.data.id)
    } catch (error) {
      console.error("Error creating company:", error)
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to create company. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleUpdateCompany = async () => {
    if (!selectedCompanyId || !updatingCompanyName) {
      toast({
        title: "Error",
        description: "Company ID and name are required.",
        variant: "destructive"
      })
      return
    }

    try {
      await updateCompanyMutation.mutateAsync({
        companyId: selectedCompanyId!,
        companyData: { name: updatingCompanyName, createdBy: userId! }
      })
      setIsUpdatingCompany(false)
      setUpdatingCompanyName("")
      toast({
        title: "Success",
        description: "Company updated successfully.",
        variant: "success"
      })
      await refetchCompanies()
    } catch (error) {
      console.error("Error updating company:", error)
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to update company. Please try again.",
        variant: "destructive"
      })
    }
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
            <Label htmlFor="workspace-name" className="text-gray-900 dark:text-gray-100">
              Workspace Name
            </Label>
            <Input
              id="workspace-name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Enter workspace name"
              required
              width={3 - 50}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workspace-description" className="text-gray-900 dark:text-gray-100">
              Description
            </Label>
            <Input
              id="workspace-description"
              value={workspaceDescription}
              onChange={(e) => setWorkspaceDescription(e.target.value)}
              placeholder="Enter workspace description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workspace-type" className="text-gray-900 dark:text-gray-100">
              Workspace Type
            </Label>
            <Select
              value={workspaceType}
              onValueChange={(value: "PRIVATE" | "PUBLIC" | "SHARED") => setWorkspaceType(value)}
            >
              <SelectTrigger className="border border-gray-300 focus:border-black focus:ring-black dark:focus:border-white dark:focus:ring-white text-gray-900 dark:text-gray-100">
                <SelectValue placeholder="Select workspace type" />
              </SelectTrigger>
              <SelectContent className="border border-gray-300 focus:border-black focus:ring-black dark:focus:border-white dark:focus:ring-white bg-white dark:bg-gray-800">
                <SelectItem value="PRIVATE">Private</SelectItem>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="SHARED">Shared</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company" className="text-gray-900 dark:text-gray-100">
              Company
            </Label>
            {isCreatingNewCompany ? (
              <div className="flex items-center space-x-2">
                <Input
                  id="new-company-name"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="Enter new company name"
                  required
                />
                <Button variant="outline" onClick={() => setIsCreatingNewCompany(false)}>
                  Cancel
                </Button>
                <Button variant="ghost" onClick={handleCreateCompany}>
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Select value={selectedCompanyId || ""} onValueChange={setSelectedCompanyId}>
                  <SelectTrigger className="border border-gray-300 focus:border-black focus:ring-black dark:focus:border-white dark:focus:ring-white text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-300 focus:border-black focus:ring-black dark:focus:border-white dark:focus:ring-white bg-white dark:bg-gray-800">
                    {companiesData?.map((company: Company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" onClick={() => setIsCreatingNewCompany(true)}>
                  <Plus className="mr-2 h-4 w-4" /> New Company
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setIsUpdatingCompany(true)}
                  disabled={!selectedCompanyId}
                >
                  <Edit className="mr-2 h-6 w-4" /> Update Company
                </Button>
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
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

      {isUpdatingCompany && (
        <Dialog open={isUpdatingCompany} onOpenChange={setIsUpdatingCompany}>
          <DialogContent className="bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle>Update Company</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label htmlFor="update-company-name" className="text-gray-900 dark:text-gray-100">
                Company Name
              </Label>
              <Input
                id="update-company-name"
                value={updatingCompanyName}
                onChange={(e) => setUpdatingCompanyName(e.target.value)}
                placeholder="Enter updated company name"
              />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsUpdatingCompany(false)}>
                Cancel
              </Button>
              <Button variant="ghost" onClick={handleUpdateCompany}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
