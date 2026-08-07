import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import api from '../api/axiosClient'
import Card from './ui/Card'
import Button from './ui/Button'

const TaskModal = ({
  open,
  onClose,
  onCreate,
  initialData = null,
  isEdit = false,
}) => {
  const [preview, setPreview] = useState([])

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
    if (!open) return

    if (initialData) {
      reset({
        taskName: initialData.taskName || '',
        priority: initialData.priority || 'Medium',
        description: initialData.description || '',
        sp: initialData.sp || '',
        images: null,
      })

      setPreview(Array.isArray(initialData.docs) ? initialData.docs : [])
    } else {
      reset({
        taskName: '',
        priority: 'Medium',
        description: '',
        sp: '',
        images: null,
      })

      setPreview([])
    }
  }, [initialData, open, reset])

  useEffect(() => {
    if (!imageFiles || imageFiles.length === 0) return

    const objectUrls = Array.from(imageFiles)
      .slice(0, 2)
      .map((file) => URL.createObjectURL(file))

    setPreview(objectUrls)

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imageFiles])

  const handleCancel = () => {
    reset()
    setPreview([])
    onClose()
  }

  const onSubmit = async (data) => {
    let docs = initialData?.docs || []

    if (data.images && data.images.length > 0) {
      docs = Array.from(data.images)
        .slice(0, 2)
        .map((file) => URL.createObjectURL(file))
    }

    const payload = {
      ...(initialData || {}),
      taskName: data.taskName,
      description: data.description,
      sp: Number(data.sp),
      priority: data.priority,
      docs,
    }

    if (!isEdit) {
      try {
        const response = await api.post('/api/tasks', payload)
        onCreate(response.data || payload)
      } catch (err) {
        console.error(err)
        onCreate(payload)
      }
    } else {
      onCreate(payload)
    }

    reset()
    setPreview([])
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {isEdit ? 'Edit Task' : 'Add Task'}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {isEdit
                ? 'Update task details.'
                : 'Fill in task details and upload up to 2 images.'}
            </p>
          </div>

          <button
            onClick={handleCancel}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form
          className="mt-6 space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="block text-sm font-medium text-slate-300">
              Task name
            </label>

            <input
              {...register('taskName', {
                required: 'Task name is required',
              })}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/90 px-3 py-2 text-white outline-none focus:border-cyan-400"
              placeholder="Enter task name"
            />

            {errors.taskName && (
              <p className="mt-1 text-xs text-rose-400">
                {errors.taskName.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-300">
                Priority
              </label>

              <select
                {...register('priority')}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/90 px-3 py-2 text-white outline-none focus:border-cyan-400"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">
                SP
              </label>

              <input
                type="number"
                {...register('sp', {
                  required: 'SP is required',
                  min: {
                    value: 1,
                    message: 'SP must be at least 1',
                  },
                })}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/90 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />

              {errors.sp && (
                <p className="mt-1 text-xs text-rose-400">
                  {errors.sp.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              Description
            </label>

            <textarea
              {...register('description')}
              className="mt-2 h-24 w-full rounded-lg border border-slate-700 bg-slate-950/90 px-3 py-2 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              Upload Images
            </label>

            <label className="mt-2 flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-slate-300 hover:border-cyan-400 hover:text-white">
              <span>
                {preview.length
                  ? 'Change Images'
                  : 'Select up to 2 images'}
              </span>

              <input
                type="file"
                accept="image/*"
                multiple
                {...register('images')}
                className="hidden"
              />
            </label>

            {preview.length > 0 && (
              <div className="mt-3 flex gap-3">
                {preview.map((src, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-700 p-2"
                  >
                    <img
                      src={typeof src === 'string' ? src : src.thumbnail}
                      alt=""
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <Button type="submit">
              {isEdit ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default TaskModal