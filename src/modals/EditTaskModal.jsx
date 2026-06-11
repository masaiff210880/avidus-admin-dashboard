import { useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext'
import { useFetchTaskByIdQuery, useUpdateTaskMutation } from '../redux-toolkit/service'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import Select from '../components/common/Select'
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from '../constants/taskOptions'
import { validateCreateTaskForm } from '../utils/validation'

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'

export default function EditTaskModal({ isOpen, onClose, taskId }) {
  const { showToast } = useToast()
  const { data, isLoading, isError, error } = useFetchTaskByIdQuery(taskId, {
    skip: !isOpen || !taskId,
  })
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation()

  const [form, setForm] = useState({ title: '', status: 'pending', priority: 'medium' })
  const [errors, setErrors] = useState({})

  const task = data?.status ? data.data : null
  const hasApiError = !isLoading && data && data.status === false

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
      })
      setErrors({})
    }
  }, [task])

  useEffect(() => {
    if (!isOpen) {
      setForm({ title: '', status: 'pending', priority: 'medium' })
      setErrors({})
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isUpdating) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, isUpdating, onClose])

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validateCreateTaskForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      const result = await updateTask({
        id: taskId,
        title: form.title.trim(),
        status: form.status,
        priority: form.priority,
      }).unwrap()

      if (result.status) {
        showToast({ type: 'success', message: result.message || 'Task updated successfully' })
        onClose()
        return
      }

      showToast({ type: 'error', message: result.message || 'Failed to update task' })
    } catch (err) {
      const message = err?.data?.message || err?.message || 'Failed to update task. Please try again.'
      showToast({ type: 'error', message })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={isUpdating ? undefined : onClose}
        aria-label="Close modal"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 id="edit-task-title" className="text-lg font-semibold text-slate-900">
              Edit Task
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">Update task details</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoading && <LoadingSpinner isLoading text="Loading task..." />}

        {!isLoading && (isError || hasApiError) && (
          <ErrorMessage
            error={isError ? error : null}
            message={hasApiError ? data.message : undefined}
            title="Failed to load task"
            className="mx-6 my-5 border-0 bg-transparent py-8"
          />
        )}

        {!isLoading && !isError && !hasApiError && task && (
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5" noValidate>
            <div>
              <label htmlFor="edit-task-title-input" className="mb-1 block text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                id="edit-task-title-input"
                type="text"
                value={form.title}
                onChange={updateField('title')}
                placeholder="Write the task title here..."
                className={`${inputClassName} ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
              />
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="edit-task-status" className="mb-1 block text-sm font-medium text-slate-700">
                Status
              </label>
              <Select
                id="edit-task-status"
                value={form.status}
                onChange={updateField('status')}
                options={TASK_STATUS_OPTIONS}
                hasError={!!errors.status}
                variant="light"
              />
              {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status}</p>}
            </div>

            <div>
              <label htmlFor="edit-task-priority" className="mb-1 block text-sm font-medium text-slate-700">
                Priority
              </label>
              <Select
                id="edit-task-priority"
                value={form.priority}
                onChange={updateField('priority')}
                options={TASK_PRIORITY_OPTIONS}
                hasError={!!errors.priority}
                variant="light"
              />
              {errors.priority && <p className="mt-1 text-xs text-red-500">{errors.priority}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isUpdating}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <Button type="submit" isLoading={isUpdating} loadingText="Updating task..." className="flex-1">
                Update Task
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
