import api from "@/api"

export const updateUserProfile = async (profileDetails: {
  userId: string
  firstName: string
  lastName: string
  email: string
  phone: string
}) => {
  try {
    const response = await api.put(`/users/${profileDetails.userId}`, profileDetails)
    return response.data.data
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}
