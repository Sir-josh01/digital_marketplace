import { useState, useEffect } from "react";
import axios from 'axios';
import {Routes, Route} from 'react-router';
import Navbar from "./components/Navbar";
import Hero from './components/Hero';
import HomePage from "./components/HomePage";
import ProductDetails from './pages/ProductDetails'

import "./App.css";
import { CheckOutPage } from "./pages/CheckoutPage";

function App() {
  const [cart, setCart] = useState([]);
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
    const res = axios.get();
    setCart(res.data);
    console.log("cart is loading...");
    
  } ;

  useEffect(() => {
    const offLoad = () => {
    loadCart();
    }
    offLoad();
  }, []);

  return (
    <>
      <div className="app-wrapper">
        <Navbar />
        <div className="product-container">
          <Routes>
            <Route index element={ <HomePage products={products} />} />
            <Route path="/product/:id" element={ <ProductDetails products={products} />} />
            <Route path="checkout" element={ <CheckOutPage cart={cart} />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
