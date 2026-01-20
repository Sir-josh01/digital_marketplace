import React from 'react';
import { Header } from "./Header";
import {Link} from 'react-router';
import './Navbar.css';

const Navbar = ({ cart, onCartClick }) => {
  // const itemCount = (cart || []).reduce((total, item) => total + item.quantity, 0);
  const itemCount = (cart || []).length;
  
  return (
    <>
    <nav className="navbar">
      <div className="nav-logo">
        <Link to='/'
        style={{textDecoration: "none", color: "inherit" }}
        >
        <h2>Digital<span>Market</span></h2>
        </Link>
      </div>

      <div className="nav-search">
        <input type="text" placeholder="Search digital assets..." />
      </div>

      <ul className="nav-links">
        <li><a href="#browse">Browse</a></li>
        <li><a href="#sell">Start Selling</a></li>
        <Link to="/admin" className="admin-link"
        >Add Product
        </Link>
        
        <li className="nav-cart">
          <button className="cart-icon" onClick={onCartClick}>
            🛒 {itemCount > 0 && (
              <span className="cart-count">{itemCount}</span>
            )}
          </button>
        </li>
      </ul>
    </nav>

    <Header />
    </>
  );
};

export default Navbar;