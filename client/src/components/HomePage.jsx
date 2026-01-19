import React from "react";
import Hero from "./Hero";
import CategoryFilter from "./CategoryFilter";
import ProductCard from "./ProductCard";

import "./HomePage.css";

const HomePage = ({ products }) => {
  return (
    <>
      <main>
        <Hero />
        <CategoryFilter />
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <div className="empty-state">
              <h3>No digital assets available yet.</h3>
              <p>Check back soon or start selling your own!</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default HomePage;
