import React, { useState } from 'react'
import backgroungimp from '../images/jherico-agulay-HiAAheY23h8-unsplash.jpg'
import { useNavigate } from 'react-router-dom'
import '../LandingPage/landing.css'

const Landing = () => {
  const [loading,setLoading]=useState(false)
  const navigate=useNavigate();
  
  const handleclick=()=>{
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/signup')
    }, 5000);
  }

  const handleclick2=()=>{
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/signin')
    }, 5000);
  }

  return (
    <div className='container'>
    
      <img src={backgroungimp} alt='background' className='back-image'/>
      <div className='gradient-overlay'></div>
        <div className='heading'>
            <h2>Welcome to BrahMos Travels</h2>
        </div>
  <button className='homebutton' onClick={handleclick}>
  <span>Sign Up</span>
</button>
<button className='loginbutton' onClick={handleclick2}>
  <span>Sign In</span>
</button>

{loading &&(
  <div className='spinner-overlay'>
  <div className="spinner-container">
  <div className="dot"></div>
  <div className="dot"></div>
  <div className="dot"></div>
  <div className="dot"></div>
  <div className="dot"></div>
  <div className="dot"></div>
  <div className="dot"></div>
  <div className="dot"></div>
</div>
</div>
)}
    </div>
  )
}

export default Landing