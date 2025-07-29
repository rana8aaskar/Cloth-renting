import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminSignIn from './pages/AdminSignIn'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Listings from './pages/Listings'
import Rentals from './pages/Rentals'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/sign-in" element={<AdminSignIn />} />
          <Route element={<PrivateRoute />}>
            <Route
              path="/*"
              element={
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1">
                    <Header />
                    <div className="p-6">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/listings" element={<Listings />} />
                        <Route path="/rentals" element={<Rentals />} />
                      </Routes>
                    </div>
                  </div>
                </div>
              }
            />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
