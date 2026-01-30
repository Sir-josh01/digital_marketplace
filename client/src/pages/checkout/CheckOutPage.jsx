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
    (acc, item) => acc + Number(item.price),
    0,
  );

  const handlePayment = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/place_order.php`, {
        cart: cart,
        total: total,
        user_id: user.id,
      });

      if (res.data.success) {
        alert(`Order placed successfully!`);
        clearCart();
      } else {
        throw new Error("Failed to process order");
      }
    } catch (err) {
      console.error("Checkout failed", err);
      alert(
        err.response?.data?.error ||
          "There was an issue processing your payment.",
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
        // clearCart={clearCart}
      />
    </div>
  );
};

export default CheckOutPage;
