import React, { useState, useEffect, useCallback } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Navbar from '../../components/navbar/Navbar';
import axios from 'axios';
import cookies from 'js-cookie';
import './bookinghistory.css';
import { useNavigate } from 'react-router-dom';

export default function BookingHistory() {
    const navigate = useNavigate();
    const [busbooking, setBusbooking] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);

    const fetchBusBooking = useCallback(async () => {
        try {
            const userid = cookies.get('userid');
            if (!userid) {
                cookies.remove('userid');
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                cookies.remove('userid');
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            const response = await axios.get('https://brahmosbackend.onrender.com/api/busbooking/client/mybookings', {
                headers: { Authorization: `Bearer ${token}` },
            });

            setBusbooking(response.data.Mybookings || []);
        } catch (error) {
            console.error('Error fetching bus data:', error);
        }
    }, [navigate]);

    useEffect(() => {
        fetchBusBooking();
    }, [fetchBusBooking]);

    const handleDelete = async () => {
        try {
            await axios.delete(`https://brahmosbackend.onrender.com/api/busbooking/cancel/mybookings/${selectedBookingId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setBusbooking(busbooking.filter((booking) => booking._id !== selectedBookingId));
            setOpenDialog(false);
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    const handleClickOpen = (id) => {
        setSelectedBookingId(id);
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    return (
        <div className='containerbooking'>
            <Navbar className="navbarbooking" />
            <h1 className="table-heading">Booking History 🚍</h1>
            <TableContainer component={Paper} className="custom-table-container">
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Bus Name</strong></TableCell>
                            <TableCell align="right"><strong>Booking ID</strong></TableCell>
                            <TableCell align="right"><strong>Boarding Point</strong></TableCell>
                            <TableCell align="right"><strong>Dropping Point</strong></TableCell>
                            <TableCell align='right'><strong>Seat Number</strong></TableCell>
                            <TableCell align="right"><strong>Total Fare</strong></TableCell>
                            <TableCell align="right"><strong>Name</strong></TableCell>
                            <TableCell align="right"><strong>Booking Date</strong></TableCell>
                            <TableCell align="right"><strong>Status</strong></TableCell>
                            <TableCell align="right"><strong>Action</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {busbooking.length > 0 ? (
                            busbooking.map((booking) => (
                                <TableRow key={booking._id} className="custom-table-row">
                                    <TableCell component="th" scope="row">{booking.busname}</TableCell>
                                    <TableCell align="right">{booking._id}</TableCell>
                                    <TableCell align="right">{booking.boardingpoint}</TableCell>
                                    <TableCell align="right">{booking.droppingpoint}</TableCell>
                                    <TableCell align='right'>{booking.seatnumber.join(', ')}</TableCell>
                                    <TableCell align="right">{booking.totalfare}</TableCell>
                                    <TableCell align="right">{booking.userName}</TableCell>
                                    <TableCell align="right">{formatDate(booking.bookingDate)}</TableCell>
                                    <TableCell align="right">{booking.isVerified}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleClickOpen(booking._id)}
                                        >
                                            Cancel
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={10} align="center">No booking till now</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Cancellation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to cancel this booking?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">No</Button>
                    <Button onClick={handleDelete} color="secondary" autoFocus>Yes, Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
