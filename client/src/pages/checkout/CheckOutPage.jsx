import React, { useState } from "react";
// import { useNavigate } from "react-router";
import axios from "axios";

import CheckOutView from "./CheckOutView";

import "./CheckOutPage.css";
import { API_BASE_URL } from "../../config";

const CheckOutPage = ({ cart, clearCart, user }) => {
  const [loading, setLoading] = useState(false);

  // const navigate = useNavigate();

  const total = (Array.isArray(cart) ? cart : []).reduce(
    (acc, item) => acc + (Number(item.price) * (item.quantity || 1)),
    0,
  );

  const handlePayment = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/initialize_payment.php`, {
        user_id: user.id,
        email: user.email, // Required by Paystack
        amount: total,     // Total in Naira
        cart: cart         // Pass cart items for record keeping
      });

      if (res.data.status && res.data.data.authorization_url) {
        // Redirect the user to the Paystack Payment Page
        window.location.href = res.data.data.authorization_url;
      } else {
        throw new Error(res.data.message || "Failed to initialize payment gateway.");
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
