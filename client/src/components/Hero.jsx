import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>The World's Best <span>Digital Assets</span> in One Place</h1>
        <p>
          High-quality templates, scripts, and graphics created by top-tier vendors. 
          Build your next big project faster.
        </p>
        <div className="hero-btns">
          <button className="btn-primary">Browse Assets</button>
          <button className="btn-secondary">Become a Vendor</button>
        </div>
      </div>
      <div className="hero-visual">
        {/* We can add an abstract 3D image or glassmorphism shapes here later */}
        <div className="abstract-shape"></div>
      </div>
    </section>
  );
};

export default Hero;