import routesConfig from '../data/routes.json'

export function getMenuForRole(role) {
  const roleConfig = routesConfig.roles[role]
  if (!roleConfig) return []
  return roleConfig.routes
}

export function canAccessRoute(role, path) {
  const menu = getMenuForRole(role)
  return menu.some((route) => route.path === path)
}

export function getAllRoutes() {
  const seen = new Map()
  Object.values(routesConfig.roles).forEach((roleConfig) => {
    roleConfig.routes.forEach((route) => {
      if (!seen.has(route.path)) {
        seen.set(route.path, route)
      }
    })
  })
  return Array.from(seen.values())
}

export function getRoleLabel(role) {
  return routesConfig.roles[role]?.label || role
}
