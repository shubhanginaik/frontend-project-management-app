import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Ban, CheckCircle2 } from "lucide-react"
type User = {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "blocked"
  avatarUrl?: string
}
const initialUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
    avatarUrl: "https://github.com/shadcn.png"
  },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "User", status: "active" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "User", status: "active" }
]
export function UserTable() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const toggleUserStatus = (id: string) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, status: user.status === "active" ? "blocked" : "active" } : user
      )
    )
  }
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Badge variant={user.status === "active" ? "default" : "destructive"}>
                  {user.status === "active" ? "Active" : "Blocked"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant={user.status === "active" ? "destructive" : "secondary"}
                  size="sm"
                  onClick={() => toggleUserStatus(user.id)}
                >
                  {user.status === "active" ? (
                    <>
                      <Ban className="mr-2 h-4 w-4" />
                      Block
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Unblock
                    </>
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
