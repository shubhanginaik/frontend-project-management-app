import React from "react"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"

export function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="w-full flex items-center justify-between p-4 bg-background border-b">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
          <Link to="/" className="text-xl font-bold text-foreground">
            VisionBoard
          </Link>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-sm font-medium text-foreground">
              Workspaces
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
              <Link to="#" className="w-full text-foreground">
                Workspace 1
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
              <Link to="#" className="w-full text-foreground">
                Workspace 2
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
              <Link to="#" className="w-full text-foreground">
                Workspace 3
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 max-w-md mx-4">
        <Input type="text" placeholder="Search..." className="w-full" />
      </div>

      <div className="flex items-center space-x-4">
        <nav className="flex space-x-4">
          <Link
            to="/profile"
            className="text-sm font-medium text-foreground hover:text-accent-foreground"
          >
            Profile
          </Link>
          <Link
            to="/settings"
            className="text-sm font-medium text-foreground hover:text-accent-foreground"
          >
            Settings
          </Link>
          <Link to="/" className="text-sm font-medium text-foreground hover:text-accent-foreground">
            Logout
          </Link>
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
