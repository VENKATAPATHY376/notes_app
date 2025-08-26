import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthProvider.jsx'

export default function App() {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  return (
    <div className="container">
      <div className="topbar">
        <h2 style={{margin:0}}>📝 Notes</h2>
        <div>
          {user ? (
            <div className="row">
              <span>{user.email}</span>
              <button className="btn" onClick={() => nav('/notes/new')}>New</button>
              <button className="btn" onClick={logout}>Logout</button>
            </div>
          ) : (
            <button className="btn primary" onClick={() => nav('/login')}>Login</button>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  )
}
