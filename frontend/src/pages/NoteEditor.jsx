import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthProvider.jsx'

export default function NoteEditor() {
  const { id } = useParams()
  const isNew = !id
  const { accessToken } = useAuth()
  const nav = useNavigate()

  const [note, setNote] = useState({
    title: '', content: '', tags: [], is_pinned:false, is_archived:false, version: 1
  })
  const [tagsText, setTagsText] = useState('')
  const [err, setErr] = useState(null)

  useEffect(() => {
    async function load() {
      if (!isNew) {
        const n = await api.getNote(accessToken, id)
        setNote(n)
        setTagsText((n.tags || []).join(', '))
      }
    }
    load()
  }, [id])

  async function save() {
    setErr(null)
    const payload = { ...note, tags: splitTags(tagsText) }
    try {
      if (isNew) {
        const created = await api.createNote(accessToken, payload)
        nav(`/notes/${created.id}`)
      } else {
        const updated = await api.updateNote(accessToken, id, payload)
        setNote(updated)
      }
    } catch (e) {
      if (e.status === 409) {
        const serverVersion = e?.detail?.detail?.server_version
        setErr(`Version conflict. Server version is ${serverVersion}. Refreshing...`)
        const latest = await api.getNote(accessToken, id)
        setNote(latest)
        setTagsText((latest.tags || []).join(', '))
      } else {
        setErr('Failed to save')
      }
    }
  }

  function splitTags(s) {
    return s.split(',').map(t=>t.trim()).filter(Boolean)
  }

  return (
    <div style={{maxWidth:720, margin:'16px auto'}}>
      {err && <div style={{color:'red', marginBottom:12}}>{err}</div>}
      <input placeholder="Title" value={note.title} onChange={e=>setNote({...note, title:e.target.value})} />
      <textarea placeholder="Write your note..." rows={12} style={{marginTop:8}}
        value={note.content} onChange={e=>setNote({...note, content:e.target.value})}/>
      <input placeholder="tags, comma,separated" style={{marginTop:8}} value={tagsText} onChange={e=>setTagsText(e.target.value)} />
      <div className="row" style={{marginTop:8}}>
        <label><input type="checkbox" checked={note.is_pinned} onChange={e=>setNote({...note, is_pinned:e.target.checked})}/> pinned</label>
        <label><input type="checkbox" checked={note.is_archived} onChange={e=>setNote({...note, is_archived:e.target.checked})}/> archived</label>
      </div>
      <div className="row" style={{marginTop:12}}>
        <button className="btn primary" onClick={save}>Save</button>
        <button className="btn" onClick={()=>nav('/')}>Back</button>
      </div>
      {!isNew && <div style={{marginTop:8, color:'#666'}}>version: {note.version}</div>}
    </div>
  )
}
