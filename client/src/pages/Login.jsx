import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Login(){
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch('http://localhost:4000/api/auth/login' , {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            })

            const data = await response.json();

            if(!response.ok){
                setError(data.error || 'Login failed')
                return
            }

            setUser(data.user)
            navigate('/')
        } catch (err) {
            console.error(err)
            setError('Could not reach the server')
        } finally {
            setLoading(false)
        }
    }

    if (user) {
        return <Navigate to="/" replace />
    }
}