import React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Clipboard, Target, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

import "./home.css"

export function Home() {
  const navigate = useNavigate()
  const { isAuthenticated, firstName, workspaces } = useAuth()
  const totalWorkspaces = workspaces?.length ?? 0

  const handleGetStarted = () => {
    navigate("/signup")
  }
  if (!isAuthenticated) {
    return (
      <div className="home">
        <h1 className="home-title">Welcome to Vision Board</h1>
        <motion.div
          className="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Welcome to Your Project Management App
          </motion.h1>
          <motion.p
            className="subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Streamline your workflow, collaborate seamlessly, and boost productivity
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button onClick={handleGetStarted} className="get-started-btn">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
        <div className="background-animation"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {firstName || "User"}!</h1>
      <div className="grid grid-cols-1 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>My Workspaces</CardTitle>
            <CardDescription>View and manage your current Workspaces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Clipboard className="h-12 w-12 mb-2" />
                <p>You have {totalWorkspaces} active workspaces</p>
              </div>
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Vision Board Tips</CardTitle>
              <CardDescription>Maximize your productivity</CardDescription>
            </CardHeader>
            <CardContent>
              <Lightbulb className="h-12 w-12 mb-2" />
              <ul className="list-disc pl-5 space-y-2">
                <li>Use color coding for different types of tasks</li>
                <li>Break large projects into smaller, manageable tasks</li>
                <li>Set realistic deadlines for your goals</li>
                <li>Regularly review and update your vision board</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Goal Tracking</CardTitle>
              <CardDescription>Stay focused on your objectives</CardDescription>
            </CardHeader>
            <CardContent>
              <Target className="h-12 w-12 mb-2" />
              <p className="mb-4">Track your progress and celebrate milestones!</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Personal Goals</span>
                  <span className="font-bold">3/5 Completed</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div id="completed-bar" className="bg-blue-600 h-2.5 rounded-full"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Work Projects</span>
                  <span className="font-bold">2/4 In Progress</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div id="inprogress-bar" className="bg-green-500 h-2.5 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
