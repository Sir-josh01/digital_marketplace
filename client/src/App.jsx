import { useState, useEffect, useCallback } from "react";
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
import OrderHistory from "./pages/orders/OrderHistory";

// for components
import Navbar from "./components/layout/Navbar";
import CartSidebar from "./components/layout/CartSidebar";
import Toast from "./components/UI/Toast";
import ProtectedRoute from "./components/UI/ProtectedRoute";
import AdminLogin from "./Admin/AdminLogin";

// General styles and config
import { API_BASE_URL } from "./config";
import "./App.css";

function App() {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('adminToken') === 'true');
  const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem('ecommerceUser');
  return savedUser ? JSON.parse(savedUser) : null;
});

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  const navigate = useNavigate();

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

  const loginAdmin = () => {
    setIsAdmin(true);
    localStorage.setItem('adminToken', 'true');
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('adminToken');
};


  // API ACTIONS
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

    const loadCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/get_cart.php?user_id=${user.id}?t=${Date.now()}`);

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

  }, [user]);

  const fetchOrders = async () => {
   try {
    // Note: pointing to get_admin_orders.php now
      const res = await axios.get(`${API_BASE_URL}/admin_get_orders.php`, {
      headers: {
        'X-API-KEY': import.meta.env.VITE_ADMIN_KEY // Must match your PHP define
      }});
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

  const updateQuantity = async (cartId, change) => {
   
    setCart(prevCart => 
    prevCart.map(item => {
      if (item.cart_id === cartId) {  
        return { ...item, quantity: Math.max(0, item.quantity + change) }; 
      }
      return item;
      }).filter(item => item.quantity > 0)
  );

    try {
      const res = await axios.post(`${API_BASE_URL}/update_cart_quantity.php`, {
        cart_id: cartId,
        change: change,
      });

      if (!res.data.success) {
        loadCart();
        console.error("Backend failed, reverting state");  
      } else {
        console.log("I send myself:");
      }
    } catch (err) {
      showToast("Could not update quantity");
      loadCart();
      console.error("Network Error:", err);
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

  const clearCart = async () => {
  try {
    const res = await axios.post(`${API_BASE_URL}/clear_cart.php`, { user_id: user.id });

    if (res.data.success) {
      setCart([]); 
      showToast("Cart cleared");
    }
  } catch (err) {
    showToast("Failed to clear cart", err);
    
  }
};

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  // const handleProceedToCheckout = () => {
  //   if (cart.length === 0) return showToast("Cart is empty");
  //   setCartOpen(false);
  //   navigate("/checkout");
  // }

  
  // EFFECTS
  useEffect(() => {fetchProducts();}, []);

  useEffect(() => { loadCart(); }, [loadCart]);

  return (
    <>
      {toast.show && (
        <Toast
          message={toast.message}
          onClose={() => setToast({ show: false, message: "" })}
        />
      )}
      
      <Routes>
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/admin-login" element={<AdminLogin onLogin={loginAdmin} />} />

        {/* PROTECTED STORE ROUTES (Requires User Login) */}
        <Route path="/*" element={
          !user ? <Navigate to="/login" /> : (
            <div className="app-wrapper">
              <Navbar 
                onCartClick={() => setCartOpen(true)} 
                cart={cart} 
                user={user} 
                handleUserLogout={handleUserLogout} 
                isAdmin={isAdmin} 
              />
              
              <CartSidebar 
                cartOpen={cartOpen} 
                onClose={() => setCartOpen(false)} 
                cart={cart} 
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}

                handleProceedToCheckout={() => {setCartOpen(false); navigate("/checkout");}}
              />

              <div className="product-container">
                <Routes>
                  <Route index element={<HomePage products={products} loading={loading} error={error} addToCart={addToCart} />} />

                  <Route path="product/:id" element={<ProductDetails addToCart={addToCart} openCart={() => setCartOpen(true)} />} />

                  <Route path="checkout" element={<CheckOutPage cart={cart} user={user} /*clearCart={() => setCart([])} */ clearCart={clearCart} />} />

                  <Route path="history" element={<OrderHistory user={user} clearCart={clearCart} />} />

                  <Route path="track/:id" element={<OrderTracking user={user} />} />
                  
                  {/* ADMIN ONLY ROUTES */}
                  <Route path="admin" element={
                    <ProtectedRoute isAdmin={isAdmin}>
                      <AdminDashboard logout={logoutAdmin} orders={orders} fetchOrders={fetchOrders} />
                    </ProtectedRoute>
                  } />
                  <Route path="add-products" element={
                    <ProtectedRoute isAdmin={isAdmin}>
                      <AddProduct />
                    </ProtectedRoute>
                  } />
                </Routes>
              </div>
            </div>
          )
        } />
      </Routes>    
    </>
  );
}

export default App;
