
export const ProductImage = (imgUrl, title) => {
  
  if (imgUrl && imgUrl.trim() !== "") {
    return <img src={imgUrl} alt={title} className="product-img" />;
  }

  return (
    <div className="image-fallback">
      <span>Preview Unavailable</span>
    </div>
  );
};

