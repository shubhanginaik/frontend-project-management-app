import React, { useState } from "react"
import { Task } from "@/api/tasks"
import { Droppable, Draggable } from "@hello-pangea/dnd"

interface TaskColumnProps {
  id: string
  title: string
  tasks: Task[]
  onAddTask: (columnId: string, taskName: string) => void
  onTaskClick: (task: Task) => void
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  id,
  title,
  tasks,
  onAddTask,
  onTaskClick
}) => {
  const [newTaskName, setNewTaskName] = useState("")

  const handleAddTask = () => {
    if (newTaskName.trim() !== "") {
      onAddTask(id, newTaskName)
      setNewTaskName("")
    }
  }

  return (
    <div className="w-80 bg-gray-100 rounded-md p-4">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <Droppable droppableId={id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white p-4 rounded-md shadow-md flex justify-between items-center"
                  >
                    <div onClick={() => onTaskClick(task)} className="cursor-pointer">
                      {task.name}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className="mt-4">
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="New task name"
          className="w-full p-2 border rounded-md"
        />
        <button
          onClick={handleAddTask}
          className="mt-2 w-full bg-[rgb(38, 124, 156)] text-white py-2 rounded-md hover:bg-blue-300"
        >
          Add Task
        </button>
      </div>
    </div>
  )
}
