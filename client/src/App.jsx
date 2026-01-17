import { useState } from "react";
import {Routes, Route} from 'react-router';
import Navbar from "./components/Navbar";
import Hero from './components/Hero';
import HomePage from "./components/HomePage";
import "./App.css";

function App() {
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

  return (
    <>
      <div className="app-wrapper">
        <Navbar />
        <Hero />
        <div className="product-container">

          <Routes>
            <Route path="/" element={ <HomePage products={products} />} />
            <Route path="/" element={ <HomePage products={products} />} />
            {/* <Route path="/" element={ <HomePage products={products} />} /> */}
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
