import React, { useEffect, useState } from 'react'
import api from '../../api/axiosClient'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import TaskModal from '../../components/TaskModal'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'

const normalizeTasks = (rawTasks) =>
  (Array.isArray(rawTasks) ? rawTasks : rawTasks?.tasks || []).map((task, index) => ({
    id: task.id ?? index + 1,
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
    setOpen(false)
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
            <p className="mt-2 text-sm text-slate-400">View and manage your current tasks.</p>
          </div>
          <Button onClick={() => setOpen(true)}>+ Add Task</Button>
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
              </tr>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="text-slate-300">{task.id}</TableCell>
                  <TableCell className="font-medium text-white">{task.taskName}</TableCell>
                  <TableCell>
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs uppercase tracking-[0.08em] ${getPriorityClass(task.priority)}`}>
                      {task.priority}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-400">{task.sp}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {(Array.isArray(task.docs) ? task.docs : []).slice(0, 2).map((doc, index) => {
                        const src = typeof doc === 'string' ? doc : doc.thumbnail || ''
                        const alt = typeof doc === 'string' ? `doc-${index + 1}` : doc.name || `doc-${index + 1}`
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => openImageViewer(Array.isArray(task.docs) ? task.docs : [], index)}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <TaskModal open={open} onClose={() => setOpen(false)} onCreate={handleCreateTask} />

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
                      className={`rounded-xl border px-3 py-1 text-sm ${index === viewerIndex ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200' : 'border-slate-700 text-slate-300'}`}
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
