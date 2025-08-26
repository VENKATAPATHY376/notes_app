import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthProvider.jsx'
import NoteCard from '../components/NoteCard.jsx'

export default function NotesList() {
  const { accessToken } = useAuth()
  const [notes, setNotes] = useState([])
  const [search, setSearch] = useState('')
  const nav = useNavigate()

  async function load() {
    const res = await api.listNotes(accessToken, { search })
    setNotes(res.items)
  }

  useEffect(() => { load() }, []) // initial
  useEffect(() => { const id=setTimeout(load, 300); return ()=>clearTimeout(id) }, [search]) // debounce

  async function del(id) {
    await api.deleteNote(accessToken, id)
    await load()
  }

  return (
    <div style={{marginTop:16}}>
      <div className="row" style={{justifyContent:'space-between', marginBottom:12}}>
        <input style={{maxWidth:360}} placeholder="Search notes..." value={search} onChange={e=>setSearch(e.target.value)} />
        <button className="btn" onClick={()=>nav('/notes/new')}>+ New Note</button>
      </div>
      <div className="grid">
        {notes.map(n => <NoteCard key={n.id} note={n} onOpen={(id)=>nav(`/notes/${id}`)} onDelete={del} />)}
      </div>
    </div>
  )
}
