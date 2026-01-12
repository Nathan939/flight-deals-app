'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name?: string
  subscription: {
    plan: string
    status: string
  }
}

export default function UserAvatar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setShowDropdown(false)

    // Trigger auth change event for header update
    window.dispatchEvent(new Event('auth-change'))

    router.push('/')
  }

  if (!user) {
    return null
  }

  const displayName = user.name || 'User'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300 font-bold">
          {initials}
        </div>
        <span className="hidden md:block text-sm text-gray-300">{displayName}</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-800">
            <p className="text-sm font-bold text-white">{displayName}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>

          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
            onClick={() => setShowDropdown(false)}
          >
            Dashboard
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  )
}
