import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);


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

  const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
  const totalOrders = orders.length;

  return (
    <div className="admin-container">
      <h2>Admin: Order Management</h2>

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
    </div>
  );
};

export default AdminDashboard;