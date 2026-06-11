import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useLogoutMutation } from '../redux-toolkit/service'
import { getRoleLabel } from '../utils/routeHelpers'

export default function Header({ onMenuToggle }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const [logoutApi, { isLoading }] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      const result = await logoutApi().unwrap()

      if (result.status) {
        logout()
        showToast({ type: 'success', message: result.message || 'Logged out successfully' })
        navigate('/login')
        return
      }

      showToast({ type: 'error', message: result.message || 'Logout failed' })
    } catch (err) {
      const message = err?.data?.message || err?.message || 'Logout failed. Please try again.'
      showToast({ type: 'error', message })
    }
  }

  return (
    <header className="z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">Avidus Admin</h1>
          <p className="hidden text-xs text-slate-500 sm:block">Manage your platform efficiently</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">{user?.name}</p>
          <p className="text-xs text-slate-500">{getRoleLabel(user?.role)}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-semibold text-white sm:h-10 sm:w-10">
          {user?.name?.charAt(0) || 'A'}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoading}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
        >
          {isLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </header>
  )
}
