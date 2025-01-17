import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link } from 'react-router-dom'
import '../pages/css/Navbar.css'


// NEED AUTHUSER STATE
function Navbar() {

  const {authUser , logout} = useAuthStore()


  return (
    <header className='header-nav'>
        <div className="nav-container">

          <div className="nav-left">
            <Link to="/" className='nav-link'>Home</Link>
            {/* CHECK TO SEE IF AUTH USER is logged IN */}
            {authUser && (
              <div className="profile-container">
                {/* check to see if authUser has profilePic */}
                {authUser.profilePic ? (
                  <img 
                    src={authUser.profilePic}
                    alt='Profile'
                    className='profile-pic'  
                  />
                ) : (
                  <div className="profile-placeholder">?</div>
                )}
              </div>
            )}
          </div>
          <div className="nav-right">
            <Link to="/settings" className='nav-link'> Settings</Link>
            <Link to="/signup" className='nav-link'>SignUp</Link>
            {/* ONLY WANT TO SHOW PROFILE/LOGOUT IF USER IS AUTHENTICATED */}
            {/* && = ONLY RENDER THIS IF THIS CONDITION IS MET */}
            {authUser && (
              <div>
                <Link to={"profile"} className='nav-link'>Profile</Link>
                <button onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        </div>
    </header>
  )
}

export default Navbar

