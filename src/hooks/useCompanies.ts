import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/api"

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
  errors: null | any
}

export interface CreateCompanyResponse {
  data: Company
  status: string
  code: number
  errors: null | any
}

const fetchCompanies = async (): Promise<CompanyResponse> => {
  const response = await api.get<CompanyResponse>("/companies")
  return response.data
}

export const useCompanies = () => {
  return useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompanies
  })
}

export const createCompany = async (companyData: {
  name: string
  createdBy: string
}): Promise<CreateCompanyResponse> => {
  const response = await api.post<CreateCompanyResponse>("/companies", companyData)
  return response.data
}

export const useCreateCompany = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    }
  })
}
