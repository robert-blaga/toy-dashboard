import React, { useEffect, useRef, useState, useCallback } from 'react';

const DRONE_SIZE = 38;
const MOVE_SPEED = 500;
const ACCELERATION = 300;
const DECELERATION = 200;
const DROP_SPEED = 10;
const GRAVITY = 1;

const Drone = ({ onLocationUpdate, onCardDrop }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const dronePositionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const movementRef = useRef({ w: false, a: false, s: false, d: false });
  const lastUpdateTimeRef = useRef(0);
  const [activeCards, setActiveCards] = useState([]);
  const [droppedCards, setDroppedCards] = useState([]);
  const audioRef = useRef(null);
  const droneImageRef = useRef(null);
  const cardImageRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    containerRef.current = container;

    // Set initial drone position to bottom center of the game area
    dronePositionRef.current = {
      x: container.offsetWidth / 2 - DRONE_SIZE / 2,
      y: container.offsetHeight - DRONE_SIZE - 20
    };

    // Set canvas size to match container
    const updateCanvasSize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    updateCanvasSize();

    // Load assets
    audioRef.current = new Audio('/assets/drone.mp3');
    audioRef.current.loop = true;

    droneImageRef.current = new Image();
    droneImageRef.current.src = '/assets/drone.png';

    cardImageRef.current = new Image();
    cardImageRef.current.src = '/assets/creditCard.png';

    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Reset all cards
    setActiveCards([]);
    setDroppedCards([]);
    
    // Reset velocity
    velocityRef.current = { x: 0, y: 0 };
    
    // Reset movement
    movementRef.current = { w: false, a: false, s: false, d: false };
    
    // Reset drone position to initial position
    if (containerRef.current) {
      dronePositionRef.current = {
        x: containerRef.current.offsetWidth / 2 - DRONE_SIZE / 2,
        y: containerRef.current.offsetHeight - DRONE_SIZE - 20
      };
    }
  }, []);

  const checkCollision = useCallback((cardPosition) => {
    if (!cardPosition || !containerRef.current) return false;
    
    const locationTypes = ['city', 'smallBusiness', 'largeOffice', 'village', 'oilRig'];
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    for (const locationType of locationTypes) {
      const locationElement = document.querySelector(`.location.${locationType}`);
      if (locationElement) {
        const rect = locationElement.getBoundingClientRect();
        
        // Convert coordinates to be relative to the game area
        const locationX = rect.left - containerRect.left + rect.width / 2;
        const locationY = rect.top - containerRect.top + rect.height / 2;
        const cardX = cardPosition.x + 20; // half of card width
        const cardY = cardPosition.y + 12.5; // half of card height
        
        const dx = cardX - locationX;
        const dy = cardY - locationY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= rect.width / 2) {
          // Only log on actual collision
          console.log(`Collision detected with ${locationType}!`, {
            cardPosition: { x: cardX, y: cardY },
            locationPosition: { x: locationX, y: locationY },
            distance,
            threshold: rect.width / 2
          });
          onLocationUpdate(locationType, true);
          return true;
        }
      }
    }
    return false;
  }, [onLocationUpdate]);

  const startAudio = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(error => console.error("Audio play failed:", error));
    }
  }, []);

  const handleDrop = useCallback(() => {
    if (onCardDrop()) {
      const newCard = {
        x: dronePositionRef.current.x + (DRONE_SIZE - 40) / 2,
        y: dronePositionRef.current.y + DRONE_SIZE,
        id: Date.now(),
        velocity: DROP_SPEED
      };
      setActiveCards(prev => [...prev, newCard]);
    }
  }, [onCardDrop]);

  const updateVelocity = (axis, positive, negative, deltaTime) => {
    const direction = positive ? 1 : negative ? -1 : 0;
    if (direction !== 0) {
      velocityRef.current[axis] += direction * ACCELERATION * deltaTime;
      velocityRef.current[axis] = Math.min(Math.max(velocityRef.current[axis], -MOVE_SPEED), MOVE_SPEED);
    } else {
      const deceleration = DECELERATION * deltaTime;
      if (Math.abs(velocityRef.current[axis]) <= deceleration) {
        velocityRef.current[axis] = 0;
      } else {
        velocityRef.current[axis] -= Math.sign(velocityRef.current[axis]) * deceleration;
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const gameLoop = (currentTime) => {
      if (!lastUpdateTimeRef.current) {
        lastUpdateTimeRef.current = currentTime;
      }

      const deltaTime = (currentTime - lastUpdateTimeRef.current) / 1000;
      lastUpdateTimeRef.current = currentTime;

      updateVelocity('x', movementRef.current.d, movementRef.current.a, deltaTime);
      updateVelocity('y', movementRef.current.s, movementRef.current.w, deltaTime);

      dronePositionRef.current.x += velocityRef.current.x * deltaTime;
      dronePositionRef.current.y += velocityRef.current.y * deltaTime;

      dronePositionRef.current.x = Math.max(0, Math.min(canvas.width - DRONE_SIZE, dronePositionRef.current.x));
      dronePositionRef.current.y = Math.max(0, Math.min(canvas.height - DRONE_SIZE, dronePositionRef.current.y));

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw drone
      if (droneImageRef.current) {
        ctx.drawImage(droneImageRef.current, dronePositionRef.current.x, dronePositionRef.current.y, DRONE_SIZE, DRONE_SIZE);
      }

      // Update and draw cards
      const updatedCards = activeCards.map(card => {
        const newY = card.y + card.velocity;
        const hasCollided = checkCollision({ ...card, y: newY });
        
        if (hasCollided) {
          setDroppedCards(prev => [...prev, { ...card, y: newY }]);
          return null;
        } else if (newY < canvas.height - 40) {
          const updatedCard = { 
            ...card, 
            y: newY, 
            velocity: card.velocity + GRAVITY
          };
          if (cardImageRef.current) {
            ctx.drawImage(cardImageRef.current, updatedCard.x, updatedCard.y, 40, 40);
          }
          return updatedCard;
        } else {
          setDroppedCards(prev => [...prev, { ...card, y: canvas.height - 40 }]);
          return null;
        }
      }).filter(Boolean);

      setActiveCards(updatedCards);

      // Draw dropped cards
      droppedCards.forEach(card => {
        if (cardImageRef.current) {
          ctx.drawImage(cardImageRef.current, card.x, card.y, 40, 40);
        }
      });

      requestAnimationFrame(gameLoop);
    };

    const handleKeyDown = (e) => {
      startAudio();
      movementRef.current[e.key.toLowerCase()] = true;
      if (e.key === ' ') {
        handleDrop();
      }
      if (audioRef.current) {
        audioRef.current.volume = 1;
      }
    };

    const handleKeyUp = (e) => {
      movementRef.current[e.key.toLowerCase()] = false;
      if (audioRef.current) {
        audioRef.current.volume = 0.5;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [startAudio, handleDrop, checkCollision, activeCards, droppedCards]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-10"
      style={{
        touchAction: 'none',
        willChange: 'transform'
      }}
    />
  );
};

export default Drone;