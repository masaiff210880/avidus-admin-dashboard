import {
  useFetchActivityLogsQuery,
  useFetchAllTasksQuery,
  useFetchAllUsersQuery,
} from '../redux-toolkit/service'
import StatCard from '../components/StatCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { TASK_STATUS_LABELS, TASK_STATUS_STYLES } from '../constants/taskOptions'
import { formatDateTime } from '../utils/date'

function UsersStatIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
    </svg>
  )
}

function TasksStatIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function formatAction(action) {
  if (!action) return ''

  return action
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function sortByRecent(items) {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
    const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime()
    return dateB - dateA
  })
}

function parseListData(data) {
  if (!data?.status) return []

  return Array.isArray(data.data) ? data.data : data.data?.users || data.data?.tasks || []
}

export default function Dashboard() {
  const { user } = useAuth()

  const { data: usersData, isLoading: usersLoading } = useFetchAllUsersQuery()
  const { data: tasksData, isLoading: tasksLoading } = useFetchAllTasksQuery()
  const { data: activitiesData, isLoading: activitiesLoading } = useFetchActivityLogsQuery()

  const isLoading = usersLoading || tasksLoading || activitiesLoading

  const users = parseListData(usersData)
  const tasks = parseListData(tasksData)
  const activities = activitiesData?.status ? activitiesData.data || [] : []

  const totalUsers = usersData?.totalUsers ?? users.length
  const totalTasks = tasksData?.totalTasks ?? tasks.length
  const completedTasks = tasks.filter((task) => task.status === 'completed').length
  const pendingTasks = tasks.filter((task) => task.status === 'pending').length
  const inProgressTasks = tasks.filter((task) => task.status === 'in-progress').length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const recentTasks = sortByRecent(tasks).slice(0, 5)
  const recentActivities = sortByRecent(activities).slice(0, 5)

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Good morning, {user?.name?.split(' ')[0]}
        </h2>
        <p className="mt-1 text-slate-500">Here&apos;s what&apos;s happening across your platform today.</p>
      </div>

      {isLoading && <LoadingSpinner isLoading text="Loading dashboard..." />}

      {!isLoading && (
        <>
          <section>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Analytics Overview</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Users"
                value={totalUsers}
                subtitle="Registered platform users"
                icon={UsersStatIcon}
                accent="indigo"
              />
              <StatCard
                title="Total Tasks"
                value={totalTasks}
                subtitle="Across all projects"
                icon={TasksStatIcon}
                accent="violet"
              />
              <StatCard
                title="Completed Tasks"
                value={completedTasks}
                subtitle={`${completionRate}% completion rate`}
                icon={CheckIcon}
                accent="emerald"
              />
              <StatCard
                title="Pending Tasks"
                value={pendingTasks}
                subtitle={
                  inProgressTasks > 0
                    ? `${inProgressTasks} in progress`
                    : 'Awaiting action'
                }
                icon={ClockIcon}
                accent="amber"
              />
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Recent Tasks</h3>
              <div className="space-y-3">
                {recentTasks.length === 0 ? (
                  <p className="py-6 text-center text-sm text-slate-500">No tasks found.</p>
                ) : (
                  recentTasks.map((task) => (
                    <div
                      key={task._id || task.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">{task.title}</p>
                        <p className="text-xs text-slate-500">
                          {task.createdBy?.name || 'Unknown'} · {formatDateTime(task.updatedAt || task.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status={task.status} />
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivities.length === 0 ? (
                  <p className="py-6 text-center text-sm text-slate-500">No activity found.</p>
                ) : (
                  recentActivities.map((activity) => (
                    <div
                      key={activity._id}
                      className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                    >
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-600">
                          {activity.user?.name || 'System'}
                        </span>
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                          {formatAction(activity.action)}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{activity.description}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {formatDateTime(activity.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        TASK_STATUS_STYLES[status] || TASK_STATUS_STYLES.pending
      }`}
    >
      {TASK_STATUS_LABELS[status] || status}
    </span>
  )
}
