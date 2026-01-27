import { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, useNavigate } from "react-router";

// For pages
import HomePage from "./pages/home/HomePage";
import CheckOutPage from "./pages/checkout/CheckOutPage";
import ProductDetails from "./pages/home/ProductDetails";
import AddProduct from "./pages/admin/AddProduct";
import OrderTracking from "./pages/orders/OrderTracking";
import AdminDashboard from "./Admin/AdminDashboard";

// for components
import Navbar from "./components/layout/Navbar";
import CartSidebar from "./components/layout/CartSidebar";
import Toast from "./components/UI/Toast";
import OrderHistory from "./pages/orders/OrderHistory";

// General styles and config
import { API_BASE_URL } from "./config";
import "./App.css";


function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  const [view, setView] = useState("shop") //shop, success, checkout
  const navigate = useNavigate();


  const loadCart = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/get_cart.php`);

      if (res.data && res.data.success) {
      setProducts(res.data.products);
    } else {
      console.warn("API returned success:false or malformed data");
      setProducts([]); // Fallback to empty array if success is false
    }
     
   } catch (err) {
    console.error("Product fetch failed", err);
    setProducts([]); // Fallback to empty array on network error
  }

  };

  const addToCart = async (productId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/add_to_cart.php`, {
        product_id: productId,
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

      <div className="app-wrapper">
        <Navbar onCartClick={() => setCartOpen(true)} cart={cart} />

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
                  addToCart={addToCart}
                />
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
                  />
              } 
            />
            {/* <Route path="orders" element={ <OrdersPage cart={cart} />} />  */}

            <Route path="/history" element={<OrderHistory />} />
            <Route path="/track/:id" element={<OrderTracking />} />
            <Route path="/add-products" element={<AddProduct />} />
            <Route path="/admin" element={<AdminDashboard />} />
            
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
