
import React from 'react';
import { GeneratedSalesFunnel, FunnelStage } from '../types';
import Card from './common/Card';

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-2xl font-black text-white tracking-tight border-b-2 border-yellow-400 pb-2 mb-6">{children}</h3>
);

const StageCard: React.FC<{ stage: FunnelStage; index: number; isLast: boolean }> = ({ stage, index, isLast }) => {
    const stageColors = ['border-blue-500', 'border-purple-500', 'border-green-500'];
    const stageBgColors = ['bg-blue-900/20', 'bg-purple-900/20', 'bg-green-900/20'];
    const colorClass = stageColors[index % stageColors.length];
    const bgColorClass = stageBgColors[index % stageBgColors.length];

    return (
        <div className="relative pl-8 pb-8">
            {!isLast && <div className="absolute left-4 top-5 h-full w-0.5 bg-gray-600" aria-hidden="true"></div>}
            <div className={`absolute left-0 top-0 flex items-center justify-center w-9 h-9 bg-gray-700 border-2 ${colorClass} text-white font-bold rounded-full`}>
                {index + 1}
            </div>
            <div className="ml-4">
                <Card className={`${bgColorClass} ${colorClass.replace('border-', 'border-t-4 ')}`}>
                    <h4 className="text-xl font-bold text-white mb-1">{stage.stageName}</h4>
                    <p className="text-gray-400 italic mb-4">{stage.goal}</p>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-900/50 p-3 rounded-lg">
                            <h5 className="font-bold text-yellow-300 mb-2">Ad / First Message</h5>
                            <p className="text-gray-300"><strong className="text-gray-400">Headline:</strong> {stage.adCopy.headline}</p>
                            <p className="text-gray-300 mt-1"><strong className="text-gray-400">Body:</strong> {stage.adCopy.body}</p>
                            <p className="text-gray-300 mt-1"><strong className="text-gray-400">Action:</strong> {stage.adCopy.cta}</p>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded-lg">
                            <h5 className="font-bold text-yellow-300 mb-2">Website Page</h5>
                            <p className="text-gray-300"><strong className="text-gray-400">Headline:</strong> {stage.landingPage.headline}</p>
                            <p className="text-gray-300 mt-1"><strong className="text-gray-400">Key Parts:</strong> {stage.landingPage.elements.join(', ')}</p>
                            <p className="text-gray-300 mt-1"><strong className="text-gray-400">Main Goal:</strong> {stage.landingPage.keyFocus}</p>
                        </div>
                    </div>
                    
                    <div className="bg-gray-900/50 p-3 rounded-lg mt-4">
                        <h5 className="font-bold text-yellow-300 mb-2">Sales Chat</h5>
                        <p className="text-gray-300"><strong className="text-gray-400">What to Do:</strong> {stage.salesProcess.step}</p>
                        <p className="text-gray-300 mt-1"><strong className="text-gray-400">What to Talk About:</strong> {stage.salesProcess.scriptFocus}</p>
                    </div>

                    <div className="mt-4 text-right">
                        <p className="text-xs uppercase font-bold text-gray-400">Number to Watch</p>
                        <p className="font-bold text-white">{stage.keyMetric}</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};


const SalesFunnel: React.FC<{ salesFunnel: GeneratedSalesFunnel }> = ({ salesFunnel }) => {
    return (
        <Card>
            <SectionHeader>{salesFunnel.title}</SectionHeader>
            <div className="text-center mb-8 bg-gray-900/70 p-4 rounded-lg border border-gray-700">
                <p className="text-lg font-bold text-yellow-400">The Big Idea</p>
                <p className="text-gray-300 italic">"{salesFunnel.corePrinciple}"</p>
            </div>
            <div>
                {salesFunnel.stages.map((stage, index) => (
                    <StageCard 
                        key={index} 
                        stage={stage} 
                        index={index} 
                        isLast={index === salesFunnel.stages.length - 1} 
                    />
                ))}
            </div>
        </Card>
    );
};

export default SalesFunnel;
