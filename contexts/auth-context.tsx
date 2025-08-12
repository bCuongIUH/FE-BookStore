"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - in real app, this would be an API call
    const mockUsers = [
      { id: "1", email: "admin@bookstore.vn", password: "admin123", name: "Admin User" },
      { id: "2", email: "user@example.com", password: "user123", name: "John Doe" },
    ]

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const userData = { id: foundUser.id, email: foundUser.email, name: foundUser.name }
      setUser(userData)
      localStorage.setItem("bookstore_user", JSON.stringify(userData))
      setIsLoading(false)
      return { success: true, message: "Đăng nhập thành công!" }
    } else {
      setIsLoading(false)
      return { success: false, message: "Email hoặc mật khẩu không đúng!" }
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock registration - in real app, this would be an API call
    const existingUsers = JSON.parse(localStorage.getItem("bookstore_registered_users") || "[]")

    if (existingUsers.find((u: any) => u.email === email)) {
      setIsLoading(false)
      return { success: false, message: "Email đã được sử dụng!" }
    }

    const newUser = { id: Date.now().toString(), email, name }
    existingUsers.push({ ...newUser, password })
    localStorage.setItem("bookstore_registered_users", JSON.stringify(existingUsers))

    setUser(newUser)
    localStorage.setItem("bookstore_user", JSON.stringify(newUser))
    setIsLoading(false)
    return { success: true, message: "Đăng ký thành công!" }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("bookstore_user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
