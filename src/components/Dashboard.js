import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const episodes = [
  {
    id: 1,
    title: 'Episode 1',
    subtitle: 'Employee Value Proposition (EVP)',
    color: 'indigo',
    icon: (
      <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    url: '/game/episode-1',
    demoUrl: 'https://drone-drop.vercel.app/'
  },
  {
    id: 2,
    title: 'Episode 2',
    subtitle: 'Vision',
    color: 'purple',
    icon: (
      <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    url: 'https://drone-reveal-game.vercel.app/',
    demoUrl: 'https://drone-reveal-game.vercel.app/'
  },
  {
    id: 3,
    title: 'Episode 3',
    subtitle: 'Mission',
    color: 'blue',
    icon: (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    url: 'https://mashreq-puzzle.vercel.app/',
    demoUrl: 'https://mashreq-puzzle.vercel.app/'
  },
  {
    id: 4,
    title: 'Episode 4',
    subtitle: 'Values',
    color: 'pink',
    icon: (
      <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    url: 'https://memory-game-theta-gules.vercel.app/',
    demoUrl: 'https://memory-game-theta-gules.vercel.app/'
  },
  {
    id: 5,
    title: 'Episode 5',
    subtitle: 'Culture',
    color: 'amber',
    icon: (
      <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    url: 'https://tower-block-wheat.vercel.app/',
    demoUrl: 'https://tower-block-wheat.vercel.app/'
  }
];

const Toast = ({ message }) => (
  <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in border border-gray-700">
    <svg 
      className="w-4 h-4 text-green-400" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M5 13l4 4L19 7"
      />
    </svg>
    <span className="text-sm">{message}</span>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [episode1Complete, setEpisode1Complete] = useState(false);
  const [episode1Time, setEpisode1Time] = useState(null);

  useEffect(() => {
    // Check if Episode 1 is complete
    const endTime = localStorage.getItem('endTime');
    const startTime = localStorage.getItem('startTime');
    
    if (endTime && startTime) {
      setEpisode1Complete(true);
      const duration = parseInt(endTime) - parseInt(startTime);
      const minutes = Math.floor(duration / 1000 / 60);
      const seconds = Math.floor((duration / 1000) % 60);
      setEpisode1Time(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }
  }, []);

  const handleCopy = (url, e) => {
    e.preventDefault();
    navigator.clipboard.writeText(url)
      .then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  const getEpisodeStatus = (episode) => {
    if (episode.id === 1 && episode1Complete) {
      return {
        status: 'completed',
        text: `Completed in ${episode1Time}`,
        className: 'bg-green-500/20 border-green-500/50 text-green-400'
      };
    }
    
    return {
      status: 'not-started',
      text: 'Not Started',
      className: 'bg-gray-500/20 border-gray-500/50 text-gray-400'
    };
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(63,94,251,0.1),rgba(252,70,107,0.1))]"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">
              Training Episodes
            </span>
          </h1>
          <p className="text-gray-400 text-sm">
            Choose your challenge and begin the adventure
          </p>
        </div>

        <div className="grid grid-cols-5 gap-6">
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className={`group relative bg-gray-800/50 backdrop-blur-sm rounded-xl border overflow-hidden transition-all duration-300 min-h-[200px] flex flex-col
                ${episode.id === 1 && episode1Complete 
                  ? 'border-green-500/50 hover:border-green-400/50' 
                  : 'border-gray-700/50 hover:border-indigo-500/50'}`}
            >
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative p-4 flex flex-col flex-1">
                {/* Status badge for all episodes */}
                <div className={`mb-4 border rounded-lg px-2 py-1 text-[10px] text-center w-full
                  ${getEpisodeStatus(episode).className}`}
                >
                  {getEpisodeStatus(episode).text}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {episode.icon}
                  <h3 className="text-sm font-semibold text-gray-100">
                    {episode.title}
                  </h3>
                </div>
                
                <p className="text-xs text-gray-400 mb-4 line-clamp-1">
                  {episode.subtitle}
                </p>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={(e) => handleCopy(episode.demoUrl, e)}
                    className="flex-1 group/btn bg-indigo-600 hover:bg-indigo-500 px-3 py-2 rounded-lg text-xs transition-all duration-200 flex items-center justify-center gap-2 border border-indigo-500/30 hover:border-indigo-400/60"
                  >
                    <span>Copy</span>
                    <svg 
                      className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-y-[-1px]" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => navigate(episode.url)}
                    disabled={episode.id === 1 && episode1Complete}
                    className={`group/play px-3 py-2 rounded-lg text-xs transition-all duration-200 flex items-center justify-center border
                      ${episode.id === 1 && episode1Complete
                        ? 'bg-gray-700/50 border-gray-600/30 cursor-not-allowed'
                        : 'bg-gray-700 hover:bg-gray-600 border-gray-600/30 hover:border-gray-500/60'
                      }`}
                    title={episode.id === 1 && episode1Complete ? 'Already completed' : 'Play game'}
                  >
                    {episode.id === 1 && episode1Complete ? (
                      <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showToast && <Toast message="Link copied to clipboard!" />}
    </div>
  );
};

export default Dashboard; 