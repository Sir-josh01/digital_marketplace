import {useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/admin_login.php`, { password });
      if (res.data.success) {
        onLogin(); // Sets isAdmin to true in App.jsx
        navigate("/admin");
      }
    } catch (err) {
      alert("Unauthorized: Incorrect Password", err);
      setError(err.response?.data?.error || "Login failed. Check connection.");
    } finally {
        setIsSubmitting(false);
      }
  }


  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h3>Admin Access</h3>
        {error && <p style={{color: 'red', fontSize: '0.8rem'}}>{error}</p>}

        <input 
          type="password" 
          placeholder="Enter Admin Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-search-input"
          disabled={isSubmitting}
        />
        <button type="submit" className="download-btn" style={{width: '100%', marginTop: '10px'}} 
        disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;