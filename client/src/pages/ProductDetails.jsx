import React from 'react';
import './ProductDetails.css';

const ProductDetails = ({ product }) => {
  // Mock data for a single product
  const data = product || {
    title: "Premium SaaS Dashboard Template",
    price: 49.00,
    vendor: "CodeWizard",
    description: "Build your next application with this high-quality React dashboard. Includes 50+ components, dark mode support, and fully responsive layouts.",
    format: "React/Next.js",
    size: "12.4 MB",
    lastUpdate: "Oct 2025"
  };

  return (
    <div className="details-container">
      <div className="details-left">
        <div className="main-preview">
           <img src="https://picsum.photos/800/450" alt="preview" />
        </div>
        
        <div className="details-text">
          <h1>{data.title}</h1>
          <p className="vendor-link">By <span>{data.vendor}</span></p>
          <h3>Description</h3>
          <p>{data.description}</p>
        </div>
      </div>

      <div className="details-right">
        <div className="buy-box">
          <div className="price-tag">${data.price}</div>
          <button className="add-to-cart-btn">Add to Cart</button>
          <button className="buy-now-btn">Buy it Now</button>
          
          <ul className="spec-list">
            <li><strong>Format:</strong> {data.format}</li>
            <li><strong>Size:</strong> {data.size}</li>
            <li><strong>Updated:</strong> {data.lastUpdate}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;