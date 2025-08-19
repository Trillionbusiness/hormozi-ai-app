import React from 'react';

interface ProgressBarProps {
  progress: number;
  loadingText: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, loadingText }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <p className="text-yellow-400 font-semibold tracking-wider mb-2">{loadingText}</p>
      <div className="w-full bg-gray-700 rounded-full h-4">
        <div 
          className="bg-yellow-400 h-4 rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${Math.min(100, progress)}%` }}
        ></div>
      </div>
      <p className="text-white font-bold text-lg">{Math.min(100, Math.round(progress))}%</p>
    </div>
  );
};

export default ProgressBar;