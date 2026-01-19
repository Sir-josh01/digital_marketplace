import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { API_BASE_URL } from "../config";
import axios from "axios";
import "./ProductDetails.css";

const ProductDetails = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProduct = async () => {
      console.log("1.Trying to get product-details");

      try {
        const res = await axios.get(
          `${API_BASE_URL}/get_single_product.php?id=${id}`,
        );
        // setProduct(res.data);
        // console.log("Product details acquired")

        // IMPORTANT: If PHP returns an array, take the first item
        const data = Array.isArray(res.data) ? res.data[0] : res.data;

        setProduct(data);
        console.log("Product details acquired:", data);
      } catch (err) {
        console.log("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  if (loading) return <div className="loader">LOADING PRODUCTS...</div>;
  if (!product) return <div className="error">PRODUCT NOT FOUND.</div>;
  // Find the specific product from the array passed from App.jsx
  // const foundProduct = products.find((p) => p.id === parseInt(id));

  // Mock data for a single product
  // const data = foundProduct || {
  //   title: "Premium SaaS Dashboard Template",
  //   price: 49.0,
  //   vendor: "CodeWizard",
  //   description:
  //     "Build your next application with this high-quality React dashboard. Includes 50+ components, dark mode support, and fully responsive layouts.",
  //   format: "React/Next.js",
  //   size: "12.4 MB",
  //   lastUpdate: "Oct 2025",
  // };

  return (
    <>
      <div className="details-container">
        <div className="details-left">
          <button className="back-link" onClick={() => navigate(-1)}>
            ← Back to Marketplace
          </button>

          <div className="main-preview">
            {/* <img src={product.image || "https://via.placeholder.com/800x450"} alt={product.title} /> */}
            {product.image ? (
              <img src={product.image} alt={product.title} />
            ) : (
              <div className="image-placeholder">No Image Available</div>
            )}
          </div>

          <div className="details-text">
            <h1>{product.title}</h1>
            <p className="vendor-link">
              By <span>{product.vendor}</span>
            </p>
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
        </div>

        <div className="details-right">
          <div className="buy-box">
            <div className="price-tag">${product.price}</div>
            <button
              className="add-to-cart-btn"
              onClick={() => {
                console.log("Button clicked. Current product state:", product);
                addToCart(product?.id || product?.product_id);
                // addToCart(product.id);
              }}
            >
              Add to Cart
            </button>
            <button className="buy-now-btn">Buy it Now</button>

            <ul className="spec-list">
              <li>
                <strong>Format:</strong> {product.format}
              </li>
              <li>
                <strong>Size:</strong> {product.size}
              </li>
              <li>
                <strong>Updated:</strong> {product.lastUpdate}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
