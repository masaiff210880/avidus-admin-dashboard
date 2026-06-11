import { useState } from 'react'
import { useDeleteTaskMutation } from '../redux-toolkit/service'
import { useToast } from '../context/ToastContext'

export default function useTaskActions() {
  const { showToast } = useToast()
  const [viewTaskId, setViewTaskId] = useState(null)
  const [editTaskId, setEditTaskId] = useState(null)
  const [deleteTask] = useDeleteTaskMutation()

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

  return {
    viewTaskId,
    editTaskId,
    setViewTaskId,
    setEditTaskId,
    handleView,
    handleEdit,
    handleDelete,
  }
}
