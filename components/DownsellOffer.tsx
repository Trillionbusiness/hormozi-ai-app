

import React from 'react';
import { GeneratedDownsell, OfferStackItem } from '../types';
import Card, { StrategyAccordion } from './common/Card';

interface DownsellOfferProps {
  downsell: GeneratedDownsell;
  onPreviewAsset: (item: OfferStackItem) => void;
  isStatic?: boolean;
}

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-2xl font-black text-white tracking-tight border-b-2 border-yellow-400 pb-2 mb-6">{children}</h3>
);

const DownsellOffer: React.FC<DownsellOfferProps> = ({ downsell, onPreviewAsset, isStatic = false }) => {
  if (!downsell?.offer) {
    return null;
  }
  
  const { rationale, offer } = downsell;

  return (
    <section>
        <SectionHeader>A Simple 'Hello' Offer</SectionHeader>
        <Card className="bg-blue-900/20 border-blue-700">
            <div className="mb-6">
                <h4 className="text-lg font-bold text-blue-300">Why This Offer Works:</h4>
                <p className="text-gray-300 italic">{rationale}</p>
            </div>
            
            <Card className="bg-gray-800/50 border-gray-700 flex flex-col">
              <div className="flex-grow">
                <p className="font-bold text-lg text-white leading-tight">{offer.name}</p>
                <p className="text-gray-400 italic mb-6">"{offer.promise}"</p>
                
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-300 mb-2">Here is what you get:</p>
                  {offer.stack.map((item, index) => (
                       <div key={index} className="bg-gray-700/60 p-4 rounded-lg text-sm border-l-2 border-gray-600">
                          <div className="flex justify-between items-start gap-4">
                            <p className="font-bold text-gray-200 flex-grow">{item.solution}</p>
                            <p className="font-bold text-green-400 whitespace-nowrap">{item.value}</p>
                          </div>
                          <p className="text-gray-400 text-xs mt-1">
                            <span className="font-semibold">Solves Problem:</span> {item.problem}
                          </p>
                          {!isStatic && item.asset && (
                            <div className="mt-3 text-right flex items-center justify-end gap-2">
                                <button
                                    onClick={() => onPreviewAsset(item)}
                                    className="px-3 py-1 text-xs font-bold rounded capitalize bg-gray-600 text-white hover:bg-gray-500 transition-colors"
                                >
                                    Preview
                                </button>
                            </div>
                          )}
                        </div>
                      ))}
                </div>

                {offer.strategyBehindStack && (
                    <StrategyAccordion title="Why This Offer Is Great" isStatic={isStatic}>
                        <p className="whitespace-pre-wrap">{offer.strategyBehindStack}</p>
                    </StrategyAccordion>
                )}
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-700">
                <div className="text-right mb-4">
                  <p className="text-md font-semibold text-gray-400">All this is worth:</p>
                  <p className="text-2xl font-bold text-red-500 line-through">{offer.totalValue}</p>
                </div>

                <div className="text-right mb-4">
                  <p className="text-md font-semibold text-gray-300">Your special price:</p>
                  <p className="text-4xl font-black text-yellow-400">{offer.price}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-400">Our Promise to You:</p>
                  <p className="font-medium text-white italic bg-gray-900/50 p-3 rounded-md">"{offer.guarantee}"</p>
                </div>
              </div>
            </Card>
        </Card>
    </section>
  );
};

export default DownsellOffer;