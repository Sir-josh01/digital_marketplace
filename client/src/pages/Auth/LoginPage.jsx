import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useNavigate, Link } from 'react-router';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/login_page.php`, { email, password });
      if (res.data.success) {
        onLoginSuccess(res.data.user); // Pass user info up to App.jsx
        navigate("/");
      } else {
        alert(res.data.error);
      }
    } catch (err) {
      alert("Login failed. Check your connection.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h3>Welcome Back</h3>
        <input 
          type="email" placeholder="Email Address" className="admin-search-input"
          value={email} onChange={(e) => setEmail(e.target.value)} required 
        />
        <input 
          type="password" placeholder="Password" className="admin-search-input"
          value={password} onChange={(e) => setPassword(e.target.value)} required 
        />
        <button type="submit" className="download-btn" style={{width: '100%'}}>
          Login
        </button>
        <p className="auth-switch-text">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;