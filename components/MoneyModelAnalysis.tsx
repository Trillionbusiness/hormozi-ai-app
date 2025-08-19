
import React from 'react';
import { GeneratedMoneyModelAnalysis } from '../types';
import Card from './common/Card';

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-2xl font-black text-white tracking-tight border-b-2 border-yellow-400 pb-2 mb-6">{children}</h3>
);

const ModelCard: React.FC<{ model: GeneratedMoneyModelAnalysis['oldModel'], color: 'red' | 'green' }> = ({ model, color }) => {
    const borderColor = color === 'red' ? 'border-red-700' : 'border-green-600';
    const bgColor = color === 'red' ? 'bg-red-900/30' : 'bg-green-900/30';
    const textColor = color === 'red' ? 'text-red-300' : 'text-green-300';

    return (
        <div className={`p-4 rounded-lg border ${borderColor} ${bgColor} flex flex-col`}>
          <h4 className={`font-bold ${textColor} text-lg`}>{model.title}</h4>
          <p className="text-gray-400 text-sm mt-1 mb-4 flex-grow">{model.description}</p>
          <div className="space-y-2">
            {model.metrics.map((metric, index) => (
                <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-300">{metric.label}:</span>
                    <span className="font-bold text-white">{metric.value}</span>
                </div>
            ))}
          </div>
        </div>
    );
};


const MoneyModelAnalysis: React.FC<{ analysis: GeneratedMoneyModelAnalysis }> = ({ analysis }) => {
  return (
    <Card>
      <SectionHeader>Your Money Plan: Before and After</SectionHeader>
      <p className="text-gray-400 mb-6 -mt-4">This is the most important part. A good money plan helps you grow. We are going to make your money plan much better.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ModelCard model={analysis.oldModel} color="red" />
        <ModelCard model={analysis.newModel} color="green" />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
            <h4 className="text-xl font-bold text-yellow-400 mb-2">Your Goal for Customer Value</h4>
            <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-center bg-gray-900 p-4 rounded-lg mb-3">
                    <span className="text-5xl font-black text-white">{analysis.ltvCacAnalysis.targetRatio}</span>
                    <p className="text-gray-400 text-sm">Goal for how much a customer is worth to you</p>
                </div>
                <p className="text-gray-400 text-sm">{analysis.ltvCacAnalysis.explanation}</p>
            </div>
        </div>
        <div>
            <h4 className="text-xl font-bold text-yellow-400 mb-2">How Much You Could Make in 30 Days</h4>
            <div className="bg-gray-800/50 p-4 rounded-lg space-y-3">
                 <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-300">What a customer brings you:</span>
                    <span className="font-bold text-green-400">{analysis.projectedEconomics.targetLTV}</span>
                </div>
                 <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-300">Cost to get a customer:</span>
                    <span className="font-bold text-red-400">-{analysis.projectedEconomics.estimatedCAC}</span>
                </div>
                <div className="border-t border-gray-600 my-2"></div>
                <div className="flex justify-between items-center text-xl">
                    <span className="text-white font-bold">Money you make right away:</span>
                    <span className="font-black text-yellow-400">{analysis.projectedEconomics.immediateProfit}</span>
                </div>
                <p className="text-gray-400 text-sm pt-2">{analysis.projectedEconomics.explanation}</p>
            </div>
        </div>
      </div>
    </Card>
  );
};

export default MoneyModelAnalysis;
