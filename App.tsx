
import React, { useState, useCallback, useEffect } from 'react';
import { BusinessData, GeneratedPlaybook, OfferStackItem, GeneratedOffer, ChatMessage, GeneratedDiagnosis } from './types';
import { 
    generateDiagnosis, generateMoneyModelAnalysis, generateMoneyModel, 
    generateMoneyModelMechanisms, generateOperationsPlan, generateOffer1, 
    generateOffer2, generateDownsell, generateProfitPath, 
    generateMarketingModel, generateSalesFunnel, generateKpiDashboard,
    generateAccountabilityTracker, generateAssetContent, generateBusinessDataFromInstagram 
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import MiniReportView from './components/MiniReportView';
import InstagramInputForm from './components/InstagramInputForm';


const App: React.FC = () => {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [playbook, setPlaybook] = useState<Partial<GeneratedPlaybook> | null>(null);
  const [generationStage, setGenerationStage] = useState<'instagramInput' | 'reviewData' | 'miniReport' | 'fullPlan'>('instagramInput');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Starting...');

  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const [error, setError] = useState<string | null>(null);
  const [generatingAsset, setGeneratingAsset] = useState<OfferStackItem | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [assetToPreview, setAssetToPreview] = useState<OfferStackItem | null>(null);

  const [triggerFullPlan, setTriggerFullPlan] = useState(false);

  const handleGenerateMiniReportFromInstagram = useCallback(async (url: string) => {
    setIsLoading(true);
    setLoadingProgress(0);
    setError(null);
    setPlaybook(null);
    setBusinessData(null);

    try {
        setLoadingText("Analyzing your Instagram profile...");
        setLoadingProgress(25);
        const dataFromAI = await generateBusinessDataFromInstagram(url);
        setBusinessData(dataFromAI);
        
        setLoadingText("Generating your free report...");
        setLoadingProgress(75);
        const diagnosis = await generateDiagnosis(dataFromAI);
        
        await new Promise(res => setTimeout(res, 500));
        setLoadingProgress(100);
        setLoadingText("Your free report is ready!");
        
        setPlaybook({ diagnosis });
        setGenerationStage('miniReport');

    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred. Please check the URL and try again.');
        console.error(err);
        setGenerationStage('instagramInput'); // Reset on error
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleGenerateFullPlan = useCallback(async () => {
    if (!businessData || !playbook?.diagnosis) {
        setError("Missing business data or initial diagnosis. Please start over.");
        setGenerationStage('instagramInput');
        return;
    }
    
    setIsLoading(true);
    setLoadingProgress(0);
    setError(null);
    setGenerationStage('fullPlan'); // Move to full plan view immediately to show progress bar
    
    try {
        const fullPlaybook: Partial<GeneratedPlaybook> = { diagnosis: playbook.diagnosis };
        
        const steps = [
            { name: "Building Your Money Plan...", fn: () => generateMoneyModelAnalysis(businessData), key: 'moneyModelAnalysis' },
            { name: "Creating Your Money Toolkit...", fn: () => generateMoneyModelMechanisms(businessData), key: 'moneyModelMechanisms' },
            { name: "Designing Your Money Funnel...", fn: () => generateMoneyModel(businessData), key: 'moneyModel' },
            { name: "Crafting Your Best Offers...", fn: () => generateOffer1(businessData), key: 'offer1' },
            { name: "Creating a Second Offer...", fn: () => generateOffer2(businessData), key: 'offer2' },
            { name: "Making a 'Hello' Offer...", fn: () => generateDownsell(businessData), key: 'downsell' },
            { name: "Finding Your Customer Path...", fn: () => generateMarketingModel(businessData), key: 'marketingModel' },
            { name: "Building Your Sales Funnel...", fn: () => generateSalesFunnel(businessData), key: 'salesFunnel' },
            { name: "Designing Your Profit Steps...", fn: () => generateProfitPath(businessData), key: 'profitPath' },
            { name: "Planning Your Daily Actions...", fn: () => generateOperationsPlan(businessData), key: 'operationsPlan' },
            { name: "Setting Up Your Scorecard...", fn: () => generateKpiDashboard(businessData), key: 'kpiDashboard' },
            { name: "Creating Your Growth Tracker...", fn: () => generateAccountabilityTracker(businessData), key: 'accountabilityTracker' },
        ];
        
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

        for (let i = 0; i < steps.length; i++) {
            setLoadingText(steps[i].name);
            // @ts-ignore
            fullPlaybook[steps[i].key] = await steps[i].fn();
            setPlaybook(prev => ({...prev, ...fullPlaybook})); // Update playbook state progressively
            setLoadingProgress(((i + 1) / steps.length) * 100);
            if (i < steps.length - 1) await delay(2000);
        }
        
        const finalPlaybook = fullPlaybook as GeneratedPlaybook;
        setLoadingText('Plan Complete!');
        setPlaybook(finalPlaybook);

    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  }, [businessData, playbook?.diagnosis]);

  // Effect to trigger full plan generation after data confirmation
  useEffect(() => {
    if (triggerFullPlan) {
      handleGenerateFullPlan();
      setTriggerFullPlan(false); // Reset trigger
    }
  }, [triggerFullPlan, handleGenerateFullPlan]);
  
  const handleProceedToFullPlan = () => {
    setGenerationStage('reviewData');
  };

  const handleConfirmAndGenerateFullPlan = (confirmedBusinessData: BusinessData) => {
    setBusinessData(confirmedBusinessData);
    setTriggerFullPlan(true);
  };
  
  const handleStartOver = () => {
    const confirmed = window.confirm("Are you sure you want to start a new plan? Your current progress will be lost.");
    if (confirmed) {
        setPlaybook(null);
        setBusinessData(null);
        setError(null);
        setIsLoading(false);
        setChatHistory([]);
        setGenerationStage('instagramInput');
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
            setDownloadProgress((assetsProcessed / totalAssets) * 50);
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
            
            if (playbook) {
                const newPlaybook = JSON.parse(JSON.stringify(playbook));
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
  
  const handleDownloadPdf = async (config: { type: string; assetBundle?: GeneratedOffer | null; singleAsset?: NonNullable<OfferStackItem['asset']> | null; }) => {
    if (!playbook || !businessData) return;

    setIsDownloading(true);
    setDownloadProgress(0);

    const sanitizeFilename = (name: string) => name.replace(/[\\/:*?"<>|]/g, '').replace(/ /g, '_');

    const filenames: {[key: string]: string} = {
        'full': 'Full_Business_Playbook.pdf',
        'kpi-dashboard': 'Business_Scorecard.pdf',
        'accountability-tracker': 'Growth_Tracker.pdf',
        'cfa-model': 'Money_Making_Plan.pdf',
        'offer-presentation': 'Offer_Presentation.pdf',
        'concepts-guide': 'Concepts_Guide.pdf',
        'landing-page': 'Landing_Page_Copy.pdf',
        'downsell-pamphlet': 'Offer_Flyer.pdf',
        'tripwire-followup': 'Customer_Follow-Up.pdf',
        'mini-clarity-report': 'AI_Mini_Clarity_Report.pdf',
        'assetBundle': sanitizeFilename(`${config.assetBundle?.name}_Asset_Bundle.pdf`),
        'singleAsset': sanitizeFilename(`${config.singleAsset?.name}.pdf`),
    };

    const filename = filenames[config.type] || 'Hormozi_AI_Plan.pdf';

    try {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '0';
        container.style.top = '0';
        container.style.zIndex = '-1';
        document.body.appendChild(container);
        
        const root = ReactDOM.createRoot(container);
        root.render(<AllPdfs playbook={playbook as GeneratedPlaybook} businessData={businessData} {...config} />);

        await new Promise(resolve => setTimeout(resolve, 1500));
        setDownloadProgress(25);

        const content = container.querySelector('div');
        if (!content) throw new Error("Could not find rendered content for PDF generation.");

        const canvas = await html2canvas(content, {
            scale: 2,
            useCORS: true,
            logging: false,
            windowWidth: content.scrollWidth,
            windowHeight: content.scrollHeight,
        });
        setDownloadProgress(75);

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: 'a4' });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = pdfWidth / canvasWidth;
        const imgHeight = canvasHeight * ratio;
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position -= pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save(filename);
        setDownloadProgress(100);

        root.unmount();
        document.body.removeChild(container);
        
    } catch (err) {
        setError(err instanceof Error ? `PDF Download Failed: ${err.message}` : 'An unknown error occurred during PDF download.');
        console.error(err);
    } finally {
        setIsDownloading(false);
    }
  };

  const handleDownloadHtml = async () => {
    if (!playbook || !businessData) return;
    setIsDownloading(true);
    setDownloadProgress(0);
    try {
        const processedPlaybook = await processAllAssets(playbook as GeneratedPlaybook);
        setDownloadProgress(85);
        
        const tempDiv = document.createElement('div');
        const tempRoot = ReactDOM.createRoot(tempDiv);
        
        const htmlPromise = new Promise<void>(resolve => {
            tempRoot.render(<AllHtml playbook={processedPlaybook} businessData={businessData} />);
            setTimeout(() => {
                const content = tempDiv.innerHTML;
                const fullHtml = generateOfflineIndexHtml(content, processedPlaybook, businessData);
                setDownloadProgress(95);

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
            }, 1000);
        });

        await htmlPromise;

    } catch (err) {
        setError(err instanceof Error ? `HTML Download Failed: ${err.message}` : 'An unknown error occurred during HTML download.');
    } finally {
        setIsDownloading(false);
    }
  };
  
  const handleDownloadZip = async () => {
    if (!playbook || !businessData) return;
    setIsDownloading(true);
    setDownloadProgress(0);
    try {
        const processedPlaybook = await processAllAssets(playbook as GeneratedPlaybook);
        setDownloadProgress(50);

        const zip = new JSZip();
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '-9999px';
        container.style.top = '-9999px';
        document.body.appendChild(container);
        
        const root = ReactDOM.createRoot(container);
        
        root.render(<AllPdfs playbook={processedPlaybook} businessData={businessData} type="all" />);
        await new Promise(resolve => setTimeout(resolve, 2000));

        const docElements = container.querySelectorAll<HTMLElement>('[data-pdf-output]');
        const totalDocs = docElements.length;

        for (let i = 0; i < totalDocs; i++) {
            const element = docElements[i];
            const content = element.firstChild as HTMLElement;
            if (!content) continue;

            const path = element.dataset.pdfPath || `document_${i + 1}.pdf`;

            const canvas = await html2canvas(content, { scale: 2, useCORS: true, logging: false, windowWidth: content.scrollWidth, windowHeight: content.scrollHeight });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: 'a4' });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = pdfWidth / canvasWidth;
            const imgHeight = canvasHeight * ratio;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position -= pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
            
            const pdfBlob = pdf.output('blob');
            zip.file(path, pdfBlob);

            setDownloadProgress(50 + ((i + 1) / totalDocs) * 50);
        }
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Hormozi_AI_Business_Plan_Kit.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        root.unmount();
        document.body.removeChild(container);

    } catch (err) {
        setError(err instanceof Error ? `ZIP Download Failed: ${err.message}` : 'An unknown error occurred during ZIP download.');
    } finally {
        setIsDownloading(false);
    }
  };

  const generateOfflineIndexHtml = (reactHtml: string, playbookData: GeneratedPlaybook, businessInfo: BusinessData): string => {
    const escapeHtml = (unsafe: string | undefined | null) => (unsafe || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    
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
        .playbook-step { margin-bottom: 2rem; }
        .playbook-step .relative { padding-left: 4rem; }
        .playbook-step .absolute { position: absolute; left: 0; top: 0; display: flex; align-items: center; justify-content: center; width: 3rem; height: 3rem; background-color: #FBBF24; color: #111827; font-weight: 900; font-size: 1.5rem; border-radius: 9999px; }
        .playbook-step h2 { font-size: 2rem; font-weight: 900; color: white; }
        .playbook-step p { color: #9CA3AF; }
        .playbook-step-content { margin-top: 2rem; }
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
        .strategy-toggle-icon { display: none; }
        .strategy-content { max-height: unset !important; }
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
    { label: 'Full Playbook (PDF)', onClick: () => handleDownloadPdf({ type: 'full' }) },
    { label: 'AI Mini Clarity Report', onClick: () => handleDownloadPdf({ type: 'mini-clarity-report' }) },
    { label: 'Business Scorecard (KPIs)', onClick: () => handleDownloadPdf({ type: 'kpi-dashboard' }) },
    { label: 'Growth Tracker', onClick: () => handleDownloadPdf({ type: 'accountability-tracker' }) },
    { label: 'Money Making Plan (CFA)', onClick: () => handleDownloadPdf({ type: 'cfa-model' }) },
    { label: 'Offer Presentation', onClick: () => handleDownloadPdf({ type: 'offer-presentation' }) },
    { label: 'Concepts Guide', onClick: () => handleDownloadPdf({ type: 'concepts-guide' }) },
    { label: 'Marketing: Landing Page', onClick: () => handleDownloadPdf({ type: 'landing-page' }) },
    { label: 'Marketing: Offer Flyer', onClick: () => handleDownloadPdf({ type: 'downsell-pamphlet' }) },
    { label: 'Marketing: Customer Follow-Up', onClick: () => handleDownloadPdf({ type: 'tripwire-followup' }) },
  ];

  const renderContent = () => {
    if (isLoading && generationStage !== 'fullPlan') {
        return <ProgressBar progress={loadingProgress} loadingText={loadingText} />;
    }

    switch (generationStage) {
        case 'instagramInput':
            return <InstagramInputForm onSubmit={handleGenerateMiniReportFromInstagram} />;
        case 'reviewData':
            return <Step1Form 
                        onSubmit={handleConfirmAndGenerateFullPlan}
                        initialData={businessData}
                        submitButtonText="Confirm & Generate Full Plan"
                    />;
        case 'miniReport':
            return playbook?.diagnosis ? (
                <MiniReportView
                    diagnosis={playbook.diagnosis as GeneratedDiagnosis}
                    onGenerateFullPlan={handleProceedToFullPlan}
                    onDownloadReport={() => handleDownloadPdf({ type: 'mini-clarity-report' })}
                />
            ) : null;
        case 'fullPlan':
             if (isLoading) {
                return <ProgressBar progress={loadingProgress} loadingText={loadingText} />;
            }
            return playbook?.accountabilityTracker && businessData ? (
                <div>
                    <header className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-4 z-10 border border-gray-700">
                        <h1 className="text-2xl font-bold text-white text-center md:text-left">Your Business Plan is Ready!</h1>
                        <div className="flex items-center gap-2 flex-wrap justify-center">
                            <button onClick={handleStartOver} className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-colors transform hover:scale-105">
                                Start Over
                            </button>
                            <DropdownButton
                                label="Download PDFs"
                                isLoading={isDownloading}
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
                            <button 
                                onClick={handleDownloadZip} 
                                disabled={isDownloading}
                                className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-colors transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait"
                            >
                                {isDownloading ? <CircularProgress progress={downloadProgress} /> : 'Download All (ZIP)'}
                            </button>
                        </div>
                    </header>
        
                    <FullPlaybook 
                        playbook={playbook as GeneratedPlaybook} 
                        onPreviewAsset={handlePreviewAsset}
                        chatHistory={chatHistory}
                        isChatLoading={isChatLoading}
                        onSendMessage={() => {}}
                        onDownloadAssetBundle={(offer) => handleDownloadPdf({ type: 'assetBundle', assetBundle: offer })}
                    />
                </div>
            ) : <ProgressBar progress={loadingProgress} loadingText={loadingText} />; // Show progress while loading full plan
        default:
            return <InstagramInputForm onSubmit={handleGenerateMiniReportFromInstagram} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {error && <div className="bg-red-500 text-white p-4 rounded-lg mb-4 text-center">{error}</div>}
      
      {renderContent()}

      {assetToPreview && (
        <OfferPreviewModal 
          asset={assetToPreview.asset!} 
          onClose={() => setAssetToPreview(null)}
          onDownload={() => handleDownloadPdf({type: 'singleAsset', singleAsset: assetToPreview.asset!})}
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
