import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './dashboard.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('dashboard-scroll'); 

    return () => {
      document.body.classList.remove('dashboard-scroll'); 
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          cookies.remove('userid');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        const response = await axios.get('https://backend-brahmos-bus.onrender.com/api/busbooking/admin/sales', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching the sales data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!data) {
    return <div className="no-data">No data to show</div>;
  }

  const totalSeats = data.Notsold + data.TotalseatsSold;
  const totalRevenue = data.TotalRevenue;

  const revenuePerSoldSeat = totalRevenue / (data.TotalseatsSold || 1);

  const seatData = [
    { name: 'Sold Seats', value: data.TotalseatsSold },
    { name: 'Not Sold', value: data.Notsold },
  ];

  const revenueData = [
    { name: 'Total Revenue', value: totalRevenue },
    { name: 'Remaining Seats', value: totalSeats },
  ];

  const comparisonData = [
    {
      name: 'Revenue Comparison',
      TotalRevenue: totalRevenue,
      RevenuePerSoldSeat: revenuePerSoldSeat,
    },
  ];

  return (
    <div className="dashboard">
      <Typography variant="h4" className="dashboard-title">Bus Sales Analytics</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h4">₹{totalRevenue.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6">Seats Sold</Typography>
              <Typography variant="h4">{data.TotalseatsSold}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6">Seats Not Sold</Typography>
              <Typography variant="h4">{data.Notsold}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={seatData} barSize={50}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>

        <Grid item xs={12} sm={6}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={revenueData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                {revenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="TotalRevenue" fill="#82ca9d" />
          <Bar dataKey="RevenuePerSoldSeat" fill="#FFBB28" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
