
import React from 'react';
import { GeneratedDiagnosis } from '../types';
import Card from './common/Card';
import CopyableBlock from './common/CopyableBlock';

interface MiniReportViewProps {
  diagnosis: GeneratedDiagnosis;
  onGenerateFullPlan: () => void;
  onDownloadReport: () => void;
}

const MiniReportView: React.FC<MiniReportViewProps> = ({ diagnosis, onGenerateFullPlan, onDownloadReport }) => {
  return (
    <Card>
      <div className="text-center">
        <h2 className="text-3xl font-black text-white">Your Free AI Clarity Report</h2>
        <p className="text-xl font-bold text-yellow-400 mt-2">Ready to Send to Your Prospect!</p>
        <p className="text-gray-400 mt-4 max-w-3xl mx-auto">
          We analyzed your prospect's business and created a custom, high-value asset to send them for free. This builds massive trust and opens the door to a sale.
        </p>
      </div>
      
      <div className="my-8 grid md:grid-cols-2 gap-8">
        <div className="bg-gray-900/50 p-6 rounded-lg border border-red-500/50">
          <h3 className="text-xl font-bold text-white mb-4">The "Stuck Points" This Solves</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            {diagnosis.constraints.map((constraint, index) => <li key={index}>{constraint}</li>)}
          </ul>
        </div>
        <div className="bg-gray-900/50 p-6 rounded-lg border border-green-500/50">
          <h3 className="text-xl font-bold text-white mb-4">Their First Action Steps</h3>
          <ul className="list-decimal list-inside space-y-2 text-gray-300">
            {diagnosis.actions.map((action, index) => <li key={index}>{action}</li>)}
          </ul>
        </div>
      </div>

      <div className="my-8 bg-gray-900/50 p-6 rounded-lg border border-yellow-400/50">
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Your Prospect's "Crown Jewel" Asset</h3>
        <div>
            <h4 className="font-semibold text-yellow-400">The Rationale (Why this is so valuable for them):</h4>
            <p className="text-gray-300 text-sm mt-2">{diagnosis.freeValueAsset.rationale}</p>
        </div>
        <CopyableBlock 
            title={diagnosis.freeValueAsset.name}
            content={diagnosis.freeValueAsset.assetContent}
        />
      </div>

      <div className="my-8 bg-gray-900/50 p-6 rounded-lg border border-blue-400/50">
        <h3 className="text-2xl font-bold text-white mb-2 text-center">Your Outreach Script</h3>
        <p className="text-center text-gray-400 text-sm mb-4">Copy this message and send it to your prospect to offer them their free report.</p>
        <CopyableBlock 
            title="Cold Outreach Message:"
            content={diagnosis.outreachScriptForUser}
        />
      </div>


      <div className="text-center space-y-4 border-t border-gray-700 pt-8">
        <p className="text-lg text-gray-300">
          This free asset is just the hook. Your full plan includes the irresistible core offers, marketing model, and financial plan to close this client and scale your business.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button
                onClick={onDownloadReport}
                className="px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-500 transition-colors transform hover:scale-105"
            >
                Download Their Report (PDF)
            </button>
            <button
                onClick={onGenerateFullPlan}
                className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold text-xl rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 animate-pulse"
            >
                Build My Full Plan!
            </button>
        </div>
      </div>
    </Card>
  );
};

export default MiniReportView;