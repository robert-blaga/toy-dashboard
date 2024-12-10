import React, { createContext, useContext, useState, useEffect } from 'react';

const SectionContext = createContext();

export const SectionProvider = ({ children }) => {
  // Load initial state from localStorage with proper time handling
  const [currentSection, setCurrentSection] = useState(() => 
    parseInt(localStorage.getItem('currentSection')) || 1
  );
  const [isSection2Unlocked, setIsSection2Unlocked] = useState(() => 
    localStorage.getItem('isSection2Unlocked') === 'true'
  );
  const [isSection3Unlocked, setIsSection3Unlocked] = useState(() => 
    localStorage.getItem('isSection3Unlocked') === 'true'
  );
  
  // Update time handling
  const [startTime, setStartTime] = useState(() => {
    const savedStartTime = localStorage.getItem('startTime');
    return savedStartTime ? parseInt(savedStartTime) : null;
  });
  
  const [endTime, setEndTime] = useState(() => {
    const savedEndTime = localStorage.getItem('endTime');
    return savedEndTime ? parseInt(savedEndTime) : null;
  });
  
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Save state changes to localStorage with proper time handling
  useEffect(() => {
    localStorage.setItem('currentSection', currentSection);
    localStorage.setItem('isSection2Unlocked', isSection2Unlocked);
    localStorage.setItem('isSection3Unlocked', isSection3Unlocked);
    if (startTime) {
      localStorage.setItem('startTime', startTime.toString());
    }
    if (endTime) {
      localStorage.setItem('endTime', endTime.toString());
    }
  }, [currentSection, isSection2Unlocked, isSection3Unlocked, startTime, endTime]);

  const startTimer = () => {
    const now = Date.now();
    setStartTime(now);
    localStorage.setItem('startTime', now.toString());
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    const now = Date.now();
    setEndTime(now);
    localStorage.setItem('endTime', now.toString());
    setIsTimerRunning(false);
  };

  // Update reset progress to include drone game
  const resetProgress = () => {
    // Clear all localStorage first
    localStorage.clear();  // This will clear ALL localStorage items

    // Then update all the states
    setCurrentSection(1);
    setIsSection2Unlocked(false);
    setIsSection3Unlocked(false);
    setStartTime(null);
    setEndTime(null);
    setIsTimerRunning(false);

    // Use a small timeout to ensure state is updated before reload
    setTimeout(() => {
      window.location.href = '/';  // Use this instead of reload()
    }, 100);
  };

  const value = {
    currentSection,
    setCurrentSection,
    isSection2Unlocked,
    setIsSection2Unlocked,
    isSection3Unlocked,
    setIsSection3Unlocked,
    startTimer,
    stopTimer,
    resetProgress,
    startTime,
    endTime,
    isTimerRunning
  };

  return (
    <SectionContext.Provider value={value}>
      {children}
    </SectionContext.Provider>
  );
};

export const useSection = () => {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error('useSection must be used within a SectionProvider');
  }
  return context;
}; 