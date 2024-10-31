import React, { useState } from 'react';
import backgroundimg from '../images/chuttersnap-kq8iWoh5-mU-unsplash.jpg';
import '../AdminSignup/adminsignup.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    phonenumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://backend-brahmos-bus.onrender.com/api/auth/register', {
        name: formData.name,
        phonenumber: formData.phonenumber,
        email: formData.email,
        password: formData.password,
        role: 'Admin', // Assuming the role is 'admin'
      });
      console.log(response.data.message);
      navigate('/signin'); // Navigate to the login page upon successful registration
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.message);
      } else {
        console.error('Error!', error.message);
      }
    }
  };

  return (
    <div className='container'>
      <img src={backgroundimg} className='backimg' alt='background' />
      <div className='gradient'>
        <form className='form' onSubmit={handleSubmit}>
          <p className='admintitle'>Register As Admin</p>
          <p className='adminmessage'>Signup as an admin now and get the chance to list your bus.</p>
          <label>
            <input 
              required 
              placeholder='' 
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
              placeholder='' 
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
              placeholder='' 
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
              placeholder='' 
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
              placeholder='' 
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
