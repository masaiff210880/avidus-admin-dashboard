import { createContext, useContext, useState } from 'react'
import { getCookie, removeCookie, setCookie } from '../utils/cookies'

const AuthContext = createContext(null)

function sanitizeUser(user) {
  if (!user) return null
  const { password, ...safeUser } = user
  return safeUser
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = getCookie('user')
    const token = getCookie('token')
    return storedUser && token ? sanitizeUser(storedUser) : null
  })

  console.log("storedUser",user)

  const login = (userData, token) => {
    const safeUser = sanitizeUser(userData)
    setUser(safeUser)
    setCookie('user', safeUser)
    setCookie('token', token)
  }

  const logout = () => {
    setUser(null)
    removeCookie('user')
    removeCookie('token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
