
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
                <Title>Mini Clarity Report</Title>
                <Subtitle>A custom-built, high-value asset for your <strong className="text-gray-800">{businessData.businessType}</strong>.</Subtitle>
            </header>

            <main>
                <P>This report is designed to give you an immediate, actionable tool. We've analyzed your business to create a powerful asset you can use right now to start getting results.</P>
                
                <SectionTitle>Part 1: The Quick Diagnosis</SectionTitle>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">Your Biggest "Stuck Points"</h3>
                        <P className="text-sm">These are the problems your new free asset will help solve.</P>
                        <ul className="list-disc list-inside space-y-2 mt-2">
                            {diagnosis.constraints.map((constraint, i) => (
                                <li key={i} className="text-red-800 font-semibold">{constraint}</li>
                            ))}
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-bold text-lg text-gray-800">Your First Action Steps</h3>
                        <P className="text-sm">This is the path forward. Notice how this asset helps with step #1.</P>
                        <ul className="list-decimal list-inside space-y-2 mt-2">
                            {diagnosis.actions.map((action, i) => (
                                <li key={i} className="text-green-800 font-semibold">{action}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <SectionTitle>Part 2: Your "Crown Jewel" Free Asset</SectionTitle>
                <div className="p-6 bg-gray-50 border-2 border-gray-200 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-800">The Rationale (Why This is So Valuable)</h3>
                    <P>{diagnosis.freeValueAsset.rationale}</P>
                </div>
                
                <div className="mt-6 p-6 bg-blue-50 border-l-8 border-blue-300 rounded-r-lg">
                    <h3 className="text-xl font-bold text-blue-800">{diagnosis.freeValueAsset.name}</h3>
                    <P>Here is your complete, ready-to-use asset:</P>
                    <pre className="mt-4 p-4 bg-white border border-blue-200 rounded-md text-sm text-gray-700 whitespace-pre-wrap font-sans">
                        {diagnosis.freeValueAsset.assetContent}
                    </pre>
                </div>

            </main>

            <footer className="mt-12 pt-8 border-t-4 border-yellow-400 text-center">
                <h3 className="text-2xl font-bold text-gray-800">This is Just the Beginning...</h3>
                <P>This free asset is just the hook. A full, personalized business playbook can provide the complete step-by-step plans, irresistible core offers, and marketing materials you need to achieve your goals.</P>
                <div className="mt-4 p-4 bg-yellow-400 text-gray-900 font-bold text-xl rounded-lg">
                    Ready to grow? Let's build your full plan!
                </div>
            </footer>
        </div>
    );
};

export default MiniClarityReportPdf;