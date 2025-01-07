import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Home } from "./pages/home/home"
import { Header } from "./components/header/header"
import { Sidebar } from "./components/sidebar/Sidebar"
import { LoginPage } from "./pages/login"

function App() {
  return (
    <Router>
      <Header />
      <div className="App">
        <Sidebar />
        <div className="main-content">
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
