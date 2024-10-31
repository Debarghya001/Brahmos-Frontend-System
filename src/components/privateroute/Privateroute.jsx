import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (token) {
    const role = localStorage.getItem('role');
    if (role === 'Admin') {
      return <Navigate to="/adminpage" />;
    } else {
      return <Navigate to="/home" />;
    }
  }

  return children; 
};

export default PrivateRoute;
