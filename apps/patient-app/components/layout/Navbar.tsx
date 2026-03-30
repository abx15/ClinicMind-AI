'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser, useIsAuthenticated, useAuthStore } from '@/stores/authStore'
import { MenuIcon, XIcon, UserIcon, CalendarIcon, LogOutIcon } from '@/components/icons'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const user = useUser()
  const isAuthenticated = useIsAuthenticated()
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const navLinks = [
    { href: '/hospitals', label: 'Hospitals' },
    { href: '/doctors', label: 'Doctors' },
    { href: '/search', label: 'Specializations' },
  ]

  const dashboardLinks = [
    { href: '/dashboard/home', label: 'Dashboard', icon: UserIcon },
    { href: '/dashboard/appointments', label: 'Appointments', icon: CalendarIcon },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-lg bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg font-heading">C</span>
            </div>
            <span className="text-xl font-bold text-primary font-heading">
              ClinicMind
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-secondary hover:text-primary-500 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
                    <span className="text-primary font-medium text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-text-1 font-medium">{user.name}</span>
                </div>
                <Link
                  href="/dashboard/appointments"
                  className="border border-primary text-primary hover:bg-primary hover:text-white text-sm py-2 px-4 rounded-lg transition-colors"
                >
                  Appointments
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-text-3 hover:text-text-1 transition-colors"
                >
                  <LogOutIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="border border-primary text-primary hover:bg-primary hover:text-white text-sm py-2 px-4 rounded-lg transition-colors">
                  Login
                </Link>
                <Link href="/register" className="bg-primary hover:bg-primary-dark text-white text-sm py-2 px-4 rounded-lg transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-text-3 hover:text-text-1 hover:bg-primary-light transition-colors"
            >
              {isMobileMenuOpen ? (
                <XIcon className="w-5 h-5" />
              ) : (
                <MenuIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-text-2 hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="border-t border-border pt-4">
                {isAuthenticated && user ? (
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
                        <span className="text-primary font-medium text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-text-1 font-medium">{user.name}</span>
                    </div>
                    {dashboardLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center space-x-2 text-text-2 hover:text-primary transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <link.icon className="w-4 h-4" />
                        <span>{link.label}</span>
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-2 text-text-3 hover:text-text-1 transition-colors font-medium"
                    >
                      <LogOutIcon className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link
                      href="/login"
                      className="border border-primary text-primary hover:bg-primary hover:text-white text-center py-2 px-4 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="bg-primary hover:bg-primary-dark text-white text-center py-2 px-4 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
