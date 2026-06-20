import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/client";

const authContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const verifySession = async () => {

            try {
                const response = await API.get('/auth/me')
                setUser(response.data.user)

            } catch (error) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        verifySession()
    }, [])

    const login = async (email, password) => {
        try {
            const response = await API.post('/auth/login', { email, password })
            setUser(response.data.user)
            return { success: true }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Login Failed"
            }
        }
    }

    const logout = async () => {

        try {
            await API.post('/auth/logout')
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Login Failed"
            }
        } finally {
            setUser(null)
        }
    }

    return (
        <authContext.Provider value={{ user, loading, login, logout }}>
            {!loading && children}
        </authContext.Provider>
    )
}

export const useAuth = () => useContext(authContext)