import React from 'react';
import GameArea from './GameArea';
import NavBar from './NavBar';
import { SectionProvider } from '../episode-1/context/SectionContext';

const GameView = () => {
  return (
    <SectionProvider>
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="w-[900px] h-[500px] flex overflow-hidden rounded-2xl border border-gray-700/50 shadow-2xl">
          <GameArea />
          <NavBar />
        </div>
      </div>
    </SectionProvider>
  );
};

export default GameView; 