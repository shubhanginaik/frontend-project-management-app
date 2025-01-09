import React from "react"
import { useNavigate } from "react-router-dom"

interface BoardProps {
  id: string
  name: string
  link: string
}

const Board: React.FC<BoardProps> = ({ id, name, link }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(link)
  }

  return (
    <div className="board" onClick={handleClick}>
      <h3>{name}</h3>
    </div>
  )
}

export default Board
