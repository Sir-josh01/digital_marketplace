import React from 'react';
import './CartSidebar.css';

export const CartSidebar = ({ isOpen, onClose, cart }) => {
  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h3>Your Cart</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      
      <div className="cart-content">
        {cart.length === 0 ? <p>Cart is empty</p> : (
          cart.map(item => (
            <div key={item.id} className="cart-item-mini">
              <span>{item.title}</span>
              <strong>${item.price}</strong>
            </div>
          ))
        )}
      </div>

      <div className="cart-footer">
        <button className="checkout-btn">Go to Checkout</button>
      </div>
    </div>
  );
};