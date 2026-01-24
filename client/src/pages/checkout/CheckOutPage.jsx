import React, { useState } from 'react';
import axios from 'axios';

import CheckOutView from './CheckOutView';

import './CheckOutPage.css';
import { API_BASE_URL } from '../../config';

const CheckOutPage = ({ cart, clearCart }) => {
  const [loading, setLoading] = useState(false);


  // Logic: Calculate total (safely)
  const total = (Array.isArray(cart) ? cart : []).reduce((acc, item) => acc + Number(item.price), 0);

  // Logic: Handle the final payment process
  const handlePayment = async () => {
    if (cart.length === 0) return;
    setLoading(true);
   
    try {
       console.log("Connecting to PHP backend to process payment...");
       const res = await axios.post(`${API_BASE_URL}/place_order.php`, {
        cart: cart,
        total: total
       });

       const result = res.data;

       if (result.success) {
        alert(`Order #${result.order_id} placed successfully!`) 
        clearCart();
       } else {
       throw new Error(result.error || "Failed to process order");
       }
    } catch(err) {
      console.error("Checkout failed", err);
      alert(err.response?.data?.error || "There was an issue processing your payment.");
    } finally {
      setLoading(false);
    }  
  };

  return (
    <div className='checkout-page-wrapper'>
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