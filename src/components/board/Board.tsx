import React from "react"
import { Link } from "react-router-dom"
import "./Board.css"

const Board = ({ name, id }: { name: string; id: string }) => {
  return (
    <Link to={`/board/${id}`} className="board">
      <div className="board-content">
        <h3>{name}</h3>
      </div>
    </Link>
  )
}

export default Board
