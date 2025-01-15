import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/api"
import { useAuth } from "@/context/AuthContext"

export interface Company {
  id: string
  name: string
  createdDate: string
  createdBy: string
}

export interface CompanyResponse {
  data: Company[]
  status: string
  code: number
  errors: null | unknown
}

export interface updateCompany {
  name: string
  createdBy: string
}
export interface CreateAndUpdateCompanyResponse {
  data: Company
  status: string
  code: number
  errors: null | unknown
}

const fetchCompanies = async (userId: string): Promise<Company[]> => {
  const response = await api.get<CompanyResponse>("/companies")
  const companies = response.data.data
  console.log(response.data.errors)
  // Filter companies created by the logged-in user
  return companies.filter((company) => company.createdBy === userId)
}

export const useCompanies = () => {
  const { userId } = useAuth()

  return useQuery({
    queryKey: ["companies", userId],
    queryFn: () => fetchCompanies(userId!)
  })
}

export const createCompany = async (companyData: {
  name: string
  createdBy: string
}): Promise<CreateAndUpdateCompanyResponse> => {
  const response = await api.post<CreateAndUpdateCompanyResponse>("/companies", companyData)
  return response.data
}

export const useCreateCompany = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
      console.log("Company created successfully")
    }
  })
}

//updateCompany
export const updateCompany = async (
  companyId: string,
  companyData: { name: string; createdBy: string }
): Promise<CreateAndUpdateCompanyResponse> => {
  const response = await api.put<CreateAndUpdateCompanyResponse>(
    `/companies/${companyId}`,
    companyData
  )
  return response.data
}

export const useUpdateCompany = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      companyId,
      companyData
    }: {
      companyId: string
      companyData: { name: string; createdBy: string }
    }) => updateCompany(companyId, companyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    }
  })
}
