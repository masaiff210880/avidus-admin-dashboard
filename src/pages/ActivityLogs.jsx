import { useFetchActivityLogsQuery } from '../redux-toolkit/service'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { formatDateTime } from '../utils/date'

function formatAction(action) {
  if (!action) return ''

  return action
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function ActivityLogs() {
  const { data, isLoading, isError, error } = useFetchActivityLogsQuery()

  const activities = data?.status ? data.data || [] : []
  const hasApiError = !isLoading && data && data.status === false

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Activity Logs</h2>
          <p className="mt-1 text-slate-500">
            Audit trail of all user actions and system events
            {data?.totalActivities != null && ` · ${data.totalActivities} total`}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          Export Logs
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <LoadingSpinner isLoading={isLoading} text="Loading activity logs..." />

        {!isLoading && (isError || hasApiError) && (
          <ErrorMessage
            error={isError ? error : null}
            message={hasApiError ? data.message : undefined}
            title="Failed to load activity logs"
          />
        )}

        {!isLoading && !isError && !hasApiError && (
          <div className="divide-y divide-slate-100">
            {activities.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-slate-500 sm:px-6">
                No activity logs found.
              </p>
            ) : (
              activities.map((activity) => {
                const userName = activity.user?.name || 'System'

                return (
                  <div
                    key={activity._id}
                    className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                        {userName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold text-slate-600">{userName}</span>
                          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                            {formatAction(activity.action)}
                          </span>
                        </div>
                        <p className="rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm font-semibold leading-relaxed text-slate-900 sm:text-base">
                          {activity.description}
                        </p>
                        {activity.task?.title && (
                          <p className="mt-2 text-sm font-medium text-indigo-600">
                            Task: {activity.task.title}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 pl-14 sm:pl-0">
                      <span className="text-xs font-medium text-slate-500 sm:text-sm">
                        {formatDateTime(activity.createdAt)}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}
