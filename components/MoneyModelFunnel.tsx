
import React from 'react';
import { GeneratedMoneyModel, MoneyModelStep } from '../types';
import Card from './common/Card';

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-2xl font-black text-white tracking-tight border-b-2 border-yellow-400 pb-2 mb-6">{children}</h3>
);

const StepCard: React.FC<{ step: MoneyModelStep, isLast: boolean }> = ({ step, isLast }) => {
    return (
        <div className="relative pl-8 pb-8">
            {/* Connecting line */}
            {!isLast && (
                <div className="absolute left-4 top-5 h-full w-0.5 bg-gray-600" aria-hidden="true"></div>
            )}
            {/* Step circle */}
            <div className="absolute left-0 top-0 flex items-center justify-center w-9 h-9 bg-gray-700 border-2 border-yellow-400 text-yellow-400 font-bold rounded-full">
                {step.stepNumber}
            </div>
            
            <div className="ml-4">
                <Card className="bg-gray-800/60 border-gray-600">
                    <h4 className="text-lg font-bold text-yellow-400">{step.title}</h4>
                    <p className="text-xl font-bold text-white mt-1">{step.offerName} - <span className="text-green-400">{step.price}</span></p>
                    
                    <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border-l-2 border-yellow-500">
                        <p className="text-sm font-semibold text-gray-300">Why this step is good:</p>
                        <p className="text-gray-400 text-sm">{step.rationale}</p>
                    </div>

                    <div className="mt-3">
                         <p className="font-mono text-xs uppercase tracking-wider text-blue-300 bg-blue-900/30 inline-block px-2 py-1 rounded">{step.hormoziTactic}</p>
                    </div>

                    <div className="mt-4 text-gray-300 text-sm whitespace-pre-wrap">
                        {step.details}
                    </div>
                </Card>
            </div>
        </div>
    );
};

const MoneyModelFunnel: React.FC<{ moneyModel: GeneratedMoneyModel }> = ({ moneyModel }) => {
  return (
    <Card>
      <SectionHeader>{moneyModel.title}</SectionHeader>
      <div className="text-center mb-8 bg-gray-900/70 p-4 rounded-lg border border-gray-700">
        <p className="text-lg font-bold text-yellow-400">The Big Idea</p>
        <p className="text-gray-300 italic">"{moneyModel.corePrinciple}"</p>
      </div>
      
      <div>
        {moneyModel.steps.sort((a, b) => a.stepNumber - b.stepNumber).map((step, index) => (
          <StepCard key={step.stepNumber} step={step} isLast={index === moneyModel.steps.length - 1} />
        ))}
      </div>

      <div className="mt-6 text-center bg-gray-900/70 p-4 rounded-lg">
        <p className="text-lg font-bold text-white">All Together</p>
        <p className="text-gray-400 mt-1">{moneyModel.summary}</p>
      </div>
    </Card>
  );
};

export default MoneyModelFunnel;
