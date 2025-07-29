import React from 'react'
import { useDispatch } from 'react-redux'
import { signOutStart, signOutSuccess, signOutFailure } from '../redux/admin/adminSlice'
import { API_BASE_URL } from '../config'

export default function Header() {
  const dispatch = useDispatch()

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart())
      const res = await fetch(`${API_BASE_URL}/auth/signout`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(signOutFailure(data.message))
        return
      }
      dispatch(signOutSuccess(data))
    } catch (error) {
      dispatch(signOutFailure(error.message))
    }
  }

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Admin Dashboard
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  )
}
