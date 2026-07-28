import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import api from '../api/axiosClient'
import Button from './ui/Button'
import Card from './ui/Card'
import RangeCalendar from './RangeCalendar'
import { format } from 'date-fns'

const normalizeAvailableTasks = (tasks = []) =>
  (Array.isArray(tasks) ? tasks : tasks?.tasks || []).map((task, index) => ({
    id: task.id ?? task._id ?? index + 1,
    taskName: task.taskName || task.name || task.title || `Task ${index + 1}`,
    description: task.description || '',
    sp: task.sp ?? task.storyPoints ?? task.points ?? 0,
  }))

const Modal = ({ open, onClose, users = [], project = null, onSave, onCreate }) => {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      projectName: '',
      users: [],
      startDate: '',
      endDate: '',
      selectedTasks: [],
    },
  })

  const [taskList, setTaskList] = useState([])
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [taskError, setTaskError] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [range, setRange] = useState({ from: undefined, to: undefined })

  useEffect(() => {
    if (!open) {
      reset()
      setRange({ from: undefined, to: undefined })
      setShowCalendar(false)
      return
    }

    if (project) {
      const projectUsers = Array.isArray(project.users)
        ? project.users
            .map((user) => {
              if (typeof user === 'object' && user !== null) return user.id ?? user._id ?? user.value
              return user
            })
            .filter(Boolean)
        : []

      const selectedIds = Array.isArray(project.selectedTaskIds)
        ? project.selectedTaskIds.map((id) => (typeof id === 'string' || typeof id === 'number' ? id : id?.id ?? id?._id))
        : Array.isArray(project.tasks)
        ? project.tasks.map((task) => (typeof task === 'object' ? task.id ?? task._id : task))
        : []

      reset({
        projectName: project.projectName || project.name || '',
        users: projectUsers.map(String),
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        selectedTasks: selectedIds.map(String),
      })

      if (project.startDate && project.endDate) {
        const fromDate = new Date(project.startDate)
        const toDate = new Date(project.endDate)
        if (!Number.isNaN(fromDate.getTime()) && !Number.isNaN(toDate.getTime())) {
          setRange({ from: fromDate, to: toDate })
        }
      }
    }

    const loadTasks = async () => {
      setLoadingTasks(true)
      setTaskError(null)
      try {
        const response = await api.get('/api/tasks')
        setTaskList(normalizeAvailableTasks(response.data))
      } catch (error) {
        console.error('Failed to load available tasks', error)
        setTaskList([])
        setTaskError(error)
      } finally {
        setLoadingTasks(false)
      }
    }

    loadTasks()
  }, [open, project, reset])

  function toggleSelectAll(val) {
    if (val) setValue('selectedTasks', taskList.map((t) => String(t.id)))
    else setValue('selectedTasks', [])
  }

  function onSubmit(data) {
    const selectedTaskIds = Array.isArray(data.selectedTasks)
      ? data.selectedTasks.map((id) => {
          if (typeof id === 'string' && /^[0-9]+$/.test(id)) return Number(id)
          return id
        })
      : []
    const mapped = {
      projectName: data.projectName,
      users: data.users || [],
      startDate: data.startDate,
      endDate: data.endDate,
      selectedTaskIds,
    }
    if (onSave) {
      onSave(mapped)
    } else if (onCreate) {
      onCreate(mapped)
    } else {
      console.log('Project create', mapped)
    }
    reset()
  }

  if (!open) return null

  const selected = watch('selectedTasks') || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-w-3xl w-full max-h-[85vh] overflow-hidden">
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{project ? 'Edit project' : 'Create project'}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
          </div>

          <form className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-2" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-slate-300">Project name</label>
              <input
                {...register('projectName', { required: 'Project name is required' })}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-white"
              />
              {errors.projectName && <p className="mt-1 text-xs text-rose-400">{errors.projectName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Select users</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {users.map((u) => {
                  const userId = String(u.id ?? u._id ?? u.value ?? u)
                  return (
                    <label key={userId} className="inline-flex items-center gap-2">
                      <input type="checkbox" value={userId} {...register('users')} className="h-4 w-4" />
                      <span className="rounded-full bg-slate-800/60 px-3 py-1 text-sm text-slate-200">{u.username}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Select date range</label>
              <div className="mt-2 relative">
                <input
                  readOnly
                  value={range.from && range.to ? `${format(range.from, 'yyyy-MM-dd')} — ${format(range.to, 'yyyy-MM-dd')}` : ''}
                  onFocus={() => setShowCalendar(true)}
                  className="mt-2 w-full cursor-pointer rounded-lg border border-slate-700 bg-slate-800/90 px-3 py-2 text-white"
                />
                {showCalendar && (
                  <div className="absolute left-1/2 top-full z-40 mt-2 -translate-x-1/2 bg-slate-800/95 p-4 rounded-lg shadow-xl">
                    <RangeCalendar
                      selected={range}
                      onSelect={(r) => {
                        setRange(r || { from: undefined, to: undefined })
                        if (r && r.from) setValue('startDate', format(r.from, 'yyyy-MM-dd'))
                        if (r && r.to) setValue('endDate', format(r.to, 'yyyy-MM-dd'))
                        if (r && r.from && r.to) setShowCalendar(false)
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-300">Select tasks</label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" onChange={(e) => toggleSelectAll(e.target.checked)} checked={selected.length === taskList.length && taskList.length > 0} />
                    <span className="text-slate-300">Select all</span>
                  </label>
                </div>
              </div>

              <div className="mt-3 max-h-64 overflow-y-auto rounded-md border border-slate-800 p-3">
                {loadingTasks ? (
                  <div className="py-8 text-center text-slate-400">Loading tasks...</div>
                ) : taskList.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">No tasks available.</div>
                ) : (
                  taskList.map((t) => (
                    <div key={t.id} className="flex items-center gap-3 py-2">
                      <input type="checkbox" value={String(t.id)} {...register('selectedTasks')} className="h-4 w-4" />
                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-white">
                          <span>{t.taskName}</span>
                          <span className="rounded-full bg-slate-800/70 px-2 py-0.5 text-xs text-slate-300">SP {t.sp}</span>
                        </div>
                        <div className="text-xs text-slate-400">{t.description || ''}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* <div className="mt-2 flex justify-end">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" onChange={(e) => toggleSelectAll(e.target.checked)} checked={selected.length === taskList.length && taskList.length > 0} />
                  <span className="text-slate-300">Select all</span>
                </label>
              </div> */}
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => { reset(); onClose() }}>Cancel</Button>
              <Button type="submit">{project ? 'Save Project' : 'Create Project'}</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Modal
