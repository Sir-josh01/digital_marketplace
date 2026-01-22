import React, { useState, useEffect } from "react";
import axios from "axios";
import Hero from "./Hero";
import CategoryFilter from "./CategoryFilter";
import ProductCard from "./ProductCard";
// import { ProductImage } from "./ProductImage";
import { API_BASE_URL } from "../config";

import "./HomePage.css";

const HomePage = ({
  addToCart,
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  handleClearFilters,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isFiltered = searchTerm !== "" || activeCategory !== "All";

  // COMBINED FILTER LOGIC :FOR SEARCH AND MATCHED PRODUCTS
  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, products]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/get_products.php`);
        setProducts(res.data);
        console.log("fetched products successfully");
        setLoading(false);
      } catch (err) {
        console.log("Error fetching products", err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="loader">Loading Marketplace...</div>;

  return (
    <>
      <main>
        <Hero />

        <div className="search-section">
          {/* <div className="search-input-wrapper"> */}
          {/* <span className="search-icon">🔍</span> */}
          <input
            type="text"
            placeholder="Search for templates, graphics..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="main-search-bar"
          />
          {/* </div> */}
        </div>

        <CategoryFilter
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {isFiltered && (
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            Reset Filters ✕
          </button>
        )}

        {products.length === 0 ? (
          <div className="loader-container">
            <p>Loading premium assets ...</p>
            <div className="loader"></div>
          </div>
        ) : (
           <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddtoCart={() => addToCart(product.id)}
              />
            ))
          ) : (
            <div className="empty-state">
              <h3>No digital assets available yet for "{searchTerm}".</h3>
              <p>Check back soon or start selling your own!</p>
              <button
                className="clear-filters-btn secondary"
                onClick={handleClearFilters}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
        )}
       
      </main>
    </>
  );
};

export default HomePage;
