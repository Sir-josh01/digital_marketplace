import React from 'react';
import SafeImage from '../../components/UI/SafeImage';

import './CheckOutView.css';


const CheckOutView = ({ cart, total, handlePayment, isSubmitting }) => {
  return (
    <div className="checkout-page">
      <h2 className="page-title">Checkout Summary</h2>
      
      <div className="checkout-grid">
        {/* left side of the page */}
        <div className="cart-items-section">
          {cart.length > 0 ? (
            cart.map((product) => (
              <div key={product.title} className="checkout-item">
                <SafeImage 
                  src={product.image}
                  alt={product.title}
                  className="checkout.thumb"                
                />
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
            <span>Items ({cart.length})</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Platform Fee</span>
            <span className="free-tag">Free</span>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Total Amount</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <button 
            className={`pay-btn ${isSubmitting ? 'loading' : ''}`} 
            disabled={cart.length === 0 || isSubmitting}
            onClick={handlePayment}
          >
            {isSubmitting ? "Processing..." : "Complete Purchase"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOutView;