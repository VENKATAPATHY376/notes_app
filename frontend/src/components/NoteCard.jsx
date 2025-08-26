export default function NoteCard({ note, onOpen, onDelete }) {
  return (
    <div className="card" onClick={() => onOpen(note.id)} style={{cursor:'pointer'}}>
      <h3 style={{marginTop:4}}>{note.title || '(Untitled)'}</h3>
      <p style={{whiteSpace:'pre-wrap', color:'#555'}}>{(note.content || '').slice(0,160)}</p>
      <div style={{display:'flex', justifyContent:'space-between', marginTop:8}}>
        <div>
          {(note.tags || []).map(t => <span key={t} className="pill">{t}</span>)}
        </div>
        <button className="btn" onClick={(e)=>{e.stopPropagation(); onDelete(note.id)}}>Delete</button>
      </div>
    </div>
  )
}
