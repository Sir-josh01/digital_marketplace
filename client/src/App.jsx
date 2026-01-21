import { useState, useEffect } from "react";
import axios from 'axios';
import {Routes, Route} from 'react-router';
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import ProductDetails from './pages/ProductDetails'
import CartSidebar from "./components/CartSidebar";
import "./App.css";
import { CheckOutPage } from "./pages/CheckoutPage";
import { OrdersPage } from "./pages/orders/OrdersPage";
import { API_BASE_URL } from "./config";
import AddProduct from "./pages/AddProduct";

function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [products] = useState([
    {
      id: 1,
      title: "Premium SaaS Dashboard",
      price: 49,
      vendor: "CodeWizard",
      category: "Templates",
      image: "https://via.placeholder.com/300x180",
    },
    {
      id: 2,
      title: "Abstract 3D Icon Set",
      price: 15,
      vendor: "PixelPerfect",
      category: "Graphics",
      image: "https://via.placeholder.com/300x180",
    },
    {
      id: 3,
      title: "React E-commerce Starter",
      price: 89,
      vendor: "FullStackPro",
      category: "Scripts",
      image: "https://via.placeholder.com/300x180",
    },
  ]);

  const loadCart = async () => {
    try {
    const res = await axios.get(`${API_BASE_URL}/get_cart.php`);
    setCart(res.data);
    console.log("cart is loading...");
    } catch(err) {
      console.log("Cart fetch failed at the loadCart", err);
    }
  };

  const addToCart = async (productId) => {
    // console.log("1. Add to cart triggered for ID:", productId);
    try {
      const response = await axios.post(`${API_BASE_URL}/add_to_cart.php`, {
        product_id: productId
      });

      // console.log("2. Server Response:", response.data);

      if (response.data.message) {
        // console.log("3. Success! Reloading cart...");
        alert("Success: " + response.data.message); // Temporary feedback
        loadCart();
        setCartOpen(true);
      }
    } catch(error) {
      console.error("Error adding to cart:", error);
      alert("Could not add item to cart.");
    }
  }

  const removeFromCart = async (cartId) => {
    try {
      // We send the cart_id (the unique ID of the row in the cart table)
      const response = await axios.post(`${API_BASE_URL}/remove_from_cart.php`, {
        cart_id: cartId
      });

      if (response.data.success) {
        // Refresh the cart list to show it's gone
        loadCart(); 
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  useEffect(() => {
    const offLoad = () => {
        loadCart();
      }
    offLoad();
  }, []);

  return (
    <>
      <div className="app-wrapper">

        <Navbar 
          onCartClick={() => setCartOpen(true)} 
          cart={cart}  />

        {cartOpen && <div className="sidebar-overlay" onClick={() => setCartOpen(false)}></div>}

        <CartSidebar 
          cartOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          cart={cart}
          removeFromCart={removeFromCart}
        /> 

        <div className="product-container">
          <Routes>
            <Route index element={ <HomePage products={products} addToCart={addToCart} />} />
            <Route path="/product/:id" element={ <ProductDetails products={products} addToCart={addToCart} />} />
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
