import React from "react"
import Board from "../../components/board/Board"
import "./Home.css"

export function Home() {
  const boards = [
    { id: "1", name: "Board 1" },
    { id: "2", name: "Board 2" },
    { id: "3", name: "Board 3" }
  ]

  return (
    <div className="home">
      <h1 className="home-title">Your Boards</h1>
      <div className="boards-container">
        {boards.map((board) => (
          <Board key={board.id} id={board.id} name={board.name} />
        ))}
      </div>
    </div>
  )
}
