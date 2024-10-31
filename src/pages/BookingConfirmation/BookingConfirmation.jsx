import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../BookingConfirmation/BookingConfirmation.css';

const BookingConfirmation = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { busid, seatnumber, bookingDate } = state;

    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        age: ''
    });
    const [totalFare, setTotalFare] = useState(null);
    const [busDetails, setBusDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserAndBusDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    Cookies.remove('userid');
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }

                const userResponse = await axios.get(
                    'https://brahmosbackend.onrender.com/api/auth/myprofile',
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const { name, email, age } = userResponse.data.profile;
                setUserDetails({ name, email, age });

                const busResponse = await axios.post(
                    'https://brahmosbackend.onrender.com/api/busbooking/calculateFareAndDetails',
                    {
                        busid,
                        seatnumber,
                        bookingDate,
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setTotalFare(busResponse.data.totalfare);
                setBusDetails({
                    busname: busResponse.data.busname,
                    busnumber: busResponse.data.busnumber,
                    boardingPoint: busResponse.data.boardingpoint,
                    droppingPoint: busResponse.data.droppingpoint
                });
                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                setLoading(false);
            }
        };

        fetchUserAndBusDetails();
    }, [busid, seatnumber, bookingDate, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    };

    const handleConfirmBooking = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                Cookies.remove('userid');
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            const response = await axios.post(
                'https://brahmosbackend.onrender.com/api/busbooking/booking',
                {
                    busid,
                    seatnumber,
                    bookingDate,
                    userName: userDetails.name,
                    email: userDetails.email,
                    age: userDetails.age,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('Booking successful!');
            navigate('/home');
        } catch (error) {
            alert(`Booking failed: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleCancel = () => {
        navigate('/home');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="booking-confirmation">
            <h2>Booking Confirmation</h2>
            <form>
                <div className="user-details">
                    <label>
                        Name:
                        <input 
                            type="text" 
                            name="name" 
                            value={userDetails.name} 
                            onChange={handleInputChange} 
                        />
                    </label>
                    <label>
                        Email:
                        <input 
                            type="email" 
                            name="email" 
                            value={userDetails.email} 
                            onChange={handleInputChange} 
                        />
                    </label>
                    <label>
                        Age:
                        <input 
                            type="number" 
                            name="age" 
                            value={userDetails.age} 
                            onChange={handleInputChange} 
                            required
                        />
                    </label>
                </div>

                <p><strong>Bus Name:</strong> {busDetails.busname}</p>
                <p><strong>Bus Number:</strong> {busDetails.busnumber}</p>
                <p><strong>Seat Numbers:</strong> {seatnumber.join(', ')}</p>
                <p><strong>Boarding Point:</strong> {busDetails.boardingPoint}</p>
                <p><strong>Dropping Point:</strong> {busDetails.droppingPoint}</p>
                <p><strong>Total Fare:</strong> Rs {totalFare}</p>
                <p><strong>Booking Date:</strong> {new Date(bookingDate).toLocaleDateString()}</p>

                <div className="booking-buttons">
                    <button type="button" onClick={handleConfirmBooking}>Confirm</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default BookingConfirmation;
