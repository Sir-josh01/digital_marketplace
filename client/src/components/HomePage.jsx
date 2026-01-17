import React from "react";
import Hero from "./Hero";
import CategoryFilter from "./CategoryFilter";
import ProductCard from "./ProductCard";

import './HomePage.css';

const HomePage = ({ products }) => {
  return (
    <>
      <main>
        <Hero />
        <CategoryFilter />
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </>
  );
};

export default HomePage