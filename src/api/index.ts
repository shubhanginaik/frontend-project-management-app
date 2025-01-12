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
    const token = localStorage.getItem("token")
    //const currentWorkspaceId = localStorage.getItem("currentWorkspaceId")

    if (token) {
      const decodedToken: any = jwtDecode(token)
      const currentTime = Date.now() / 1000

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token")
        //localStorage.removeItem("currentWorkspaceId")
        return Promise.reject(new Error("Token is expired"))
      }

      // Skip adding the Authorization header for the login and signup requests
      if (!config.url?.includes("/auth/login") && !config.url?.includes("/auth/signup")) {
        config.headers.Authorization = `Bearer ${token}`
        // if (currentWorkspaceId) {
        //   config.headers["workspaceId"] = currentWorkspaceId
        // }
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
