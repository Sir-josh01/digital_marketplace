import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { Link } from "react-router";

import "./OrderHistory.css";

const OrderHistory = ({ user, clearCart }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const reference = searchParams.get("reference");
  // 2. THE LOCK: This survives re-renders without triggering them
  const hasVerified = useRef(false);

  const fetchCustomerOrders = async () => {
    if (!user?.id) {
      console.warn(
        "📡 Signal: fetchCustomerOrders aborted. Reason: No User ID yet.",
      );
      return;
    }

    try {
      const res = await axios.get(
        `${API_BASE_URL}/get_orders.php?user_id=${user.id}`,
      );

      // if (typeof res.data === "string") {
      //   console.error(
      //     "📡 Signal: Critical! Backend sent HTML instead of JSON. Check PHP warnings.",
      //   );
      //   return;
      // }
      
      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        console.error(
          "📡 Signal: Server returned success:false. Error:",
          res.data.error,
        );
      }
    } catch (err) {
      console.error("Could not fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerOrders();
  }, [user?.id]);

  useEffect(() => {
    const verifyTransaction = async () => {
      // 3. CHECK THE LOCK: Exit if already running or completed
      if (!reference || !user?.id || hasVerified.current) return;
      // 4. ENGAGE THE LOCK: Mark as "currently processing"
      hasVerified.current = true;
      setVerifying(true);
      try {
        const res = await axios.get(
          `${API_BASE_URL}/verify_payment.php?reference=${reference}`,
        );

        if (
          res.data.success ||
          (res.data.message && res.data.message.includes("1062"))
        ) {
          console.log("Payment confirmed", res.data.message);

          await clearCart();
          await fetchCustomerOrders();

          setSearchParams({});
          setPaymentSuccess(true);
        }
      } catch (err) {
        console.error("Verification failed", err);
        fetchCustomerOrders();

        if (err.response) console.log("Backend Error Data:", err.response.data);

      } finally {
        setVerifying(false);
      }
      // }
    };
    verifyTransaction();
  }, [reference, user?.id, setSearchParams, clearCart]);

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
      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span>Order #{order.id}</span>
                <span className="order-date">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
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
      ) : (
        !verifying && <p>You haven't placed any orders yet.</p>
      )}
    </div>
  );
};

export default OrderHistory;
