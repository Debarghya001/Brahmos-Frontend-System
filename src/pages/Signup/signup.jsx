import React, { useState } from 'react';
import backgroundimg from '../images/chuttersnap-kq8iWoh5-mU-unsplash.jpg';
import '../Signup/signup.css';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    phonenumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrorMessage(''); // Reset error message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords don't match.");
      return;
    }

    try {
      // Send data to the API
      const response = await axios.post('https://brahmosbackend.onrender.com/api/auth/register', {
        name: formData.name,
        phonenumber: formData.phonenumber,
        email: formData.email,
        password: formData.password,
        role: 'Client', // Adjust the role if necessary
      });
      
      console.log(response.data.message);
      navigate('/signin'); // Redirect on successful registration
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message); // Display server error message
      } else {
        setErrorMessage('Error! Please try again.'); // Generic error message
      }
    }
  };

  const handleAdminSignupClick = () => {
    navigate('/adminsignup'); // Navigate to Admin Signup
  };

  return (
    <div className='container'>
      <img src={backgroundimg} className='backimg' alt='background' />
      <div className='gradient'>
        <div className='button-container'>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handleAdminSignupClick}className='Admin-button'>Admin Signup</Button>
          </Stack>
        </div>
        <form className='form-signup' onSubmit={handleSubmit}>
          <p className='title-signup'>Register</p>
          <p className='message'>Signup now and get full access to our app.</p>
          {errorMessage && <p className='error-message'>{errorMessage}</p>} {/* Show error message */}

          <label>
            <input 
              required 
              type='text' 
              className='input' 
              name='name' 
              value={formData.name} 
              onChange={handleChange} 
            />
            <span>Firstname</span>
          </label>
          
          <label>
            <input 
              required 
              type='text' 
              className='input' 
              name='phonenumber' 
              value={formData.phonenumber} 
              onChange={handleChange} 
            />
            <span>Phone Number</span>
          </label>
          
          <label>
            <input 
              required 
              type='email' 
              className='input' 
              name='email' 
              value={formData.email} 
              onChange={handleChange} 
            />
            <span>Email</span>
          </label>
          
          <label>
            <input 
              required 
              type='password' 
              className='input' 
              name='password' 
              value={formData.password} 
              onChange={handleChange} 
            />
            <span>Password</span>
          </label>
          
          <label>
            <input 
              required 
              type='password' 
              className='input' 
              name='confirmPassword' 
              value={formData.confirmPassword} 
              onChange={handleChange} 
            />
            <span>Confirm password</span>
          </label>
          
          <button type='submit' className='submit'>Submit</button>
          <p className='signin'>Already have an account? <Link to={'/signin'}>Signin</Link></p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
