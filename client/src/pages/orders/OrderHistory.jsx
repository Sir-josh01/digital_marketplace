import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import {Link} from 'react-router'

import './OrderHistory.css'

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const deleteOrder = async (orderId) => {
  if (window.confirm("Are you sure you want to delete this order?")) {
    try {
      // We pass adminConfig as the THIRD argument for POST requests
      const res = await axios.post(
        `${API_BASE_URL}/delete_order.php`, 
        { order_id: orderId }, 
        adminConfig 
      );

      if (res.data.success) {
        fetchOrders(); // Refresh the list
      }
    } catch (err) {
      alert("Security Error: You do not have permission to delete.");
    }
  }
};

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/get_orders.php`);
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

  if (loading) return <div className="loader">Loading your orders...</div>;

  return (
    <div className="order-history-container">
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