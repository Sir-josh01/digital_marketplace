import React from 'react';
import './CheckOutPage.css';

export const CheckOutPage = ({ cart }) => {
  // Calculate total price
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="checkout-page">
      <h2 className="page-title">Checkout Summary</h2>
      
      <div className="checkout-grid">
        {/* Left Side: Items in Cart */}
        <div className="cart-items-section">
          {cart.length > 0 ? (
            cart.map((product) => (
              <div key={product.id} className="checkout-item">
                <img src={product.image} alt={product.title} />
                <div className="item-info">
                  <h4>{product.title}</h4>
                  <p>Vendor: {product.vendor}</p>
                </div>
                <p className="item-price">${product.price}</p>
              </div>
            ))
          ) : (
            <p className="empty-msg">Your cart is currently empty.</p>
          )}
        </div>

        {/* Right Side: Order Summary Box */}
        <div className="order-summary-box">
          <h3>Order Total</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${total}</span>
          </div>
          <div className="summary-row">
            <span>Platform Fee</span>
            <span>$0.00</span>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Total</span>
            <span>${total}</span>
          </div>
          <button className="pay-btn" disabled={cart.length === 0}>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};