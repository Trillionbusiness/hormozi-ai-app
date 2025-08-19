import React from 'react';
import { GeneratedAccountabilityTracker, TrackerPhase } from '../../types';

// --- Reusable PDF Components ---
const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => <h1 className="text-4xl font-black text-gray-900 tracking-tight">{children}</h1>;
const Subtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="text-lg text-gray-600 mt-2">{children}</p>;
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-yellow-400 pb-3 mb-6 mt-10 break-after-avoid">{children}</h2>;
const P: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <p className={`text-base text-gray-700 leading-relaxed ${className || ''}`}>{children}</p>;

const PhaseWorksheet: React.FC<{ phase: TrackerPhase }> = ({ phase }) => (
    <div className="break-before-page pt-10">
        <SectionTitle>Phase {phase.phaseNumber}: {phase.title}</SectionTitle>
        <div className="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg text-center">
             <h3 className="text-xl font-bold text-yellow-800">Your Goal For This Phase:</h3>
             <p className="text-lg text-gray-700 italic mt-1">"{phase.goal}"</p>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Key Actions To Complete</h3>
        <div className="space-y-4">
            {phase.actions.map(action => (
                 <div key={action.id} className="p-4 bg-white rounded-lg border-2 border-gray-300 shadow-sm break-inside-avoid">
                     <div className="flex items-start">
                        <div className="w-8 h-8 border-2 border-gray-400 rounded-md mt-1 flex-shrink-0"></div>
                        <div className="ml-4">
                            <p className="font-bold text-gray-800">{action.description}</p>
                            <p className="text-sm text-gray-500 mt-1">📈 Metric to Watch: {action.metric}</p>
                        </div>
                     </div>
                     <div className="mt-4 ml-12">
                         <label className="font-semibold text-sm text-gray-600">Results & Learnings:</label>
                         <div className="mt-1 w-full h-20 bg-gray-100 border border-gray-300 rounded p-2">
                            {/* Empty space for writing */}
                         </div>
                     </div>
                 </div>
            ))}
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Daily Checklist</h3>
        <div className="p-4 bg-blue-50 border-l-8 border-blue-300 rounded-r-lg">
             <ul className="space-y-2">
                {phase.dailyChecklist.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                        <div className="w-6 h-6 border-2 border-blue-300 rounded mr-3"></div>
                        <span>{item}</span>
                    </li>
                ))}
             </ul>
        </div>
    </div>
);


const AccountabilityTrackerPdf: React.FC<{ tracker: GeneratedAccountabilityTracker }> = ({ tracker }) => {
  return (
    <div className="p-12 bg-white font-sans text-gray-900">
        <header className="text-center mb-10">
            <Title>{tracker.title}</Title>
            <Subtitle>"{tracker.corePrinciple}"</Subtitle>
        </header>
        <P className="text-center mb-8">This is your printable action plan. Complete each phase to build unstoppable momentum. Your goal is simple: take action, learn, and repeat.</P>
        <main>
            {tracker.phases.map((phase) => (
                <PhaseWorksheet key={phase.phaseNumber} phase={phase} />
            ))}
        </main>
    </div>
  );
};

export default AccountabilityTrackerPdf;