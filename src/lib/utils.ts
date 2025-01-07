import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Active, DataRef, Over } from "@dnd-kit/core"
import { ColumnDragData } from "../components/board/board-column"
import { TaskDragData } from "../components/board/task-card"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
type DraggableData = ColumnDragData | TaskDragData
export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>
} {
  if (!entry) {
    return false
  }
  const data = entry.data.current
  if (data?.type === "Column" || data?.type === "Task") {
    return true
  }
  return false
}
