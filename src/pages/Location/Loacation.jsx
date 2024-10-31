import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Location/location.css';
import { TextField, Button, Card, CardContent, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete Icon

export default function Location() {
  const [row, setRows] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({
    name: ''
  });

  const navigate = useNavigate();

  // Combined function to fetch data
  const fetchRowData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found in localStorage');
        Cookies.remove('userid');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      const response = await axios.get('https://brahmosbackend.onrender.com/api/location/findlocation', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRows(response.data.fetch);
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchRowData();
  }, [navigate]);

  // Toggle form visibility
  const handleClick = () => {
    setShowForm(!showForm);
  };

  // Handle form input changes
  const handleInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found in localStorage');
        Cookies.remove('userid');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      await axios.post('https://brahmosbackend.onrender.com/api/location/addlocation', form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setForm({ name: '' });
      setShowForm(false);

      // Fetch the updated list of locations after adding the new one
      fetchRowData();

    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  // Handle location deletion
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found in localStorage');
        Cookies.remove('userid');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      await axios.delete(`https://brahmosbackend.onrender.com/api/location/deletelocation/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Fetch the updated list of locations after deleting
      fetchRowData();
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  return (
    <div>
      <button className='addbutton' onClick={handleClick}>
        {showForm ? 'Close Form' : 'Add Location'}
      </button>
      {showForm && (
        <div className="floating-form">
          <Card className='add-bus-card'>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Add New Location
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label='Location Name'
                  name='name'
                  value={form.name}
                  onChange={handleInput}
                  fullWidth
                  margin='normal'
                />
                <Button type='submit' variant='contained' color='primary'>
                  Add Location
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
      <TableContainer component={Paper} className="custom-table-container">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow className="table-header">
              <TableCell>Locations</TableCell>
              <TableCell>Action</TableCell> {/* New column for Delete button */}
            </TableRow>
          </TableHead>
          <TableBody>
            {row.map((row) => (
              <TableRow key={row._id} className="table-row">
                <TableCell className="table-cell">{row.name}</TableCell>
                <TableCell className="table-cell">
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(row._id)} // Call delete function
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
