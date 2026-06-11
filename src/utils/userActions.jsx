function TasksIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  )
}

export function getUserActionOptions(user, { onViewTasks, onStatusChange, onDelete }) {
  const isActive = user.status?.toLowerCase() === 'active'
  const options = []

  options.push({
    label: 'Tasks',
    variant: 'default',
    icon: <TasksIcon />,
    onClick: () => onViewTasks(user),
  })

  if (isActive) {
    options.push({
      label: 'Inactive',
      variant: 'danger',
      onClick: () => onStatusChange(user, 'inactive'),
    })
  } else {
    options.push({
      label: 'Active',
      variant: 'success',
      onClick: () => onStatusChange(user, 'active'),
    })
  }

  options.push({
    label: 'Delete',
    variant: 'danger',
    icon: <DeleteIcon />,
    onClick: () => onDelete(user),
  })

  return options
}
