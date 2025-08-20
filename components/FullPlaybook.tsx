
import React, { useState } from 'react';
import { GeneratedPlaybook, OfferStackItem, GeneratedOffer, ChatMessage } from '../types';
import Step2Diagnosis from './Step2Diagnosis';
import MoneyModelAnalysis from './MoneyModelAnalysis';
import MoneyModelMechanisms from './MoneyModelMechanisms';
import Step3Offers from './Step3Offers';
import DownsellOffer from './DownsellOffer';
import Step4ProfitPath from './Step4ProfitPath';
import Step5MarketingModel from './Step5MarketingModel';
import MoneyModelFunnel from './MoneyModelFunnel';
import OperationsPlan from './OperationsPlan';
import SalesFunnel from './SalesFunnel';
import KpiDashboard from './KpiDashboard';
import AccountabilityTracker from './AccountabilityTracker';
import PlaybookChat from './PlaybookChat';

interface FullPlaybookProps {
    playbook: GeneratedPlaybook;
    onPreviewAsset: (item: OfferStackItem) => void;
    onDownloadAssetBundle: (offer: GeneratedOffer) => void;
    chatHistory: ChatMessage[];
    isChatLoading: boolean;
    onSendMessage: (message: string) => void;
    isStatic?: boolean;
}

interface PlaybookStepProps {
    number: number;
    title: string;
    subtitle: string;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    isStatic?: boolean;
}

const PlaybookStep: React.FC<PlaybookStepProps> = ({ number, title, subtitle, children, isOpen, onToggle, isStatic }) => {
    const headerContent = (
        <div className="relative pl-12 md:pl-16">
             <div className="absolute left-0 top-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-yellow-400 text-gray-900 font-black text-2xl rounded-full">
                {number}
            </div>
            <div className="pl-4 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{title}</h2>
                    <p className="text-gray-400 mb-2">{subtitle}</p>
                </div>
                {!isStatic && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`playbook-step-toggle-icon h-8 w-8 text-yellow-300 transform transition-transform flex-shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                )}
            </div>
        </div>
    );
    const isExpanded = isStatic || isOpen;

    return (
        <section className="playbook-step">
            {isStatic ? headerContent : <button onClick={onToggle} className="w-full text-left">{headerContent}</button>}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden playbook-step-content ${isExpanded ? 'max-h-full opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                {children}
            </div>
        </section>
    );
};


const FullPlaybook: React.FC<FullPlaybookProps> = ({ 
    playbook, 
    onPreviewAsset,
    onDownloadAssetBundle,
    chatHistory,
    isChatLoading,
    onSendMessage,
    isStatic = false,
}) => {
  const [openStep, setOpenStep] = useState<number | null>(isStatic ? -1 : 1);

  const toggleStep = (stepNumber: number) => {
    if (isStatic) return;
    setOpenStep(openStep === stepNumber ? null : stepNumber);
  };
  
  const allSteps = [
    { number: 1, title: 'Your Diagnosis', subtitle: 'The simple truth about your business right now.', component: <Step2Diagnosis diagnosis={playbook.diagnosis} /> },
    { number: 2, title: 'Your Money Plan', subtitle: 'The before-and-after of how you make money.', component: <MoneyModelAnalysis analysis={playbook.moneyModelAnalysis} /> },
    { number: 3, title: 'Your Money Toolkit', subtitle: 'Four powerful ways to get paid.', component: <MoneyModelMechanisms moneyModelMechanisms={playbook.moneyModelMechanisms} /> },
    { number: 4, title: 'Your Offers', subtitle: 'The irresistible deals that will grow your business.', component: <Step3Offers offer1={playbook.offer1} offer2={playbook.offer2} onPreviewAsset={onPreviewAsset} onDownloadAssetBundle={onDownloadAssetBundle} isStatic={isStatic} /> },
    { number: 5, title: 'Your "Hello" Offer', subtitle: 'A simple, low-cost offer to attract new customers.', component: <DownsellOffer downsell={playbook.downsell} onPreviewAsset={onPreviewAsset} onDownloadAssetBundle={() => onDownloadAssetBundle(playbook.downsell.offer)} isStatic={isStatic}/> },
    { number: 6, title: 'Your Profit Path', subtitle: 'Four steps to make more money from every customer.', component: <Step4ProfitPath profitPath={playbook.profitPath} isStatic={isStatic} /> },
    { number: 7, title: 'Your Marketing Model', subtitle: 'Four ways to find your ideal customers.', component: <Step5MarketingModel marketingModel={playbook.marketingModel} isStatic={isStatic} /> },
    { number: 8, title: 'Your Money Funnel', subtitle: 'The step-by-step customer journey to profit.', component: <MoneyModelFunnel moneyModel={playbook.moneyModel} /> },
    { number: 9, title: 'Your Sales Funnel', subtitle: 'How to turn strangers into buyers.', component: <SalesFunnel salesFunnel={playbook.salesFunnel} /> },
    { number: 10, title: 'Your Operations Plan', subtitle: 'The simple way to run your business.', component: <OperationsPlan operationsPlan={playbook.operationsPlan} /> },
    { number: 11, title: 'Your Scorecard', subtitle: 'The key numbers that tell you if you\'re winning.', component: <KpiDashboard kpiDashboard={playbook.kpiDashboard} /> },
    { number: 12, title: 'Your Growth Tracker', subtitle: 'The simple way to test ideas and track what works.', component: <AccountabilityTracker tracker={playbook.accountabilityTracker} isStatic={isStatic} /> },
  ];

  return (
    <div className="space-y-8">
      {allSteps.map(step => (
        <PlaybookStep 
          key={step.number}
          number={step.number}
          title={step.title}
          subtitle={step.subtitle}
          isOpen={isStatic ? true : openStep === step.number}
          onToggle={() => toggleStep(step.number)}
          isStatic={isStatic}
        >
          {step.component}
        </PlaybookStep>
      ))}

      {!isStatic && (
        <div className="pt-8">
            <PlaybookChat 
                history={chatHistory}
                isLoading={isChatLoading}
                onSendMessage={onSendMessage}
            />
        </div>
      )}
    </div>
  );
};

export default FullPlaybook;