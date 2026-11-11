import { useState } from 'react'
import './App.css'
import { useAuth } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'


function App() {
   return (
      <Routes>
         <Route path='/login' element={<Login />} />
      </Routes>
   )
}

export default App
