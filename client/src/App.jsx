import { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, useNavigate, Navigate } from "react-router";

// For pages
import HomePage from "./pages/home/HomePage";
import CheckOutPage from "./pages/checkout/CheckOutPage";
import ProductDetails from "./pages/home/ProductDetails";
import AddProduct from "./Admin/AddProduct";
import OrderTracking from "./pages/orders/OrderTracking";
import AdminDashboard from "./Admin/AdminDashboard";
import LoginPage from "./pages/Auth/LoginPage";
import SignUpPage from "./pages/Auth/SignUpPage";

// for components
import Navbar from "./components/layout/Navbar";
import CartSidebar from "./components/layout/CartSidebar";
import Toast from "./components/UI/Toast";
import OrderHistory from "./pages/orders/OrderHistory";
import ProtectedRoute from "./components/UI/ProtectedRoute";
import AdminLogin from "./Admin/AdminLogin";

// General styles and config
import { API_BASE_URL } from "./config";
import "./App.css";

function App() {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('adminToken') === 'true');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("shop") //shop, success, checkout
  const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem('ecommerceUser');
  return savedUser ? JSON.parse(savedUser) : null;
});

  const navigate = useNavigate();

  const adminConfig = {
  headers: {
    'X-API-KEY': import.meta.env.VITE_ADMIN_API_KEY 
  }
};

const handleLoginSuccess = (userData) => {
  setUser(userData);
  localStorage.setItem('ecommerceUser', JSON.stringify(userData));
  showToast(`Welcome back, ${userData.full_name}!`);
};

const handleUserLogout = () => {
  setUser(null);
  localStorage.removeItem('ecommerceUser');
  navigate("/");
  showToast("Logged out successfully");
};

  const login = () => {
    setIsAdmin(true);
    localStorage.setItem('adminToken', 'true');
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('adminToken');
};

  const loadCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/get_cart.php?user_id=${user.id}`);

      if (res.data.success && Array.isArray(res.data.data)) {
        setCart(res.data.data);
      } else {
        setCart([]); // Fallback 
        console.error("Server Error:", res.data.error);
      }   
     } catch (err) {
      setCart([]); // Network failure fallback
      console.error("Connection Error:", err);
    }

  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    const timer = new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const [res] = await Promise.all([
        axios.get(`${API_BASE_URL}/get_products.php`),
        timer    
      ]);
      // ADD THIS TEMPORARY LOG:
        // console.log("SERVER DATA:", res.data);
        if (res.data && res.data.success) {
          setProducts(res.data.products); 
          console.log("fetched products successfully");
        } else {
          throw new Error(res.data.error || "Malformed data");
        }   
        setLoading(false);
      } catch (err) {
        console.log("Error fetching products", err);
        await timer;
        setProducts([]);
        setError("Server is currently unreachable. Please try again later.");  
      } finally {
        setLoading(false);
      }
    };

  const fetchOrders = async () => {
   try {
    // Note: pointing to get_admin_orders.php now
    const res = await axios.get(`${API_BASE_URL}/get_admin_orders.php`, adminConfig);
    if (res.data.success) {
      setOrders(res.data.orders);
    }
  } catch (err) {
    console.error("Admin Access Denied:", err.response?.data?.error || err.message);
  }
  };

  const addToCart = async (productId) => {
    if (!user) return showToast("Please login to add items");
    try {
      const response = await axios.post(`${API_BASE_URL}/add_to_cart.php`, {
        product_id: productId,
        user_id: user.id
      });

      if (response.data.success) {
        console.log("product added!");
        showToast(response.data.message);
        await loadCart();
        // setCartOpen(true);
      }
    } catch (error) {
      showToast("Error adding item to cart.", error);
      console.log('Failed adding product');     
    }
  };

  const updateQuantity = async (productId, change) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/update_cart_quantity.php`, {
        product_id: productId,
        change: change,
      });
      console.log("Full Axios Response:", res);
      if (res.data.success) {
        await loadCart();
      } else {
        console.error(
          "Logic Error:",
          res.data ? res.data.message : "No data received from server",
        );
      }
    } catch (err) {
      showToast("Could not update quantity");
      console.error("Network Error:", err);
      console.error(
        "System Error:",
        err.response ? err.response.data : err.message,
      );
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/remove_from_cart.php`,
        {
          cart_id: cartId,
        },
      );

      if (response.data.success) {
        showToast("Item removed from cart");
        loadCart();
      }
    } catch (error) {
      showToast("Failed to remove item");
      console.error("Error removing item:", error);
    }
  };

  const clearCart = () => {
  setCart([]); // This empties the array instantly
  localStorage.removeItem('cart'); // If you are saving the cart to local storage, clear that too!
};

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return showToast("Cart is empty");
    setCartOpen(false);
    navigate("/checkout");
  }

  const completePurchase = async () => {
    try {
      // Clear the cart in the DB (we reuse your clear_cart logic)
      await axios.post(`${API_BASE_URL}/clear_cart.php`);
      setCart([]);
      setView("success");
    } catch(err) {
      setToast("Transaction failed");
    }
  };

  useEffect(() => {
  fetchProducts();
}, []);

  useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(cart));
}, [cart]);

  useEffect(() => {
    const offLoad = () => {
      loadCart();
    };
    offLoad();
  }, []);

  return (
    <>
      {toast.show && (
        <Toast
          message={toast.message}
          onClose={() => setToast({ show: false, message: "" })}
        />
      )}

      {!user ? (
        <Routes>
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/signup" element={<SignUpPage />} />
        {/* Redirect any other path to login if not logged in */}
        <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ): (
      <div className="app-wrapper">
        <Navbar 
         onCartClick={() => setCartOpen(true)} 
         cart={cart || []}
         user={user}
         handleUserLogout={handleUserLogout} 
         isAdmin={isAdmin}
        />

        {cartOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setCartOpen(false)}
          ></div>
        )}

        <CartSidebar
          cartOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          cart={cart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          handleProceedToCheckout={handleProceedToCheckout}
        />

        <div className="product-container">
          <Routes>
            <Route
              index
              element={
                <HomePage
                  products={products}
                  loading={loading}
                  error={error}
                  fetchProducts={fetchProducts}
                  addToCart={addToCart}

                />
              }
            />

            <Route 
              path="/admin-login" 
              element={<AdminLogin onLogin={login} />} 
            />

            <Route 
              path="/admin" 
              element={
                <ProtectedRoute isAdmin={isAdmin}>
                  <AdminDashboard logout={logout} orders={orders} fetchOrders={fetchOrders} />
                </ProtectedRoute>
              } 
            />

            <Route
              path="/product/:id"
              element={
                <ProductDetails 
                  addToCart={addToCart} />
              }
            />

            <Route 
              path="checkout" 
              element={
                <CheckOutPage 
                  cart={cart}
                  // completePurchase={completePurchase} 
                  clearCart={clearCart}
                  user={user}
                  />
              } 
            />
            {/* <Route path="orders" element={ <OrdersPage cart={cart} />} />  */}

            <Route path="/history" element={<OrderHistory user={user} />} />
            <Route path="/track/:id" element={<OrderTracking />} />
            <Route path="/add-products" element={<AddProduct />} />
            
          </Routes>
        </div>
      </div>
      )}
    </>
  );
}

export default App;
