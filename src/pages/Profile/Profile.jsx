import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import axios from 'axios';
import cookies from 'js-cookie';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updatedProfile, setUpdatedProfile] = useState({
    name: '',
    email: '',
    phonenumber: '',
    role: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          cookies.remove('userid');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        const response = await axios.get('https://brahmosbackend.onrender.com/api/auth/myprofile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data.profile);
        setUpdatedProfile({
          name: response.data.profile.name,
          email: response.data.profile.email,
          phonenumber: response.data.profile.phonenumber,
          role: response.data.profile.role,
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [navigate]);

  const handleProfileUpdate = async () => {
    try {
      const userId = cookies.get('userid');
      const token = localStorage.getItem('token');
      if (!token || !userId) {
        cookies.remove('userid');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const response = await axios.put(
        `https://brahmosbackend.onrender.com/api/auth/myprofile/update/${userId}`,
        updatedProfile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
      setProfileData(updatedProfile);
      setOpenEditModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Profile update failed. Please try again.');
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      const userId = cookies.get('userid');
      if (!userId) {
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
      const response = await axios.put(
        `https://brahmosbackend.onrender.com/api/auth/myprofile/updatepassword/${userId}`,
        { password: oldPassword, newpassword: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
      setOpenPasswordModal(false);
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Password update failed. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const userId = cookies.get('userid');
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      if (!token || !userId) {
        cookies.remove('userid');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      if (role === "Admin") {
        await axios.delete(`https://brahmosbackend.onrender.com/api/busbooking/alldelete/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await axios.delete(`https://brahmosbackend.onrender.com/api/busregister/alldeletebus/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const response = await axios.delete(`https://brahmosbackend.onrender.com/api/auth/delete/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert(response.data.message);
      }
      else {
        await axios.delete(`https://brahmosbackend.onrender.com/api/busbooking/alldelete/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const response = await axios.delete(`https://brahmosbackend.onrender.com/api/auth/delete/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert(response.data.message);
      }

      cookies.remove('userid');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/signin');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Account deletion failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container className="profile-container">
      <Card className="profile-card">
        <CardContent>
          <div className="profile-avatar-container">
            <Avatar className="profile-avatar" alt={profileData.name} src={profileData.avatarUrl} />
          </div>
          <Typography variant="h5" className="profile-name">
            {profileData.name}
          </Typography>
          <div className="profile-details">
            <Typography>
              <span className="profile-label">Email:</span> {profileData.email}
            </Typography>
            <Typography>
              <span className="profile-label">Phone Number:</span> {profileData.phonenumber}
            </Typography>
            <Typography>
              <span className="profile-label">Role:</span> {profileData.role}
            </Typography>
          </div>
          <div className="profile-actions">
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              className="edit-button"
              onClick={() => setOpenEditModal(true)}
            >
              Edit Profile
            </Button>
            <Button
              variant="contained"
              startIcon={<DeleteIcon />}
              color="error"
              className="delete-button"
              onClick={() => setOpenDeleteModal(true)}
            >
              Delete Account
            </Button>
            <Button
              variant="contained"
              startIcon={<LockIcon />}
              color="primary"
              onClick={() => setOpenPasswordModal(true)}
            >
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openPasswordModal} onClose={() => setOpenPasswordModal(false)}>
        <DialogTitle>Update Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Old Password"
            type="password"
            fullWidth
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handlePasswordUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={updatedProfile.name}
            onChange={(e) => setUpdatedProfile({ ...updatedProfile, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={updatedProfile.email}
            onChange={(e) => setUpdatedProfile({ ...updatedProfile, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            value={updatedProfile.phonenumber}
            onChange={(e) => setUpdatedProfile({ ...updatedProfile, phonenumber: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleProfileUpdate} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete your account? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
