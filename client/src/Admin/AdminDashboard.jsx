import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);


//   const handleStatusChange = async (orderId, newStatus) => {
//   try {
//     const res = await axios.post(`${API_BASE_URL}/update_order_status.php`, {
//       order_id: orderId,
//       status: newStatus
//     });

//     if (res.data.success) {
//       alert("Status updated successfully!");
//       // Refresh the orders list to see the change
//       fetchOrders(); 
//     }
//   } catch (err) {
//     alert("Failed to update status");
//   }
// };

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
      alert("Network error: Could not update status");
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

  return (
    <div className="admin-container">
      <h2>Admin: Order Management</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Total</th>
            <th>Current Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>${order.total_amount}</td>
              <td><span className={`status-${(order.status ||'pending').toLowerCase()}`}>{order.status ? order.status : "Pending"}</span></td>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;