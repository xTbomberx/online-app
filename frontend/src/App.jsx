import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Components Imports
import Navbar from './components/Navbar'
import './pages/css/Body.css'

// Pages Imports
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'

import { useAuthStore } from './store/useAuthStore'
import {Loader} from 'lucide-react'

const App = () => {

  const {authUser, checkAuth, isCheckingAuth , onlineUsers} = useAuthStore()


  console.log({onlineUsers})


  // checkAuth will be in useEffect(so it runs when its loaded)
  useEffect(() => {
    checkAuth()
  }, [checkAuth]);

  console.log({authUser});

  // IF CURRENTLY CHECKING AUTH and AUTHUSER IS NULL
  if(isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className='size-10 animate-spin' />
      </div>
  )


  // FRONTEND LOGISTICS
  return (
    <div>
      <Navbar />
        {/* localhost:5713/{insert-path} */}
        <Routes>
          {/* IF authUSER(logged in) go to HOMEPAGE if NOT navigate to login page */}
          <Route  path='/' element={authUser ? <HomePage /> : <Navigate to="/login" /> } /> 
          {/* <Route  path='/signup' element={authUser ? <SignUpPage /> : <Navigate to='/' />} /> */}
          <Route path='/signup' element={<SignUpPage />} />
          {/* IF there is an AUTHUSER re-direct to HOMEPAGE */}
          <Route  path='/login' element={authUser ? <Navigate to='/' /> : <LoginPage />} />
          <Route  path='/settings' element={<SettingsPage />} />
          <Route  path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" /> } />
        </Routes>

    </div>
  )
}

export default App