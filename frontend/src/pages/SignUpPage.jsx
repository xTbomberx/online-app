import React from 'react'
import {useState} from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

import '../pages/css/SignUpPage.css'
 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


function SignUpPage() {
    // SHOW PASSWORD COMPONENT 
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      password: ''
    })

    const [error, setError ] = useState('');

    const { signup } = useAuthStore();
    const navigate = useNavigate();

    // ERROR HANDLING //
    // IF ANY FIELDS ARE NOT VALID 
    //      1. IT SETS AND ERROR MESSAGHE
    //      2. then returns FALSE to indicate that the form is not valid
    const validateForm = () => {
      if(formData.fullName.trim() === "" ){
        setError('Full name is required');
        return false;
      }
      if(formData.email.trim() === ""){
        setError('Email is required');
        return false;
      }
      if(formData.password.trim() === ''){
        setError('Password is required');
        return false;
      }
      if(formData.password.length < 5){
        setError('Password is less then 5 characters')
        return false;
      }

      setError(''); // CLEAR and previous ERROR messages
      return true;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const success = validateForm()
      if(success){
          await signup(formData, navigate)
        }
    } 

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
  };

    return (
      <div className='signup-container'>
        {/* LEFT SIDE  */}
        <div className='form-container'>

          {/* LOGO - CREATE ACCOUNT*/}
          <div className='logo'>
            <h1>CREATE ACCOUNT</h1>
            <h2>Get started with your free account</h2>
          </div>
  
          {/* FORM */}
            {/* CUSTOM ERROR MESSAGE/ONLY DISPLAYED IF ERROR */}
            {error && <h1 className='error-message'>{error}</h1>}
          <form className='form' onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
                <input 
                  type="text"
                  id='fullName'
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email"
                id='email'
                value={formData.email}
                onChange={(e) =>setFormData({...formData, email: e.target.value})} />
            </div>

            <div className='form-group'>
                <label htmlFor='password'>Password</label>
                <div className='password-input-container'>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        onClick={togglePasswordVisibility}
                        className='password-toggle-icon'
                    />
                </div>
                <button 
                  type='submit'
                  className='create-button'>CREATE ACCOUNT</button>
            </div>
          </form>

          <div className='login-link'>
            <p>Already have an account? <a href='/login'>Log in</a></p>
          </div>
        </div>



      </div>
      // SIGN-UP CONTAINER END
  )
}

export default SignUpPage