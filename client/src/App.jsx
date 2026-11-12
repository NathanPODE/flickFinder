import { useState } from 'react'
import './App.css'
import { useAuth } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'


function App() {
   return (
      <Routes>
         <Route path='/login' element={<Login />} />
         <Route path='/register' element={<Register />} />
      </Routes>
   )
}

export default App
