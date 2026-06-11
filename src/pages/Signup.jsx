import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useToast } from '../context/ToastContext'
import { useRegisterMutation } from '../redux-toolkit/service'
import Button from '../components/common/Button'
import PasswordInput from '../components/common/PasswordInput'
import Select from '../components/common/Select'
import { validateSignupForm } from '../utils/validation'

const ROLE_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
]

const inputClassName =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'

export default function Signup() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [register, { isLoading }] = useRegisterMutation()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [errors, setErrors] = useState({})

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validateSignupForm({ ...form, agreedToTerms })
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
        showToast({ type: 'success', message: result.message })
        navigate('/login')
        return
      }

      showToast({ type: 'error', message: result.message || 'Registration failed' })
    } catch (err) {
      const message = err?.data?.message || err?.message || 'Registration failed. Please try again.'
      showToast({ type: 'error', message })
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="mb-5 text-center">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Create account</h1>
          <p className="mt-1.5 text-sm text-slate-400">Join Avidus and start managing tasks</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-300">
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={updateField('name')}
              placeholder="John Doe"
              className={`${inputClassName} ${errors.name ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30' : ''}`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="signup-email" className="mb-1 block text-sm font-medium text-slate-300">
              Email address
            </label>
            <input
              id="signup-email"
              type="email"
              value={form.email}
              onChange={updateField('email')}
              placeholder="you@avidus.com"
              className={`${inputClassName} ${errors.email ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30' : ''}`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="signup-role" className="mb-1 block text-sm font-medium text-slate-300">
              Role
            </label>
            <Select
              id="signup-role"
              value={form.role}
              onChange={updateField('role')}
              options={ROLE_OPTIONS}
              hasError={!!errors.role}
            />
            {errors.role && <p className="mt-1 text-xs text-red-400">{errors.role}</p>}
          </div>

          <div>
            <label htmlFor="signup-password" className="mb-1 block text-sm font-medium text-slate-300">
              Password
            </label>
            <PasswordInput
              id="signup-password"
              value={form.password}
              onChange={updateField('password')}
              hasError={!!errors.password}
            />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
          </div>

          <div>
            <label className="flex items-start gap-2 text-xs text-slate-400 sm:text-sm">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked)
                  if (errors.terms) {
                    setErrors((prev) => ({ ...prev, terms: undefined }))
                  }
                }}
                className="mt-0.5 rounded border-white/20 bg-white/5 text-indigo-500"
              />
              I agree to the Terms of Service and Privacy Policy
            </label>
            {errors.terms && <p className="mt-1 text-xs text-red-400">{errors.terms}</p>}
          </div>

          <Button type="submit" isLoading={isLoading} loadingText="Creating account...">
            Create account
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
