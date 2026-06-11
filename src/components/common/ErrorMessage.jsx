export default function ErrorMessage({
  error,
  message,
  title = 'Unable to load data',
  className = '',
}) {
  const displayMessage =
    message || error?.data?.message || error?.message || 'Something went wrong. Please try again.'

  if (!error && !message) return null

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center ${className}`}
      role="alert"
    >
      <span
        className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600"
        aria-hidden="true"
      >
        !
      </span>
      <p className="text-sm font-semibold text-red-800">{title}</p>
      <p className="max-w-md text-sm text-red-600">{displayMessage}</p>
    </div>
  )
}
