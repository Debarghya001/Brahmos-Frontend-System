import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup/signup';
import Adminsignup from './pages/AdminSignup/adminsignup';
import Landing from './pages/LandingPage/landing';
import Signin from './pages/Signin/signin';
import Home from './pages/Home/Home';
import AdminPage from './pages/AdminPage/adminpage';
import PrivateRoute from './components/privateroute/Privateroute';
import BookingHistory from './pages/BookingHistory/BookingHistory';
import SearchedBus from './pages/SearchedBus/SearchedBus';
import Profile from './pages/ClientProfile/ClientProfile';
import BookingConfirmation from './pages/BookingConfirmation/BookingConfirmation';
import About from './pages/About/About';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={
          <PrivateRoute>
          <Landing />
          </PrivateRoute>
          }
           />
        <Route exact path='/signup' element={
          <PrivateRoute>
            <Signup/>
          </PrivateRoute>
          } />
        <Route exact path='/adminsignup' element={
          <PrivateRoute>
            <Adminsignup/>
          </PrivateRoute>
        }/>
        <Route exact path='/signin' element={
          <PrivateRoute>
            <Signin/>
          </PrivateRoute>
        }/>
        <Route exact path='/home' element={<Home/>}/>
        <Route exact path='/adminpage' element={<AdminPage/>}/>
        <Route exact path='/bookinghistory' element={<BookingHistory/>}/>
        <Route exact path='/searchedbus' element={<SearchedBus/>}/>
        <Route exact path='/booking-confirmation' element={<BookingConfirmation/>}/>
        <Route exact path='/profile' element={<Profile/>}/>
        <Route exact path='/about' element={<About/>}/>
      </Routes>
    </Router>
  );
};

export default App;
