import React, { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export function ProfileUpdateForm() {
  const { userId, firstName, lastName, userEmail, phone, updateUserProfile } = useAuth()
  const [userData, setUserData] = useState({
    firstName: firstName || "",
    lastName: lastName || "",
    email: userEmail || "",
    phone: phone || ""
  })

  useEffect(() => {
    setUserData({
      firstName: firstName || "",
      lastName: lastName || "",
      email: userEmail || "",
      phone: phone || ""
    })
  }, [firstName, lastName, userEmail, phone])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateUserProfile({ userId: userId!, ...userData })
      toast({
        title: "Success",
        description: "Profile updated successfully."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
      console.error("Failed to update profile:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="firstName">First Name</label>
        <Input
          id="firstName"
          name="firstName"
          value={userData.firstName}
          onChange={handleChange}
          placeholder="Enter your first name"
          required
        />
      </div>
      <div>
        <label htmlFor="lastName">Last Name</label>
        <Input
          id="lastName"
          name="lastName"
          value={userData.lastName}
          onChange={handleChange}
          placeholder="Enter your last name"
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          name="email"
          type="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
      </div>
      <div>
        <label htmlFor="phone">Phone</label>
        <Input
          id="phone"
          name="phone"
          value={userData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          required
        />
      </div>
      <Button variant="ghost" type="submit">
        Update Profile
      </Button>
    </form>
  )
}
