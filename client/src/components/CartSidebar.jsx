import React, { useEffect } from "react";
import SafeImage from './SafeImage';
import "./CartSidebar.css";

const CartSidebar = ({ cartOpen, onClose, cart, removeFromCart }) => {
  // Calculate total price from the database results
  const total = (cart || []).reduce(
    (sum, item) => sum + parseFloat(item.price) * (item.quantity || 1),
    0,
  );

  useEffect(() => {
    if (cartOpen) {
      // Prevent the body from scrolling
      document.body.style.overflow = "hidden";
    } else {
      // Let the body scroll again
      document.body.style.overflow = "auto";
    }

    // Clean up function to ensure scroll returns if component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [cartOpen]);

  return (
    <div
      className={`cart-sidebar ${cartOpen ? "open" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="cart-header">
        <h2>Your Cart ({(cart || []).length})</h2>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="cart-items">
        {(cart || []).length === 0 ? (
          <>
            <p className="empty-msg">Your cart is empty.</p>
            <button
              onClick={onClose}
              style={{
                marginTop: "20px",
                background: "none",
                border: "1px solid var(--primary)",
                color: "var(--primary)",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Browse Assets
            </button>
          </>
        ) : (
          cart.map((item) => (
            <div key={item.cart_id} className="cart-item">
            
              <SafeImage 
                src={item.image} 
                alt={item.title} 
                className="cart-thumb"
               />

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
