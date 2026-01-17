import React from "react";
import CategoryFilter from "./CategoryFilter";
import ProductCard from "./ProductCard";

const HomePage = ({ products }) => {
  return (
    <>
      <main>
        {/* <Hero /> */}
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