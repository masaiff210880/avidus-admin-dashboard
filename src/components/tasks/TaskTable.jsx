import ActionMenu from '../common/ActionMenu'
import {
  TASK_PRIORITY_STYLES,
  TASK_STATUS_LABELS,
  TASK_STATUS_STYLES,
} from '../../constants/taskOptions'
import { formatDateTime } from '../../utils/date'
import { getTaskActionOptions } from '../../utils/taskActions'

export default function TaskTable({ tasks, onView, onEdit, onDelete, showCreatedBy = true }) {
  if (!tasks.length) {
    return (
      <p className="px-4 py-10 text-center text-sm text-slate-500 sm:px-6">
        No tasks found.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Title</th>
            {showCreatedBy && (
              <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Created By</th>
            )}
            <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Priority</th>
            <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Status</th>
            <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Created</th>
            <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <tr key={task._id || task.id} className="hover:bg-slate-50/80">
              <td className="px-4 py-3.5 font-medium text-slate-900 sm:px-6">{task.title}</td>
              {showCreatedBy && (
                <td className="px-4 py-3.5 text-slate-600 sm:px-6">
                  {task.createdBy?.name || 'Unknown'}
                </td>
              )}
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
                    onView,
                    onEdit,
                    onDelete,
                  })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
