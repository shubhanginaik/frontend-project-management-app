import React, { useState } from "react"
import { Task } from "@/hooks/taskHook"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import { DropdownMenu } from "@/components/task/TaskDropDown"

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

  const handleEditTask = (task: Task) => {
    onTaskClick(task)
  }

  const handleDeleteTask = (taskId: string) => {
    console.log(`Delete task with ID: ${taskId}`)
  }

  const handleAssignTask = (taskId: string) => {
    console.log(`Assign task with ID: ${taskId}`)
  }

  const handleCommentTask = (taskId: string) => {
    console.log(`Comment on task with ID: ${taskId}`)
  }

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
                    <DropdownMenu
                      onEdit={() => handleEditTask(task)}
                      onDelete={() => handleDeleteTask(task.id)}
                      onAssign={() => handleAssignTask(task.id)}
                      onComment={() => handleCommentTask(task.id)}
                    />
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
          className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>
    </div>
  )
}
