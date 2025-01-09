import React from "react"
import Board from "../../components/board/Board"
import { boards } from "../dashboard/boardsData"
import "./Home.css"
import { Link } from "react-router-dom"

export function Home() {
  return (
    <div className="home">
      <h1 className="home-title">Welcome to Vision Board</h1>
      <h2 className="home-title">Your Boards</h2>
      <div className="boards-container">
        {boards.map((board) => (
          <Link to={`/board/${board.id}`} key={board.id} className="board-link">
            <Board key={board.id} id={board.id} name={board.name} link={`/board/${board.id}`} />
          </Link>
        ))}
      </div>
    </div>
  )
}
