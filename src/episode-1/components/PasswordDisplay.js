import React from 'react';

const PasswordDisplay = ({ password }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm z-[100]">
      <div className="text-center font-cairo">
        <h2 className="text-3xl font-bold text-white mb-4">
          Success!
        </h2>
        <p className="text-xl text-gray-200">
          The Password is <span className="text-indigo-400 font-semibold">"{password}"</span>
        </p>
      </div>
    </div>
  );
};

export default PasswordDisplay;