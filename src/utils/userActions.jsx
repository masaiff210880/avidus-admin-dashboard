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

export function getUserActionOptions(user, { onStatusChange, onDelete }) {
  const isActive = user.status?.toLowerCase() === 'active'
  const options = []

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
