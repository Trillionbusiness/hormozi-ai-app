
import React from 'react';
import { GeneratedKpiDashboard, Kpi } from '../types';
import Card from './common/Card';

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-2xl font-black text-white tracking-tight border-b-2 border-yellow-400 pb-2 mb-6">{children}</h3>
);

const KpiCard: React.FC<{ kpi: Kpi }> = ({ kpi }) => {
    const perspectiveColors = {
        Financial: 'border-green-500 bg-green-900/20',
        Customer: 'border-blue-500 bg-blue-900/20',
        Operational: 'border-purple-500 bg-purple-900/20',
        Marketing: 'border-pink-500 bg-pink-900/20',
    };
    const colorClass = perspectiveColors[kpi.perspective] || 'border-gray-500 bg-gray-800/50';

    return (
        <Card className={`${colorClass} flex flex-col`}>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h4 className="text-xl font-bold text-white flex-grow pr-4">{kpi.name}</h4>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-300 bg-gray-700 px-2 py-1 rounded">{kpi.perspective}</span>
                </div>
                <p className="text-gray-400 mt-2 text-sm">{kpi.description}</p>
                
                <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
                     <p className="text-sm font-semibold text-gray-300">Why it's important for you:</p>
                     <p className="text-gray-400 text-sm italic">{kpi.importance}</p>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-700/60 p-3 rounded-lg">
                        <p className="font-semibold text-yellow-300">How to Measure It:</p>
                        <p className="text-gray-300 mt-1">{kpi.howToMeasure}</p>
                    </div>
                     <div className="bg-gray-700/60 p-3 rounded-lg">
                        <p className="font-semibold text-yellow-300">Simple Formula:</p>
                        <p className="text-gray-300 font-mono mt-1">{kpi.formula}</p>
                    </div>
                </div>
                 <div className="mt-4 bg-gray-700/60 p-3 rounded-lg">
                    <p className="font-semibold text-yellow-300">Example:</p>
                    <p className="text-gray-300 mt-1">{kpi.example}</p>
                </div>
            </div>
        </Card>
    );
};


const KpiDashboard: React.FC<{ kpiDashboard: GeneratedKpiDashboard }> = ({ kpiDashboard }) => {
  return (
    <Card>
      <SectionHeader>{kpiDashboard.title}</SectionHeader>
      <div className="text-center mb-8 bg-gray-900/70 p-4 rounded-lg border border-gray-700">
        <p className="text-lg font-bold text-yellow-400">The Big Idea</p>
        <p className="text-gray-300 italic">"{kpiDashboard.corePrinciple}"</p>
      </div>
      <div className="space-y-6">
        {kpiDashboard.kpis.map((kpi, index) => (
            <KpiCard key={index} kpi={kpi} />
        ))}
      </div>
    </Card>
  );
};

export default KpiDashboard;
