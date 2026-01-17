import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { title, price, vendor, category, image } = product;

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={title} />
        <span className="category-tag">{category}</span>
      </div>
      
      <div className="product-info">
        <h3>{title}</h3>
        <p className="vendor-name">by {vendor}</p>
        
        <div className="product-footer">
          <span className="price">${price}</span>
          <button className="buy-btn">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;