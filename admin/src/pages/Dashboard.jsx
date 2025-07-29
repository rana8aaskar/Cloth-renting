import React, { useState, useEffect } from 'react'
import { API_BASE_URL } from '../config'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    totalRentals: 0,
    pendingRentals: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/stats`, {
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      color: 'bg-blue-500',
    },
    {
      title: 'Total Listings',
      value: stats.totalListings,
      icon: '👕',
      color: 'bg-green-500',
    },
    {
      title: 'Total Rentals',
      value: stats.totalRentals,
      icon: '📦',
      color: 'bg-purple-500',
    },
    {
      title: 'Pending Rentals',
      value: stats.pendingRentals,
      icon: '⏳',
      color: 'bg-orange-500',
    },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3 mr-4`}>
                <span className="text-white text-xl">{stat.icon}</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-600">New user registered</span>
              <span className="text-gray-400 ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-gray-600">New listing created</span>
              <span className="text-gray-400 ml-auto">4 hours ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              <span className="text-gray-600">Rental request pending</span>
              <span className="text-gray-400 ml-auto">6 hours ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <span className="text-blue-600 mr-3">👥</span>
                <span>Manage Users</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <span className="text-green-600 mr-3">👕</span>
                <span>Review Listings</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <span className="text-purple-600 mr-3">📦</span>
                <span>Process Rentals</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
