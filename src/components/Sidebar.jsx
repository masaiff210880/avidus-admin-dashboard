import { NavLink } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { getMenuForRole } from '../utils/routeHelpers'
import { NavIcon } from './icons/NavIcons'

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const menuItems = getMenuForRole(user?.role)

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-slate-700/50 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white">
          A
        </div>
        <div>
          <p className="font-semibold text-white">Avidus</p>
          <p className="text-xs text-slate-400">Admin Panel</p>
        </div>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Main Menu
        </p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <NavIcon name={item.icon} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-700/50 p-4">
        <div className="rounded-xl bg-slate-800/60 p-3">
          <p className="text-xs text-slate-400">Logged in as</p>
          <p className="mt-0.5 truncate text-sm font-medium text-white">{user?.name}</p>
          <p className="truncate text-xs text-indigo-400 capitalize">{user?.role}</p>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar — fixed full height */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden h-screen w-64 flex-col bg-slate-900 lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-900 transition-transform duration-300 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:text-white"
          aria-label="Close menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {sidebarContent}
      </aside>
    </>
  )
}
