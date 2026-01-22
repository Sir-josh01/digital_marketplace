import React from 'react';

const CheckoutView = ({ cart, total, onBack, onComplete }) => {
  return (
    <div className="checkout-container">
      <button className="back-link" onClick={onBack}>← Back to Assets</button>
      
      <div className="checkout-grid">
        {/* Left Side: Summary */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cart.map((item) => (
              <div key={item.id} className="summary-item">
                <span>{item.title} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <span>Total to Pay:</span>
            <span className="total-amount">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Right Side: Simple Form */}
        <div className="checkout-form">
          <h3>Payment Details</h3>
          <input type="email" placeholder="Email Address for delivery" />
          <input type="text" placeholder="Card Number" />
          <div className="form-row">
            <input type="text" placeholder="MM/YY" />
            <input type="text" placeholder="CVC" />
          </div>
          <button className="pay-btn" onClick={onComplete}>
            Complete Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;