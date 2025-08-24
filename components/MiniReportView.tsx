
import React from 'react';
import { GeneratedDiagnosis } from '../types';
import Card from './common/Card';

interface MiniReportViewProps {
  diagnosis: GeneratedDiagnosis;
  onGenerateFullPlan: () => void;
  onDownloadReport: () => void;
}

const MiniReportView: React.FC<MiniReportViewProps> = ({ diagnosis, onGenerateFullPlan, onDownloadReport }) => {
  return (
    <Card>
      <div className="text-center">
        <h2 className="text-3xl font-black text-white">The Trust Builder Offer</h2>
        <p className="text-xl font-bold text-yellow-400 mt-2">Your Free AI Mini Business Clarity Report is Ready!</p>
        <p className="text-gray-400 mt-4 max-w-3xl mx-auto">Based on your Instagram, here’s a quick diagnosis of your business using the principles of Alex Hormozi. This is the first step to unlocking massive growth.</p>
      </div>
      
      <div className="my-8 grid md:grid-cols-2 gap-8">
        <div className="bg-gray-900/50 p-6 rounded-lg border border-red-500/50">
          <h3 className="text-xl font-bold text-white mb-4">Your Biggest "Stuck Points"</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            {diagnosis.constraints.map((constraint, index) => <li key={index}>{constraint}</li>)}
          </ul>
        </div>
        <div className="bg-gray-900/50 p-6 rounded-lg border border-green-500/50">
          <h3 className="text-xl font-bold text-white mb-4">Your First Action Steps</h3>
          <ul className="list-decimal list-inside space-y-2 text-gray-300">
            {diagnosis.actions.map((action, index) => <li key={index}>{action}</li>)}
          </ul>
        </div>
      </div>

      <div className="text-center space-y-4 border-t border-gray-700 pt-8">
        <p className="text-lg text-gray-300">
          This is just the tip of the iceberg. Your full plan includes irresistible offers, a step-by-step marketing model, and a complete financial plan to help you grow.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button
                onClick={onDownloadReport}
                className="px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-500 transition-colors transform hover:scale-105"
            >
                Download Your Free Report (PDF)
            </button>
            <button
                onClick={onGenerateFullPlan}
                className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold text-xl rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 animate-pulse"
            >
                Create My Full Plan!
            </button>
        </div>
      </div>
    </Card>
  );
};

export default MiniReportView;
