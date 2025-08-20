
import React, { useState, useCallback } from 'react';
import { BusinessData, GeneratedPlaybook, OfferStackItem, GeneratedOffer, ChatMessage } from './types';
import { 
    generateDiagnosis, generateMoneyModelAnalysis, generateMoneyModel, 
    generateMoneyModelMechanisms, generateOperationsPlan, generateOffer1, 
    generateOffer2, generateDownsell, generateProfitPath, 
    generateMarketingModel, generateSalesFunnel, generateKpiDashboard,
    generateAccountabilityTracker, generateAssetContent, generateChatResponseStream 
} from './services/hormoziAiService';

import Step1Form from './components/Step1Form';
import ProgressBar from './components/common/ProgressBar';
import FullPlaybook from './components/FullPlaybook';
import OfferPreviewModal from './components/OfferPreviewModal';
import DropdownButton from './components/common/DropdownButton';
import AllPdfs from './components/pdf/AllPdfs';
import ReactDOM from 'react-dom/client';
import AllHtml from './components/html/AllHtml';
import CircularProgress from './components/common/CircularProgress';
import Card from './components/common/Card';


const App: React.FC = () => {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [playbook, setPlaybook] = useState<GeneratedPlaybook | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Starting...');
  
  const [pdfGenConfig, setPdfGenConfig] = useState<{ type: string; assetBundle?: GeneratedOffer | null; singleAsset?: NonNullable<OfferStackItem['asset']> | null; } | null>(null);

  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const [error, setError] = useState<string | null>(null);
  const [generatingAsset, setGeneratingAsset] = useState<OfferStackItem | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [assetToPreview, setAssetToPreview] = useState<OfferStackItem | null>(null);

  const handleGeneratePlan = useCallback(async (submittedBusinessData: BusinessData) => {
    setBusinessData(submittedBusinessData);
    setIsLoading(true);
    setLoadingProgress(0);
    setError(null);
    setPlaybook(null);

    try {
        const fullPlaybook: Partial<GeneratedPlaybook> = {};
        const steps = [
            { name: "Analyzing Your Business...", fn: () => generateDiagnosis(submittedBusinessData), key: 'diagnosis' },
            { name: "Building Your Money Plan...", fn: () => generateMoneyModelAnalysis(submittedBusinessData), key: 'moneyModelAnalysis' },
            { name: "Creating Your Money Toolkit...", fn: () => generateMoneyModelMechanisms(submittedBusinessData), key: 'moneyModelMechanisms' },
            { name: "Designing Your Money Funnel...", fn: () => generateMoneyModel(submittedBusinessData), key: 'moneyModel' },
            { name: "Crafting Your Best Offers...", fn: () => generateOffer1(submittedBusinessData), key: 'offer1' },
            { name: "Creating a Second Offer...", fn: () => generateOffer2(submittedBusinessData), key: 'offer2' },
            { name: "Making a 'Hello' Offer...", fn: () => generateDownsell(submittedBusinessData), key: 'downsell' },
            { name: "Finding Your Customer Path...", fn: () => generateMarketingModel(submittedBusinessData), key: 'marketingModel' },
            { name: "Building Your Sales Funnel...", fn: () => generateSalesFunnel(submittedBusinessData), key: 'salesFunnel' },
            { name: "Designing Your Profit Steps...", fn: () => generateProfitPath(submittedBusinessData), key: 'profitPath' },
            { name: "Planning Your Daily Actions...", fn: () => generateOperationsPlan(submittedBusinessData), key: 'operationsPlan' },
            { name: "Setting Up Your Scorecard...", fn: () => generateKpiDashboard(submittedBusinessData), key: 'kpiDashboard' },
            { name: "Creating Your Growth Tracker...", fn: () => generateAccountabilityTracker(submittedBusinessData), key: 'accountabilityTracker' },
        ];
        
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

        for (let i = 0; i < steps.length; i++) {
            setLoadingText(steps[i].name);
            // @ts-ignore
            fullPlaybook[steps[i].key] = await steps[i].fn();
            setLoadingProgress(((i + 1) / steps.length) * 100);
            if (i < steps.length - 1) await delay(2000);
        }
        
        const finalPlaybook = fullPlaybook as GeneratedPlaybook;
        setLoadingText('Plan Complete!');
        setPlaybook(finalPlaybook);

    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
        console.error(err);
        setBusinessData(null);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleStartOver = () => {
    const confirmed = window.confirm("Are you sure you want to start a new plan? Your current plan will be lost.");
    if (confirmed) {
        setPlaybook(null);
        setBusinessData(null);
        setError(null);
        setIsLoading(false);
        setChatHistory([]);
    }
  };
  
  const processAllAssets = async (playbookToProcess: GeneratedPlaybook) => {
    if (!businessData) return playbookToProcess;

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const allOffers = [playbookToProcess.offer1, playbookToProcess.offer2, playbookToProcess.downsell.offer];
    const totalAssets = allOffers.reduce((sum, offer) => sum + offer.stack.filter(item => item.asset).length, 0);
    let assetsProcessed = 0;

    const processOffer = async (offer: GeneratedOffer) => {
        const processedStack: OfferStackItem[] = [];
        for (const item of offer.stack) {
            if (!item.asset) {
                processedStack.push(item);
                continue;
            }
            let newContent = item.asset.content;
            if (!item.asset.content || item.asset.content.trim() === '' || item.asset.content.length < 50) {
                newContent = await generateAssetContent(item, businessData);
                await delay(2000);
            }
            assetsProcessed++;
            setDownloadProgress((assetsProcessed / totalAssets) * 80);
            processedStack.push({ ...item, asset: { ...item.asset, content: newContent }});
        }
        return { ...offer, stack: processedStack };
    };

    const processedOffer1 = await processOffer(playbookToProcess.offer1);
    const processedOffer2 = await processOffer(playbookToProcess.offer2);
    const processedDownsellOffer = await processOffer(playbookToProcess.downsell.offer);

    return {
        ...playbookToProcess,
        offer1: processedOffer1,
        offer2: processedOffer2,
        downsell: { ...playbookToProcess.downsell, offer: processedDownsellOffer }
    };
  };

  const handlePreviewAsset = useCallback(async (item: OfferStackItem) => {
    if (!item.asset || !businessData) {
        setError("Cannot preview asset: Missing asset details or business context.");
        return;
    }
    
    setGeneratingAsset(item);
    if (!item.asset.content || item.asset.content.trim() === '' || item.asset.content.length < 50) {
        try {
            const newContent = await generateAssetContent(item, businessData);
            const updatedItem = { ...item, asset: { ...item.asset, content: newContent } };
            
            // Update the main playbook state so the content is persisted
            if (playbook) {
                const newPlaybook = JSON.parse(JSON.stringify(playbook)); // Deep copy
                [newPlaybook.offer1, newPlaybook.offer2, newPlaybook.downsell.offer].forEach(offer => {
                    const stackItem = offer.stack.find((si: OfferStackItem) => si.solution === item.solution);
                    if (stackItem) {
                        stackItem.asset.content = newContent;
                    }
                });
                setPlaybook(newPlaybook);
            }
            setAssetToPreview(updatedItem);

        } catch (err) {
            setError(err instanceof Error ? `Asset Generation Failed: ${err.message}` : 'An unknown error occurred during asset generation.');
        } finally {
            setGeneratingAsset(null);
        }
    } else {
        setAssetToPreview(item);
        setGeneratingAsset(null);
    }
  }, [businessData, playbook]);

  const handleDownloadHtml = async () => {
    if (!playbook || !businessData) return;
    setIsDownloading(true);
    setDownloadProgress(0);
    try {
        const processedPlaybook = await processAllAssets(playbook);
        setDownloadProgress(85);
        
        // Render the component to a string
        const tempDiv = document.createElement('div');
        const tempRoot = ReactDOM.createRoot(tempDiv);
        
        const htmlPromise = new Promise<void>(resolve => {
            tempRoot.render(<AllHtml playbook={processedPlaybook} businessData={businessData} />);
            setTimeout(() => {
                const content = tempDiv.innerHTML;
                const fullHtml = generateOfflineIndexHtml(content, processedPlaybook, businessData);
                setDownloadProgress(95);

                // Trigger download
                const blob = new Blob([fullHtml], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Hormozi_AI_Business_Plan.html';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                setDownloadProgress(100);
                tempRoot.unmount();
                resolve();
            }, 1000); // Allow time for render
        });

        await htmlPromise;

    } catch (err) {
        setError(err instanceof Error ? `HTML Download Failed: ${err.message}` : 'An unknown error occurred during HTML download.');
    } finally {
        setIsDownloading(false);
    }
  };

  const generateOfflineIndexHtml = (reactHtml: string, playbookData: GeneratedPlaybook, businessInfo: BusinessData): string => {
    const escapeHtml = (unsafe: string | undefined | null) => (unsafe || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    
    // The main react-rendered content is passed in as `reactHtml`.
    // We just need to wrap it in a full HTML document structure with styles.
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hormozi AI Business Plan for ${escapeHtml(businessInfo.businessType)}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #111827; color: #E5E7EB; margin: 0; padding: 2rem; line-height: 1.6; }
        .container { max-width: 900px; margin: auto; }
        h1, h2, h3, h4, h5, h6 { color: white; }
        /* Playbook Step Styles */
        .playbook-step { margin-bottom: 2rem; }
        .playbook-step .relative { padding-left: 4rem; }
        .playbook-step .absolute { position: absolute; left: 0; top: 0; display: flex; align-items: center; justify-content: center; width: 3rem; height: 3rem; background-color: #FBBF24; color: #111827; font-weight: 900; font-size: 1.5rem; border-radius: 9999px; }
        .playbook-step h2 { font-size: 2rem; font-weight: 900; color: white; }
        .playbook-step p { color: #9CA3AF; }
        .playbook-step-content { margin-top: 2rem; }
        /* Card Styles */
        .bg-gray-800 { background-color: #1F2937; }
        .border-gray-700 { border-color: #374151; }
        .rounded-xl { border-radius: 0.75rem; }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); }
        .p-6 { padding: 1.5rem; }
        .md\\:p-8 { padding: 2rem; }
        .text-yellow-400 { color: #FBBF24; }
        .border-b-2 { border-bottom-width: 2px; }
        .pb-2 { padding-bottom: 0.5rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .font-black { font-weight: 900; }
        /* Accordion */
        .strategy-toggle-icon { display: none; }
        .strategy-content { max-height: unset !important; }
        /* Other component styles */
        .text-white { color: #fff; }
        .text-gray-400 { color: #9CA3AF; }
        .text-gray-200 { color: #E5E7EB; }
        .space-y-8 > * + * { margin-top: 2rem; }
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        .lg\\:grid-cols-2 { @media (min-width: 1024px) { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        .gap-8 { gap: 2rem; }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .flex-grow { flex-grow: 1; }
        .italic { font-style: italic; }
        .line-through { text-decoration: line-through; }
        .text-red-500 { color: #EF4444; }
        .text-green-400 { color: #4ADE80; }
        .bg-gray-800\\/50 { background-color: rgba(31, 41, 55, 0.5); }
        .bg-gray-700\\/60 { background-color: rgba(55, 65, 81, 0.6); }
        .bg-gray-900\\/50 { background-color: rgba(17, 24, 39, 0.5); }
        .rounded-lg { border-radius: 0.5rem; }
        .border-l-2 { border-left-width: 2px; }
        .border-gray-600 { border-color: #4B5563; }
        .p-4 { padding: 1rem; }
        .space-y-3 > * + * { margin-top: 0.75rem; }
        .justify-between { justify-content: space-between; }
        .items-start { align-items: flex-start; }
        .whitespace-nowrap { white-space: nowrap; }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .mt-auto { margin-top: auto; }
        .pt-4 { padding-top: 1rem; }
        .border-t { border-top-width: 1px; }
        .text-2xl { font-size: 1.5rem; }
        .text-4xl { font-size: 2.25rem; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 50% { opacity: .5; } }
        .bg-blue-900\\/20 { background-color: rgba(30, 58, 138, 0.2); }
        .border-blue-700 { border-color: #1D4ED8; }
        .text-blue-300 { color: #93C5FD; }
        .border-l-4 { border-left-width: 4px; }
        .rounded-r-lg { border-top-right-radius: 0.5rem; border-bottom-right-radius: 0.5rem; }
        .text-lg { font-size: 1.125rem; }
        pre { white-space: pre-wrap; font-family: monospace; }
        .whitespace-pre-wrap { white-space: pre-wrap; }
        .bg-black\\/20 { background-color: rgba(0,0,0,0.2); }
    </style>
</head>
<body>
    <div class="container">
        <header style="text-align: center; border-bottom: 4px solid #FBBF24; padding-bottom: 1.5rem; margin-bottom: 2rem;">
            <h1 style="font-size: 3rem; font-weight: 900; margin: 0; color: white;">Your Hormozi AI Business Plan</h1>
            <p style="color: #9CA3AF;">for ${escapeHtml(businessInfo.businessType)}</p>
        </header>
        ${reactHtml}
    </div>
</body>
</html>`;
  };

  const downloadOptions = [
    { label: 'Full Playbook (PDF)', onClick: () => setPdfGenConfig({ type: 'full' }) },
    { label: 'Business Scorecard (KPIs)', onClick: () => setPdfGenConfig({ type: 'kpi-dashboard' }) },
    { label: 'Growth Tracker', onClick: () => setPdfGenConfig({ type: 'accountability-tracker' }) },
    { label: 'Money Making Plan (CFA)', onClick: () => setPdfGenConfig({ type: 'cfa-model' }) },
    { label: 'Offer Presentation', onClick: () => setPdfGenConfig({ type: 'offer-presentation' }) },
    { label: 'Concepts Guide', onClick: () => setPdfGenConfig({ type: 'concepts-guide' }) },
    { label: 'Marketing: Landing Page', onClick: () => setPdfGenConfig({ type: 'landing-page' }) },
    { label: 'Marketing: Offer Flyer', onClick: () => setPdfGenConfig({ type: 'downsell-pamphlet' }) },
    { label: 'Marketing: Customer Follow-Up', onClick: () => setPdfGenConfig({ type: 'tripwire-followup' }) },
  ];

  if (pdfGenConfig && playbook && businessData) {
    return (
      <div className="bg-gray-300 min-h-screen">
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center print:hidden sticky top-0 z-10 shadow-lg">
          <h3 className="font-bold text-lg">PDF Preview</h3>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-400 hidden md:block">Use your browser's "Save as PDF" option in the print menu.</p>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-md hover:bg-yellow-300 transition-colors"
            >
              Print / Save PDF
            </button>
            <button
              onClick={() => setPdfGenConfig(null)}
              className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 transition-colors"
            >
              Back to Plan
            </button>
          </div>
        </div>
        <div className="p-4 flex justify-center">
            <div className="bg-white shadow-2xl">
                 <AllPdfs playbook={playbook} businessData={businessData} {...pdfGenConfig} />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {error && <div className="bg-red-500 text-white p-4 rounded-lg mb-4 text-center">{error}</div>}
      
      {isLoading && <ProgressBar progress={loadingProgress} loadingText={loadingText} />}

      {!isLoading && !playbook && <Step1Form onSubmit={handleGeneratePlan} />}

      {playbook && businessData && !isLoading && (
        <div>
          <header className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-4 z-10 border border-gray-700">
            <h1 className="text-2xl font-bold text-white text-center md:text-left">Your Business Plan is Ready!</h1>
            <div className="flex items-center gap-2 flex-wrap justify-center">
                <button onClick={handleStartOver} className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-colors transform hover:scale-105">
                    Start Over
                </button>
                <DropdownButton
                    label="Download Options"
                    isLoading={isDownloading && downloadProgress < 100}
                    progress={downloadProgress}
                    options={downloadOptions}
                />
                <button 
                    onClick={handleDownloadHtml} 
                    disabled={isDownloading}
                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait"
                >
                    {isDownloading ? <CircularProgress progress={downloadProgress} /> : 'Download HTML'}
                </button>
            </div>
          </header>

          <FullPlaybook 
            playbook={playbook} 
            onPreviewAsset={handlePreviewAsset}
            chatHistory={chatHistory}
            isChatLoading={isChatLoading}
            onSendMessage={() => {}}
            onDownloadAssetBundle={(offer) => setPdfGenConfig({ type: 'assetBundle', assetBundle: offer })}
          />
        </div>
      )}

      {assetToPreview && (
        <OfferPreviewModal 
          asset={assetToPreview.asset!} 
          onClose={() => setAssetToPreview(null)}
          onDownload={() => setPdfGenConfig({type: 'singleAsset', singleAsset: assetToPreview.asset!})}
        />
      )}
       {generatingAsset && (
         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <Card>
                <h3 className="text-xl font-bold text-yellow-400 text-center">Generating Your Asset...</h3>
                <p className="text-center mt-2">"{generatingAsset.asset?.name}"</p>
                <div className="mt-4">
                    <ProgressBar progress={100} loadingText="Please wait..." />
                </div>
            </Card>
         </div>
      )}
    </div>
  );
};

export default App;
