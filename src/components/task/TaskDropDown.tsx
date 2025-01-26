import React, { useState } from "react"

interface DropdownMenuProps {
  onEdit: () => void
  onDelete: () => void
  onAssign: () => void
  onComment: () => void
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  onEdit,
  onDelete,
  onAssign,
  onComment
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleMenu}
        className="p-2 rounded-full hover:bg-gray-200"
        title="Toggle menu"
      ></button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <ul className="py-1">
            <li>
              <button
                onClick={onEdit}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Edit Task
              </button>
            </li>
            <li>
              <button
                onClick={onDelete}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Delete Task
              </button>
            </li>
            <li>
              <button
                onClick={onAssign}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Assign Task
              </button>
            </li>
            <li>
              <button
                onClick={onComment}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Comment
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
