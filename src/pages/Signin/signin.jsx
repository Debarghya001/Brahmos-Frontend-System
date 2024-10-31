import React, { useState, useEffect } from 'react';
import backgroundimg from '../images/chuttersnap-kq8iWoh5-mU-unsplash.jpg';
import '../Signin/signin.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import Backdropcom from '../../components/Backdrop/Backdropcom';
import cookies from 'js-cookie';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const role = localStorage.getItem('role');
      if (role === 'Admin') {
        navigate('/adminpage');
      } else {
        navigate('/booking');
      }
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();

    axios.post('https://backend-brahmos-bus.onrender.com/api/auth/login', { email, password })
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        cookies.set('userid',res.data.userid,{expires:7,path:'/'});
        
        setAlert({ type: 'success', message: res.data.message });

        setTimeout(() => {
          setLoading(false);
          if (res.data.role === 'Admin') {
            navigate('/adminpage');
          } else {
            navigate('/home');
          }
        }, 1000);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || 'An error occurred';

        setAlert({ type: 'error', message: errorMessage });
        window.location.reload();
      });
  };

  return (
    <div className='container'>
      <img src={backgroundimg} className='backimg' alt='background' />
      <div className='gradient'>
        {alert && <Alert severity={alert.type}>{alert.message}</Alert>}
        <form className='form' onSubmit={handleSubmit}>
          <p className='title'>Login</p>
          <label>
            <input
              required
              placeholder=''
              type='email'
              className='input'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span>Email</span>
          </label>
          <label>
            <input
              required
              placeholder=''
              type='password'
              className='input'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Password</span>
          </label>
          <button className='submit' type='submit'>Login</button>
          <p className='signin'>Don't have an account? <Link to={'/signup'}>Signup</Link></p>
        </form>
      </div>
      <Backdropcom loading={loading} />
    </div>
  );
};

export default Signup;
