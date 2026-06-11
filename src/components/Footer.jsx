export default function Footer() {
  return (
    <footer className="shrink-0 border-t border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Avidus. All rights reserved.
        </p>
        <p className="text-xs text-slate-400">
          Admin Dashboard v1.0
        </p>
      </div>
    </footer>
  )
}
