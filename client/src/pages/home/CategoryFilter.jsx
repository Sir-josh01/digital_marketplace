import React from 'react';
import './CategoryFilter.css';

const CategoryFilter = ({activeCategory, setActiveCategory}) => {
  
  const categories = ["All", "Templates", "Graphics", "Scripts", "E-books", "Audio"];
 
  return (
    <div className="filter-container">
      <div className="filter-scroll">
        {categories.map((cat) => (
          <button 
            key={cat} 
            className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;