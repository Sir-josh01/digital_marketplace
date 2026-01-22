import { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import ProductDetails from "./pages/ProductDetails";
import CartSidebar from "./components/CartSidebar";
import "./App.css";
import { CheckOutPage } from "./pages/CheckoutPage";
import { OrdersPage } from "./pages/orders/OrdersPage";
import { API_BASE_URL } from "./config";
import AddProduct from "./pages/AddProduct";
import Toast from "./components/Toast";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [view, setView] = useState("shop") //shop, success, checkout


  const loadCart = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/get_cart.php`);

      setCart(res.data);
      console.log("cart is loading...");
    } catch (err) {
      console.log("Cart fetch failed at the loadCart", err);
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

  const handleClearFilters = () => {
    setSearchTerm("");
    setActiveCategory("All");
    // This clears the physical text in the input box
    const searchInput = document.querySelector(".main-search-bar");
    if (searchInput) searchInput.value = "";
  };

  // The showToast function
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
    setView("checkout");
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
        />

        <div className="product-container">
          <Routes>
            <Route
              index
              element={
                <HomePage
                  products={products}
                  addToCart={addToCart}
                  handleClearFilters={handleClearFilters}
                  searchTerm={searchTerm}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProductDetails products={products} addToCart={addToCart} />
              }
            />
            {/* <Route path="checkout" element={ <CheckOutPage cart={cart} />} /> */}
            {/* <Route path="orders" element={ <OrdersPage cart={cart} />} /> */}
            <Route path="/admin" element={<AddProduct />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
