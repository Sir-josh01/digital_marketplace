import React from 'react'

const SuccessView = ({returnBack}) => {

  return (
    <div className='success-overlay'>
      <div className='success-card'>
        <div className='confetti-icon'>🎉</div>
        <h2>Order Successful</h2>
        <p>Your digital assets are being prepared for download</p>
        <button className='return-btn' onClick={returnBack}>Back to Store</button>
      </div>
    </div>
  );
}

export default SuccessView