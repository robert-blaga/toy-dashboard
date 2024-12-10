import React, { useState, useEffect } from 'react';
import PasswordModal from './PasswordModal';
import { useSection } from '../episode-1/context/SectionContext';

const NavBar = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const { 
    currentSection, 
    setCurrentSection, 
    isSection2Unlocked, 
    setIsSection2Unlocked, 
    isSection3Unlocked, 
    setIsSection3Unlocked,
    startTime,
    endTime,
    isTimerRunning,
    resetProgress
  } = useSection();

  const [currentTime, setCurrentTime] = useState(0);

  // Update timer every second
  useEffect(() => {
    let intervalId;
    
    if (isTimerRunning && startTime) {
      intervalId = setInterval(() => {
        setCurrentTime(Date.now() - startTime);
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTimerRunning, startTime]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const navItems = [
    {
      number: '1'
    },
    {
      number: '2',
      locked: true,
      requiredPassword: 'RISE'
    },
    {
      number: '3',
      locked: true,
      requiredPassword: '9909'
    }
  ];

  const isSectionLocked = (item) => {
    if (item.number === '2') {
      return !isSection2Unlocked;
    }
    if (item.number === '3') {
      return !isSection3Unlocked;
    }
    return false;
  };

  const handleSectionClick = (item) => {
    const sectionNumber = parseInt(item.number);
    if (isSectionLocked(item)) {
      setSelectedSection(item);
    } else {
      setCurrentSection(sectionNumber);
    }
  };

  const handleUnlock = () => {
    if (selectedSection.number === '2') {
      setIsSection2Unlocked(true);
      setCurrentSection(2);
    } else if (selectedSection.number === '3') {
      setIsSection3Unlocked(true);
      setCurrentSection(3);
    }
    setSelectedSection(null);
  };

  return (
    <>
      <div className="h-full w-[60px] bg-gray-800/80 backdrop-blur-sm border-l border-gray-700/50 flex flex-col items-center py-4">
        <div className="flex-1 flex flex-col gap-6">
          {navItems.map((item) => (
            <button
              key={item.number}
              onClick={() => handleSectionClick(item)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold relative
                ${currentSection === parseInt(item.number)
                  ? 'bg-orange-500 text-white'
                  : isSectionLocked(item)
                    ? 'bg-gray-900/50 text-gray-600'
                    : 'bg-gray-900/50 text-gray-300 hover:bg-gray-900/80'
                }`}
            >
              {item.number}
              {isSectionLocked(item) && (
                <span className="absolute -right-1 -top-1 w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-[10px]">🔒</span>
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Timer display */}
        {(isTimerRunning || endTime) && (
          <div className="px-2 py-1 text-xs text-gray-400 bg-gray-900/50 rounded-md">
            {endTime ? (
              <span>Final: {formatTime(endTime - startTime)}</span>
            ) : (
              <span>{formatTime(currentTime)}</span>
            )}
          </div>
        )}

        {/* Reset button */}
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to reset all progress?')) {
              resetProgress();
            }
          }}
          className="mt-4 text-xs text-gray-500 hover:text-gray-400"
        >
          Reset
        </button>
      </div>

      {selectedSection && (
        <PasswordModal
          episode={selectedSection}
          onClose={() => setSelectedSection(null)}
          onSubmit={handleUnlock}
        />
      )}
    </>
  );
};

export default NavBar; 