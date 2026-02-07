
import React from 'react';

interface GoalBarProps {
  current: number;
  target: number;
  currentScore: number;
  targetScore: number;
  totalScore: number;
}

export const GoalBar: React.FC<GoalBarProps> = ({ current, target, currentScore, targetScore, totalScore }) => {
  return (
    <div className="w-full mt-16 pb-6 px-2">
      <div className="relative h-12 w-full flex items-center">
        
        {/* The Track Line (Dashed "Road") */}
        <div className="absolute top-1/2 left-0 w-full">
           <div className="w-full border-t-2 border-dashed border-gray-200"></div>
        </div>

        {/* Progress Fill (Solid Blue) */}
         <div className="absolute top-1/2 left-0 h-1 bg-blue-500 rounded-l-full z-0 transform -translate-y-1/2 shadow-sm" style={{ width: `${current}%` }}></div>
        
        {/* 0% Marker (Start) */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 z-0">
            <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
        </div>
        
        {/* User Marker (You) */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
          style={{ left: `${current}%` }}
        >
          {/* Unified Badge (Top) */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 whitespace-nowrap filter drop-shadow-md">
            <span className="relative inline-flex items-center px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold">
              You • {current}%ile
              {/* Pointy bit */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-blue-600 rotate-45 rounded-sm"></div>
            </span>
          </div>

          {/* Marker Dot */}
          <div className="w-5 h-5 bg-blue-600 rounded-full ring-4 ring-white shadow-md flex items-center justify-center relative z-10">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
          
          {/* Explicit Marks (Bottom) */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-max text-center">
            <span className="text-xs font-bold text-gray-900 block">{currentScore} Marks</span>
          </div>
        </div>

        {/* Target Marker (Goal) */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
          style={{ left: `${target}%` }}
        >
          {/* Unified Badge (Top) */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 whitespace-nowrap">
            <span className="relative inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold shadow-sm">
              Goal • {target}%ile
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-50 border-b border-r border-amber-200 rotate-45"></div>
            </span>
          </div>

          {/* Gold Star Icon */}
          <div className="w-6 h-6 bg-amber-400 rounded-full ring-4 ring-white shadow-md flex items-center justify-center relative z-10">
             <div className="absolute inset-0 bg-amber-400 rounded-full animate-pulse opacity-40 scale-125"></div>
             <svg className="w-3.5 h-3.5 text-white relative z-10" fill="currentColor" viewBox="0 0 20 20">
               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
             </svg>
          </div>
          
          {/* Explicit Marks (Bottom) */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-max text-center">
             <span className="text-xs font-medium text-gray-500 block">{targetScore} Marks</span>
          </div>
        </div>

        {/* 100% Marker (End) */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 z-0">
          <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
