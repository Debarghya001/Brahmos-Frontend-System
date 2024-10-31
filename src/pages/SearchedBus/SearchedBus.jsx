import React, { useState, useEffect, useCallback } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Navbar from '../../components/navbar/Navbar';
import '../SearchedBus/SearchedBus.css'; 
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Seating from '../../components/Seating/Seating';

export default function SearchedBus() {
  const search = useLocation().search;
  const params = new URLSearchParams(search);
  const startLocation = params.get('startLocation');
  const endLocation = params.get('endLocation');
  const journeyDate = params.get('journeyDate');
  const [searchedbus, setSearchedbus] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [showSeatingLayout, setShowSeatingLayout] = useState(false);
  const navigate = useNavigate();

  const fetchBus = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Cookies.remove('userid');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      const response = await axios.get(
        `https://backend-brahmos-bus.onrender.com/api/busregister/searchbus?BoardingPoint=${startLocation}&DroppingPoint=${endLocation}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSearchedbus(response.data.fetchbus || []);
    } catch (error) {
      console.log(`Fetching Error ${error}`);
    }
  }, [startLocation, endLocation, navigate]);

  useEffect(() => {
    fetchBus();
  }, [fetchBus]);

  const openSeatingLayout = (bus) => {
    setSelectedBus(bus);
    setShowSeatingLayout(true);
  };

  const closeSeatingLayout = () => {
    setShowSeatingLayout(false);
    setSelectedBus(null);
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="containerbooking">
      <Navbar className="navbarbooking" />
      <h1 className="table-heading">From: {startLocation}</h1>
      <h1 className="table-heading">To: {endLocation}</h1>
      <h2 className="table-heading">Date: {journeyDate}</h2>
      {searchedbus.length === 0 ? (
        <>
          <h3 className="no-bus-message">No buses found with these locations</h3>
          <Button variant="contained" color="primary" onClick={handleBack}>
            Back
          </Button>
        </>
      ) : (
        <TableContainer component={Paper} className="custom-table-container">
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Bus Name</TableCell>
                <TableCell align="right">Bus Type</TableCell>
                <TableCell align="right">Boarding Point</TableCell>
                <TableCell align="right">Dropping Point</TableCell>
                <TableCell align="right">Total Seats</TableCell>
                <TableCell align="right">Fare (per Seat)</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchedbus.map((bus) => (
                <TableRow
                  key={bus._id}
                  className="custom-table-row"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {bus.BusName}
                  </TableCell>
                  <TableCell align="right">{bus.BusType}</TableCell>
                  <TableCell align="right">{bus.BoardingPoint}</TableCell>
                  <TableCell align="right">{bus.DroppingPoint}</TableCell>
                  <TableCell align="right">{bus.totalseats}</TableCell>
                  <TableCell align="right">{bus.totalfare}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => openSeatingLayout(bus)}
                    >
                      Book
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {showSeatingLayout && selectedBus && (
        <Seating
          totalSeats={selectedBus.totalseats}
          soldSeats={selectedBus.soldseats || []}
          busid={selectedBus._id}
          boardingPoint={startLocation}
          droppingPoint={endLocation}
          totalFare={selectedBus.totalfare}
          bookingDate={journeyDate}
          onClose={closeSeatingLayout}
        />
      )}
    </div>
  );
}
