import React from 'react';

const GameOverScreen = ({ onRetry }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm z-[100]">
      <div className="text-center font-cairo max-w-lg p-6 bg-gray-800/80 rounded-xl border border-gray-700/50">
        <h2 className="text-3xl font-bold text-red-500 mb-4">
          Mission Failed
        </h2>
        <p className="text-gray-200 mb-6">
          You've run out of cards before completing all locations.
        </p>
        <button 
          onClick={onRetry}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen; 