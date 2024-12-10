import React from 'react';
import { useSection } from '../context/SectionContext';
import DroneGame from './DroneGame';
import Section2 from './Section2/Section2';
import Section3 from './Section3/Section3';

const Episode1 = () => {
  const { currentSection } = useSection();

  const renderSection = () => {
    switch(currentSection) {
      case 1:
        return <DroneGame />;
      case 2:
        return <Section2 />;
      case 3:
        return <Section3 />;
      default:
        return <DroneGame />;
    }
  };

  return renderSection();
};

export default Episode1; 