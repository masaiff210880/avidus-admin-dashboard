import { Outlet, Link, useLocation } from 'react-router'

export default function AuthLayout() {
  const { pathname } = useLocation()
  const isSignup = pathname === '/signup'

  return (
    <div
      className={`relative flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 ${
        isSignup ? 'min-h-screen' : 'h-screen overflow-hidden'
      }`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <header className="relative z-10 flex shrink-0 items-center px-6 py-4 sm:px-10">
        <Link to="/login" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white shadow-lg shadow-indigo-500/25">
            A
          </div>
          <span className="text-xl font-semibold text-white">Avidus</span>
        </Link>
      </header>

      <main
        className={`relative z-10 px-4 sm:px-6 ${
          isSignup
            ? 'flex flex-1 items-center justify-center py-6 sm:py-8'
            : 'flex min-h-0 flex-1 flex-col overflow-hidden'
        }`}
      >
        <Outlet />
      </main>

      <footer className="relative z-10 shrink-0 px-6 py-3 text-center text-sm text-slate-500 sm:px-10">
        &copy; {new Date().getFullYear()} Avidus. Secure admin access.
      </footer>
    </div>
  )
}
