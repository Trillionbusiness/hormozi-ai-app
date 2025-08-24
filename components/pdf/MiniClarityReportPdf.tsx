
import React from 'react';
import { BusinessData, GeneratedPlaybook } from '../../types';

// --- Reusable PDF Components ---
const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => <h1 className="text-4xl font-black text-gray-900 tracking-tight">{children}</h1>;
const Subtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="text-lg text-gray-600 mt-2">{children}</p>;
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-yellow-400 pb-2 mb-4 mt-8">{children}</h2>;
const P: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <p className={`text-base text-gray-700 leading-relaxed my-3 ${className || ''}`}>{children}</p>;

interface MiniClarityReportPdfProps {
  businessData: BusinessData;
  playbook: GeneratedPlaybook;
}

const MiniClarityReportPdf: React.FC<MiniClarityReportPdfProps> = ({ businessData, playbook }) => {
    const { diagnosis } = playbook;

    return (
        <div className="p-12 bg-white font-sans text-gray-900">
            <header className="text-center mb-8 pb-4 border-b-4 border-yellow-400">
                <p className="text-yellow-500 font-bold uppercase tracking-widest">Your Free</p>
                <Title>AI Mini Business Clarity Report</Title>
                <Subtitle>A quick analysis for your <strong className="text-gray-800">{businessData.businessType}</strong>.</Subtitle>
            </header>

            <main>
                <P>This report is designed to give you immediate clarity. We've analyzed the information you provided to identify the biggest things holding you back and the most important actions you can take right now to move forward.</P>
                
                <SectionTitle>Your Biggest Growth Opportunities (The "Stuck Points")</SectionTitle>
                <P>Every business has bottlenecks. Based on our analysis, these are the primary constraints slowing down your growth. Solving these is your top priority.</P>
                <div className="space-y-3 mt-4">
                    {diagnosis.constraints.map((constraint, i) => (
                        <div key={i} className="p-4 bg-red-50 border-l-4 border-red-400">
                            <p className="text-red-800 font-semibold text-lg">{constraint}</p>
                        </div>
                    ))}
                </div>

                <SectionTitle>Your First 3 Action Steps</SectionTitle>
                <P>Don't try to do everything at once. Focus is key. Here are the simple, high-impact steps to take to start making progress immediately.</P>
                 <div className="space-y-3 mt-4">
                    {diagnosis.actions.slice(0, 3).map((action, i) => (
                         <div key={i} className="flex items-start p-4 bg-green-50 border-l-4 border-green-500">
                            <div className="flex-shrink-0 text-2xl font-bold text-green-700 mr-3">{i + 1}.</div>
                            <p className="text-green-800 font-semibold text-lg">{action}</p>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="mt-12 pt-8 border-t-4 border-yellow-400 text-center">
                <h3 className="text-2xl font-bold text-gray-800">This is Just the Beginning...</h3>
                <P>This mini-report is just a tiny glimpse of what's possible. Your full, personalized business playbook contains the complete step-by-step plans, offers, marketing materials, and tools you need to achieve your goals.</P>
                <div className="mt-4 p-4 bg-yellow-400 text-gray-900 font-bold text-xl rounded-lg">
                    Ready to unlock your full plan? Get started today!
                </div>
            </footer>
        </div>
    );
};

export default MiniClarityReportPdf;
