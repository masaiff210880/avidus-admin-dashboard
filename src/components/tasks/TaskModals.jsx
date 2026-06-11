import CreateTaskModal from '../../modals/CreateTaskModal'
import EditTaskModal from '../../modals/EditTaskModal'
import ViewTaskModal from '../../modals/ViewTaskModal'

export default function TaskModals({
  isCreateOpen = false,
  onCreateClose,
  viewTaskId,
  onViewClose,
  editTaskId,
  onEditClose,
}) {
  return (
    <>
      {isCreateOpen !== undefined && onCreateClose && (
        <CreateTaskModal isOpen={isCreateOpen} onClose={onCreateClose} />
      )}

      <ViewTaskModal
        isOpen={!!viewTaskId}
        taskId={viewTaskId}
        onClose={onViewClose}
      />

      <EditTaskModal
        isOpen={!!editTaskId}
        taskId={editTaskId}
        onClose={onEditClose}
      />
    </>
  )
}
