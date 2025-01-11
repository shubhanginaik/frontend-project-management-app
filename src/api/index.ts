import axios from "axios"
import jwtDecode from "jwt-decode"

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

    if (token) {
      const decodedToken: any = jwtDecode(token)
      const currentTime = Date.now() / 1000

      if (decodedToken.exp < currentTime) {
        // Token is expired
        localStorage.removeItem("token")
        return Promise.reject(new Error("Token is expired"))
      }
      // Skip adding the Authorization header for the login and signup requests
      if (token && !config.url?.includes("/auth/login") && !config.url?.includes("/auth/signup")) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
