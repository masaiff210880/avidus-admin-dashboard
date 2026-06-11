import { useEffect } from 'react'
import { useFetchTaskByIdQuery } from '../redux-toolkit/service'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import {
  TASK_PRIORITY_STYLES,
  TASK_STATUS_LABELS,
  TASK_STATUS_STYLES,
} from '../constants/taskOptions'
import { formatDateTime } from '../utils/date'

function DetailRow({ label, children }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <div className="text-sm font-semibold text-slate-900 sm:text-right">{children}</div>
    </div>
  )
}

export default function ViewTaskModal({ isOpen, onClose, taskId }) {
  const { data, isLoading, isError, error } = useFetchTaskByIdQuery(taskId, {
    skip: !isOpen || !taskId,
  })

  const task = data?.status ? data.data : null
  const hasApiError = !isLoading && data && data.status === false

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-task-title"
        className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 id="view-task-title" className="text-lg font-semibold text-slate-900">
              Task Preview
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">View task details</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoading && <LoadingSpinner isLoading text="Loading task..." />}

        {!isLoading && (isError || hasApiError) && (
          <ErrorMessage
            error={isError ? error : null}
            message={hasApiError ? data.message : undefined}
            title="Failed to load task"
            className="mx-6 my-5 border-0 bg-transparent py-8"
          />
        )}

        {!isLoading && !isError && !hasApiError && task && (
          <div className="space-y-5 px-6 py-5">
            <div className="rounded-xl bg-slate-50 px-4 py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Title</p>
              <p className="mt-1 text-base font-semibold leading-relaxed text-slate-900">{task.title}</p>
            </div>

            <div className="space-y-4 rounded-xl border border-slate-200 p-4">
              <DetailRow label="Status">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    TASK_STATUS_STYLES[task.status] || TASK_STATUS_STYLES.pending
                  }`}
                >
                  {TASK_STATUS_LABELS[task.status] || task.status}
                </span>
              </DetailRow>

              <DetailRow label="Priority">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    TASK_PRIORITY_STYLES[task.priority] || TASK_PRIORITY_STYLES.low
                  }`}
                >
                  {task.priority}
                </span>
              </DetailRow>

              <DetailRow label="Created By">
                {task.createdBy?.name || 'Unknown'}
              </DetailRow>

              {task.createdBy?.email && (
                <DetailRow label="Email">{task.createdBy.email}</DetailRow>
              )}

              {task.createdBy?.role && (
                <DetailRow label="Role">
                  <span className="capitalize">{task.createdBy.role}</span>
                </DetailRow>
              )}

              <DetailRow label="Created At">{formatDateTime(task.createdAt)}</DetailRow>

              <DetailRow label="Updated At">{formatDateTime(task.updatedAt)}</DetailRow>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
