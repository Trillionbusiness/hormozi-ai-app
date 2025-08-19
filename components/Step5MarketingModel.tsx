
import React from 'react';
import { GeneratedMarketingModel } from '../types';
import Card from './common/Card';
import CopyableBlock from './common/CopyableBlock';

interface Step5MarketingModelProps {
  marketingModel: GeneratedMarketingModel;
  isStatic?: boolean;
}

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-2xl font-black text-white tracking-tight border-b-2 border-yellow-400 pb-2 mb-6">{children}</h3>
);

const Step5MarketingModel: React.FC<Step5MarketingModelProps> = ({ marketingModel, isStatic = false }) => {
  const icons = ["🔥", "🎯", "🚀", "📈"];
  return (
    <Card>
      <SectionHeader>4 Ways to Find Customers</SectionHeader>
      <p className="text-gray-400 mb-8 -mt-4">This is how you find people who really want what you sell. Do these four things to show them your amazing offer.</p>
      <div className="space-y-6">
        {marketingModel.steps.map((step, index) => (
          <div key={index} className="bg-gray-800/50 rounded-lg p-5 border-l-4 border-yellow-500 shadow-md">
              <h4 className="flex items-center text-xl font-bold text-yellow-400 mb-2">
                <span className="text-2xl mr-3">{icons[index % icons.length]}</span>
                {step.method}
              </h4>
             <p className="text-white font-semibold mb-2 pl-10">{step.strategy}</p>
             <div className="bg-gray-700/60 p-3 rounded-lg pl-4 border-l-2 border-gray-600 ml-10">
                <p className="text-gray-300 italic"><span className="font-bold text-gray-400 not-italic">For example: </span>{step.example}</p>
             </div>
            {step.template && (
                <div className="pl-10 mt-4">
                    <CopyableBlock title="A Template You Can Use" content={step.template} isStatic={isStatic} />
                </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Step5MarketingModel;
