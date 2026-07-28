import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import api from '../api/axiosClient'
import Card from './ui/Card'
import Button from './ui/Button'

const TaskModal = ({ open, onClose, onCreate }) => {
  const [preview, setPreview] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      taskName: '',
      priority: 'Medium',
      description: '',
      sp: '',
      images: null,
    },
  })

  const imageFiles = watch('images')

  useEffect(() => {
    if (!imageFiles || imageFiles.length === 0) {
      setPreview(null)
      return
    }

    const objectUrls = Array.from(imageFiles).map((file) => URL.createObjectURL(file))
    setPreview(objectUrls)

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imageFiles])

  const handleCancel = () => {
    reset()
    setPreview(null)
    onClose()
  }

  const onSubmit = async (data) => {
    const files = data.images ? Array.from(data.images) : []
    const docs = files.slice(0, 2).map((file) => URL.createObjectURL(file))

    const payload = {
      taskName: data.taskName,
      description: data.description,
      sp: Number(data.sp),
      priority: data.priority,
      docs,
    }

    try {
      const taskResponse = await api.post('/api/tasks', payload)
      const createdTask = taskResponse.data || payload
      onCreate(createdTask)
    } catch (taskError) {
      console.error('Task creation failed, falling back to local state', taskError)
      onCreate(payload)
    }

    reset()
    setPreview(null)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Add Task</h3>
            <p className="mt-1 text-sm text-slate-400">Fill in task details and upload up to 2 images.</p>
          </div>
          <button onClick={handleCancel} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-slate-300">Task name</label>
            <input
              {...register('taskName', { required: 'Task name is required' })}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/90 px-3 py-2 text-white outline-none focus:border-cyan-400"
              placeholder="Enter task name"
            />
            {errors.taskName && <p className="mt-1 text-xs text-rose-400">{errors.taskName.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-300">Priority</label>
              <select
                {...register('priority', { required: 'Priority is required' })}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/90 px-3 py-2 text-white outline-none focus:border-cyan-400"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">SP</label>
              <input
                type="number"
                {...register('sp', { required: 'SP is required', min: { value: 1, message: 'SP must be at least 1' } })}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/90 px-3 py-2 text-white outline-none focus:border-cyan-400"
                placeholder="Story points"
              />
              {errors.sp && <p className="mt-1 text-xs text-rose-400">{errors.sp.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Description</label>
            <textarea
              {...register('description')}
              className="mt-2 h-24 w-full rounded-lg border border-slate-700 bg-slate-950/90 px-3 py-2 text-white outline-none focus:border-cyan-400"
              placeholder="Add task description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Upload images</label>
            <label className="mt-2 flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-slate-300 transition hover:border-cyan-400 hover:text-white">
              <span>{preview ? 'Change images' : 'Select up to 2 images'}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                {...register('images')}
                className="hidden"
              />
            </label>
            {preview && (
              <div className="mt-3 flex justify-start gap-3">
                {preview.map((src, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950/80 p-2">
                    <img src={src} alt={`Preview ${index + 1}`} className="h-16 w-18 rounded-lg object-cover" />
                    {/* <div>
                      <p className="font-medium text-white">Preview {index + 1}</p>
                    </div> */}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" type="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default TaskModal
