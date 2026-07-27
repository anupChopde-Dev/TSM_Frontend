import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from './ui/Button'
import Card from './ui/Card'
import RangeCalendar from './RangeCalendar'
import { format } from 'date-fns'

const Modal = ({ open, onClose, users = [], availableTasks = [], onCreate }) => {
  const { register, handleSubmit, reset, watch, setValue, getValues, formState: { errors } } = useForm({
    defaultValues: {
      projectName: '',
      users: [],
      startDate: '',
      endDate: '',
      selectedTasks: [],
    },
  })

  const [showCalendar, setShowCalendar] = useState(false)
  const [range, setRange] = useState({ from: undefined, to: undefined })

  useEffect(() => {
    if (!open) {
      reset()
      setRange({ from: undefined, to: undefined })
      setShowCalendar(false)
    }
  }, [open, reset])

  function toggleSelectAll(val) {
    if (val) setValue('selectedTasks', availableTasks.map((t) => t.id))
    else setValue('selectedTasks', [])
  }

  function onSubmit(data) {
    const mapped = {
      projectName: data.projectName,
      users: (data.users || []).map((id) => users.find((u) => u.id === id)).filter(Boolean),
      startDate: data.startDate,
      endDate: data.endDate,
      selectedTaskIds: data.selectedTasks || [],
    }
    if (onCreate) onCreate(mapped)
    else console.log('Project create', mapped)
    reset()
  }

  if (!open) return null

  const selected = watch('selectedTasks') || []

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
                  <div className="absolute left-1/2 -translate-x-1/2 z-40 mt-2 bg-slate-800/95 p-4 rounded-lg shadow-xl">
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
                    <input type="checkbox" onChange={(e) => toggleSelectAll(e.target.checked)} checked={selected.length === availableTasks.length && availableTasks.length > 0} />
                    <span className="text-slate-300">Select all</span>
                  </label>
                </div>
              </div>

              <div className="mt-3 max-h-64 overflow-y-auto rounded-md border border-slate-800 p-3">
                {availableTasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 py-2">
                    <input type="checkbox" value={t.id} {...register('selectedTasks')} className="h-4 w-4" />
                    <div>
                      <div className="font-medium text-white">{t.title}</div>
                      <div className="text-xs text-slate-400">{t.description || ''}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 flex justify-end">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" onChange={(e) => toggleSelectAll(e.target.checked)} checked={selected.length === availableTasks.length && availableTasks.length > 0} />
                  <span className="text-slate-300">Select all</span>
                </label>
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
