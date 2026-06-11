import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  useDeleteUserMutation,
  useFetchAllUsersQuery,
  useUpdateUserStatusMutation,
} from '../redux-toolkit/service'
import ActionMenu from '../components/common/ActionMenu'
import Badge from '../components/common/Badge'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import CreateUserModal from '../modals/CreateUserModal'
import { useToast } from '../context/ToastContext'
import { formatDateTime } from '../utils/date'
import { getUserActionOptions } from '../utils/userActions'

export default function UserManagement() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { data, isLoading, isError, error } = useFetchAllUsersQuery()
  const [deleteUser] = useDeleteUserMutation()
  const [updateUserStatus] = useUpdateUserStatusMutation()

  const handleViewTasks = (user) => {
    const userId = user._id || user.id
    navigate(`/users/${userId}/tasks`, {
      state: { userName: user.name, userEmail: user.email },
    })
  }

  const handleStatusChange = async (user, newStatus) => {
    const { password, ...safeUser } = user
    const updatedUser = {
      ...safeUser,
      status: newStatus,
    }

    try {
      const result = await updateUserStatus(updatedUser).unwrap()

      if (result.status) {
        showToast({
          type: 'success',
          message: result.message || `${user.name} marked as ${newStatus}.`,
        })
        return
      }

      showToast({ type: 'error', message: result.message || 'Failed to update user status' })
    } catch (err) {
      const message = err?.data?.message || err?.message || 'Failed to update user status. Please try again.'
      showToast({ type: 'error', message })
    }
  }

  const handleDelete = async (user) => {
    const userId = user._id || user.id

    try {
      const result = await deleteUser(userId).unwrap()

      if (result.status) {
        showToast({ type: 'success', message: result.message || `${user.name} deleted successfully` })
        return
      }

      showToast({ type: 'error', message: result.message || 'Failed to delete user' })
    } catch (err) {
      const message = err?.data?.message || err?.message || 'Failed to delete user. Please try again.'
      showToast({ type: 'error', message })
    }
  }

  const users = data?.status
    ? Array.isArray(data.data)
      ? data.data
      : data.data?.users || []
    : []
  const hasApiError = !isLoading && data && data.status === false

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">User Management</h2>
          <p className="mt-1 text-slate-500">Manage platform users, roles, and access permissions.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
        >
          + Add User
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <LoadingSpinner isLoading={isLoading} text="Loading users..." />

        {!isLoading && (isError || hasApiError) && (
          <ErrorMessage
            error={isError ? error : null}
            message={hasApiError ? data.message : undefined}
            title="Failed to load users"
          />
        )}

        {!isLoading && !isError && !hasApiError && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Name</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Email</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Role</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Status</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Joined</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500 sm:px-6">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id || user.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3.5 font-medium text-slate-900 sm:px-6">{user.name}</td>
                      <td className="px-4 py-3.5 text-slate-600 sm:px-6">{user.email}</td>
                      <td className="px-4 py-3.5 sm:px-6">
                        <Badge type="role" value={user.role} />
                      </td>
                      <td className="px-4 py-3.5 sm:px-6">
                        <Badge type="status" value={user.status} />
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 sm:px-6">
                        {formatDateTime(user.createdAt || user.joined)}
                      </td>
                      <td className="relative px-4 py-3.5 sm:px-6">
                        <ActionMenu
                          options={getUserActionOptions(user, {
                            onViewTasks: handleViewTasks,
                            onStatusChange: handleStatusChange,
                            onDelete: handleDelete,
                          })}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}
