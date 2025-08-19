
import React from 'react';
import { GeneratedOperationsPlan } from '../types';
import Card from './common/Card';

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-2xl font-black text-white tracking-tight border-b-2 border-yellow-400 pb-2 mb-6">{children}</h3>
);

const OperationsPlan: React.FC<{ operationsPlan: GeneratedOperationsPlan }> = ({ operationsPlan }) => {
  return (
    <Card>
      <SectionHeader>{operationsPlan.title}</SectionHeader>
       <div className="text-center mb-8 bg-gray-900/70 p-4 rounded-lg border border-gray-700">
        <p className="text-lg font-bold text-yellow-400">The Big Idea</p>
        <p className="text-gray-300 italic">"{operationsPlan.corePrinciple}"</p>
      </div>

      <div className="mb-8">
        <h4 className="text-xl font-bold text-white mb-4">What You'll Do and Why</h4>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-yellow-400 uppercase bg-gray-700/50">
                    <tr>
                        <th scope="col" className="px-4 py-3">Good Thing for Customer</th>
                        <th scope="col" className="px-4 py-3">What You Do</th>
                        <th scope="col" className="px-4 py-3">How Much Time</th>
                        <th scope="col" className="px-4 py-3">How Often</th>
                    </tr>
                </thead>
                <tbody>
                    {operationsPlan.outcomesAndActivities.map((item, index) => (
                        <tr key={index} className="border-b border-gray-700">
                            <td className="px-4 py-3 font-semibold text-white">{item.outcome}</td>
                            <td className="px-4 py-3">{item.activity}</td>
                            <td className="px-4 py-3">{item.timeAllocation}</td>
                            <td className="px-4 py-3">{item.frequency}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
      
      <div className="mb-8">
        <h4 className="text-xl font-bold text-white mb-4">What's Slowing You Down</h4>
        <div className="bg-gray-800/60 p-4 rounded-lg border-l-4 border-red-500">
          <p className="text-gray-300">{operationsPlan.bottleneckAnalysis}</p>
        </div>
      </div>

      <div>
        <h4 className="text-xl font-bold text-white mb-4">Jobs to Do</h4>
        <div className="space-y-6">
          {operationsPlan.proposedRoles.map((role, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-600">
              <h5 className="text-lg font-bold text-yellow-400">{role.roleTitle}</h5>
              <p className="text-sm text-gray-400 mb-4"><span className="font-semibold">How to know it's working:</span> {role.keyMetric}</p>
              
              <p className="text-sm font-semibold text-gray-300 mb-2">Important tasks:</p>
              <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                {role.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
              </ul>

              <p className="text-sm font-semibold text-gray-300 mt-4 mb-2">What a day looks like:</p>
              <p className="text-gray-400 text-sm whitespace-pre-wrap bg-gray-800 p-3 rounded">{role.dailyStructure}</p>
            </Card>
          ))}
        </div>
      </div>

    </Card>
  );
};

export default OperationsPlan;
