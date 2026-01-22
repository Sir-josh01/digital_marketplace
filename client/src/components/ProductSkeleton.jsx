import React from 'react'

// const ProductSkeleton = () => {
//   return (
//     <div>ProductSkeleton</div>
//   )
// }

// export default ProductSkeleton

export const ProductSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton-image pulse"></div>
    <div className="skeleton-text pulse"></div>
    <div className="skeleton-price pulse"></div>
  </div>
);