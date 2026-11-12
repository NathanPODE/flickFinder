import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Register(){
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
            const response = await fetch('http://localhost:4000/api/auth/register' , {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            })

            const data = await response.json();

            if(!response.ok){
                setError(data.error || 'Register failed')
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

    return(
        <div className='flex flex-col items-center justify-center'>
            <div className='flex flex-col items-center justify-center'>
                <h1 className='text-2xl font-bold mb-6'>Flick Finder</h1>
                <p className='text-base'>Register</p>
            </div>
            
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label className='block text-sm font-medium mb-1'>Email</label>
                    <input 
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className='w-full border rounded px-3 py-2'
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium mb-1'>Password</label>
                    <input 
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {error && <p className='text-red-600 text-sm'>{error}</p>}

                <button
                    type='submit'
                    disabled={loading}
                    className='w-full bg-blue-600 text-white rounded px-3 py-2 disabled:opacity-50'
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>

            <p className="mt-4 text-sm">
                Already have an account? <Link to='/login' className='text-blue-600 underline'>Log In</Link>
            </p>
        </div>
    )
}

export default Register