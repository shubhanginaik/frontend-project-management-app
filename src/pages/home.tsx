import { Button } from "../components/ui/Button"
import { useState } from "react"

export function Home() {
  const [message, setMessage] = useState("")

  const handleWelcome = () => {
    setMessage("Why did you?")
  }
  const handleCleanState = () => {
    setMessage("")
  }

  return (
    <div className="flex flex-col justify-center items-center gap-10 h-screen">
      <h1 className="text-2xl">Welcome!</h1>
      {message && <p>{message}</p>}
      {!message ? (
        <Button onClick={handleWelcome}>Do not click me</Button>
      ) : (
        <Button onClick={handleCleanState}>Undo the damage</Button>
      )}
    </div>
  )
}
