import React, { useState, useCallback, useEffect } from 'react';
import Map from './Map';
import Drone from './Drone';
import GameDashboard from './GameDashboard';
import PasswordDisplay from './PasswordDisplay';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';

const DroneGame = () => {
  // Load saved state from localStorage
  const [locations, setLocations] = useState(() => {
    const saved = localStorage.getItem('droneGameLocations');
    return saved ? JSON.parse(saved) : {
      city: false,
      smallBusiness: false,
      largeOffice: false,
      village: false,
      oilRig: false
    };
  });
  
  const [availableCards, setAvailableCards] = useState(() => {
    return parseInt(localStorage.getItem('droneGameCards')) || 5;
  });
  
  const [showPassword, setShowPassword] = useState(() => {
    return localStorage.getItem('droneGameShowPassword') === 'true';
  });
  
  const [gameStarted, setGameStarted] = useState(() => {
    return localStorage.getItem('droneGameStarted') === 'true';
  });
  
  const [gameOver, setGameOver] = useState(() => {
    return localStorage.getItem('droneGameOver') === 'true';
  });

  const [gameKey, setGameKey] = useState(0);

  // Save state changes to localStorage
  useEffect(() => {
    localStorage.setItem('droneGameLocations', JSON.stringify(locations));
    localStorage.setItem('droneGameCards', availableCards);
    localStorage.setItem('droneGameShowPassword', showPassword);
    localStorage.setItem('droneGameStarted', gameStarted);
    localStorage.setItem('droneGameOver', gameOver);
  }, [locations, availableCards, showPassword, gameStarted, gameOver]);

  const handleLocationUpdate = useCallback((locationType, success) => {
    if (success && !locations[locationType]) {
      setLocations(prev => ({
        ...prev,
        [locationType]: true
      }));
    }
  }, [locations]);

  const handleCardDrop = useCallback(() => {
    if (availableCards > 0) {
      const newCount = availableCards - 1;
      setAvailableCards(newCount);
      
      // Check if game is over (no more cards and not all locations completed)
      if (newCount === 0) {
        const completedLocations = Object.values(locations).filter(Boolean).length;
        if (completedLocations < 5) {
          setGameOver(true);
        }
      }
      return true;
    }
    return false;
  }, [availableCards, locations]);

  const resetGame = () => {
    // Clear localStorage for drone game
    localStorage.removeItem('droneGameLocations');
    localStorage.removeItem('droneGameCards');
    localStorage.removeItem('droneGameShowPassword');
    localStorage.removeItem('droneGameStarted');
    localStorage.removeItem('droneGameOver');
    
    setLocations({
      city: false,
      smallBusiness: false,
      largeOffice: false,
      village: false,
      oilRig: false
    });
    setAvailableCards(5);
    setShowPassword(false);
    setGameOver(false);
    setGameKey(prev => prev + 1);
  };

  // Check if all locations are completed
  const allLocationsCompleted = Object.values(locations).every(val => val);

  if (allLocationsCompleted && !showPassword) {
    setShowPassword(true);
  }

  return (
    <div className="relative w-full h-full">
      {!gameStarted && (
        <StartScreen onStart={() => setGameStarted(true)} />
      )}
      
      {gameStarted && (
        <>
          <GameDashboard 
            locationsCompleted={Object.values(locations).filter(Boolean).length} 
            availableCards={availableCards}
          />
          <Map locations={locations} key={gameKey}>
            <Drone 
              key={gameKey}
              onLocationUpdate={handleLocationUpdate}
              onCardDrop={handleCardDrop}
            />
          </Map>
          {showPassword && <PasswordDisplay password="RISE" />}
          {gameOver && !showPassword && (
            <GameOverScreen onRetry={resetGame} />
          )}
        </>
      )}
    </div>
  );
};

export default DroneGame; 