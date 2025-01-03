import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Home } from "./pages/home"
import Header from "./pages/header"

function App() {
  return (
    <Router>
      <Header />
      <div className="App">
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
