import React, { useState, useRef, useEffect } from 'react';
import CircularProgress from './CircularProgress';

interface DropdownButtonProps {
  label: string;
  options: { label: string; onClick: () => void }[];
  isLoading?: boolean;
  progress: number;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ label, options, isLoading, progress }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          className="inline-flex justify-center items-center w-full rounded-lg border border-gray-600 shadow-sm px-6 py-3 bg-gray-600 text-base font-bold text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-400 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{minHeight: '52px', minWidth: '180px'}}
        >
          {isLoading ? <CircularProgress progress={progress} /> : (
            <>
            {label}
            <svg className="-mr-1 ml-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            </>
          )}
        </button>
      </div>
      
      {isOpen && (
        <div 
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {options.map((option) => (
                <button
                    key={option.label}
                    onClick={() => handleOptionClick(option.onClick)}
                    className="w-full text-left text-gray-200 block px-4 py-2 text-sm hover:bg-gray-600 hover:text-white"
                    role="menuitem"
                >
                    {option.label}
                </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default DropdownButton;