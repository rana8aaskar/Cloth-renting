import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signInStart, signInSuccess, signInFailure } from '../redux/admin/adminSlice'
import { API_BASE_URL } from '../config'

export default function AdminSignIn() {
  // Fixed admin sign-in response handling
  const [formData, setFormData] = useState({})
  const { loading, error } = useSelector((state) => state.admin)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(signInStart())
      const res = await fetch(`${API_BASE_URL}/auth/admin/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(signInFailure(data.message))
        return
      }
      dispatch(signInSuccess(data.loggedInUser))
      navigate('/dashboard')
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access the admin dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter admin email"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter admin password"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              disabled={loading}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center mt-2">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
