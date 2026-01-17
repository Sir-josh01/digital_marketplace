import React from 'react';
import { Header } from "./Header";
import './Navbar.css';

const Navbar = () => {
  return (
    <>
    <nav className="navbar">
      <div className="nav-logo">
        <h2>Byte<span>Market</span></h2>
      </div>

      <div className="nav-search">
        <input type="text" placeholder="Search digital assets..." />
      </div>

      <ul className="nav-links">
        <li><a href="#browse">Browse</a></li>
        <li><a href="#sell">Start Selling</a></li>
        <li className="nav-cart">
          <button className="cart-icon">
            🛒 <span className="cart-count">0</span>
          </button>
        </li>
      </ul>
    </nav>

    <Header />
    </>
  );
};

export default Navbar;