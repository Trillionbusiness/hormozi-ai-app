
import React from 'react';
import { GeneratedProfitPath } from '../types';
import Card from './common/Card';
import CopyableBlock from './common/CopyableBlock';

interface Step4ProfitPathProps {
  profitPath: GeneratedProfitPath;
  isStatic?: boolean;
}

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-2xl font-black text-white tracking-tight border-b-2 border-yellow-400 pb-2 mb-6">{children}</h3>
);

const Step4ProfitPath: React.FC<Step4ProfitPathProps> = ({ profitPath, isStatic = false }) => {
  return (
    <Card>
      <SectionHeader>4 Steps to Make More Money</SectionHeader>
      <p className="text-gray-400 mb-8 -mt-4">This plan helps you make money right away from each new customer. This helps you grow faster.</p>
      <div className="space-y-6">
        {profitPath.steps.map((step, index) => (
          <div key={index} className="p-4 border-l-4 border-yellow-400 bg-gray-800/50 rounded-r-lg">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-shrink-0 md:w-1/3">
                <h4 className="font-bold text-lg text-yellow-400">{index + 1}. {step.title}</h4>
                </div>
                <div className="flex-grow">
                <p className="text-white"><span className="font-semibold text-gray-300">What to do:</span> {step.action}</p>
                <p className="text-gray-400 mt-1 italic"><span className="font-semibold text-gray-300 not-italic">For example:</span> {step.example}</p>
                </div>
            </div>
            {step.script && <CopyableBlock title="A Script You Can Use" content={step.script} isStatic={isStatic} />}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Step4ProfitPath;
