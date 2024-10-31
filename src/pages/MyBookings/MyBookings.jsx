import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Cookies from 'js-cookie';
import '../MyBookings/mybookings.css';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const fetchBookings = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Cookies.remove('userid');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      const response = await axios.get('https://backend-brahmos-bus.onrender.com/api/busbooking/admin/mybookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data.Mybookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  }, [navigate]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const verifyBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://backend-brahmos-bus.onrender.com/api/busbooking/admin/mybookings/verifysale/${bookingId}`,
        { isVerified: 'verified' },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchBookings();
    } catch (error) {
      console.error('Error verifying booking:', error.response ? error.response.data.message : error.message);
    }
  };

  const rejectBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://backend-brahmos-bus.onrender.com/api/busbooking/admin/mybookings/verifysale/${bookingId}`,
        { isVerified: 'canceled' },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchBookings();
    } catch (error) {
      console.error('Error rejecting booking:', error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div className="table-container">
      <Typography variant="h4" className="page-heading">My Bus Bookings</Typography>
      {bookings.length > 0 ? (
        <TableContainer component={Paper} className="mui-table-container">
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow className="table-header-row">
                <TableCell className="table-header-cell">Booking ID</TableCell>
                <TableCell className="table-header-cell">User Name</TableCell>
                <TableCell className="table-header-cell">Email</TableCell>
                <TableCell className="table-header-cell">Bus Name</TableCell>
                <TableCell className="table-header-cell">Boarding Point</TableCell>
                <TableCell className="table-header-cell">Dropping Point</TableCell>
                <TableCell className="table-header-cell">Date</TableCell>
                <TableCell className="table-header-cell">Status</TableCell>
                <TableCell className="table-header-cell">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id} className="table-row">
                  <TableCell>{booking._id}</TableCell>
                  <TableCell>{booking.userName}</TableCell>
                  <TableCell>{booking.email}</TableCell>
                  <TableCell>{booking.busname}</TableCell>
                  <TableCell>{booking.boardingpoint}</TableCell>
                  <TableCell>{booking.droppingpoint}</TableCell>
                  <TableCell>{new Date(booking.bookingDate).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell>{booking.isVerified}</TableCell>
                  <TableCell>
                    {booking.isVerified === 'pending' && (
                      <>
                        <IconButton color="success" className="verify-button" onClick={() => verifyBooking(booking._id)}>
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton color="error" className="reject-button" onClick={() => rejectBooking(booking._id)}>
                          <CancelIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" className="no-data-text">No bookings to display</Typography>
      )}
    </div>
  );
};

export default MyBookings;
