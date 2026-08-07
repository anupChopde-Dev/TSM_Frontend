import React from 'react'
import { DeleteIcon, Eye, EyeOff, Trash } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axiosClient'
import useApi from '../../hooks/useApi'
import Card from '../../components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'

const Users = () => {
  const { data: users = [], loading, error, refetch } = useApi('/api/users', {}, { dedupe: false })

  const handleToggleBlock = async (user) => {
    try {
      await api.patch(`/api/users/${user.id}/block`, { isBlock: !user.isBlock })
      await refetch()
      toast.success(`User ${user.username} is now ${user.isBlock ? 'active' : 'inactive'}`)
    } catch (err) {
      console.error('Failed to update user status', err)
      toast.error('Could not update user status')
    }
  }

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Users</h2>
          <p className="mt-2 text-sm text-slate-400">Manage users and access roles across the platform.</p>
        </div>
      </div>

      <div className="mt-6  border border-slate-800 bg-slate-950/80">
        <div className="max-h-[350px] overflow-auto">
          <Table>
            <TableHeader>
              <tr className="border-b border-slate-800">
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </tr>
            </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-6 text-center text-slate-400">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="py-6 text-center text-rose-300">
                  Failed to load users.
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-6 text-center text-slate-400">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium text-white">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-slate-400">{user.createdAt ? user.createdAt.slice(0, 10) : '—'}</TableCell>
                  <TableCell className={user.isBlock ? 'text-rose-300' : 'text-emerald-300'}>
                    {user.isBlock ? 'Inactive' : 'Active'}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleBlock(user)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300"
                      aria-label={user.isBlock ? `Activate ${user.username}` : `Block ${user.username}`}
                    >
                      {user.isBlock ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleBlock(user)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-100 transition hover:border-red-400 hover:text-red-300"
                      
                    >
                      <Trash size={18} />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      </div>

    </Card>
  )
}

export default Users
