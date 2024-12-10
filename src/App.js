import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Episode1 from './episode-1/components/Episode1';
import GameView from './common/GameView';

function MainApp() {
  return (
    <Router>
      <Routes>
        <Route path="/game/*" element={<GameView />}>
          <Route path="episode-1" element={<Episode1 />} />
        </Route>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default MainApp;
