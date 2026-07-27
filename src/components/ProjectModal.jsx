import React, { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import Button from './ui/Button'
import Card from './ui/Card'

const Modal = ({ open, onClose, users = [], onCreate }) => {
  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      projectName: '',
      users: [],
      startDate: '',
      endDate: '',
      tasks: [{ title: '', assignee: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'tasks' })

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  function onSubmit(data) {
    // Map assignee ids to user objects
    const mapped = {
      ...data,
      users: (data.users || []).map((id) => users.find((u) => u.id === id)).filter(Boolean),
      tasks: (data.tasks || []).map((t) => ({ ...t, assignee: users.find((u) => u.id === t.assignee) || null })),
    }
    if (onCreate) onCreate(mapped)
    else console.log('Project create', mapped)
    reset()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-w-3xl w-full">
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Create project</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
          </div>

          <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                {users.map((u) => (
                  <label key={u.id} className="inline-flex items-center gap-2">
                    <input type="checkbox" value={u.id} {...register('users')} className="h-4 w-4" />
                    <span className="rounded-full bg-slate-800/60 px-3 py-1 text-sm text-slate-200">{u.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300">Start date</label>
                <input type="date" {...register('startDate', { required: 'Start date required' })} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-white" />
                {errors.startDate && <p className="mt-1 text-xs text-rose-400">{errors.startDate.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">End date</label>
                <input type="date" {...register('endDate', { required: 'End date required', validate: (v) => v >= watch('startDate') || 'End date should be after start date' })} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-white" />
                {errors.endDate && <p className="mt-1 text-xs text-rose-400">{errors.endDate.message}</p>}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-300">Tasks</label>
                <button type="button" onClick={() => append({ title: '', assignee: '' })} className="text-sm text-cyan-300">+ add</button>
              </div>

              <div className="mt-3 space-y-3">
                {fields.map((field, idx) => (
                  <div key={field.id} className="flex items-start gap-2">
                    <input {...register(`tasks.${idx}.title`, { required: 'Task title required' })} placeholder="Task title" className="w-2/3 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-white" />
                    <select {...register(`tasks.${idx}.assignee`)} className="w-1/3 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-white">
                      <option value="">Unassigned</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => remove(idx)} className="text-rose-400">Remove</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => { reset(); onClose() }}>Cancel</Button>
              <Button type="submit">Create Project</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Modal
