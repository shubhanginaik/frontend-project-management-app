import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"
import { WorkspacePage } from "@/pages/dashboard/workspaceDash/WorkspacePageDd"
import { useAuth } from "@/context/AuthContext"

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated, logout } = useAuth()

  return (
    <header className="w-full flex items-center justify-between p-4 bg-background border-b">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
          <Link to="/" className="text-xl font-bold text-foreground">
            VisionBoard
          </Link>
        </div>
        {/* add this only when authenticated */}
        {isAuthenticated && (
          <div className="relative z-10">
            <WorkspacePage />
          </div>
        )}
      </div>

      <div className="flex-1 max-w-md mx-4">
        <Input type="text" placeholder="Search..." className="w-full" />
      </div>

      <div className="flex items-center space-x-4">
        <nav className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="text-sm font-medium text-foreground hover:text-accent-foreground bg-gray-700 dark:bg-gray-800 px-3 py-2 rounded-md"
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="text-sm font-medium text-foreground hover:text-accent-foreground bg-gray-700 dark:bg-gray-800 px-3 py-2 rounded-md"
              >
                Settings
              </Link>
              <Button
                onClick={logout}
                className="text-sm font-medium text-foreground hover:text-accent-foreground bg-gray-700 dark:bg-gray-800 px-3 py-2 rounded-md"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-foreground hover:text-accent-foreground bg-gray-700 dark:bg-gray-800 px-3 py-2 rounded-md"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium text-foreground hover:text-accent-foreground bg-gray-700 dark:bg-gray-800 px-3 py-2 rounded-md"
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
      </div>
    </header>
  )
}
