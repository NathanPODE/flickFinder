import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { useAuth } from './context/AuthContext.jsx'

function App() {
   const { user, loading } = useAuth()

    if (loading) return <p>Loading...</p>

    return <p>{user ? `Logged in as ${user.email}` : 'Not logged in'}</p>

  return (
    <div className="text-3xl font-bold text-blue-600">Hello there</div>
  )
}

export default App
