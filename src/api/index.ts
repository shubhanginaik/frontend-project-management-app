import axios from "axios"
import { Import } from "lucide-react"
import { env } from "process"

//const isDevelopment = import.meta.env.MODE === "development"
const baseURL = import.meta.env.VITE_API_URL
axios.defaults.headers.post["Content-Type"] = "application/json"

// if (!isDevelopment) {
//   // Update this later when you have a working backend server
//   baseURL = "http://localhost:8080/swagger-ui/index.html#"
// }

const api = axios.create({
  baseURL
})
// Add an interceptor to include the token in the request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    const workspaceId = localStorage.getItem("workspaceId")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (workspaceId) {
      config.headers["Workspace-Id"] = workspaceId
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
