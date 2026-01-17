import React from 'react';
import './CategoryFilter.css';

const CategoryFilter = () => {
  const categories = ["All", "Templates", "Graphics", "Scripts", "E-books", "Audio"];

  return (
    <div className="filter-container">
      <div className="filter-scroll">
        {categories.map((cat, index) => (
          <button 
            key={index} 
            className={`filter-chip ${index === 0 ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;