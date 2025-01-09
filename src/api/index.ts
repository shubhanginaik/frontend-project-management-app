import axios from "axios"

//const isDevelopment = import.meta.env.MODE === "development"
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json"
  }
})

// if (!isDevelopment) {
//   // Update this later when you have a working backend server
//   baseURL = "http://localhost:8080/swagger-ui/index.html#"
// }

// Add an interceptor to include the token in the request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    // const workspaceId = localStorage.getItem("workspaceId")

    // Skip adding the Authorization header for the login and signup requests
    if (token && !config.url?.includes("/auth/login") && !config.url?.includes("/auth/signup")) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // if (workspaceId) {
    //   config.headers["Workspace-Id"] = workspaceId
    // }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
