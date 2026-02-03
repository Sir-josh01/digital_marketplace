import React, { useState } from "react";
// import { useNavigate } from "react-router";
import axios from "axios";

import CheckOutView from "./CheckOutView";

import "./CheckOutPage.css";
import { API_BASE_URL } from "../../config";

const CheckOutPage = ({ cart, clearCart, user }) => {
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  // const navigate = useNavigate();
    const total = (Array.isArray(cart) ? cart : []).reduce(
    (acc, item) => acc + (Number(item.price) * (item.quantity || 1)),
    0,
  );

  const exchangeRate = 1550;
  const totalNGN = (total * exchangeRate).toLocaleString();


  const handlePayment = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    if (!address || !phone) {
      alert("Please provide shipping details.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/initialize_payment.php`, {
        user_id: user.id,
        email: user.email, 
        amount: total,     
        cart: cart,
        address: address, 
        phone: phone       
      });

      if (res.data.status && res.data.data.authorization_url) {
        // Redirect the user to the Paystack Payment Page
        window.location.href = res.data.data.authorization_url;
      } else {
        throw new Error(res.data.message || "Failed to initialize payment gateway. Check your network and try again");
        }
      } catch (err) {
        console.error("Payment initialization failed", err);
        alert(
          err.response?.data?.error || 
        err.message || 
        "There was an issue connecting to the payment gateway."
        );
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="checkout-page-wrapper">
      <h2>Complete Your Purchase</h2>

      <div className="shipping-form">
        <div className="input-group">
          <label>Phone Number</label>
          <input 
            type="tel" 
            placeholder="+234..." 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
          />
        </div>

        <div className="input-group">
          <label>Shipping Address</label>
          <textarea 
            placeholder="Enter full delivery address..." 
            value={address} 
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="payment-summary">
        <div className="total-display">
          <h3>Total: ${total.toFixed(2)}</h3>
          <p className="currency-note">
            (Processed as <strong>₦{totalNGN}</strong>)
          </p>
        </div>
      </div>

      <CheckOutView
        cart={cart}
        total={total}
        handlePayment={handlePayment}
        isSubmitting={loading}
        clearCart={clearCart}
      />
    </div>
  );
};

export default CheckOutPage;
