import { useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext'
import { useCreateTaskMutation } from '../redux-toolkit/service'
import Button from '../components/common/Button'
import Select from '../components/common/Select'
import { validateCreateTaskForm } from '../utils/validation'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const INITIAL_FORM = {
  title: '',
  status: 'pending',
  priority: 'medium',
}

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'

export default function CreateTaskModal({ isOpen, onClose }) {
  const { showToast } = useToast()
  const [createTask, { isLoading }] = useCreateTaskMutation()
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isOpen) {
      setForm(INITIAL_FORM)
      setErrors({})
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, isLoading, onClose])

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
      const result = await createTask({
        title: form.title.trim(),
        status: form.status,
        priority: form.priority,
      }).unwrap()

      if (result.status) {
        showToast({ type: 'success', message: result.message || 'Task created successfully' })
        onClose()
        return
      }

      showToast({ type: 'error', message: result.message || 'Failed to create task' })
    } catch (err) {
      const message = err?.data?.message || err?.message || 'Failed to create task. Please try again.'
      showToast({ type: 'error', message })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={isLoading ? undefined : onClose}
        aria-label="Close modal"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 id="create-task-title" className="text-lg font-semibold text-slate-900">
              Add New Task
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">Create a new task for your team</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5" noValidate>
          <div>
            <label htmlFor="create-task-title-input" className="mb-1 block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              id="create-task-title-input"
              type="text"
              value={form.title}
              onChange={updateField('title')}
              placeholder="Write the task title here..."
              className={`${inputClassName} ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="create-task-status" className="mb-1 block text-sm font-medium text-slate-700">
              Status
            </label>
            <Select
              id="create-task-status"
              value={form.status}
              onChange={updateField('status')}
              options={STATUS_OPTIONS}
              hasError={!!errors.status}
              variant="light"
            />
            {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status}</p>}
          </div>

          <div>
            <label htmlFor="create-task-priority" className="mb-1 block text-sm font-medium text-slate-700">
              Priority
            </label>
            <Select
              id="create-task-priority"
              value={form.priority}
              onChange={updateField('priority')}
              options={PRIORITY_OPTIONS}
              hasError={!!errors.priority}
              variant="light"
            />
            {errors.priority && <p className="mt-1 text-xs text-red-500">{errors.priority}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <Button type="submit" isLoading={isLoading} loadingText="Creating task..." className="flex-1">
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
