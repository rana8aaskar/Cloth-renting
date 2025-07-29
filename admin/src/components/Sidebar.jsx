import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Sidebar() {
  const location = useLocation()
  const { currentAdmin } = useSelector((state) => state.admin)

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: '📊' },
    { path: '/users', name: 'Users', icon: '👥' },
    { path: '/listings', name: 'Listings', icon: '👕' },
    { path: '/rentals', name: 'Rentals', icon: '📦' },
  ]

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        <p className="text-sm text-gray-600 mt-1">Cloth Rental System</p>
      </div>
      
      <nav className="mt-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
              isActive(item.path) ? 'bg-blue-50 text-blue-600 border-r-3 border-blue-600' : ''
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-64 p-6 border-t">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {currentAdmin?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{currentAdmin?.username}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  )
}
