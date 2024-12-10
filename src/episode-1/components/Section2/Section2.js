import React, { useEffect, useRef, useState } from 'react';

const Section2 = () => {
  const viewerRef = useRef(null);
  const panoRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentScene, setCurrentScene] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  // Function to create hotspot element
  const createHotspotElement = (content) => {
    const hotspotContainer = document.createElement('div');
    hotspotContainer.className = 'hotspot-container';

    const hotspot = document.createElement('div');
    hotspot.className = 'relative group cursor-pointer';

    // Create main hotspot element
    const hotspotElement = document.createElement('div');
    hotspotElement.className = 'w-40 h-40 relative';

    // Pulsing background - changed to orange
    const pulsingBg = document.createElement('div');
    pulsingBg.className = 'absolute inset-0 bg-orange-500 rounded-full opacity-20 animate-ping';

    // Main circle - changed to orange
    const mainCircle = document.createElement('div');
    mainCircle.className = 'absolute inset-2 bg-orange-500 rounded-full flex items-center justify-center transform-gpu group-hover:scale-95 transition-transform duration-300';

    // Icon
    const icon = document.createElement('div');
    icon.className = 'text-white text-4xl font-bold';
    icon.innerHTML = '!';

    mainCircle.appendChild(icon);
    hotspotElement.appendChild(pulsingBg);
    hotspotElement.appendChild(mainCircle);
    hotspot.appendChild(hotspotElement);
    hotspotContainer.appendChild(hotspot);

    hotspot.addEventListener('click', () => {
      setModalContent(content);
      setShowModal(true);
      setHasSeenIntro(true);
    });

    return hotspotContainer;
  };

  useEffect(() => {
    if (!viewerRef.current) return;

    const initializeMarzipano = () => {
      try {
        // Create viewer with basic options
        const viewer = new window.Marzipano.Viewer(viewerRef.current);

        // Updated scenes data for all 5 scenes
        const scenes = [
          {
            id: 'scene1',
            name: 'Scene 1',
            url: "/360/scene1.jpg",
            initialViewParameters: {
              yaw: 3,
              pitch: 0.1,
              fov: Math.PI/2
            },
            hotspots: [
              {
                yaw: 1,
                pitch: 0.1,
                title: "Interactive Hotspot",
                content: {
                  title: "Welcome Explorer!",
                  description: `Welcome to the start of your journey at Mashreq!

I'm Tada, and I'm here to help. 

To unlock the next section, you'll need to pay close attention as you explore the rooms.

Your task is "simple". 

Find and count how many times the word GROWTH appears in the clues spread throughout the four rooms. Once you have the number, add it to the sum of all the years that are mentioned in the History Room. The final number is the passcode.

Remember, only by carefully reading through each room will you uncover the answer.

Good luck!`,
                  image: "/assets/tada.png"
                }
              }
            ]
          },
          {
            id: 'scene2',
            name: 'Scene 2',
            url: "/360/scene2.jpg",
            initialViewParameters: {
              yaw: 0,
              pitch: 0,
              fov: Math.PI/2
            }
          },
          {
            id: 'scene3',
            name: 'Scene 3',
            url: "/360/scene3.jpg",
            initialViewParameters: {
              yaw: Math.PI/4,
              pitch: 0,
              fov: Math.PI/2
            }
          },
          {
            id: 'scene4',
            name: 'Scene 4',
            url: "/360/scene4.jpg",
            initialViewParameters: {
              yaw: -Math.PI/4,
              pitch: 0,
              fov: Math.PI/2
            }
          },
          {
            id: 'scene5',
            name: 'Scene 5',
            url: "/360/scene5.jpg",
            initialViewParameters: {
              yaw: Math.PI,
              pitch: 0,
              fov: Math.PI/2
            }
          }
        ];

        // Create scenes
        const createdScenes = scenes.map(sceneData => {
          const source = window.Marzipano.ImageUrlSource.fromString(
            sceneData.url
          );

          const geometry = new window.Marzipano.EquirectGeometry([
            { width: 4000 }
          ]);

          const limiter = window.Marzipano.RectilinearView.limit.traditional(
            2048,
            120 * Math.PI / 180
          );
          
          const view = new window.Marzipano.RectilinearView(
            sceneData.initialViewParameters,
            limiter
          );

          const scene = viewer.createScene({
            source: source,
            geometry: geometry,
            view: view,
            pinFirstLevel: true
          });

          // Add hotspots if they exist
          if (sceneData.hotspots) {
            sceneData.hotspots.forEach(hotspot => {
              const element = createHotspotElement(hotspot.content);
              scene.hotspotContainer().createHotspot(element, 
                { yaw: hotspot.yaw, pitch: hotspot.pitch },
                { perspective: { radius: 1640, extraTransforms: "rotateX(0)" } }
              );
            });
          }

          return {
            data: sceneData,
            scene: scene,
            view: view
          };
        });

        // Switch to first scene
        createdScenes[0].scene.switchTo();
        setCurrentScene(createdScenes[0]);

        panoRef.current = {
          viewer,
          scenes: createdScenes
        };
        
        setIsLoading(false);

      } catch (err) {
        console.error('Error initializing panorama:', err);
        setError('Failed to initialize panorama viewer. Please refresh the page.');
        setIsLoading(false);
      }
    };

    if (window.Marzipano) {
      initializeMarzipano();
    } else {
      const checkMarzipano = setInterval(() => {
        if (window.Marzipano) {
          clearInterval(checkMarzipano);
          initializeMarzipano();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkMarzipano);
        if (!window.Marzipano) {
          setError('Marzipano library failed to load. Please refresh the page.');
          setIsLoading(false);
        }
      }, 5000);
    }

    return () => {
      if (panoRef.current) {
        panoRef.current.viewer.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!panoRef.current || !currentScene) return;

    const keysPressed = {
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
      ArrowDown: false,
    };

    let animationFrameId = null;
    const ROTATION_SPEED = 0.03;
    const ZOOM_SPEED = 0.1;

    const updateView = () => {
      const view = currentScene.view;

      if (keysPressed.ArrowLeft) {
        view.setYaw(view.yaw() - ROTATION_SPEED);
      }
      if (keysPressed.ArrowRight) {
        view.setYaw(view.yaw() + ROTATION_SPEED);
      }
      if (keysPressed.ArrowUp) {
        view.setPitch(Math.min(view.pitch() + ROTATION_SPEED, Math.PI/2));
      }
      if (keysPressed.ArrowDown) {
        view.setPitch(Math.max(view.pitch() - ROTATION_SPEED, -Math.PI/2));
      }

      if (Object.values(keysPressed).some(pressed => pressed)) {
        animationFrameId = requestAnimationFrame(updateView);
      }
    };

    const handleKeyDown = (e) => {
      if (keysPressed.hasOwnProperty(e.key) && !keysPressed[e.key]) {
        keysPressed[e.key] = true;
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(updateView);
        }
      }

      // Handle zoom separately
      if (e.key === '+' || e.key === '=') {
        const view = currentScene.view;
        view.setFov(view.fov() * (1 - ZOOM_SPEED));
      }
      if (e.key === '-' || e.key === '_') {
        const view = currentScene.view;
        view.setFov(view.fov() * (1 + ZOOM_SPEED));
      }
    };

    const handleKeyUp = (e) => {
      if (keysPressed.hasOwnProperty(e.key)) {
        keysPressed[e.key] = false;
        if (!Object.values(keysPressed).some(pressed => pressed)) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [currentScene]);

  const switchToScene = (sceneIndex) => {
    if (!panoRef.current || !panoRef.current.scenes[sceneIndex]) return;

    const nextScene = panoRef.current.scenes[sceneIndex];
    
    const transitionOpts = {
      transitionDuration: 1000,
      transitionUpdate: function(val, newScene) {
        newScene.layer().setEffects({ opacity: val });
      }
    };

    nextScene.scene.switchTo(transitionOpts);
    setCurrentScene(nextScene);
  };

  return (
    <div className="relative w-full h-full">
      <div 
        ref={viewerRef} 
        className="absolute inset-0 [opacity:0.99]"
        style={{
          WebkitUserSelect: 'none',
          userSelect: 'none',
          WebkitUserDrag: 'none',
          WebkitTouchCallout: 'none',
          msContentZooming: 'none'
        }}
      />

      {/* Only show navigation after intro has been seen */}
      {hasSeenIntro && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {[0, 1, 2, 3, 4].map((index) => (
            <button
              key={index}
              onClick={() => switchToScene(index)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentScene?.data.id === `scene${index + 1}`
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800/80 text-gray-200 hover:bg-gray-700/80'
              }`}
            >
              Scene {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && modalContent && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm animate-fadeIn">
          <div className="w-full h-full flex items-center justify-center">
            <div 
              className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8
              w-full h-full border-y border-indigo-500/30 shadow-xl shadow-indigo-500/10 animate-slideUp"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="max-w-6xl mx-auto">
                {/* Tada's Introduction Animation */}
                <div className="flex items-center gap-4 mb-8 animate-bounceIn">
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-2xl font-bold">
                    T
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    {modalContent.title}
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 gap-12 text-gray-200">
                  <div className="space-y-6 text-base">
                    <p className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                      Welcome to the start of your journey at Mashreq!
                    </p>
                    <p className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                      I'm Tada, and I'm here to help.
                    </p>
                    <p className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                      To unlock the next section, you'll need to pay close attention as you explore the rooms.
                    </p>
                    <p className="animate-fadeIn font-semibold text-lg text-indigo-400" style={{ animationDelay: '0.7s' }}>
                      Good luck!
                    </p>
                  </div>
                  <div className="space-y-6 text-base">
                    <div className="bg-indigo-950/50 p-6 rounded-lg border border-indigo-500/20 shadow-lg animate-fadeIn"
                         style={{ animationDelay: '0.4s' }}>
                      <h3 className="text-lg font-semibold text-indigo-400 mb-4">Your Task:</h3>
                      <div className="space-y-4">
                        <p className="text-white">
                          Find and count how many times the word <span className="text-indigo-400 font-semibold">GROWTH</span> appears in the clues spread throughout the four rooms.
                        </p>
                        <p className="text-white">
                          Add this number to the sum of all the <span className="text-indigo-400 font-semibold">years</span> that are mentioned in the History Room.
                        </p>
                        <p className="text-white font-semibold">
                          The final number is your passcode.
                        </p>
                      </div>
                    </div>
                    <p className="animate-fadeIn italic text-indigo-300" style={{ animationDelay: '0.6s' }}>
                      Remember, only by carefully reading through each room will you uncover the answer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
          <div className="text-white text-lg">
            Loading panorama...
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
          <div className="text-center text-white p-6 bg-red-900/50 rounded-lg">
            <p className="text-xl">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Section2; 