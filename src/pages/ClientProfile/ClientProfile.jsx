import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import Profile from '../Profile/Profile';

const ClientProfile = () => {
  return (
    <div className='container'>
         <Navbar className="navbar" page={'Booking History'}/>
        <Profile/>
    </div>
  )
}

export default ClientProfile