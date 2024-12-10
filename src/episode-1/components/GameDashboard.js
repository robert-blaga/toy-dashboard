import React from 'react';

const GameDashboard = ({ locationsCompleted, availableCards }) => {
  return (
    <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-gray-800/70 backdrop-blur-sm text-white px-5 py-2.5 rounded-lg flex gap-5 z-10 font-cairo border border-gray-700/50">
      <div className="text-sm">
        <span className="font-semibold">Locations:</span> {locationsCompleted}/5
      </div>
      <div className="text-sm">
        <span className="font-semibold">Available Cards:</span> {availableCards}
      </div>
    </div>
  );
};

export default GameDashboard;
