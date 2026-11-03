import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { useEffect } from 'react'

useEffect(() => {
    async function checkMe() {
        const response = await fetch('http://localhost:4000/api/auth/me', {
            credentials: 'include',
        })
        console.log('me status:', response.status)
        console.log('me body:', await response.json())
    }

    checkMe()
}, [])


function App() {
  return (
    <div className="text-3xl font-bold text-blue-600">Hello there</div>
  )
}

export default App
