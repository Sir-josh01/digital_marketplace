import {useState, } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
    const res = await axios.post(`${API_BASE_URL}/login.php`, { password });
    if (res.data.success) {
      onLogin(); // Sets isAdmin to true in App.jsx
      navigate("/admin");
    }
  } catch (err) {
    alert("Unauthorized: Incorrect Password", err);
  }
};

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h3>Admin Access</h3>
        <input 
          type="password" 
          placeholder="Enter Admin Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-search-input"
        />
        <button type="submit" className="download-btn" style={{width: '100%', marginTop: '10px'}}>
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;