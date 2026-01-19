import React from 'react';
import './CartSidebar.css';

const CartSidebar = ({ cartOpen, onClose, cart, removeFromCart }) => {
  // Calculate total price from the database results
  const total = (cart || []).reduce((sum, item) => sum + parseFloat(item.price) * (item.quantity || 1), 0);

  return (
    <div className={`cart-sidebar ${cartOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
      <div className="cart-header">
        <h2>Your Cart ({(cart || []).length})</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="cart-items">
        {(cart || []).length === 0 ? (
          <p className="empty-msg">Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div key={item.cart_id} className="cart-item">
              <img src={item.image || "https://via.placeholder.com/70"} alt={item.title} />
              <div className="item-details">
                <h4>{item.title}</h4>
                <p>${item.price}</p>
                <button 
                  className="remove-link" 
                  onClick={() => removeFromCart(item.cart_id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {(cart || []).length > 0 && (
        <div className="cart-footer">
          <div className="total-row">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="checkout-btn">Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;