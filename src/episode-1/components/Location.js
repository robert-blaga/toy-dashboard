import React from 'react';

const Location = ({ type, success }) => {
  const titles = {
    city: 'City',
    smallBusiness: 'Small business',
    largeOffice: 'Corporation',
    village: 'Remote village',
    oilRig: 'Oil rig',
  };

  const positions = {
    city: 'top-[40%] left-[1%]',
    smallBusiness: 'bottom-[30%] left-[55%]',
    largeOffice: 'bottom-[55%] left-[15%]',
    village: 'top-[30%] right-[10%]',
    oilRig: 'bottom-[20%] right-[10%]',
  };

  return (
    <div className={`location ${type} absolute w-[50px] h-[50px] ${positions[type]}`}>
      <div className="relative w-full h-full">
        {/* Circle Border */}
        <div className={`absolute w-[70%] h-[70%] top-[15%] left-[15%] border-[10px] rounded-full transition-all duration-500 
          ${success ? 'border-green-500 w-[90%] h-[90%] top-[5%] left-[5%] shadow-[0_0_20px_rgba(1,168,46,0.5)]' : 'border-white'}`}
        />
        
        {/* Location Image */}
        <img 
          src={`/assets/${type}.png`} 
          alt={type} 
          className="absolute w-full h-full object-contain"
        />
      </div>

      {/* Title Badge */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-center">
        <span className="px-2 py-1 text-xs font-semibold text-white font-cairo bg-black/75 backdrop-blur-sm rounded-lg border border-white/10 shadow-lg whitespace-nowrap">
          {titles[type]}
        </span>
      </div>
    </div>
  );
};

export default Location;