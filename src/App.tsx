import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import { Header } from "./components/header/header"
import "./App.css"
import { AppRoutes } from "./components/route/AppRoutes"
import { Sidebar } from "./components/sidebar/Sidebar"

function App() {
  return (
    <div className="app">
      <div className="header">
        <Header />
      </div>
      <div className="layout">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="main-content">
          <AppRoutes />
        </div>
      </div>
    </div>
  )
}

export default App
