import React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface TaskFilterProps {
  onFilterChange: (filter: TaskFilter) => void
}

export interface TaskFilter {
  search: string
  priority: string
  assignee: string
}

export function TaskFilter({ onFilterChange }: TaskFilterProps) {
  const [filter, setFilter] = React.useState<TaskFilter>({
    search: "",
    priority: "",
    assignee: ""
  })

  const handleFilterChange = (key: keyof TaskFilter, value: string) => {
    const newFilter = { ...filter, [key]: value }
    setFilter(newFilter)
    onFilterChange(newFilter)
  }

  return (
    <div className="flex space-x-4 mb-4">
      <Input
        placeholder="Search tasks..."
        value={filter.search}
        onChange={(e) => handleFilterChange("search", e.target.value)}
      />
      <Select
        value={filter.priority}
        onValueChange={(value) => handleFilterChange("priority", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All priorities</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filter.assignee}
        onValueChange={(value) => handleFilterChange("assignee", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select assignee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All assignees</SelectItem>
          {/* Add SelectItem for each team member */}
        </SelectContent>
      </Select>
    </div>
  )
}
