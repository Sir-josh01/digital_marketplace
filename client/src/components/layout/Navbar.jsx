import React, { useState, useEffect } from "react";
import { Header } from "../layout/Header";
import { Link } from "react-router";
import "./Navbar.css";

const Navbar = ({ onCartClick, cart = [], user, handleUserLogout, isAdmin }) => {
  const [isDark, setIsDark] = useState(true);
  const itemCount = (cart || []).length;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <>
    <nav className="navbar">
      {/* 1. BRANDING */}
      <div className="nav-logo">
        <Link to="/">
          <h2>Digital<span>Market</span></h2>
        </Link>
      </div>

      {/* 2. CENTER NAV (Hidden on mobile, professional on desktop) */}
        <ul className="nav-links-center">
          <li><Link to="/">Shop</Link></li>
          <li><a href="#browse">Browse</a></li>
          <li><a href="#sell">Start Selling</a></li>

          {isAdmin && (
            <li className="admin-dropdown">
              <button className="admin-trigger">Admin ⚙️</button>
              <div className="dropdown-menu">
                <Link to="/admin">Dashboard</Link>
                <Link to="/add-products">Add Products</Link>
              </div>
            </li>
          )}
        </ul>

        {/* 3. MOBILE OVERLAY (Uses mobile-specific classes) */}
      <div className={`mobile-nav-overlay ${isMenuOpen ? 'active' : ''}`}>
        <button className="close-menu" onClick={() => setIsMenuOpen(false)}>×</button>
        <ul className="mobile-menu-links">
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Shop</Link></li>
          <li><a href="#browse" onClick={() => setIsMenuOpen(false)}>Browse</a></li>
          <li><a href="#sell" onClick={() => setIsMenuOpen(false)}>Start Selling</a></li>
          
          {isAdmin && (
            <div className="mobile-admin-block">
              <span className="menu-divider-text">Admin Management</span>
              <li><Link to="/admin" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
              <li><Link to="/add-products" onClick={() => setIsMenuOpen(false)}>Add Products</Link></li>
            </div>
          )}
        </ul>

      </div>

      {/* 3. ACTION TOOLS */}
      <div className="nav-actions">
        <button 
          className="tool-btn" 
          onClick={() => setIsDark(!isDark)} 
          title="Toggle Theme"
          >
          {isDark ? "☀️" : "🌙"}
        </button>

        <button className="tool-btn cart-trigger" onClick={onCartClick}>
          🛒 {itemCount > 0 && <span className="badge">{itemCount}</span>}
        </button>

        <div className="v-divider"></div>

        {user ? (
          <div className="user-profile">
            <div className="user-text">
              <Link to="/history" className="profile-link-group">
              <span className="username">{user.full_name.split(' ')[0]}</span>
               <div to="/history" className="sub-link">Orders</div>
              </Link>
            </div>
            <button onClick={handleUserLogout} className="logout-pill">Logout</button>
          </div>
        ) : (
          <Link to="/login" className="login-btn-sleek">Sign In</Link>
        )}

        <button 
          className="tool-btn mobile-menu-btn" 
          onClick={() => setIsMenuOpen(true)}
          >
          ☰
        </button>
      </div>
    </nav>

    <div><Header /></div>
      
    </>
  );
};

export default Navbar;
