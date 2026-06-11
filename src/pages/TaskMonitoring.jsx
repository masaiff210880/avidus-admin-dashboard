import { useState } from 'react'
import {
  useDeleteTaskMutation,
  useFetchAllTasksQuery,
} from '../redux-toolkit/service'
import ActionMenu from '../components/common/ActionMenu'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import CreateTaskModal from '../modals/CreateTaskModal'
import EditTaskModal from '../modals/EditTaskModal'
import ViewTaskModal from '../modals/ViewTaskModal'
import { useToast } from '../context/ToastContext'
import {
  TASK_PRIORITY_STYLES,
  TASK_STATUS_LABELS,
  TASK_STATUS_STYLES,
} from '../constants/taskOptions'
import { formatDateTime } from '../utils/date'
import { getTaskActionOptions } from '../utils/taskActions'

export default function TaskMonitoring() {
  const { showToast } = useToast()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [viewTaskId, setViewTaskId] = useState(null)
  const [editTaskId, setEditTaskId] = useState(null)

  const { data, isLoading, isError, error } = useFetchAllTasksQuery()
  const [deleteTask] = useDeleteTaskMutation()

  const tasks = data?.status ? data.data || [] : []
  const hasApiError = !isLoading && data && data.status === false

  const handleView = (task) => {
    setViewTaskId(task._id || task.id)
  }

  const handleEdit = (task) => {
    setEditTaskId(task._id || task.id)
  }

  const handleDelete = async (task) => {
    const taskId = task._id || task.id

    try {
      const result = await deleteTask(taskId).unwrap()

      if (result.status) {
        showToast({ type: 'success', message: result.message || 'Task deleted successfully' })
        return
      }

      showToast({ type: 'error', message: result.message || 'Failed to delete task' })
    } catch (err) {
      const message = err?.data?.message || err?.message || 'Failed to delete task. Please try again.'
      showToast({ type: 'error', message })
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Task Monitoring</h2>
          <p className="mt-1 text-slate-500">
            Track and manage all tasks across your organization
            {data?.totalTasks != null && ` · ${data.totalTasks} total`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
        >
          + Add Task
        </button>
      </div>

      {isLoading && <LoadingSpinner isLoading text="Loading tasks..." />}

      {!isLoading && (isError || hasApiError) && (
        <ErrorMessage
          error={isError ? error : null}
          message={hasApiError ? data.message : undefined}
          title="Failed to load tasks"
        />
      )}

      {!isLoading && !isError && !hasApiError && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {tasks.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-slate-500 sm:px-6">
                No tasks found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Title</th>
                      <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Created By</th>
                      <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Priority</th>
                      <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Status</th>
                      <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Created</th>
                      <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tasks.map((task) => (
                      <tr key={task._id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3.5 font-medium text-slate-900 sm:px-6">{task.title}</td>
                        <td className="px-4 py-3.5 text-slate-600 sm:px-6">
                          {task.createdBy?.name || 'Unknown'}
                        </td>
                        <td className="px-4 py-3.5 sm:px-6">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                              TASK_PRIORITY_STYLES[task.priority] || TASK_PRIORITY_STYLES.low
                            }`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 sm:px-6">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              TASK_STATUS_STYLES[task.status] || TASK_STATUS_STYLES.pending
                            }`}
                          >
                            {TASK_STATUS_LABELS[task.status] || task.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 sm:px-6">
                          {formatDateTime(task.createdAt)}
                        </td>
                        <td className="relative px-4 py-3.5 sm:px-6">
                          <ActionMenu
                            options={getTaskActionOptions(task, {
                              onView: handleView,
                              onEdit: handleEdit,
                              onDelete: handleDelete,
                            })}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
      )}

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <ViewTaskModal
        isOpen={!!viewTaskId}
        taskId={viewTaskId}
        onClose={() => setViewTaskId(null)}
      />

      <EditTaskModal
        isOpen={!!editTaskId}
        taskId={editTaskId}
        onClose={() => setEditTaskId(null)}
      />
    </div>
  )
}
