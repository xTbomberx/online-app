import React from 'react'
import {useState} from 'react';
import { useAuthStore } from '../store/useAuthStore';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../pages/css/LoginPage.css'

const errorStyle = {
  backgroundColor: "red",
  padding: '10px 20px'
} 

function LoginPage() {

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError ] = useState('');
    const [formData, setFormData ] = useState({
      email: '',
      password: '',
    });

    const { login, isLogginIn } = useAuthStore();

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    }

    const validateForm = () => {
      if(formData.email.trim() === ''){
        setError('email is required')
        return false;
      }
      if(!formData.password){
        setError('Password is required')
        return false;
      }

      // if VALIDATED - reset error
      setError('');
      return true;
    }

    const handleSubmit = (e) => {
      e.preventDefault();

      const success = validateForm()
      if(success === true ) login(formData)

    }


    return (
      <div className="login-container">
        <div className="form-container">
            {/* LOGO - CREATE ACCOUNT*/}
            <div className="logo">
              <h1>LOGIN ACCOUNT</h1>
            </div>

            {/* FORM */}
            {/* CUSTOM ERROR MESSAGE/ONLY DISPLAYED IF ERROR */}
            {error && <h1 className='error-message' style={errorStyle}>{error} </h1>}
            <form className='Form' onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">EMAIL</label>
                <input 
                  type="email"
                  id='email'
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">PASSWORD</label>
                <div className="password-input-container">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    onClick={togglePasswordVisibility}
                    className='password-toggle-icon' />
                </div>
                <button
                  type='submit'
                  className='submit-button'>Sign In</button>
              </div>
            </form>
        </div>
      </div>
    )
}

export default LoginPage