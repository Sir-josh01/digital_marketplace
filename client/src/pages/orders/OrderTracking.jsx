import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {API_BASE_URL} from '../../config';
import { getStatusStep, formatDate } from '../../utils/OrderHelpers';
import './OrderTracking.css';

const OrderTracking = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/get_single_order_details.php?id=${id}`);
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Tracking error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="loader">Locating order...</div>;
  if (!data || !data.order) return <div className="error">Order not found.</div>;

    // Inside your component:
  const currentStep = getStatusStep(data.order.status);
  const formattedDate = formatDate(data.order.created_at);

  return (
    <div className="tracking-container">
      <Link to="/history" className="back-link">← Back to History</Link>
      
      <div className="tracking-card">
        <div className="tracking-header">
          <h1>Order # {data.order.id}</h1>
          {currentStep}
          <p>Placed on {formattedDate}</p>
        </div>

        <div className="status-badge">
         <p>Status Level: {currentStep} / 4</p>
        </div>
        
        {/* Visual Progress Tracker */}
        <div className="progress-stepper">
          <div className="step active"><span>✓</span><p>Confirmed</p></div>
          <div className="step active"><span>2</span><p>Processing</p></div>
          <div className="step"><span>3</span><p>Shipped</p></div>
          <div className="step"><span>4</span><p>Delivered</p></div>
        </div>

        <div className="order-summary">
          <h3>Items in this Order</h3>
          {data.items.map((item, index) => (
            <div key={index} className="item-detail">
              <span>{item.product_title}</span>
              <span>${Number(item.price).toFixed(2)}</span>
            </div>
          ))}
          <div className="total-bar">
            <strong>Total Paid</strong>
            <strong>${Number(data.order.total_amount).toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;