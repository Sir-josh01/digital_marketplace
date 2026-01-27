import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);

// Dashboard summary
  const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
  const totalOrders = orders.length;

  const fetchOrders = async () => {
    const res = await axios.get(`${API_BASE_URL}/get_orders.php`);
    if (res.data.success) setOrders(res.data.orders);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/update_order_status.php`, {
        order_id: orderId,
        status: newStatus
      });
      if (res.data.success) {
        fetchOrders();
      } else {
        alert("Server error: " + res.data.error);
      } 
    } catch (err) {
      alert("Network error: Could not update status", err);
    }
  };

  const deleteOrder = async (orderId) => {
  if (window.confirm("Are you sure you want to delete this order?")) {
    try {
      const res = await axios.post(`${API_BASE_URL}/delete_order.php`, {
        order_id: orderId
      });
      if (res.data.success) {
        fetchOrders(); // Refresh the list
      }
    } catch (err) {
      alert("Error deleting order");
    }
  }
};

const downloadReport = () => {
  // 1. Define Headers
  const headers = ["Order ID", "Items", "Total Amount", "Status", "Date"];
  
  // 2. Map orders to rows
  const rows = orders.map(order => [
    `#${order.id}`,
    `"${order.product_summary}"`, // Quotes handle commas inside the item names
    order.total_amount,
    order.status || "Pending",
    order.created_at
  ]);

  // 3. Combine into a single string
  const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");

  // 4. Create a download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Sales_Report_${new Date().toLocaleDateString()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div className="admin-container">
      <div className='admin-header'>
        <h2>Admin: Order Management</h2>
      <button onClick={downloadReport} className="download-btn">
    📥 Download Report
  </button>
      </div>

      <div className='table-responsive'>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Items</th>
            <th>Customer Total</th>
            <th>Current Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
           orders.map(order => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.product_summary || "No items"}</td>
              <td>${order.total_amount}</td>
              <td><span className={`status-${(order.status ||'Pending').toLowerCase()}`}>{order.status || "Pending"}</span></td>
              <td>
                <select 
                  value={order.status} 
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>

                <button 
                  onClick={() => deleteOrder(order.id)} 
                  className="delete-btn"
                  title="Delete Order"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
      <td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>
        No orders found in the database.
      </td>
    </tr>
        )}
        </tbody>
      </table>
      </div>

      {/* Summary Cards */}
      <div className="admin-stats">
        <div className="stat-card">
          <span>Total Sales</span>
          <h3>${totalSales.toFixed(2)}</h3>
        </div>
        <div className="stat-card">
          <span>Total Orders</span>
          <h3>{totalOrders}</h3>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;