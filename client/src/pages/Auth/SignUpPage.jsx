import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useNavigate } from 'react-router';

const SignUpPage = () => {
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/register_page.php`, formData);
      if (res.data.success) {
        alert("Account Created! Please Login.");
        navigate("/login");
      } else {
        alert(res.data.error);
      }
    } catch (err) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSignUp}>
        <h3>Create Account</h3>
        <input 
          type="text" placeholder="Full Name" className="admin-search-input"
          onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
          required 
        />
        <input 
          type="email" placeholder="Email Address" className="admin-search-input"
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          required 
        />
        <input 
          type="password" placeholder="Password" className="admin-search-input"
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          required 
        />
        <button type="submit" className="download-btn" style={{width: '100%', marginTop: '10px'}}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;