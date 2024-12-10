import React from 'react';

const CreditCard = ({ position }) => {
  if (!position) {
    return null;
  }

  return (
    <div 
      className="absolute w-10 h-6 transform will-change-transform"
      style={{ left: position.x, top: position.y }}
    >
      <img 
        src={`${process.env.PUBLIC_URL}/assets/creditCard.png`} 
        alt="Credit Card"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default CreditCard;