export default function StatCard({ title, value, subtitle, icon: Icon, accent = 'indigo' }) {
  const accents = {
    indigo: 'from-indigo-500/10 to-indigo-600/5 border-indigo-500/20 text-indigo-600',
    violet: 'from-violet-500/10 to-violet-600/5 border-violet-500/20 text-violet-600',
    emerald: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-600',
    amber: 'from-amber-500/10 to-amber-600/5 border-amber-500/20 text-amber-600',
    rose: 'from-rose-500/10 to-rose-600/5 border-rose-500/20 text-rose-600',
  }

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 sm:p-6 ${accents[accent]}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value.toLocaleString()}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`rounded-xl bg-white/80 p-3 shadow-sm ${accents[accent].split(' ').pop()}`}>
            <Icon />
          </div>
        )}
      </div>
    </div>
  )
}
