import React, { useState, forwardRef } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ children, className, ...props }, ref) => {
  return (
    <div 
      ref={ref}
      {...props} 
      className={`bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 md:p-8 ${className || ''}`}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

interface StrategyAccordionProps {
  title: string;
  children: React.ReactNode;
  isStatic?: boolean;
}

export const StrategyAccordion: React.FC<StrategyAccordionProps> = ({ title, children, isStatic = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isExpanded = isStatic || isOpen;

  return (
    <div className="border border-gray-600 rounded-lg my-4">
      <button
        onClick={() => !isStatic && setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 bg-gray-700/70 hover:bg-gray-700 transition-colors rounded-t-lg disabled:cursor-default"
        aria-expanded={isExpanded}
        aria-controls="strategy-content"
        disabled={isStatic}
      >
        <span className="font-semibold text-yellow-300">{title}</span>
        {!isStatic && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 text-yellow-300 transform transition-transform strategy-toggle-icon ${isOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        )}
      </button>
      <div
        id="strategy-content"
        className={`transition-all duration-300 ease-in-out overflow-hidden strategy-content ${isExpanded ? 'max-h-screen' : 'max-h-0'}`}
      >
        <div className="p-4 bg-gray-900/50 text-gray-300 text-sm">
            {children}
        </div>
      </div>
    </div>
  );
};

export default Card;