import React from 'react';

interface CircularProgressProps {
  progress: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ progress }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  
  const displayProgress = Math.round(progress);

  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 40 40">
        <circle
          className="text-gray-500"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="20"
          cy="20"
        />
        <circle
          className="text-yellow-400 transition-all duration-300 ease-linear"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="20"
          cy="20"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <span className="absolute text-xs font-bold text-white">
        {displayProgress}%
      </span>
    </div>
  );
};

export default CircularProgress;