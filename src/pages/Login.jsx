import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useLoginMutation } from '../redux-toolkit/service'
import Button from '../components/common/Button'
import PasswordInput from '../components/common/PasswordInput'
import { validateLoginForm } from '../utils/validation'

const inputClassName =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast } = useToast()
  const [loginUser, { isLoading }] = useLoginMutation()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validateLoginForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      const result = await loginUser({
        email: form.email.trim(),
        password: form.password,
      }).unwrap()

      if (result.status) {
        login(result.data.user, result.data.token)
        showToast({ type: 'success', message: result.message })
        navigate('/dashboard')
        return
      }

      showToast({ type: 'error', message: result.message || 'Login failed' })
    } catch (err) {
      const message = err?.data?.message || err?.message || 'Login failed. Please try again.'
      showToast({ type: 'error', message })
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center">
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to access your admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={updateField('email')}
              placeholder="you@avidus.com"
              className={`${inputClassName} ${errors.email ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30' : ''}`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
              Password
            </label>
            <PasswordInput
              id="password"
              value={form.password}
              onChange={updateField('password')}
              hasError={!!errors.password}
            />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-400">
              <input type="checkbox" className="rounded border-white/20 bg-white/5 text-indigo-500" />
              Remember me
            </label>
            <a href="#" className="text-indigo-400 hover:text-indigo-300">
              Forgot password?
            </a>
          </div>

          <Button type="submit" isLoading={isLoading} loadingText="Signing in...">
            Sign in
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-medium text-indigo-400 hover:text-indigo-300">
            Create account
          </Link>
        </p>
      </div>
    </div>
    </div>
  )
}
