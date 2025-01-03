import axios from "axios"
import { Import } from "lucide-react"
import { env } from "process"

//const isDevelopment = import.meta.env.MODE === "development"
let baseURL = import.meta.env.VITE_API_URL
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
    const token = import.meta.env.VITE_JWT_SECRET
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error("Error in request interceptor", error)
    return Promise.reject(error)
  }
)

// use this to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 500) {
      throw new Error(error.response.data)
    }
    return Promise.reject(error)
  }
)

export default api
