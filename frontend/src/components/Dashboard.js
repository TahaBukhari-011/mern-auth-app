import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Dashboard = ({ setToken }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      console.log('Dashboard mounted - Token:', !!token);
      
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }

      // Use stored user data immediately
      if (storedUser) {
        console.log('Using stored user data');
        setUser(JSON.parse(storedUser));
        setLoading(false);
        return;
      }

      // If no stored user, fetch from API
      try {
        console.log('Fetching user profile from API');
        const res = await axios.get(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('User profile fetched:', res.data);
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      } catch (err) {
        console.error('Error fetching user:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, setToken]);

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>🎉 Welcome to Your Dashboard!</h1>
      
      {user && (
        <div className="user-info">
          <h3>Hello, {user.name}! 👋</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Member since:</strong> {new Date().toLocaleDateString()}</p>
          <p><strong>User ID:</strong> {user.id}</p>
        </div>
      )}
      
      <p>You have successfully logged into your MERN authentication application.</p>
      <p>This is your personal dashboard where you can manage your profile.</p>
      
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;