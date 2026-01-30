import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { API_BASE_URL } from "../../config";
import axios from "axios";
import SafeImage from "../../components/UI/SafeImage";
import "./ProductDetails.css";

const ProductDetails = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      // console.log("1.Trying to get product-details");
      try {
        const res = await axios.get(
          `${API_BASE_URL}/get_single_product.php?id=${id}`,
        );
        // IMPORTANT: If PHP returns an array, take the first item
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setProduct(data);
        // console.log("Product details acquired:", data);
      } catch (err) {
        console.log("Failed to fetch products at productDetails: ", err);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  if (loading) return <div className="loader">LOADING PRODUCTS...</div>;

  if (!product)
    return (
      <div className="error">
        <h2>Oops! Asset Not Found</h2>
        <p>This item might have been removed from the marketplace.</p>
        <button
          className="back-link"
          onClick={() => navigate("/")}
          style={{ margin: "20px auto" }}
        >
          Return to Home
        </button>
      </div>
    );

  return (
    <>
      <div className="details-container">
        <div className="details-left">
          <button className="back-link" onClick={() => navigate(-1)}>
            ← Back to Marketplace
          </button>

          <div className="main-preview">
            <SafeImage
              src={product.image}
              alt={product.title}
              className="details-img"
            />
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
              className={`add-to-cart-btn ${isAdding ? "loading" : ""}`}
              disabled={isAdding}
              onClick={ async () => {
                setIsAdding(true);
                await addToCart(product.id);
                setIsAdding(false);
              }}
            >
              {isAdding ? "Adding..." : "Add to Cart"}
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
