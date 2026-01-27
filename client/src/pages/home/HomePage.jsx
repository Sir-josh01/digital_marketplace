import React, { useState } from "react";
// import axios from "axios";
// for pages
import CategoryFilter from "./CategoryFilter";

// for components
import Hero from "../../components/layout/Hero";
import ProductCard from "./ProductCard";
import ProductSkeleton from "../../components/UI/ProductSkeleton";

// import { API_BASE_URL } from "../../config";
import "./HomePage.css";

const HomePage = ({ products, loading, error, fetchProducts,addToCart }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

    const handleClearFilters = () => {
      setSearchTerm("");
      setActiveCategory("All");
      const searchInput = document.querySelector(".main-search-bar");
      if (searchInput) searchInput.value = "";
  };

  // useEffect(() => {
  //   // setTimeout(() => {
  //   //   fetchProducts();
  //   // }, 3000);
  //   fetchProducts();
  // }, []);

    const filteredProducts = React.useMemo(() => {
      if (!Array.isArray(products)) return [];
      // DEBUG LOG
      // console.log("Filtering products:", products);

      return products.filter((product) => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === "All" || product.category === activeCategory;
        return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, products]);

  if (loading) return <div className="loader">Loading assets...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <>
      <main>
        <Hero />

        <div className="search-section">

          <input
            type="text"
            placeholder="Search for templates, graphics..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="main-search-bar"
          />
        </div>

        <CategoryFilter
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {loading && (
          <div className="loader-container">
            <p>Loading premium assets ...</p>
            <div className="loader"></div>
          </div>
        )}

          <div className="product-grid">
            {loading ? (
              Array(8)
                .fill(0)
                .map((_, i) => <ProductSkeleton key={i} />)
            ) : error ? (
            <div className="error-state">
              <div className="error-icon">📡❌</div>
              <h3>Connection Issue</h3>
              <p>{error}</p>
              <button className="retry-btn" onClick={fetchProducts}>
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length > 0 ? (
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
      </main>
    </>
  );
};

export default HomePage;
