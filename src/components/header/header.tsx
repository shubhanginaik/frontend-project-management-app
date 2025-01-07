import React from "react"
import { useTheme } from "../../context/ThemeContext"
import "./Header.css"
import { Link } from "react-router-dom"

export function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="header">
      <div className="logo-container">
        <img src="/logo.svg" alt="Logo" className="logo-image" />
        <Link to="/" className="logo-link">
          <span className="logo-name">VisionBoard</span>
        </Link>
      </div>

      <div className="dropdown-container">
        <div className="dropdown">
          Workspaces
          <div className="dropdown-content">
            <a href="#">Workspace 1</a>
            <a href="#">Workspace 2</a>
            <a href="#">Workspace 3</a>
          </div>
        </div>
      </div>
      <input type="text" placeholder="Search..." />
      <div className="user-profile">
        <button>User</button>
      </div>

      <button onClick={toggleTheme} className="button">
        <img
          src={theme === "light" ? "/moon_6932837.png" : "/brightness_553230.png"}
          alt={theme === "light" ? "Dark Mode" : "Light Mode"}
        />
      </button>
    </header>
  )
}
