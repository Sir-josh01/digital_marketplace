import React, { useState } from 'react';

const SafeImage = ({ src, alt, className }) => {
  const [isBroken, setIsBroken] = useState(false);

  // If the string is totally empty or null, don't even try to load it
  const isEmpty = !src || src.trim() === "";

  // If it's empty OR the network request failed (isBroken), show the placeholder
  if (isEmpty || isBroken) {
    return (
      <div className={`image-placeholder ${className}`}>
        <span>No Preview</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setIsBroken(true)} // This triggers if the net link is dead
    />
  );
};

export default SafeImage;