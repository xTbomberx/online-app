import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';
import { Loader } from 'lucide-react';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div>
      <Navbar authUser={authUser} logout={logout} />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

// export default App;


///////////////////////////////////

import React from 'react';
import { Link } from 'react-router-dom';
import '../pages/css/Navbar.css';

function Navbar({ authUser, logout }) {
  return (
    <header className='header-nav'>
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className='nav-link'>Home</Link>
        </div>
        <div className="nav-right">
          <Link to="/settings"> Settings</Link>
          {/* ONLY WANT TO SHOW PROFILE/LOGOUT IF USER IS AUTHENTICATED */}
          {/* && = ONLY RENDER THIS IF THIS CONDITION IS MET */}
          {authUser && (
            <div>
              <Link to="profile">Profile</Link>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;