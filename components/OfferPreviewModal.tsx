
import React from 'react';
import { OfferStackItem } from '../types';
import MarkdownRenderer from './common/MarkdownRenderer';

interface OfferPreviewModalProps {
  asset: NonNullable<OfferStackItem['asset']>;
  onClose: () => void;
}

const OfferPreviewModal: React.FC<OfferPreviewModalProps> = ({ asset, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 border-2 border-yellow-400 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col p-6 md:p-8 text-white shadow-2xl relative" 
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center mb-6">
          <p className="font-bold uppercase tracking-wider text-sm text-yellow-400 capitalize">{asset.type}</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter mt-2">{asset.name}</h2>
        </div>

        <div className="flex-grow overflow-y-auto bg-gray-900/50 p-4 md:p-6 rounded-lg border border-gray-700">
          <MarkdownRenderer content={asset.content} theme="dark" />
        </div>
      </div>
    </div>
  );
};

export default OfferPreviewModal;
