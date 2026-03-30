'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useUser, useIsAuthenticated, useAuthStore } from '@/stores/authStore'
import { MenuIcon, XIcon, UserIcon, CalendarIcon, LogOutIcon, ChevronDownIcon } from '@/components/icons'
import { Avatar } from '@/components/shared/Avatar'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const user = useUser()
  const isAuthenticated = useIsAuthenticated()
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/')
    setIsProfileDropdownOpen(false)
  }

  const navLinks = [
    { href: '/hospitals', label: 'Hospitals' },
    { href: '/search', label: 'Find Doctors' },
    { href: '/search', label: 'Specializations' },
  ]

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-card border-b border-border h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="ClinicMind" 
                className="w-8 h-8 rounded-lg"
              />
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
                  className={cn(
                    "text-sm font-medium transition-colors border-b-2 border-transparent hover:border-primary hover:text-primary",
                    isActiveLink(link.href) 
                      ? "text-primary border-primary" 
                      : "text-text2"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/dashboard/appointments"
                    className="text-sm font-medium text-text2 hover:text-primary transition-colors"
                  >
                    Appointments
                  </Link>
                  
                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center space-x-2 text-sm font-medium text-text2 hover:text-primary transition-colors"
                    >
                      <Avatar 
                        fallback={user.name} 
                        size="sm"
                      />
                      <ChevronDownIcon className="w-4 h-4" />
                    </button>
                    
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg border border-border shadow-lg py-1">
                        <Link
                          href="/dashboard/profile"
                          className="block px-4 py-2 text-sm text-text2 hover:text-primary hover:bg-primary-light transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          href="/dashboard/home"
                          className="block px-4 py-2 text-sm text-text2 hover:text-primary hover:bg-primary-light transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <hr className="my-1 border-border" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-text2 hover:text-danger hover:bg-danger-light transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-text2 hover:text-primary hover:bg-primary-light transition-colors"
              >
                {isMobileMenuOpen ? (
                  <XIcon className="w-5 h-5" />
                ) : (
                  <MenuIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer */}
          <div className="fixed left-0 top-0 h-full w-72 bg-card z-50 md:hidden transform transition-transform duration-300 ease-in-out">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                  <img 
                    src="/logo.png" 
                    alt="ClinicMind" 
                    className="w-8 h-8 rounded-lg"
                  />
                  <span className="text-xl font-bold text-primary font-heading">
                    ClinicMind
                  </span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-text2 hover:text-primary hover:bg-primary-light transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors py-2",
                      isActiveLink(link.href) 
                        ? "text-primary" 
                        : "text-text2 hover:text-primary"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="border-t border-border pt-4">
                  {isAuthenticated && user ? (
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-3 py-2">
                        <Avatar 
                          fallback={user.name} 
                          size="md"
                        />
                        <div>
                          <p className="text-sm font-medium text-text1">{user.name}</p>
                          <p className="text-xs text-text3">{user.email}</p>
                        </div>
                      </div>
                      
                      <Link
                        href="/dashboard/appointments"
                        className="text-sm font-medium text-text2 hover:text-primary py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Appointments
                      </Link>
                      
                      <Link
                        href="/dashboard/home"
                        className="text-sm font-medium text-text2 hover:text-primary py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      
                      <Link
                        href="/dashboard/profile"
                        className="text-sm font-medium text-text2 hover:text-primary py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsMobileMenuOpen(false)
                        }}
                        className="text-sm font-medium text-danger hover:text-danger py-2 text-left"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        asChild
                      >
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          Login
                        </Link>
                      </Button>
                      <Button 
                        className="w-full"
                        asChild
                      >
                        <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                          Register
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
