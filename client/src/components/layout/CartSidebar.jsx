import React, { useEffect } from "react";
import SafeImage from "../UI/SafeImage";
import "./CartSidebar.css";

const CartSidebar = ({
  cartOpen,
  onClose,
  cart,
  removeFromCart,
  updateQuantity,
  handleProceedToCheckout
}) => {
  // Calculate total price from the database results
  const total = (Array.isArray(cart) ? cart : []).reduce(
  (acc, item) => acc + item.price * item.quantity, 
  0
);

  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
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
                <p>
                  ${item.price}{" "}
                  {item.quantity > 1 && (
                    <span className="qty-pill">x{item.quantity}</span>
                  )}
                </p>

                <button
                  className="remove-link"
                  onClick={() => removeFromCart(item.cart_id)}
                >
                  Remove
                </button>
                {/* <div className="qty-controls">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="qty-btn"
                    >
                      −
                    </button>
                    <span className="qty-number">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div> */}
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
          <button 
          className="checkout-btn"
          onClick={handleProceedToCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
