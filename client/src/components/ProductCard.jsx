import React from "react";
import {Link} from "react-router";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { title, price, vendor, category, image } = product;

  return (
    <Link
      to={`/product/${product.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
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
    </Link>
  );
};

export default ProductCard;
