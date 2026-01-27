import {useState, } from 'react';
import { useNavigate } from 'react-router';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") { // In production, use a real backend check
      onLogin();
      navigate("/admin");
    } else {
      alert("Invalid Credentials");
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