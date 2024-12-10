import React from 'react';
import Location from './Location';

const Map = ({ children, locations, key }) => {
  const locationTypes = ['city', 'smallBusiness', 'largeOffice', 'village', 'oilRig'];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div 
        className="relative w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/background.png")' }}
      >
        {locationTypes.map((type) => (
          <Location 
            key={`${type}-${locations[type]}`}
            type={type} 
            success={locations[type]} 
          />
        ))}
        {children}
      </div>
    </div>
  );
};

export default Map;