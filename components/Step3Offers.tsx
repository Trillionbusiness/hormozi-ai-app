
import React from 'react';
import { GeneratedOffer, OfferStackItem } from '../types';
import Card, { StrategyAccordion } from './common/Card';

interface Step3OffersProps {
  offer1: GeneratedOffer;
  offer2: GeneratedOffer;
  onPreviewAsset: (item: OfferStackItem) => void;
  onDownloadAssetBundle: (offer: GeneratedOffer) => void;
  isStatic?: boolean;
}

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-2xl font-black text-white tracking-tight border-b-2 border-yellow-400 pb-2 mb-6">{children}</h3>
);

const OfferCard: React.FC<{ offer: GeneratedOffer, title: string, onPreviewAsset: (item: OfferStackItem) => void, onDownloadAssetBundle: (offer: GeneratedOffer) => void, isStatic?: boolean }> = ({ offer, title, onPreviewAsset, onDownloadAssetBundle, isStatic = false }) => (
  <Card className="bg-gray-800/50 border-gray-700 flex flex-col">
    <div className="flex-grow">
      <h4 className="text-xl font-bold text-yellow-400 mb-2">{title}</h4>
      <p className="font-bold text-lg text-white leading-tight">{offer.name}</p>
      <p className="text-gray-400 italic mb-6">"{offer.promise}"</p>
      
      <div>
        <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold text-gray-300">What you get:</p>
            {!isStatic && (
                <button
                    onClick={() => onDownloadAssetBundle(offer)}
                    className="px-3 py-1 text-xs font-bold rounded capitalize bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                >
                    Download All Assets
                </button>
            )}
        </div>
        <div className="space-y-3">
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
                                Preview Asset
                            </button>
                        </div>
                      )}
                    </div>
            ))}
        </div>
      </div>

      {offer.strategyBehindStack && (
          <StrategyAccordion title="Why This Offer Works" isStatic={isStatic}>
              <p className="whitespace-pre-wrap">{offer.strategyBehindStack}</p>
          </StrategyAccordion>
      )}
    </div>
    
    <div className="mt-auto pt-4 border-t border-gray-700">
      <div className="text-right mb-4">
        <p className="text-md font-semibold text-gray-400">Total Value:</p>
        <p className="text-2xl font-bold text-red-500 line-through">{offer.totalValue}</p>
      </div>

      <div className="text-right mb-4">
        <p className="text-md font-semibold text-gray-300">Your Price:</p>
        <p className="text-4xl font-black text-yellow-400 animate-pulse">{offer.price}</p>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-400">Our Promise:</p>
        <p className="font-medium text-white italic bg-gray-900/50 p-3 rounded-md">"{offer.guarantee}"</p>
      </div>
    </div>
  </Card>
);

const Step3Offers: React.FC<Step3OffersProps> = ({ offer1, offer2, onPreviewAsset, onDownloadAssetBundle, isStatic = false }) => {
  return (
    <section>
        <SectionHeader>Your Best Offers</SectionHeader>
        <p className="text-gray-400 mb-6 -mt-4">These offers are so good, people will feel silly saying no.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <OfferCard offer={offer1} title="Offer Idea 1" onPreviewAsset={onPreviewAsset} onDownloadAssetBundle={onDownloadAssetBundle} isStatic={isStatic} />
            <OfferCard offer={offer2} title="Offer Idea 2" onPreviewAsset={onPreviewAsset} onDownloadAssetBundle={onDownloadAssetBundle} isStatic={isStatic} />
        </div>
    </section>
  );
};

export default Step3Offers;
