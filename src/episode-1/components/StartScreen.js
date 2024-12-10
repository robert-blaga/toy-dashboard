import React from 'react';
import { useSection } from '../context/SectionContext';

const StartScreen = ({ onStart }) => {
  const { startTimer } = useSection();

  const handleStart = () => {
    startTimer(); // Start the timer when mission starts
    onStart();
  };

  return (
    <div className="absolute inset-0 bg-black/90 text-white flex items-center justify-center z-50">
      <div className="max-w-lg text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold text-indigo-400">
          Welcome to Episode 1
        </h1>
        <p className="text-lg text-gray-300">
          Your mission is to deliver credit cards to all locations on the map.
          Use arrow keys to control the drone.
        </p>
        <button
          onClick={handleStart}
          className="px-8 py-4 bg-indigo-600 rounded-lg text-xl font-bold hover:bg-indigo-500 transition-colors"
        >
          Start Mission
        </button>
      </div>
    </div>
  );
};

export default StartScreen; 