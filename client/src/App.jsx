import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import Profile from './pages/Profile'
import About from './pages/About'
import SignUp from './pages/SignUp'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'
import Search from './pages/Search'
import Rentals from './pages/Rentals'

function App() {
  return (
   <BrowserRouter>
   <Header/>
   <Routes>
    <Route path='/' element= {<Home/>}/>
    <Route path='/sign-in' element= {<SignIn/>}/>
    <Route path='/sign-up' element= {<SignUp/>}/>
    <Route path='/listing/:listingId' element= {<Listing/>}/>
    <Route path='/search' element= {<Search/>}/>
    

    <Route  element= {<PrivateRoute/>}>
      <Route path='/profile' element= {<Profile/>}/>
      <Route path='/create-listing' element= {<CreateListing/>}/>
      <Route path='/update-listing/:listingId' element= {<UpdateListing/>}/>
      <Route path='/rentals' element= {<Rentals/>}/>
    </Route>
    
    <Route path='/about' element= {<About/>}/>
   </Routes>
   </BrowserRouter>
  )
}

export default App