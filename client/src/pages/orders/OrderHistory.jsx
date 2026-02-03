import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router";
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import {Link} from 'react-router'

import './OrderHistory.css'

const OrderHistory = ({user, clearCart}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const reference = searchParams.get("reference");


  useEffect(() => {
    const fetchCustomerOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/get_orders.php?user_id=${user.id}`);
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error("Could not fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerOrders();
  }, []);

  useEffect(() => {
    const verifyTransaction = async () => {
      if (reference) {
        setVerifying(true);

        console.log("🔍 Signal: Found Paystack reference, starting verification...", reference);

        try {
          const res = await axios.get(`${API_BASE_URL}/verify_payment.php?reference=${reference}`);

          console.log("📦 Signal: Verification API result:", res.data);

          if (res.data.success) {

            console.log("💰 Signal: Payment confirmed! Calling clearCart now...");

            setPaymentSuccess(true);
            await clearCart(); 
          } else {
            console.warn("⚠️ Signal: Backend verified but returned success: false. Message:", res.data.message);
          }
          // FETCH THE UPDATED LIST SO THE NEW ORDER APPEARS IMMEDIATELY
          const updated = await axios.get(`${API_BASE_URL}/get_orders.php?user_id=${user.id}`);
          if (updated.data.success) {
              setOrders(updated.data.orders);
          }
        } catch (err) {
          console.error("Verification failed", err);

          console.error("🔥 Signal: Critical failure in verification flow", err);
      
        } finally {
          setVerifying(false);
          // Remove reference from URL so it doesn't verify again on refresh
          setSearchParams({}); 
        }
      }
    };

    verifyTransaction();
  }, [reference]);

  if (loading) return <div className="loader">Loading your orders...</div>;

  return (
    <div className="order-history-container">
      {verifying && <div className="loader">Verifying your payment...</div>}
      
      {paymentSuccess && (
        <div className="status-card success">
          <h2>🎉 Thank You for your purchase!</h2>
          <p>Your order has been confirmed. You can track it below.</p>
        </div>
      )}

      <h2>Your Order History</h2>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span>Order #{order.id}</span>
                <span className="order-date">{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <span>{item.product_title}</span>
                    <span>${Number(item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <strong>Total: ${Number(order.total_amount).toFixed(2)}</strong>
                <span className="status-pill">{order.status}</span>
                <Link to={`/track/${order.id}`} className="track-button">
                Track Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;