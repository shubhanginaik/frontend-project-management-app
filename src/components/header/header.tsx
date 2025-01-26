import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { HelpCircle, Moon, Sun } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"
import { WorkspacePage } from "@/pages/dashboard/workspaceDash/WorkspacePageDd"
import { useAuth } from "@/context/AuthContext"
import "./header.css"
import { useState } from "react"
import { ProfileUpdateForm } from "./ProfileUpdateForm"
import { HelpInfoForm } from "./HelpInfoForm"

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated, logout, firstName } = useAuth()
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false)
  const [isHelpFormOpen, setIsHelpFormOpen] = useState(false)

  return (
    <header className="w-full flex items-center justify-between p-4 bg-background border-b">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
          <Link to="/" className="text-xl font-bold text-foreground">
            VisionBoard
          </Link>
        </div>
        {isAuthenticated && (
          <div className="relative z-10">
            <WorkspacePage />
          </div>
        )}
      </div>

      <div className="flex-1 max-w-md mx-4">
        <p className="app-heading animate-bounce">Project Management Application</p>
      </div>

      <div className="flex items-center space-x-4">
        <nav className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <div className="round-link">
                <Button
                  onClick={() => setIsProfileFormOpen(true)}
                  className="text-sm font-medium text-foreground hover:text-accent-foreground dark:bg-gray-800 px-3 py-2 rounded-md"
                >
                  {firstName}
                </Button>
              </div>
              <div className="btnlogout">
                <Button
                  onClick={logout}
                  className="text-sm font-medium text-foreground hover:text-accent-foreground  dark:bg-gray-800 px-3 py-2 rounded-md"
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-foreground hover:text-accent-foreground bg-[#2a679d] dark:bg-[#2a679d] px-3 py-2 rounded-md"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium text-foreground hover:text-accent-foreground bg-[#2a679d] dark:bg-[#2a679d] px-3 py-2 rounded-md"
              >
                SignUp
              </Link>
            </>
          )}
        </nav>

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "light" ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Link
          to="#"
          onClick={() => setIsHelpFormOpen(true)}
          className="text-sm font-medium text-foreground hover:text-accent-foreground dark:bg-gray-800 px-3 py-2 rounded-md"
        >
          <HelpCircle className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Help</span>
        </Link>
      </div>
      {isProfileFormOpen && (
        <div className="absolute top-16 right-0 bg-white p-4 rounded shadow-lg z-20">
          <ProfileUpdateForm />
          <Button className="btnclose" onClick={() => setIsProfileFormOpen(false)}>
            Close
          </Button>
        </div>
      )}
      {isHelpFormOpen && (
        <div className="absolute top-16 right-0 bg-white p-4 rounded shadow-lg z-20">
          <HelpInfoForm />
          <Button className="giant-blue-button" onClick={() => setIsHelpFormOpen(false)}>
            Close
          </Button>
        </div>
      )}
    </header>
  )
}
