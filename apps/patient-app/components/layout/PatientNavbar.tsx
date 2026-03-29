'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { MenuIcon, XIcon, UserIcon, LogOutIcon, CalendarIcon, HeartIcon } from '@/components/icons'

export default function PatientNavbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <HeartIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-text-primary font-heading">
                ClinicMind
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link href="/" className="text-text-secondary hover:text-text-primary transition-colors">
                  Home
                </Link>
                <Link href="/hospitals" className="text-text-secondary hover:text-text-primary transition-colors">
                  Hospitals
                </Link>
                <Link href="/appointments" className="text-text-secondary hover:text-text-primary transition-colors">
                  <CalendarIcon className="w-4 h-4 inline mr-1" />
                  Appointments
                </Link>
                
                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors">
                    <UserIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-text-secondary hover:bg-gray-50">
                        Profile
                      </Link>
                      <Link href="/prescriptions" className="block px-4 py-2 text-sm text-text-secondary hover:bg-gray-50">
                        Prescriptions
                      </Link>
                      <hr className="my-2 border-border" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOutIcon className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/hospitals" className="text-text-secondary hover:text-text-primary transition-colors">
                  Find Hospitals
                </Link>
                <Link href="/login" className="btn-primary text-sm">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-text-secondary hover:text-text-primary p-2"
            >
              {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/"
                    className="block px-3 py-2 text-text-secondary hover:text-text-primary rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/hospitals"
                    className="block px-3 py-2 text-text-secondary hover:text-text-primary rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Hospitals
                  </Link>
                  <Link
                    href="/appointments"
                    className="block px-3 py-2 text-text-secondary hover:text-text-primary rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Appointments
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-text-secondary hover:text-text-primary rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md flex items-center space-x-2"
                  >
                    <LogOutIcon className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/hospitals"
                    className="block px-3 py-2 text-text-secondary hover:text-text-primary rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Find Hospitals
                  </Link>
                  <Link
                    href="/login"
                    className="block px-3 py-2 btn-primary text-sm text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
