import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import '../AllBuses/allbuses.css'; // Import your CSS file

const AllBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await axios.get('https://brahmosbackend.onrender.com/api/busregister/getallbuses'); // Adjust your URL as necessary
        setBuses(response.data.AvailableBusses);
      } catch (error) {
        console.error('Error fetching buses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  if (loading) return <Typography variant="h6">Loading...</Typography>;

  return (
    <div className="table-container">
      <Typography variant="h4" className="page-heading">
        All Available Bus
      </Typography>
      <TableContainer component={Paper} className="mui-table-container">
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow className="table-header-row">
              <TableCell className="table-header-cell">Bus Name</TableCell>
              <TableCell className="table-header-cell">Bus Type</TableCell>
              <TableCell className="table-header-cell">Available Seats</TableCell>
              <TableCell className="table-header-cell">Boarding Point</TableCell>
              <TableCell className="table-header-cell">Dropping Point</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {buses.map((bus) => (
              <TableRow key={bus._id} className="table-row">
                <TableCell>{bus.BusName}</TableCell>
                <TableCell>{bus.BusType}</TableCell>
                <TableCell>{bus.AvailableSeats.length}</TableCell>
                <TableCell>{bus.BoardingPoint}</TableCell> {/* Show exact backend response */}
                <TableCell>{bus.DroppingPoint}</TableCell> 
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AllBuses;
