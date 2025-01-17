import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

function LoginPage({ authUser, logout }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
        <button type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

// export default LoginPage;
//
//
// APP PAGE
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
        <Route path="/" element={authUser ? <HomePage authUser={authUser} logout={logout} /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage authUser={authUser} logout={logout} /> : <Navigate to="/" />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <LoginPage authUser={authUser} logout={logout} />} />
        <Route path="/settings" element={<SettingsPage authUser={authUser} logout={logout} />} />
        <Route path="/profile" element={authUser ? <ProfilePage authUser={authUser} logout={logout} /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;