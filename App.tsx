
declare var JSZip: any;
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth, handleSignOut } from './services/firebaseService';
import { BusinessData, GeneratedPlaybook, OfferStackItem, GeneratedOffer, ChatMessage, UserData } from './types';
import { 
    generateDiagnosis, generateMoneyModelAnalysis, generateMoneyModel, 
    generateMoneyModelMechanisms, generateOperationsPlan, generateOffer1, 
    generateOffer2, generateDownsell, generateProfitPath, 
    generateMarketingModel, generateSalesFunnel, generateKpiDashboard,
    generateAccountabilityTracker, generateAssetContent, generateChatResponseStream 
} from './services/hormoziAiService';
import { saveUserData, getUserData } from './services/firebaseService';

import Step1Form from './components/Step1Form';
import ProgressBar from './components/common/ProgressBar';
import CircularProgress from './components/common/CircularProgress';
import FullPlaybook from './components/FullPlaybook';
import DropdownButton from './components/common/DropdownButton';
import AllPdfs from './components/pdf/AllPdfs';
import OfferPreviewModal from './components/OfferPreviewModal';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Starting...');

  const [pdfProgress, setPdfProgress] = useState(0);
  const [zipProgress, setZipProgress] = useState(0);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [pdfType, setPdfType] = useState<string | null>(null);
  const [assetForPdf, setAssetForPdf] = useState<NonNullable<OfferStackItem['asset']> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatingAsset, setGeneratingAsset] = useState<OfferStackItem | null>(null);
  const [assetBundleForPdf, setAssetBundleForPdf] = useState<GeneratedOffer | null>(null);
  const [generatingAssetBundleFor, setGeneratingAssetBundleFor] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [showAllPdfsForZip, setShowAllPdfsForZip] = useState(false);
  const [processedPlaybookForZip, setProcessedPlaybookForZip] = useState<GeneratedPlaybook | null>(null);
  const [assetToPreview, setAssetToPreview] = useState<OfferStackItem | null>(null);

  const pdfSingleRenderRef = useRef<HTMLDivElement>(null);
  const pdfAssetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        setFirebaseUser(user);
        // Fetch user data from Firestore
        const userData = await getUserData(user.uid);
        if (userData) {
          setCurrentUserData(userData);
        } else {
          // New user, create a default profile
          const newUser: UserData = {
            uid: user.uid,
            email: user.email!,
            playbook: null,
            businessData: null,
          };
          await saveUserData(newUser);
          setCurrentUserData(newUser);
        }
      } else {
        setFirebaseUser(null);
        setCurrentUserData(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGenerate = useCallback(async (data: BusinessData) => {
    if (!firebaseUser) {
        setError("You must be logged in to create a plan.");
        return;
    }

    setIsLoading(true);
    setCurrentUserData(prev => prev ? { ...prev, businessData: data, playbook: null } : null);
    setLoadingProgress(0);

    try {
        const fullPlaybook: Partial<GeneratedPlaybook> = {};
        const steps = [
            { name: "Analyzing Your Business...", fn: () => generateDiagnosis(data), key: 'diagnosis' },
            { name: "Building Your Money Plan...", fn: () => generateMoneyModelAnalysis(data), key: 'moneyModelAnalysis' },
            { name: "Creating Your Money Toolkit...", fn: () => generateMoneyModelMechanisms(data), key: 'moneyModelMechanisms' },
            { name: "Designing Your Money Funnel...", fn: () => generateMoneyModel(data), key: 'moneyModel' },
            { name: "Crafting Your Best Offers...", fn: () => generateOffer1(data), key: 'offer1' },
            { name: "Creating a Second Offer...", fn: () => generateOffer2(data), key: 'offer2' },
            { name: "Making a 'Hello' Offer...", fn: () => generateDownsell(data), key: 'downsell' },
            { name: "Finding Your Customer Path...", fn: () => generateMarketingModel(data), key: 'marketingModel' },
            { name: "Building Your Sales Funnel...", fn: () => generateSalesFunnel(data), key: 'salesFunnel' },
            { name: "Designing Your Profit Steps...", fn: () => generateProfitPath(data), key: 'profitPath' },
            { name: "Planning Your Daily Actions...", fn: () => generateOperationsPlan(data), key: 'operationsPlan' },
            { name: "Setting Up Your Scorecard...", fn: () => generateKpiDashboard(data), key: 'kpiDashboard' },
            { name: "Creating Your Growth Tracker...", fn: () => generateAccountabilityTracker(data), key: 'accountabilityTracker' },
        ];
        
        for (let i = 0; i < steps.length; i++) {
            setLoadingText(steps[i].name);
            // @ts-ignore
            fullPlaybook[steps[i].key] = await steps[i].fn();
            setLoadingProgress(((i + 1) / steps.length) * 100);
        }
        
        const finalPlaybook = fullPlaybook as GeneratedPlaybook;
        setLoadingText('Plan Complete!');
        
        const updatedUserData: UserData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            businessData: data,
            playbook: finalPlaybook,
        };
        
        await saveUserData(updatedUserData);
        setCurrentUserData(updatedUserData);

    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  }, [firebaseUser]);
  
  const handleLogout = () => {
      handleSignOut();
  };

  const handleStartNew = async () => {
    if (!currentUserData) return;
    const confirmed = window.confirm("Are you sure you want to start a new plan? Your current plan will be replaced.");
    if (confirmed) {
        const updatedUserData: UserData = {
            ...currentUserData,
            playbook: null,
            businessData: null
        };
        await saveUserData(updatedUserData);
        setCurrentUserData(updatedUserData);
        // Reset local state
        setError(null);
        setIsLoading(false);
        setChatHistory([]);
    }
  }

  const prepareAndDownloadPdf = useCallback((type: string) => {
    if (isGeneratingPdf || isZipping) return;
    setAssetBundleForPdf(null);
    setAssetForPdf(null);
    setPdfType(type);
    setIsGeneratingPdf(true);
    setPdfProgress(0);
  }, [isGeneratingPdf, isZipping]);
  
  const prepareAndDownloadAssetPdf = useCallback(async (item: OfferStackItem) => {
    if (!item.asset || !currentUserData?.businessData || isGeneratingPdf || isZipping) {
        if (!item.asset || !currentUserData?.businessData) setError("Cannot generate asset: Missing asset details or business context.");
        return;
    }
    
    setAssetBundleForPdf(null);
    setPdfType(null);
    setIsGeneratingPdf(true);
    setPdfProgress(0);
    setGeneratingAsset(item);
    
    try {
        let contentToUse = item.asset.content;
        
        setPdfProgress(25);
        if (!contentToUse || contentToUse.trim() === '' || contentToUse.length < 50) {
            contentToUse = await generateAssetContent(item, currentUserData.businessData);
        }
        setPdfProgress(75);

        setAssetForPdf({
            ...item.asset,
            name: item.asset.name,
            content: contentToUse
        });
        
    } catch (err) {
        setError(err instanceof Error ? `Asset Generation Failed: ${err.message}` : 'An unknown error occurred during asset generation.');
        setIsGeneratingPdf(false);
        setGeneratingAsset(null);
    }
  }, [currentUserData?.businessData, isGeneratingPdf, isZipping]);
  
  const prepareAndDownloadAssetBundlePdf = useCallback(async (offer: GeneratedOffer) => {
    if (!currentUserData?.businessData || isGeneratingPdf || isZipping) {
        if(!currentUserData?.businessData) setError("Cannot generate assets: Missing business context.");
        return;
    }

    setIsGeneratingPdf(true);
    setPdfProgress(0);
    setGeneratingAssetBundleFor(offer.name);
    setPdfType(null);
    setAssetForPdf(null);

    try {
        const totalAssets = offer.stack.filter(item => item.asset).length;
        let assetsProcessed = 0;
        
        const processedStack = await Promise.all(
            offer.stack.map(async (item) => {
                if (!item.asset) return item;
                let newContent = item.asset.content;
                if (!item.asset.content || item.asset.content.trim() === '' || item.asset.content.length < 50) {
                    newContent = await generateAssetContent(item, currentUserData.businessData!);
                }
                assetsProcessed++;
                setPdfProgress((assetsProcessed / totalAssets) * 90); // Process up to 90%
                return { ...item, asset: { ...item.asset, content: newContent } };
            })
        );
        
        const offerWithContent = { ...offer, stack: processedStack };
        setAssetBundleForPdf(offerWithContent);
        
    } catch (err) {
        setError(err instanceof Error ? `Asset Bundle Generation Failed: ${err.message}` : 'An unknown error occurred during asset bundle generation.');
        setIsGeneratingPdf(false);
        setGeneratingAssetBundleFor(null);
    }
  }, [currentUserData?.businessData, isGeneratingPdf, isZipping]);

  const processAllAssets = async (playbookToProcess: GeneratedPlaybook) => {
    if (!currentUserData?.businessData) return playbookToProcess;

    const allOffers = [playbookToProcess.offer1, playbookToProcess.offer2, playbookToProcess.downsell.offer];
    const totalAssets = allOffers.reduce((sum, offer) => sum + offer.stack.filter(item => item.asset).length, 0);
    let assetsProcessed = 0;

    const processOffer = async (offer: GeneratedOffer) => {
        const processedStack = await Promise.all(
            offer.stack.map(async (item) => {
                if (!item.asset) return item;
                let newContent = item.asset.content;
                if (!item.asset.content || item.asset.content.trim() === '' || item.asset.content.length < 50) {
                    newContent = await generateAssetContent(item, currentUserData.businessData!);
                }
                assetsProcessed++;
                setZipProgress((assetsProcessed / totalAssets) * 50); // Asset processing is first 50%
                return { ...item, asset: { ...item.asset, content: newContent }};
            })
        );
        return { ...offer, stack: processedStack };
    };

    const [processedOffer1, processedOffer2, processedDownsellOffer] = await Promise.all([
        processOffer(playbookToProcess.offer1),
        processOffer(playbookToProcess.offer2),
        processOffer(playbookToProcess.downsell.offer)
    ]);

    return {
        ...playbookToProcess,
        offer1: processedOffer1,
        offer2: processedOffer2,
        downsell: { ...playbookToProcess.downsell, offer: processedDownsellOffer }
    };
  };

  const handleDownloadAll = async () => {
    if (!currentUserData?.playbook || isZipping || isGeneratingPdf) return;
    setIsZipping(true);
    setZipProgress(0);
    setError(null);
    try {
      const processed = await processAllAssets(currentUserData.playbook);
      setProcessedPlaybookForZip(processed);
      setShowAllPdfsForZip(true);
    } catch(err) {
      setError(err instanceof Error ? `Asset Processing Failed: ${err.message}` : 'An unknown error occurred while preparing assets.');
      setIsZipping(false);
    }
  };

  const handlePreviewAsset = useCallback(async (item: OfferStackItem) => {
    if (!item.asset || !currentUserData?.businessData) {
        setError("Cannot preview asset: Missing asset details or business context.");
        return;
    }
    
    if (!item.asset.content || item.asset.content.trim() === '' || item.asset.content.length < 50) {
        try {
            const newContent = await generateAssetContent(item, currentUserData.businessData);
            setAssetToPreview({ ...item, asset: { ...item.asset, content: newContent } });
        } catch (err) {
            setError(err instanceof Error ? `Asset Generation Failed: ${err.message}` : 'An unknown error occurred during asset generation.');
        }
    } else {
        setAssetToPreview(item);
    }
  }, [currentUserData?.businessData]);

  const generateOfflineIndexHtml = (playbook: GeneratedPlaybook, businessData: BusinessData): string => {
    const sanitizeName = (name: string) => name.replace(/[\\/:*?"<>|]/g, '').replace(/ /g, '_');
    
    const assetLinks = (offer: GeneratedOffer, folderPath: string) => 
        offer.stack.filter(i => i.asset).map(item => 
            `<li><a href="./${folderPath}/${sanitizeName(item.asset.type)}_${sanitizeName(item.asset.name)}.pdf" download>${item.asset.name}</a></li>`
        ).join('');

    const offerSection = (offer: GeneratedOffer, title: string) => {
        const folder = `04_Asset_Library/${sanitizeName(offer.name)}`;
        return `
            <div class="offer-group">
                <h3>${title}: <span class="offer-name">${offer.name}</span></h3>
                <ul>
                    <li><a href="./${folder}/00_Full_Asset_Bundle.pdf" download><strong>Full Asset Bundle (PDF)</strong></a></li>
                    ${assetLinks(offer, folder)}
                </ul>
            </div>`;
    };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hormozi AI Business Plan</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #111827; color: #E5E7EB; margin: 0; padding: 2rem; }
        .container { max-width: 900px; margin: auto; }
        header { text-align: center; border-bottom: 4px solid #FBBF24; padding-bottom: 1.5rem; margin-bottom: 2rem; }
        h1 { font-size: 3rem; font-weight: 900; margin: 0; color: white; }
        h1 span { color: #FBBF24; }
        header p { color: #9CA3AF; font-size: 1.25rem; margin-top: 0.5rem; }
        h2 { font-size: 2rem; font-weight: 900; color: #FBBF24; border-bottom: 2px solid #4B5563; padding-bottom: 0.5rem; margin-top: 3rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        .card { background-color: #1F2937; border: 1px solid #374151; padding: 1.5rem; border-radius: 0.75rem; }
        .card h3 { font-size: 1.5rem; font-weight: 700; color: white; margin-top: 0; margin-bottom: 1rem; }
        ul { list-style: none; padding: 0; }
        li { margin-bottom: 0.75rem; }
        a { color: #60A5FA; text-decoration: none; font-weight: bold; background-color: #374151; padding: 0.5rem 1rem; border-radius: 0.375rem; display: block; transition: background-color 0.2s, color 0.2s; }
        a:hover { background-color: #4B5563; color: white; }
        strong { color: #FBBF24; }
        .offer-group { margin-top: 1.5rem; background-color: #1a222e; padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #FBBF24; }
        .offer-group h3 { margin-top: 0; font-size: 1.25rem; color: #FBBF24;}
        .offer-name { color: white; }
        footer { text-align: center; margin-top: 4rem; font-size: 0.875rem; color: #6B7280; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Your <span>Hormozi AI</span> Business Growth Kit</h1>
            <p>A complete, offline-ready package for your ${businessData.businessType}</p>
        </header>
        <main>
            <div class="grid">
                <div class="card">
                    <h3>🚀 Getting Started</h3>
                    <ul>
                        <li><a href="./00_START_HERE_Guide.pdf" download><strong>START HERE: Read Me First</strong></a></li>
                        <li><a href="./01_Core_Plan/Business_Concepts_Guide.pdf" download>Explain The Concepts</a></li>
                    </ul>
                </div>
                <div class="card">
                    <h3>📝 Core Plan</h3>
                    <ul>
                        <li><a href="./01_Core_Plan/Full_Business_Playbook.pdf" download>Full Business Playbook</a></li>
                        <li><a href="./01_Core_Plan/Business_Scorecard_(KPIs).pdf" download>Business Scorecard (KPIs)</a></li>
                         <li><a href="./01_Core_Plan/Growth_Experiment_Tracker.pdf" download>Growth Experiment Tracker</a></li>
                        <li><a href="./01_Core_Plan/Offer_Presentation_Slides.pdf" download>Offer Presentation Slides</a></li>
                    </ul>
                </div>
                 <div class="card">
                    <h3>💰 Money Models</h3>
                    <ul>
                        <li><a href="./02_Money_Models/Your_Money_Making_Plan.pdf" download>Your Money Making Plan</a></li>
                    </ul>
                </div>
                <div class="card">
                    <h3>📢 Marketing Materials</h3>
                    <ul>
                        <li><a href="./03_Marketing_Materials/High-Converting_Landing_Page.pdf" download>High-Converting Landing Page</a></li>
                        <li><a href="./03_Marketing_Materials/Simple_Offer_Flyer.pdf" download>Simple Offer Flyer</a></li>
                        <li><a href="./03_Marketing_Materials/Customer_Follow-Up_Note.pdf" download>Customer Follow-Up Note</a></li>
                    </ul>
                </div>
            </div>
            
            <h2>📚 Asset Library</h2>
            <div class="card">
                ${offerSection(playbook.offer1, "Grand Slam Offer 1")}
                ${offerSection(playbook.offer2, "Grand Slam Offer 2")}
                ${offerSection(playbook.downsell.offer, "Downsell 'Hello' Offer")}
            </div>
        </main>
        <footer>
            <p>Generated by Hormozi AI. Good luck!</p>
        </footer>
    </div>
</body>
</html>`;
  };

  const handleDownloadHtmlPage = () => {
    if (!currentUserData?.playbook || !currentUserData?.businessData) {
        setError("Cannot generate HTML page: Missing playbook or business data.");
        return;
    }
    try {
        const htmlContent = generateOfflineIndexHtml(currentUserData.playbook, currentUserData.businessData);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "index.html"; // name it index.html so it's easy to replace
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        setError(err instanceof Error ? `HTML Generation Failed: ${err.message}` : 'An unknown error occurred during HTML generation.');
    }
  };

  useEffect(() => {
    if (showAllPdfsForZip && isZipping && processedPlaybookForZip && currentUserData?.businessData) {
      const performZipping = async () => {
          await new Promise(resolve => setTimeout(resolve, 200));
          
          const zip = new JSZip();
          const { jsPDF } = (window as any).jspdf;
          const pdfElements = Array.from(document.querySelectorAll('[data-pdf-output]')) as HTMLElement[];
          let zippingProgress = 50;
          const progressStep = 48 / pdfElements.length;

          for (let i = 0; i < pdfElements.length; i++) {
              const el = pdfElements[i];
              const filePath = el.dataset.pdfPath || `document_${i}.pdf`;
              
              const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
              await pdf.html(el, {
                  autoPaging: 'text',
                  x: 0,
                  y: 0,
                  width: 210, // A4 width
                  windowWidth: 800,
                  margin: 0,
              });
              const blob = pdf.output('blob');
              zip.file(filePath, blob);
              zippingProgress += progressStep;
              setZipProgress(zippingProgress);
          }
          
          const offlineIndexHtml = generateOfflineIndexHtml(processedPlaybookForZip, currentUserData.businessData);
          zip.file('index.html', offlineIndexHtml);
          setZipProgress(99);

          zip.generateAsync({ type: "blob" })
              .then(function(content) {
                  setZipProgress(100);
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(content);
                  link.download = "Hormozi_AI_Business_Plan.zip";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  
                  setShowAllPdfsForZip(false);
                  setProcessedPlaybookForZip(null);
                  setIsZipping(false);
              });
      };
      performZipping();
    }
  }, [showAllPdfsForZip, isZipping, processedPlaybookForZip, currentUserData?.businessData]);

  useEffect(() => {
    if (currentUserData?.playbook && chatHistory.length === 0) {
        setChatHistory([{
            role: 'model',
            content: "I've created your plan. Now, let's make it perfect. Ask me to change a section, give you new ideas, or explain a concept. How can I help?"
        }]);
    }
  }, [currentUserData?.playbook, chatHistory.length]);

  const handleSendMessage = async (message: string) => {
      if (!message.trim() || isChatLoading || !currentUserData?.businessData || !currentUserData?.playbook) return;

      const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: message }];
      setChatHistory(newHistory);
      setIsChatLoading(true);

      try {
          const stream = await generateChatResponseStream(currentUserData.businessData, currentUserData.playbook, newHistory);
          
          let aiResponse = '';
          setChatHistory(prev => [...prev, { role: 'model', content: '' }]);

          for await (const chunk of stream) {
              aiResponse += chunk.text;
              setChatHistory(prev => {
                  const updatedHistory = [...prev];
                  updatedHistory[updatedHistory.length - 1].content = aiResponse;
                  return updatedHistory;
              });
          }

      } catch (err) {
          const errorMessage = err instanceof Error ? `Chat Error: ${err.message}` : 'An unknown chat error occurred.';
          setChatHistory(prev => [...prev, { role: 'model', content: `Sorry, I ran into a problem: ${errorMessage}` }]);
      } finally {
          setIsChatLoading(false);
      }
  };

  useEffect(() => {
    if (!isGeneratingPdf || !currentUserData?.playbook) return;
    if (!pdfType && !assetForPdf && !assetBundleForPdf) return;

    const generatePdf = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));

      setPdfProgress(95);

      let sourceElement: HTMLDivElement | null = null;
      let fileName: string = '';

      if (assetForPdf) {
          sourceElement = pdfAssetRef.current;
          fileName = assetForPdf.name ? `${assetForPdf.name.replace(/ /g, '_')}` : 'Hormozi_AI_Asset';
      } else if (assetBundleForPdf) {
          sourceElement = pdfSingleRenderRef.current;
          fileName = `Hormozi_AI_Assets_${assetBundleForPdf.name.replace(/ /g, '_')}`;
      } else if (pdfType) {
          sourceElement = pdfSingleRenderRef.current;
          fileName = `Hormozi_AI_${pdfType.replace(/ /g, '_')}`;
      }

      if (!sourceElement) {
        setError('Could not find content for PDF.');
        setIsGeneratingPdf(false);
        setPdfType(null); setAssetForPdf(null); setGeneratingAsset(null); setAssetBundleForPdf(null); setGeneratingAssetBundleFor(null);
        return;
      }

      const { jsPDF } = (window as any).jspdf;
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      
      try {
        await pdf.html(sourceElement, {
          callback: (doc) => {
            setPdfProgress(100);
            doc.save(`${fileName}.pdf`);
            setIsGeneratingPdf(false);
            setPdfType(null); setAssetForPdf(null); setGeneratingAsset(null); setAssetBundleForPdf(null); setGeneratingAssetBundleFor(null);
          },
          autoPaging: 'text',
          x: 0, y: 0,
          width: 210, windowWidth: 800, margin: 0
        });
      } catch (err) {
        setError(err instanceof Error ? `PDF Generation Failed: ${err.message}` : 'An unknown error occurred during PDF generation.');
        setIsGeneratingPdf(false);
        setPdfType(null); setAssetForPdf(null); setGeneratingAsset(null); setAssetBundleForPdf(null); setGeneratingAssetBundleFor(null);
      }
    };
    
    generatePdf();
  }, [pdfType, assetForPdf, assetBundleForPdf, isGeneratingPdf, currentUserData?.playbook]);

  const downloadOptions = currentUserData?.playbook ? [
    { label: 'The Full Plan (PDF)', onClick: () => prepareAndDownloadPdf('full') },
    { label: 'Explain The Concepts (PDF)', onClick: () => prepareAndDownloadPdf('concepts-guide') },
    { label: 'Your Business Scorecard (KPIs)', onClick: () => prepareAndDownloadPdf('kpi-dashboard') },
    { label: 'Your Growth Tracker (PDF)', onClick: () => prepareAndDownloadPdf('accountability-tracker') },
    { label: 'A High-Converting Web Page', onClick: () => prepareAndDownloadPdf('landing-page') },
    { label: 'A Presentation For Your Offer', onClick: () => prepareAndDownloadPdf('offer-presentation') },
    { label: 'A Simple Offer Flyer', onClick: () => prepareAndDownloadPdf('downsell-pamphlet') },
    { label: 'A Follow-Up Note', onClick: () => prepareAndDownloadPdf('tripwire-followup') },
    { label: 'Your Money-Making Plan', onClick: () => prepareAndDownloadPdf('cfa-model') },
    { label: 'Offline Dashboard (HTML)', onClick: handleDownloadHtmlPage },
  ] : [];

  const anyFileGenerationInProgress = isGeneratingPdf || isZipping;

  const renderContent = () => {
    if (authLoading) {
      return <div className="text-center p-8">Loading Account...</div>;
    }
    
    if (!firebaseUser) {
      return <Auth setError={setError} />;
    }

    if (isLoading) {
      return <ProgressBar progress={loadingProgress} loadingText={loadingText} />;
    }

    if (currentUserData?.playbook && currentUserData?.businessData) {
      return (
        <div className="space-y-12">
          <FullPlaybook 
            playbook={currentUserData.playbook} 
            onDownloadAsset={prepareAndDownloadAssetPdf}
            isAnyPdfGenerating={anyFileGenerationInProgress}
            generatingAsset={generatingAsset}
            onDownloadAllAssets={prepareAndDownloadAssetBundlePdf}
            generatingAssetBundleFor={generatingAssetBundleFor}
            chatHistory={chatHistory}
            isChatLoading={isChatLoading}
            onSendMessage={handleSendMessage}
            pdfProgress={pdfProgress}
            onPreviewAsset={handlePreviewAsset}
          />
          <div id="playbook-actions" className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
             <button 
              onClick={handleLogout}
              className="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-500 transition-colors"
            >
              Logout
            </button>
             <button 
              onClick={handleStartNew}
              disabled={anyFileGenerationInProgress}
              className="w-full sm:w-auto px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start New Plan
            </button>
             <button 
              onClick={handleDownloadAll}
              disabled={anyFileGenerationInProgress}
              className="w-full sm:w-auto px-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-400 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              style={{minWidth: '180px', minHeight: '52px'}}
            >
              {isZipping ? <CircularProgress progress={zipProgress} /> : 'Download All (ZIP)'}
            </button>
            <DropdownButton
              label="Download Files"
              options={downloadOptions}
              isLoading={(isGeneratingPdf && !!pdfType)}
              progress={pdfProgress}
            />
          </div>
        </div>
      );
    }
    
    return <Step1Form onSubmit={handleGenerate} />;
  };

  return (
    <>
      {assetToPreview && assetToPreview.asset && (
        <OfferPreviewModal 
            asset={assetToPreview.asset} 
            onClose={() => setAssetToPreview(null)} 
        />
      )}
      <div className="flex flex-col items-center p-4 sm:p-6 md:p-8 min-h-screen">
        <header className="w-full max-w-5xl text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            The <span className="text-yellow-400">Hormozi</span> AI
          </h1>
          <p className="text-gray-400 mt-2">Your Simple Path to Business Growth.</p>
           {firebaseUser && <p className="text-sm text-gray-500 mt-1">Logged in as: {firebaseUser.email}</p>}
        </header>
        
        <main className="w-full max-w-5xl flex-grow">
            {error && !isLoading && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg text-center mb-4">
                  <p className="font-bold">Something went wrong.</p>
                  <p className="mt-2 text-sm">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="mt-4 px-4 py-1 bg-yellow-400 text-gray-900 font-bold rounded-md hover:bg-yellow-300 transition-colors text-sm"
                  >
                    Close
                  </button>
              </div>
            )}
            {renderContent()}
        </main>
        
        <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1 }}>
            {currentUserData?.playbook && currentUserData?.businessData && (
              <>
                <div ref={pdfSingleRenderRef} className="w-[800px]">
                    <AllPdfs playbook={currentUserData.playbook} businessData={currentUserData.businessData} type={pdfType} assetBundle={assetBundleForPdf} />
                </div>
                {assetForPdf && (
                  <div ref={pdfAssetRef} className="w-[800px]">
                     <AllPdfs playbook={currentUserData.playbook} businessData={currentUserData.businessData} type="single-asset" singleAsset={assetForPdf} />
                  </div>
                )}
                {showAllPdfsForZip && processedPlaybookForZip && (
                  <AllPdfs playbook={processedPlaybookForZip} businessData={currentUserData.businessData} type="all" />
                )}
              </>
            )}
        </div>

        <footer className="w-full max-w-5xl text-center mt-12 text-gray-500 text-sm">
          <p>This AI provides ideas from Alex Hormozi's books for education. Please talk to a professional for major financial or legal decisions.</p>
        </footer>
      </div>
    </>
  );
};

export default App;
