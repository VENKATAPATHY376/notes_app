import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const nav = useNavigate()

  async function login(email, password) {
    const res = await api.login(email, password)
    setAccessToken(res.access_token)
    setUser(res.user)
    nav('/')
  }

  async function register(email, password) {
    const res = await api.register(email, password)
    setAccessToken(res.access_token)
    setUser(res.user)
    nav('/')
  }

  async function logout() {
    await api.logout()
    setAccessToken(null)
    setUser(null)
    nav('/login')
  }

  async function ensureToken() {
    if (!accessToken) {
      try {
        const res = await api.refresh()
        if (res.access_token) setAccessToken(res.access_token)
      } catch { /* ignore */ }
    }
  }

  useEffect(() => { ensureToken() }, [])

  const value = { user, accessToken, login, register, logout }
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}
