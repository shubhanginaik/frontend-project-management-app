import { Link } from "react-router-dom"
import Board from "../../components/board/Board"
import { boards } from "./boardsData"
import "./BoardsPage.css"

export function BoardsPage() {
  return (
    <div className="boards-page">
      <h1 className="boards-title">Your Boards</h1>
      <div className="boards-container">
        {boards.map((board) => (
          <Link key={board.id} to={`/board/${board.id}`}>
            <Board id={board.id} name={board.name} />
          </Link>
        ))}
      </div>
    </div>
  )
}
