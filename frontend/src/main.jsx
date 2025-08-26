import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import Login from './pages/Login.jsx'
import NotesList from './pages/NotesList.jsx'
import NoteEditor from './pages/NoteEditor.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<App />}>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<NotesList />} />
              <Route path="/notes/new" element={<NoteEditor />} />
              <Route path="/notes/:id" element={<NoteEditor />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
