const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

const VALID_ROLES = ['user', 'admin']

export function validateSignupForm({ name, email, password, role, agreedToTerms }) {
  const errors = {}

  const trimmedName = name.trim()
  if (!trimmedName) {
    errors.name = 'Full name is required'
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters'
  }

  const trimmedEmail = email.trim()
  if (!trimmedEmail) {
    errors.email = 'Email address is required'
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = 'Enter a valid email address'
  }

  if (!password) {
    errors.password = 'Password is required'
  } else if (!PASSWORD_REGEX.test(password)) {
    errors.password =
      'Password must be 8+ characters with uppercase, lowercase, number, and special character'
  }

  if (!role || !VALID_ROLES.includes(role)) {
    errors.role = 'Please select a valid role'
  }

  if (!agreedToTerms) {
    errors.terms = 'You must agree to the Terms of Service and Privacy Policy'
  }

  return errors
}

export function validateCreateUserForm({ name, email, password, role }) {
  const errors = {}

  const trimmedName = name.trim()
  if (!trimmedName) {
    errors.name = 'Full name is required'
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters'
  }

  const trimmedEmail = email.trim()
  if (!trimmedEmail) {
    errors.email = 'Email address is required'
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = 'Enter a valid email address'
  }

  if (!password) {
    errors.password = 'Password is required'
  } else if (!PASSWORD_REGEX.test(password)) {
    errors.password =
      'Password must be 8+ characters with uppercase, lowercase, number, and special character'
  }

  if (!role || !VALID_ROLES.includes(role)) {
    errors.role = 'Please select a valid role'
  }

  return errors
}

const VALID_TASK_STATUSES = ['pending', 'in-progress', 'completed']
const VALID_TASK_PRIORITIES = ['low', 'medium', 'high']

export function validateCreateTaskForm({ title, status, priority }) {
  const errors = {}

  const trimmedTitle = title.trim()
  if (!trimmedTitle) {
    errors.title = 'Task title is required'
  } else if (trimmedTitle.length < 3) {
    errors.title = 'Title must be at least 3 characters'
  }

  if (!status || !VALID_TASK_STATUSES.includes(status)) {
    errors.status = 'Please select a valid status'
  }

  if (!priority || !VALID_TASK_PRIORITIES.includes(priority)) {
    errors.priority = 'Please select a valid priority'
  }

  return errors
}

export function validateLoginForm({ email, password }) {
  const errors = {}

  const trimmedEmail = email.trim()
  if (!trimmedEmail) {
    errors.email = 'Email address is required'
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = 'Enter a valid email address'
  }

  if (!password) {
    errors.password = 'Password is required'
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }

  return errors
}
