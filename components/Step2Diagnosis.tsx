import React from 'react';
import { GeneratedDiagnosis } from '../types';
import Card from './common/Card';

interface Step2DiagnosisProps {
  diagnosis: GeneratedDiagnosis;
}

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-2xl font-black text-white tracking-tight border-b-2 border-yellow-400 pb-2 mb-4">{children}</h3>
);

const Step2Diagnosis: React.FC<Step2DiagnosisProps> = ({ diagnosis }) => {
  return (
    <Card>
      <SectionHeader>Your Business Today</SectionHeader>
      <div className="space-y-6 text-lg">
        <div>
          <p className="text-gray-400 font-semibold">Your stage:</p>
          <p className="font-bold text-yellow-400 text-xl">{diagnosis.currentStage}</p>
        </div>
        <div>
          <p className="text-gray-400 font-semibold">Your main job:</p>
          <p className="font-bold text-white">{diagnosis.yourRole}</p>
        </div>
        <div>
          <p className="text-gray-400 font-semibold">What holds you back:</p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-white">
            {diagnosis.constraints.map((constraint, index) => <li key={index}>{constraint}</li>)}
          </ul>
        </div>
        <div>
          <p className="text-gray-400 font-semibold">Your simple steps to grow:</p>
          <ul className="list-decimal list-inside space-y-1 mt-2 font-medium text-white">
            {diagnosis.actions.map((action, index) => <li key={index}>{action}</li>)}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default Step2Diagnosis;