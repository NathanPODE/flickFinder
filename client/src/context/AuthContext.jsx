import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadUser() {
            try {
                const response = await fetch(
                    `http://localhost:4000/api/auth/me`,
                    { credentials: 'include' }
                )
                
                const data = await response.json()

                if(!response.ok){
                    return
                }

                setUser(data.user);
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        loadUser()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}