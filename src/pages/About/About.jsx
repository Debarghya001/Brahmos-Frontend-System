import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Link,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import '../About/About.css';
import Navbar from '../../components/navbar/Navbar';

const About = () => {
  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const navigate = useNavigate();

  return (
    <>
    <Navbar className='navbar'/>
    <Container className="about-container">
      <Card className="about-card">
        <CardMedia
          component="img"
          height="400"
          image='https://plus.unsplash.com/premium_photo-1661963208071-9a65b048ebaf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt="Bus Travel"
          className="about-image"
        />
        <CardContent>
          <Typography variant="h3" gutterBottom align="center">
            Welcome to Our Bus Reservation System
          </Typography>
          <Typography variant="body1" paragraph>
            Our Bus Reservation System, developed using the powerful MERN stack, is designed to offer a seamless and convenient travel booking experience. 
            Leveraging the best of MongoDB, Express.js, React, and Node.js, our platform provides a robust and user-friendly environment for booking bus tickets with ease.
          </Typography>

          <Box mt={4} mb={2}>
            <Typography variant="h5" gutterBottom>
              Key Features
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Real-time seat availability and selection for convenience and transparency" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Secure user accounts with role-based permissions for added control" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Easy booking management, including cancellations and modifications" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Detailed booking history and ticket tracking for better organization" />
              </ListItem>
            </List>
          </Box>

          <Box mt={4} mb={2}>
            <Typography variant="h5" gutterBottom>
              Why Choose Us?
            </Typography>
            <Typography variant="body1" paragraph>
              Designed with the modern traveler in mind, our system offers a blend of functionality and simplicity.
              We understand that booking a bus ticket should be straightforward, secure, and reliable. Our platform is continually updated to meet the evolving needs of our users, 
              integrating feedback and industry standards to stay ahead.
            </Typography>
            <Typography variant="body1" paragraph>
              With a dedicated support team, we are committed to ensuring that every journey you book with us starts smoothly. 
              Your satisfaction is our top priority, and we work tirelessly to make sure you enjoy a stress-free booking experience.
            </Typography>
          </Box>

          <Box mt={4} mb={2}>
            <Typography variant="h5" gutterBottom>
              Our Technology
            </Typography>
            <Typography variant="body1" paragraph>
              Built with the latest in web technology, our bus reservation system relies on:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">MongoDB</Typography>
                <Typography variant="body2">
                  Our choice for the database ensures high availability, scalability, and flexibility, perfect for managing dynamic data across multiple users.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Express.js</Typography>
                <Typography variant="body2">
                  Our server framework provides a fast and lightweight backend, supporting our frontend and database efficiently.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">React</Typography>
                <Typography variant="body2">
                  For an interactive and responsive user experience, React powers the frontend, allowing smooth interactions and fast updates.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Node.js</Typography>
                <Typography variant="body2">
                  Node.js enables the backend to handle a high volume of connections, delivering a seamless experience for users booking bus tickets in real-time.
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Box mt={4}>
            <Typography variant="h5" gutterBottom align="center">
              Join Us on a Journey Towards Simpler, Safer, and Smarter Bus Travel
            </Typography>
            <Typography variant="body1" paragraph align="center">
              Our mission is to revolutionize bus travel booking by making it as accessible and efficient as possible. From booking to boarding, every step is designed with you in mind.
            </Typography>
          </Box>

        

          <Box mt={4}>
            <Typography variant="h5" gutterBottom align="center">
              Connect with Us
            </Typography>
            <Box display="flex" justifyContent="center" mb={2}>
              <Link href="https://www.facebook.com" target="_blank" rel="noopener" style={{ margin: '0 10px' }}>
                <Button variant="outlined" color="primary">Facebook</Button>
              </Link>
              <Link href="https://www.twitter.com" target="_blank" rel="noopener" style={{ margin: '0 10px' }}>
                <Button variant="outlined" color="primary">Twitter</Button>
              </Link>
              <Link href="https://www.instagram.com" target="_blank" rel="noopener" style={{ margin: '0 10px' }}>
                <Button variant="outlined" color="primary">Instagram</Button>
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
    </>
  );
};

export default About;
