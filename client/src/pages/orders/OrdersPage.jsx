import React from 'react';
import './OrdersPage.css';

export const OrdersPage = () => {
  // Mock data for past orders
  const orders = [
    { id: 'ORD-9921', date: 'Jan 12, 2026', total: 49, status: 'Completed' },
    { id: 'ORD-8842', date: 'Jan 05, 2026', total: 15, status: 'Completed' }
  ];

  return (
    <div className="orders-page">
      <h1>Purchase History</h1>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span className="order-id">{order.id}</span>
              <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
            </div>
            <div className="order-details">
              <p>Date: {order.date}</p>
              <p>Total: <strong>${order.total}</strong></p>
            </div>
            <button className="download-btn">Download Files</button>
          </div>
        ))}
      </div>
    </div>
  );
};