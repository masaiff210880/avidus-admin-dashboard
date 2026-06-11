import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { useFetchUserTasksQuery } from '../redux-toolkit/service'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import TaskTable from '../components/tasks/TaskTable'
import TaskModals from '../components/tasks/TaskModals'
import useTaskActions from '../hooks/useTaskActions'

export default function UserTasks() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { userId } = useParams()
  const location = useLocation()
  const { userName, userEmail } = location.state || {}

  const { data, isLoading, isError, error } = useFetchUserTasksQuery(userId, {
    skip: !userId,
  })

  const {
    viewTaskId,
    editTaskId,
    setViewTaskId,
    setEditTaskId,
    handleView,
    handleEdit,
    handleDelete,
  } = useTaskActions()

  const tasks = data?.status ? data.data || [] : []
  const hasApiError = !isLoading && data && data.status === false

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Link
        to="/users"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-indigo-600 transition hover:text-indigo-500"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Users
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">User Tasks</h2>
          <p className="mt-1 text-slate-500">
            {userName ? (
              <>
                Tasks created by <span className="font-medium text-slate-700">{userName}</span>
                {userEmail && <span className="text-slate-400"> · {userEmail}</span>}
              </>
            ) : (
              'Tasks for selected user'
            )}
            {data?.totalTasks != null && ` · ${data.totalTasks} total`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
        >
          + Create Task
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <LoadingSpinner isLoading={isLoading} text="Loading user tasks..." />

        {!isLoading && (isError || hasApiError) && (
          <ErrorMessage
            error={isError ? error : null}
            message={hasApiError ? data.message : undefined}
            title="Failed to load user tasks"
          />
        )}

        {!isLoading && !isError && !hasApiError && (
          <TaskTable
            tasks={tasks}
            showCreatedBy={false}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <TaskModals
        isCreateOpen={isCreateModalOpen}
        onCreateClose={() => setIsCreateModalOpen(false)}
        viewTaskId={viewTaskId}
        onViewClose={() => setViewTaskId(null)}
        editTaskId={editTaskId}
        onEditClose={() => setEditTaskId(null)}
      />
    </div>
  )
}
