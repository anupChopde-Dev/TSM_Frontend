import React, { useEffect, useState } from 'react'
import api from '../../api/axiosClient'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import TaskModal from '../../components/TaskModal'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/Table'
import { toast } from 'react-toastify'
import { SquarePen, Trash } from 'lucide-react'

const normalizeTasks = (rawTasks) =>
  (Array.isArray(rawTasks) ? rawTasks : rawTasks?.tasks || []).map((task, index) => ({
    id: task.id ?? index + 1,
    taskId: task._id,
    taskName: task.taskName || task.name || 'Untitled task',
    description: task.description || '',
    sp: task.sp ?? 0,
    priority: task.priority || 'Medium',
    docs: Array.isArray(task.docs) ? task.docs : [],
  }))

const TaskList = () => {
  const [tasks, setTasks] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [editingTask, setEditingTask] = useState(null)

  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerIndex, setViewerIndex] = useState(0)
  const [viewerImages, setViewerImages] = useState([])

  const openImageViewer = (images, index) => {
    setViewerImages(images)
    setViewerIndex(index)
    setViewerOpen(true)
  }

  const closeImageViewer = () => {
    setViewerOpen(false)
    setViewerImages([])
    setViewerIndex(0)
  }

  useEffect(() => {
    let active = true

    const loadTasks = async () => {
      try {
        const response = await api.get('/api/tasks')

        if (!active) return

        setTasks(normalizeTasks(response.data))
      } catch (error) {
        console.error('Failed to load tasks', error)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadTasks()

    return () => {
      active = false
    }
  }, [])

  const handleCreateTask = (taskData) => {
    setTasks((prev) => [
      ...prev,
      {
        id: taskData.id ?? (prev.length ? prev[prev.length - 1].id + 1 : 1),
        docs: Array.isArray(taskData.docs) ? taskData.docs : [],
        ...taskData,
      },
    ])

    setEditingTask(null)
    setOpen(false)
  }

  const handleEditClick = (task) => {
    setEditingTask(task)
    setOpen(true)
  }

  const handleUpdateTask = async (taskData) => {
    try {
      const response = await api.put(`/api/tasks/update/${editingTask.taskId}`, {
        ...taskData,
      })
      if (response.status === 200) {
        toast.success('Task updated successfully')
      }

      const updatedTask = {
        ...editingTask,
        ...taskData,
        ...(response?.data || {}),
      }

      setTasks((prev) =>
        prev.map((task) => (task.taskId === editingTask.taskId ? updatedTask : task))
      )

      setEditingTask(null)
      setOpen(false)
    } catch (error) {
      console.error('Failed to update task', error)
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?')

    if (!confirmed) return

    try {
      let res = await api.delete(`/api/tasks/delete/${id}`)
      if (res.status === 200) {
        toast.success('Task deleted successfully')
      }

      setTasks((prev) => prev.filter((task) => task.taskId !== id))
    } catch (error) {
      console.error('Failed to delete task', error)
    }
  }

  const handleSubmit = (taskData) => {
    if (editingTask) {
      handleUpdateTask(taskData)
    } else {
      handleCreateTask(taskData)
    }
  }

  const handleCloseModal = () => {
    setOpen(false)
    setEditingTask(null)
  }

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-500/15 text-rose-300'
      case 'High':
        return 'bg-amber-500/15 text-amber-300'
      case 'Medium':
        return 'bg-sky-500/15 text-sky-300'
      case 'Low':
        return 'bg-emerald-500/15 text-emerald-300'
      default:
        return 'bg-slate-800 text-slate-300'
    }
  }

  return (
    <>
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Task List</h2>
            <p className="mt-2 text-sm text-slate-400">
              View and manage your current tasks.
            </p>
          </div>

          <Button
            onClick={() => {
              setEditingTask(null)
              setOpen(true)
            }}
          >
            + Add Task
          </Button>
        </div>

        <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80">
          <Table>
            <TableHeader>
              <tr className="border-b border-slate-800">
                <TableHead>Id</TableHead>
                <TableHead>Task Name</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>SP</TableHead>
                <TableHead>Doc</TableHead>
                <TableHead>Action</TableHead>
              </tr>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-slate-400">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-slate-400">
                    No tasks found.
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="text-slate-300">{task.id}</TableCell>

                    <TableCell className="font-medium text-white">
                      {task.taskName}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs uppercase tracking-[0.08em] ${getPriorityClass(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </TableCell>

                    <TableCell className="text-slate-400">{task.sp}</TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        {(Array.isArray(task.docs) ? task.docs : [])
                          .slice(0, 2)
                          .map((doc, index) => {
                            const src =
                              typeof doc === 'string'
                                ? doc
                                : doc.thumbnail || doc.url || ''

                            const alt =
                              typeof doc === 'string'
                                ? `doc-${index + 1}`
                                : doc.name || `doc-${index + 1}`

                            return (
                              <button
                                key={index}
                                type="button"
                                onClick={() =>
                                  openImageViewer(
                                    Array.isArray(task.docs) ? task.docs : [],
                                    index
                                  )
                                }
                                className="rounded-lg border border-slate-700 p-0"
                              >
                                <img
                                  src={src}
                                  alt={alt}
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                              </button>
                            )
                          })}
                      </div>
                    </TableCell>

                    {/* <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          onClick={() => handleEditClick(task)}
                          className="px-3 py-1 text-sm"
                        >
                          Edit
                        </Button>

                        <Button
                          type="button"
                          onClick={() => handleDelete(task.id)}
                          className="bg-red-600 hover:bg-red-700 px-3 py-1 text-sm"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell> */}
                    <TableCell className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300"

                          onClick={() => handleEditClick(task)}
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-100 transition hover:border-red-400 hover:text-red-300"

                          onClick={() => handleDelete(task.taskId)}>
                          <Trash size={18}/>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <TaskModal
        open={open}
        onClose={handleCloseModal}
        onCreate={handleSubmit}
        initialData={editingTask}
        isEdit={!!editingTask}
      />

      {viewerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-slate-600/80 p-4 shadow-2xl">
            <button
              type="button"
              onClick={closeImageViewer}
              className="absolute right-2 top-2 rounded-full bg-slate-900 px-3 py-1 text-lg text-slate-200 hover:bg-slate-800"
            >
              ×
            </button>

            <div className="flex flex-col items-center gap-4">
              <img
                src={viewerImages[viewerIndex]}
                alt={`Preview ${viewerIndex + 1}`}
                className="max-h-[75vh] w-full max-w-full rounded-3xl object-contain"
              />

              {viewerImages.length > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {viewerImages.map((src, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setViewerIndex(index)}
                      className={`rounded-xl border px-3 py-1 text-sm ${index === viewerIndex
                        ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200'
                        : 'border-slate-700 text-slate-300'
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TaskList