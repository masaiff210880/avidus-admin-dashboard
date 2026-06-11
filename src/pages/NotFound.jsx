import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

const REDIRECT_SECONDS = 5

export default function NotFound() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS)

  const redirectPath = isAuthenticated ? '/dashboard' : '/login'
  const redirectLabel = isAuthenticated ? 'Dashboard' : 'Login'

  useEffect(() => {
    const countdown = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0))
    }, 1000)

    const redirect = setTimeout(() => {
      navigate(redirectPath, { replace: true })
    }, REDIRECT_SECONDS * 1000)

    return () => {
      clearInterval(countdown)
      clearTimeout(redirect)
    }
  }, [navigate, redirectPath])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <span className="text-2xl font-bold">404</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
        <p className="mt-2 max-w-sm text-slate-500">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <p className="mt-4 text-sm text-slate-400">
          Redirecting to {redirectLabel} in{' '}
          <span className="font-semibold text-indigo-600">{secondsLeft}</span> second
          {secondsLeft !== 1 ? 's' : ''}...
        </p>
        <Link
          to={redirectPath}
          className="mt-6 inline-flex rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Go to {redirectLabel}
        </Link>
      </div>
    </div>
  )
}
