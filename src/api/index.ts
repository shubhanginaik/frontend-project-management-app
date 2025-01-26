import axios from "axios"
import jwtDecode from "jwt-decode"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json"
  }
})

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken")
    const currentWorkspaceId = sessionStorage.getItem("currentWorkspaceId")
    const workspaces = sessionStorage.getItem("workspaces")
    if (token) {
      interface DecodedToken {
        exp: number
      }
      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token)
      const currentTime = Date.now() / 1000

      if (decodedToken.exp < currentTime) {
        sessionStorage.removeItem("token")
        return Promise.reject(new Error("Token is expired"))
      }

      if (!config.url?.includes("/auth/login") && !config.url?.includes("/auth/signup")) {
        config.headers.Authorization = `Bearer ${token}`
        if (workspaces) {
          config.headers["workspaces"] = workspaces
        }
        if (currentWorkspaceId) {
          config.headers["workspaceId"] = currentWorkspaceId
        }
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
