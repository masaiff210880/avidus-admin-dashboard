import { useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext'
import { useRegisterMutation } from '../redux-toolkit/service'
import Button from '../components/common/Button'
import PasswordInput from '../components/common/PasswordInput'
import Select from '../components/common/Select'
import { validateCreateUserForm } from '../utils/validation'

const ROLE_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
]

const INITIAL_FORM = {
  name: '',
  email: '',
  password: '',
  role: 'user',
}

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'

export default function CreateUserModal({ isOpen, onClose }) {
  const { showToast } = useToast()
  const [register, { isLoading }] = useRegisterMutation()
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

    const validationErrors = validateCreateUserForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      const result = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      }).unwrap()

      if (result.status) {
        showToast({ type: 'success', message: result.message || 'User created successfully' })
        onClose()
        return
      }

      showToast({ type: 'error', message: result.message || 'Failed to create user' })
    } catch (err) {
      const message = err?.data?.message || err?.message || 'Failed to create user. Please try again.'
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
        aria-labelledby="create-user-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 id="create-user-title" className="text-lg font-semibold text-slate-900">
              Add New User
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">Create a new platform user account</p>
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
            <label htmlFor="create-user-name" className="mb-1 block text-sm font-medium text-slate-700">
              Full name
            </label>
            <input
              id="create-user-name"
              type="text"
              value={form.name}
              onChange={updateField('name')}
              placeholder="John Doe"
              className={`${inputClassName} ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="create-user-email" className="mb-1 block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              id="create-user-email"
              type="email"
              value={form.email}
              onChange={updateField('email')}
              placeholder="you@avidus.com"
              className={`${inputClassName} ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="create-user-role" className="mb-1 block text-sm font-medium text-slate-700">
              Role
            </label>
            <Select
              id="create-user-role"
              value={form.role}
              onChange={updateField('role')}
              options={ROLE_OPTIONS}
              hasError={!!errors.role}
              variant="light"
            />
            {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}
          </div>

          <div>
            <label htmlFor="create-user-password" className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <PasswordInput
              id="create-user-password"
              value={form.password}
              onChange={updateField('password')}
              hasError={!!errors.password}
              variant="light"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
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
            <Button
              type="submit"
              isLoading={isLoading}
              loadingText="Creating user..."
              className="flex-1"
            >
              Create User
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
