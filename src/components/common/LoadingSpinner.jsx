export default function LoadingSpinner({
  isLoading = false,
  text = 'Loading...',
  className = '',
  size = 'md',
}) {
  if (!isLoading) return null

  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 ${className}`}>
      <span
        className={`${sizeClasses[size] || sizeClasses.md} animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600`}
        aria-hidden="true"
      />
      {text && <p className="text-sm font-medium text-slate-500">{text}</p>}
    </div>
  )
}
