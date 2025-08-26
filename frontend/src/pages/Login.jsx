import { useState } from 'react'
import { useAuth } from '../context/AuthProvider.jsx'

export default function Login() {
  const { login, register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login')
  const [err, setErr] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setErr(null)
    try {
      if (mode === 'login') await login(email, password)
      else await register(email, password)
    } catch (e) {
      setErr(e?.detail?.detail || 'Failed')
    }
  }

  return (
    <div style={{maxWidth:420, margin:'40px auto'}}>
      <h3>{mode === 'login' ? 'Login' : 'Create Account'}</h3>
      <form onSubmit={submit} className="row" style={{flexDirection:'column', gap:12}}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div style={{color:'red'}}>{String(err)}</div>}
        <button className="btn primary" type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
      </form>
      <div style={{marginTop:12}}>
        {mode === 'login'
          ? <button className="btn" onClick={()=>setMode('register')}>Need an account? Register</button>
          : <button className="btn" onClick={()=>setMode('login')}>Have an account? Login</button>}
      </div>
    </div>
  )
}
