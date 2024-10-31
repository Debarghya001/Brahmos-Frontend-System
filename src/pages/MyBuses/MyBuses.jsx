import React, { useEffect, useState, useCallback } from 'react';
import EnhancedTable from '../../components/Table/Table';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../MyBuses/mybuses.css';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Card, CardContent, Typography, MenuItem } from '@mui/material';

const MyBuses = () => {
  const [rows, setRows] = useState([]);
  const [locations, setLocations] = useState([]);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    BusName: '',
    BusType: '',
    BusNumber: '',
    BoardingPoint: '',
    DroppingPoint: '',
    Distance: '',
    totalseats: ''
  });

  const navigate = useNavigate();

  const columns = [
    { id: 'busName', label: 'Bus Name', minWidth: 170 },
    { id: 'busType', label: 'Bus Type', minWidth: 100 },
    { id: 'availableSeats', label: 'Available Seats', minWidth: 170, align: 'right' },
    { id: 'boardingPoint', label: 'Boarding Point', minWidth: 170, align: 'right' },
    { id: 'droppingPoint', label: 'Dropping Point', minWidth: 170, align: 'right' },
  ];

  const fetchBusData = useCallback(async () => {
    try {
      const userId = Cookies.get('userid');
      if (!userId) {
        Cookies.remove('userid');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        Cookies.remove('userid');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const response = await axios.get(`https://brahmosbackend.onrender.com/api/busregister/mybus/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const fetchedRows = response.data.mybus.map((bus) => ({
        id: bus._id,
        busName: bus.BusName || 'N/A',
        busType: bus.BusType || 'N/A',
        availableSeats: bus.AvailableSeats.length,
        droppingPoint: bus.DroppingPoint || 'N/A',
        boardingPoint: bus.BoardingPoint || 'N/A',
      }));
      setRows(fetchedRows);
    } catch (error) {
      console.error('Error fetching bus data:', error);
      Cookies.remove('userid');
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const fetchLocations = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Cookies.remove('userid');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const locationResponse = await axios.get('https://brahmosbackend.onrender.com/api/location/findlocation', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setLocations(locationResponse.data.fetch);
    } catch (error) {
      console.error('Error fetching locations:', error);
      Cookies.remove('userid');
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchBusData();
    fetchLocations();
  }, [fetchBusData, fetchLocations]);

  const handleDelete = async (busName) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Cookies.remove('userid');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const response = await axios.delete(`https://brahmosbackend.onrender.com/api/busregister/deletebus/${busName}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAlert({ type: 'success', message: response.data.message });
      setRows(rows.filter(row => row.busName !== busName));
      fetchBusData();
    } catch (error) {
      console.error('Error deleting bus:', error);
      setAlert({ type: 'error', message: 'Failed to delete bus.' });
    }
  };

  const handleAddBusClick = () => {
    setShowForm(!showForm);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Cookies.remove('userid');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      await axios.post('https://brahmosbackend.onrender.com/api/busregister/createbusroute', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAlert({ type: 'success', message: 'Bus added successfully!' });
      setShowForm(false);
      fetchBusData();
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to add bus.' });
    }
  };

  return (
    <div>
      <button onClick={handleAddBusClick} className='busbutton'>
        {showForm ? 'Close Form' : 'Add Bus'}
      </button>

      {showForm && (
        <div className="floating-form">
          <Card className='add-bus-card'>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Add New Bus
              </Typography>
              <form onSubmit={handleFormSubmit}>
                <TextField
                  label='Bus Name'
                  name='BusName'
                  value={formData.BusName}
                  onChange={handleInputChange}
                  fullWidth
                  margin='normal'
                />
                <TextField
                  label='Bus Type'
                  name='BusType'
                  value={formData.BusType}
                  onChange={handleInputChange}
                  fullWidth
                  margin='normal'
                />
                <TextField
                  label='Bus Number'
                  name='BusNumber'
                  value={formData.BusNumber}
                  onChange={handleInputChange}
                  fullWidth
                  margin='normal'
                />

                <TextField
                  label='Boarding Point'
                  name='BoardingPoint'
                  value={formData.BoardingPoint}
                  onChange={handleInputChange}
                  fullWidth
                  margin='normal'
                  select
                >
                  {locations.map((location) => (
                    <MenuItem key={location._id} value={location.name}>
                      {location.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label='Dropping Point'
                  name='DroppingPoint'
                  value={formData.DroppingPoint}
                  onChange={handleInputChange}
                  fullWidth
                  margin='normal'
                  select
                >
                  {locations.map((location) => (
                    <MenuItem key={location._id} value={location.name}>
                      {location.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label='Distance'
                  name='Distance'
                  value={formData.Distance}
                  onChange={handleInputChange}
                  fullWidth
                  margin='normal'
                />
                <TextField
                  label='Total Seats'
                  name='totalseats'
                  value={formData.totalseats}
                  onChange={handleInputChange}
                  fullWidth
                  margin='normal'
                />
                <Button type='submit' variant='contained' color='primary'>
                  Add Bus
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <EnhancedTable rows={rows.length ? rows : []} columns={columns} onDelete={handleDelete} hideSelectAll />

      {alert.message && (
        <div className={`alert alert-${alert.type}`}>{alert.message}</div>
      )}
    </div>
  );
};

export default MyBuses;
