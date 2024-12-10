import React from 'react';
import { Outlet } from 'react-router-dom';

const GameArea = () => {
  return (
    <div className="flex-1 rounded-l-2xl overflow-hidden">
      <Outlet />
    </div>
  );
};

export default GameArea; 