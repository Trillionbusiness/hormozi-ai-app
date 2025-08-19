
import React from 'react';
import { GeneratedMoneyModel, MoneyModelStep } from '../../types';

// --- Reusable PDF Components ---
const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => <h1 className="text-5xl font-black text-gray-900 tracking-tight">{children}</h1>;
const Subtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="text-xl text-gray-600 mt-2">{children}</p>;
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-yellow-400 pb-3 mb-6 mt-10 break-after-avoid">{children}</h2>;
const Paragraph: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <p className={`text-base text-gray-700 leading-relaxed my-3 ${className}`}>{children}</p>;
const HighlightBox: React.FC<{ children: React.ReactNode, title?: string, color?: 'yellow' | 'blue' }> = ({ children, title, color = 'yellow' }) => {
    const bgColor = color === 'yellow' ? 'bg-yellow-50' : 'bg-blue-50';
    const borderColor = color === 'yellow' ? 'border-yellow-200' : 'border-blue-200';
    const titleColor = color === 'yellow' ? 'text-yellow-800' : 'text-blue-800';
    return (
        <div className={`p-6 rounded-lg border ${borderColor} ${bgColor} my-4 break-inside-avoid`}>
            {title && <h3 className={`text-xl font-bold ${titleColor} mb-2`}>{title}</h3>}
            {children}
        </div>
    );
};

// --- PDF Content Sections ---
const TitleSection: React.FC<{ model: GeneratedMoneyModel }> = ({ model }) => (
    <header className="text-center mb-12 pb-6 border-b-8 border-yellow-400">
        <p className="text-yellow-500 font-bold uppercase tracking-widest">Your Guide To</p>
        <Title>{model.title}</Title>
        <Subtitle>A step-by-step plan to get new customers and have them pay for your growth.</Subtitle>
    </header>
);

const CorePrincipleSection: React.FC<{ model: GeneratedMoneyModel }> = ({ model }) => (
    <div className="break-inside-avoid">
        <SectionTitle>The Big Idea: What We're Trying To Do</SectionTitle>
        <HighlightBox title="Your #1 Goal with this Model">
            <p className="text-2xl text-center font-bold text-gray-800 italic">"{model.corePrinciple}"</p>
        </HighlightBox>
        <Paragraph>In simple terms, this means for every new customer you get, you should make enough money from them very quickly (within 30 days) to pay for all your costs to get them, and then have plenty of money left over.</Paragraph>
        <Paragraph>This is the secret to fast growth. Instead of spending your own money to get customers and waiting months to make it back, your customers are giving you the money to find even more customers. It's like a money-making machine!</Paragraph>
        <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-gray-800">What is CAC? (Customer Acquisition Cost)</h4>
                <Paragraph className="text-sm">This is how much money it costs you to get one new customer. If you spend $100 on ads and get 10 new customers, your CAC is $10.</Paragraph>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-gray-800">What is COGS? (Cost of Goods Sold)</h4>
                <Paragraph className="text-sm">This is the direct cost to deliver your service or product. For a coach, it might be the cost of software. For a gym, it's part of the rent and utilities for that member.</Paragraph>
            </div>
        </div>
    </div>
);

const PsychologySection: React.FC = () => (
     <div className="break-inside-avoid">
        <SectionTitle>Why This Step-by-Step Method Works</SectionTitle>
        <Paragraph>People don't like to make big, expensive decisions right away. It's scary! This model works because it's like making friends before asking for a big favor.</Paragraph>
        <HighlightBox title="The Psychology: The 'Foot-in-the-Door' Technique" color="blue">
            <Paragraph>This is a classic persuasion principle. If you can get someone to agree to a small request (like buying a cheap offer), they are much more likely to agree to a larger request later (buying your main offer). The first 'yes' is the hardest to get. This model is designed to get that first 'yes' as easily as possible.</Paragraph>
        </HighlightBox>
    </div>
);

const FunnelDiagramSection: React.FC<{ steps: MoneyModelStep[] }> = ({ steps }) => (
    <div className="break-inside-avoid">
        <SectionTitle>Your Money Model at a Glance</SectionTitle>
        <Paragraph>Here is how a customer will journey through your offers, from stranger to happy client.</Paragraph>
        <div className="space-y-2 mt-4">
            {steps.sort((a,b) => a.stepNumber - b.stepNumber).map((step, index) => (
                <div key={index} className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-400 text-gray-900 font-bold w-12 h-12 rounded-full flex items-center justify-center text-xl">{step.stepNumber}</div>
                    <div className="mx-4 text-2xl font-light text-gray-400">&rarr;</div>
                    <div className="p-4 bg-gray-100 rounded-lg flex-grow border border-gray-200">
                        <p className="font-bold text-gray-800">{step.title}</p>
                        <p className="text-sm text-gray-600">{step.offerName} at <span className="font-bold">{step.price}</span></p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const StepDetailSection: React.FC<{ step: MoneyModelStep }> = ({ step }) => (
    <div className="break-before-page pt-10">
        <SectionTitle>Deep Dive: Step {step.stepNumber} - {step.title}</SectionTitle>
        <HighlightBox title={step.offerName + ' - ' + step.price}>
            <p className="font-mono text-sm uppercase tracking-wider text-blue-700 bg-blue-100 inline-block px-2 py-1 rounded">{step.hormoziTactic}</p>
        </HighlightBox>
        
        <div className="grid grid-cols-2 gap-6">
            <div>
                <h3 className="font-bold text-lg text-gray-800">The "Why" Behind This Step</h3>
                <Paragraph>{step.rationale}</Paragraph>
            </div>
             <div>
                <h3 className="font-bold text-lg text-gray-800">The Goal Of This Step</h3>
                <Paragraph>Your only job here is to achieve the specific outcome this step is designed for. Don't try to upsell too early. Just deliver amazing value.</Paragraph>
            </div>
        </div>

        <h3 className="font-bold text-lg text-gray-800 mt-6">How to Execute This Step</h3>
        <Paragraph className="whitespace-pre-wrap">{step.details}</Paragraph>

        <div className="mt-6 p-4 border border-red-200 bg-red-50 rounded-lg break-inside-avoid">
            <h4 className="font-bold text-red-800">Common Pitfalls to Avoid</h4>
            <ul className="list-disc list-inside text-sm text-red-700 mt-2">
                <li>Trying to sell the next step before you've delivered value on this one.</li>
                <li>Making the offer too complicated. It should be a simple, clear "yes".</li>
                <li>Not having a clear follow-up plan for what happens after they buy.</li>
            </ul>
        </div>
    </div>
);

const SummarySection: React.FC<{ model: GeneratedMoneyModel }> = ({ model }) => (
    <div className="break-before-page pt-10">
        <SectionTitle>Putting It All Together</SectionTitle>
        <Paragraph>{model.summary}</Paragraph>
        <HighlightBox title="Why This Is So Powerful">
            <Paragraph>By following this model, you are creating a predictable system for growth. You're no longer guessing where your next customer will come from. You have a clear path that takes a stranger, turns them into a customer, and uses the money they give you to find the next one. This is how businesses scale predictably and profitably.</Paragraph>
        </HighlightBox>
        <Paragraph>Your next step is to build out the offers for each step of this model. Focus on making each one so good that it's an easy "yes" for your ideal customer.</Paragraph>
    </div>
);

interface CfaModelPdfProps {
  moneyModel: GeneratedMoneyModel;
}

const CfaModelPdf: React.FC<CfaModelPdfProps> = ({ moneyModel }) => {
  return (
    <div className="p-12 bg-white font-sans text-gray-900">
      <TitleSection model={moneyModel} />
      <main>
        <CorePrincipleSection model={moneyModel} />
        <PsychologySection />
        <FunnelDiagramSection steps={moneyModel.steps} />
        {moneyModel.steps.sort((a,b) => a.stepNumber - b.stepNumber).map(step => (
            <StepDetailSection key={step.stepNumber} step={step} />
        ))}
        <SummarySection model={moneyModel} />
      </main>
    </div>
  );
};

export default CfaModelPdf;
