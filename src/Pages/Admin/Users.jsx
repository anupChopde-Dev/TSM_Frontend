import React from 'react'
import Card from '../../components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import Button from '../../components/ui/Button'

const users = [
  { id: 'u1', name: 'Alicia Reed', email: 'alicia@taskflow.com', role: 'Manager' },
  { id: 'u2', name: 'Devon Clarke', email: 'devon@taskflow.com', role: 'Developer' },
  { id: 'u3', name: 'Priya Singh', email: 'priya@taskflow.com', role: 'Tester' },
  { id: 'u4', name: 'Jorge Martinez', email: 'jorge@taskflow.com', role: 'Designer' },
]

const Users = () => {
  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Users</h2>
          <p className="mt-2 text-sm text-slate-400">Manage users and access roles across the platform.</p>
        </div>
        <Button variant="secondary">Invite user</Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80">
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-cyan-300">{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

export default Users
