"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { loginUser } from "@/utils/authApi"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("bookstore_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("bookstore_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)

    try {
      const result = await loginUser(email, password)

      if (result.success && result.user) {
        const userData = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          avatar: result.user.avatar,
        }
        setUser(userData)
        localStorage.setItem("bookstore_user", JSON.stringify(userData))
        setIsLoading(false)
        return { success: true, message: "Đăng nhập thành công!" }
      } else {
        setIsLoading(false)
        return { success: false, message: "Đăng nhập thất bại!" }
      }
    } catch (error) {
      setIsLoading(false)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Email hoặc mật khẩu không đúng!",
      }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("bookstore_user")
    localStorage.removeItem("bookstore_token")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
