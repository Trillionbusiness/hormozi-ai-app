
import React, { useState, useCallback, useEffect } from 'react';
import { BusinessData, GeneratedPlaybook, OfferStackItem, GeneratedOffer, ChatMessage, User, Users, GeneratedDiagnosis, GeneratedMoneyModelAnalysis, GeneratedMoneyModelMechanisms, GeneratedDownsell, GeneratedProfitPath, GeneratedMarketingModel, GeneratedMoneyModel, GeneratedSalesFunnel, GeneratedOperationsPlan, GeneratedKpiDashboard, GeneratedAccountabilityTracker } from './types';
import { 
    generateDiagnosis, generateMoneyModelAnalysis, generateMoneyModel, 
    generateMoneyModelMechanisms, generateOperationsPlan, generateOffer1, 
    generateOffer2, generateDownsell, generateProfitPath, 
    generateMarketingModel, generateSalesFunnel, generateKpiDashboard,
    generateAccountabilityTracker, generateAssetContent, generateChatResponseStream 
} from './services/hormoziAiService';

import Step1Form from './components/Step1Form';
import ProgressBar from './components/common/ProgressBar';
import CircularProgress from './components/common/CircularProgress';
import FullPlaybook from './components/FullPlaybook';
import OfferPreviewModal from './components/OfferPreviewModal';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Starting...');

  // Repurposed for HTML download status
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const [error, setError] = useState<string | null>(null);
  const [generatingAsset, setGeneratingAsset] = useState<OfferStackItem | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [assetToPreview, setAssetToPreview] = useState<OfferStackItem | null>(null);

  useEffect(() => {
    try {
      const loggedInUserJson = sessionStorage.getItem('currentUser');
      if (loggedInUserJson) {
        const user: User = JSON.parse(loggedInUserJson);
        setCurrentUser(user);
      }
    } catch (e) {
      console.error("Failed to parse user from session storage", e);
      sessionStorage.removeItem('currentUser');
    }
    setAuthLoading(false);
  }, []);

  const handleSignupAndGenerate = useCallback(async (businessData: BusinessData, credentials: {username: string, password: string}) => {
    const { username, password } = credentials;
    if (!username || !password) {
        setError("Username and password are required.");
        return;
    }
    
    const usersJson = localStorage.getItem('hormoziAiUsers') || '{}';
    const users: Users = JSON.parse(usersJson);

    if (users[username]) {
        setError("Username already exists. Please choose another or log in.");
        return;
    }

    const newUser: User = { username, password, businessData, playbook: null };
    
    setIsLoading(true);
    setLoadingProgress(0);

    try {
        const fullPlaybook: Partial<GeneratedPlaybook> = {};
        const steps = [
            { name: "Analyzing Your Business...", fn: () => generateDiagnosis(businessData), key: 'diagnosis' },
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
            setLoadingProgress(((i + 1) / steps.length) * 100);
            if (i < steps.length - 1) await delay(2000);
        }
        
        const finalPlaybook = fullPlaybook as GeneratedPlaybook;
        setLoadingText('Plan Complete!');
        
        newUser.playbook = finalPlaybook;
        users[username] = { ...newUser };
        localStorage.setItem('hormoziAiUsers', JSON.stringify(users));
        
        const sessionUser = { ...newUser };
        delete sessionUser.password;
        sessionStorage.setItem('currentUser', JSON.stringify(sessionUser));
        setCurrentUser(sessionUser);

    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleLogin = (username: string, password: string): boolean => {
    const usersJson = localStorage.getItem('hormoziAiUsers') || '{}';
    const users: Users = JSON.parse(usersJson);
    const user = users[username];

    if (user && user.password === password) {
      const sessionUser = { ...user };
      delete sessionUser.password;
      sessionStorage.setItem('currentUser', JSON.stringify(sessionUser));
      setCurrentUser(sessionUser);
      setError(null);
      return true;
    } else {
      setError("Invalid username or password.");
      return false;
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    setCurrentUser(null);
    setAuthView('login');
  };

  const handleStartNew = () => {
    if (!currentUser) return;
    const confirmed = window.confirm("Are you sure you want to start a new plan? Your current plan will be replaced.");
    if (confirmed) {
        const updatedUser = { ...currentUser, playbook: null, businessData: null };
        
        const usersJson = localStorage.getItem('hormoziAiUsers') || '{}';
        const users: Users = JSON.parse(usersJson);
        const storedUser = users[currentUser.username];
        if(storedUser) {
            users[currentUser.username] = { ...storedUser, playbook: null, businessData: null };
            localStorage.setItem('hormoziAiUsers', JSON.stringify(users));
        }
        
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        setError(null);
        setIsLoading(false);
        setChatHistory([]);
    }
  };
  
  const processAllAssets = async (playbookToProcess: GeneratedPlaybook) => {
    if (!currentUser?.businessData) return playbookToProcess;

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
                newContent = await generateAssetContent(item, currentUser.businessData!);
                await delay(2000); // Delay after each asset generation
            }
            assetsProcessed++;
            setDownloadProgress((assetsProcessed / totalAssets) * 80); // Asset processing is first 80%
            processedStack.push({ ...item, asset: { ...item.asset, content: newContent }});
        }
        return { ...offer, stack: processedStack };
    };

    // Now process offers serially as well.
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
    if (!item.asset || !currentUser?.businessData) {
        setError("Cannot preview asset: Missing asset details or business context.");
        return;
    }
    
    setGeneratingAsset(item);
    if (!item.asset.content || item.asset.content.trim() === '' || item.asset.content.length < 50) {
        try {
            const newContent = await generateAssetContent(item, currentUser.businessData);
            setAssetToPreview({ ...item, asset: { ...item.asset, content: newContent } });
        } catch (err) {
            setError(err instanceof Error ? `Asset Generation Failed: ${err.message}` : 'An unknown error occurred during asset generation.');
        } finally {
            setGeneratingAsset(null);
        }
    } else {
        setAssetToPreview(item);
        setGeneratingAsset(null);
    }
  }, [currentUser?.businessData]);

  const generateOfflineIndexHtml = (playbook: GeneratedPlaybook, businessData: BusinessData): string => {
    
    // --- Helper functions for rendering HTML sections ---
    const escapeHtml = (unsafe: string | undefined | null) => (unsafe || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

    const renderDiagnosis = (data: GeneratedDiagnosis) => `
      <div class="card">
        <h2>1. Your Diagnosis</h2>
        <p class="subtitle">The simple truth about your business right now.</p>
        <div class="section">
          <h3>Your Current Stage</h3>
          <p class="highlight">${escapeHtml(data.currentStage)}</p>
        </div>
        <div class="section">
          <h3>Your Primary Role</h3>
          <p class="highlight">${escapeHtml(data.yourRole)}</p>
        </div>
        <div class="section">
          <h3>What's Holding You Back (Constraints)</h3>
          <ul>${data.constraints.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>
        </div>
        <div class="section">
          <h3>Your Action Plan (The Path Forward)</h3>
          <ol>${data.actions.map(a => `<li>${escapeHtml(a)}</li>`).join('')}</ol>
        </div>
      </div>
    `;

    const renderMoneyModelAnalysis = (data: GeneratedMoneyModelAnalysis) => `
      <div class="card">
        <h2>2. Your Money Plan</h2>
        <p class="subtitle">The before-and-after of how you make money.</p>
        <div class="grid">
          <div class="model-card old">
            <h4>${escapeHtml(data.oldModel.title)}</h4>
            <p>${escapeHtml(data.oldModel.description)}</p>
            <ul>${data.oldModel.metrics.map(m => `<li><span>${escapeHtml(m.label)}:</span> <strong>${escapeHtml(m.value)}</strong></li>`).join('')}</ul>
          </div>
          <div class="model-card new">
            <h4>${escapeHtml(data.newModel.title)}</h4>
            <p>${escapeHtml(data.newModel.description)}</p>
            <ul>${data.newModel.metrics.map(m => `<li><span>${escapeHtml(m.label)}:</span> <strong>${escapeHtml(m.value)}</strong></li>`).join('')}</ul>
          </div>
        </div>
        <div class="section">
            <h3>Projected Economics</h3>
            <p>${escapeHtml(data.projectedEconomics.explanation)}</p>
            <ul>
                <li><span>Estimated CAC:</span> <strong>${escapeHtml(data.projectedEconomics.estimatedCAC)}</strong></li>
                <li><span>Target LTV:</span> <strong>${escapeHtml(data.projectedEconomics.targetLTV)}</strong></li>
                <li><span>Immediate Profit:</span> <strong class="profit">${escapeHtml(data.projectedEconomics.immediateProfit)}</strong></li>
            </ul>
        </div>
      </div>
    `;
    
    const renderMoneyModelMechanisms = (data: GeneratedMoneyModelMechanisms) => `
        <div class="card">
            <h2>3. Your Money Toolkit</h2>
            <p class="subtitle">Four powerful ways to get paid.</p>
            <div class="principle-box">${escapeHtml(data.corePrinciple)}</div>
            ${data.mechanisms.map(m => `
                <div class="section mechanism-card">
                    <h3>${escapeHtml(m.mechanismType)}: ${escapeHtml(m.tacticName)}</h3>
                    <h4>Strategy</h4>
                    <p>${escapeHtml(m.strategy)}</p>
                    <h4>Example</h4>
                    <p class="example-box">${escapeHtml(m.example)}</p>
                    <h4>Implementation</h4>
                    <pre>${escapeHtml(m.implementationNotes)}</pre>
                </div>
            `).join('')}
        </div>
    `;

    const renderOffer = (offer: GeneratedOffer, title: string) => `
      <div class="offer-card">
        <h3>${escapeHtml(title)}: ${escapeHtml(offer.name)}</h3>
        <p class="promise">"${escapeHtml(offer.promise)}"</p>
        <h4>What You Get (The Stack):</h4>
        <ul class="stack">
          ${offer.stack.map(item => `
            <li>
              <div class="solution">
                <span>${escapeHtml(item.solution)}</span>
                <span class="value">${escapeHtml(item.value)}</span>
              </div>
              <div class="problem">Solves: ${escapeHtml(item.problem)}</div>
              ${item.asset && item.asset.content ? `
              <details class="asset-details">
                <summary>Asset: ${escapeHtml(item.asset.name)} (${escapeHtml(item.asset.type)}) - Click to expand</summary>
                <div class="asset-content">
                  <pre>${escapeHtml(item.asset.content)}</pre>
                </div>
              </details>
              ` : `
              <div class="asset-name">Asset: ${escapeHtml(item.asset.name)} (${escapeHtml(item.asset.type)})</div>
              `}
            </li>
          `).join('')}
        </ul>
        <div class="section">
          <h4>Strategy Behind The Stack</h4>
          <p>${escapeHtml(offer.strategyBehindStack)}</p>
        </div>
        <div class="pricing">
            <div>
                <span>Total Value:</span>
                <span class="value-old">${escapeHtml(offer.totalValue)}</span>
            </div>
            <div>
                <span>Your Price:</span>
                <span class="price-new">${escapeHtml(offer.price)}</span>
            </div>
        </div>
        <div class="guarantee">
            <h4>Our Promise:</h4>
            <p>"${escapeHtml(offer.guarantee)}"</p>
        </div>
      </div>
    `;

    const renderOffers = (playbook: GeneratedPlaybook) => `
        <div class="card">
            <h2>4. Your Offers</h2>
            <p class="subtitle">The irresistible deals that will grow your business.</p>
            <div class="grid">
                ${renderOffer(playbook.offer1, "Grand Slam Offer 1")}
                ${renderOffer(playbook.offer2, "Grand Slam Offer 2")}
            </div>
        </div>
    `;
    
    const renderDownsell = (downsell: GeneratedDownsell) => `
        <div class="card">
            <h2>5. Your "Hello" Offer</h2>
            <p class="subtitle">A simple, low-cost offer to attract new customers.</p>
            <div class="section">
                <h4>Rationale</h4>
                <p>${escapeHtml(downsell.rationale)}</p>
            </div>
            ${renderOffer(downsell.offer, "Downsell Offer")}
        </div>
    `;

    const renderProfitPath = (data: GeneratedProfitPath) => `
        <div class="card">
            <h2>6. Your Profit Path</h2>
            <p class="subtitle">Four steps to make more money from every customer.</p>
            ${data.steps.map((step, index) => `
                <div class="section profit-path-step">
                    <h3>${index + 1}. ${escapeHtml(step.title)}</h3>
                    <p><strong>Action:</strong> ${escapeHtml(step.action)}</p>
                    <p><strong>Example:</strong> ${escapeHtml(step.example)}</p>
                    ${step.script ? `<h4>Script:</h4><pre>${escapeHtml(step.script)}</pre>` : ''}
                </div>
            `).join('')}
        </div>
    `;
    
    const renderMarketingModel = (data: GeneratedMarketingModel) => `
        <div class="card">
            <h2>7. Your Marketing Model</h2>
            <p class="subtitle">Four ways to find your ideal customers.</p>
            ${data.steps.map(step => `
                <div class="section">
                    <h3>${escapeHtml(step.method)}</h3>
                    <p><strong>Strategy:</strong> ${escapeHtml(step.strategy)}</p>
                    <p><strong>Example:</strong> ${escapeHtml(step.example)}</p>
                    ${step.template ? `<h4>Template:</h4><pre>${escapeHtml(step.template)}</pre>` : ''}
                </div>
            `).join('')}
        </div>
    `;
    
    const renderMoneyModelFunnel = (data: GeneratedMoneyModel) => `
        <div class="card">
            <h2>8. Your Money Funnel</h2>
            <p class="subtitle">The step-by-step customer journey to profit.</p>
            <div class="principle-box">${escapeHtml(data.corePrinciple)}</div>
            ${data.steps.map(step => `
                <div class="section money-funnel-step">
                    <h3>Step ${step.stepNumber}: ${escapeHtml(step.title)}</h3>
                    <h4>${escapeHtml(step.offerName)} - ${escapeHtml(step.price)}</h4>
                    <p><strong>Tactic:</strong> ${escapeHtml(step.hormoziTactic)}</p>
                    <p><strong>Rationale:</strong> ${escapeHtml(step.rationale)}</p>
                    <p><strong>Details:</strong> ${escapeHtml(step.details)}</p>
                </div>
            `).join('')}
            <div class="section">
                <h3>Summary</h3>
                <p>${escapeHtml(data.summary)}</p>
            </div>
        </div>
    `;
    
    const renderSalesFunnel = (data: GeneratedSalesFunnel) => `
        <div class="card">
            <h2>9. Your Sales Funnel</h2>
            <p class="subtitle">How to turn strangers into buyers.</p>
            <div class="principle-box">${escapeHtml(data.corePrinciple)}</div>
            ${data.stages.map((stage, index) => `
                <div class="section sales-funnel-stage">
                    <h3>Stage ${index + 1}: ${escapeHtml(stage.stageName)}</h3>
                    <p><strong>Goal:</strong> ${escapeHtml(stage.goal)}</p>
                    <p><strong>Key Metric:</strong> ${escapeHtml(stage.keyMetric)}</p>
                    <h4>Ad Copy</h4>
                    <ul>
                        <li><strong>Headline:</strong> ${escapeHtml(stage.adCopy.headline)}</li>
                        <li><strong>Body:</strong> ${escapeHtml(stage.adCopy.body)}</li>
                        <li><strong>CTA:</strong> ${escapeHtml(stage.adCopy.cta)}</li>
                    </ul>
                    <h4>Landing Page</h4>
                    <ul>
                        <li><strong>Headline:</strong> ${escapeHtml(stage.landingPage.headline)}</li>
                        <li><strong>Elements:</strong> ${escapeHtml(stage.landingPage.elements.join(', '))}</li>
                    </ul>
                    <h4>Sales Process</h4>
                    <ul>
                        <li><strong>Step:</strong> ${escapeHtml(stage.salesProcess.step)}</li>
                        <li><strong>Focus:</strong> ${escapeHtml(stage.salesProcess.scriptFocus)}</li>
                    </ul>
                </div>
            `).join('')}
        </div>
    `;

    const renderOperationsPlan = (data: GeneratedOperationsPlan) => `
        <div class="card">
            <h2>10. Your Operations Plan</h2>
            <p class="subtitle">The simple way to run your business.</p>
            <div class="principle-box">${escapeHtml(data.corePrinciple)}</div>
            <div class="section">
                <h3>Activities & Outcomes</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Outcome</th>
                            <th>Activity</th>
                            <th>Time Allocation</th>
                            <th>Frequency</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.outcomesAndActivities.map(item => `
                            <tr>
                                <td>${escapeHtml(item.outcome)}</td>
                                <td>${escapeHtml(item.activity)}</td>
                                <td>${escapeHtml(item.timeAllocation)}</td>
                                <td>${escapeHtml(item.frequency)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
             <div class="section">
                <h3>Bottleneck Analysis</h3>
                <p>${escapeHtml(data.bottleneckAnalysis)}</p>
            </div>
            <div class="section">
                <h3>Proposed Roles</h3>
                ${data.proposedRoles.map(role => `
                    <div class="role-card">
                        <h4>${escapeHtml(role.roleTitle)}</h4>
                        <p><strong>Key Metric:</strong> ${escapeHtml(role.keyMetric)}</p>
                        <p><strong>Responsibilities:</strong></p>
                        <ul>${role.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
                        <p><strong>Daily Structure:</strong></p>
                        <pre>${escapeHtml(role.dailyStructure)}</pre>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    const renderKpiDashboard = (data: GeneratedKpiDashboard) => `
        <div class="card">
            <h2>11. Your Scorecard</h2>
            <p class="subtitle">The key numbers that tell you if you're winning.</p>
            <div class="principle-box">${escapeHtml(data.corePrinciple)}</div>
            ${data.kpis.map(kpi => `
                <div class="section kpi-card">
                    <h3>${escapeHtml(kpi.name)} <span class="perspective">(${escapeHtml(kpi.perspective)})</span></h3>
                    <p>${escapeHtml(kpi.description)}</p>
                    <p><strong>Formula:</strong> <code>${escapeHtml(kpi.formula)}</code></p>
                    <p><strong>How to Measure:</strong> ${escapeHtml(kpi.howToMeasure)}</p>
                    <p><strong>Importance:</strong> ${escapeHtml(kpi.importance)}</p>
                </div>
            `).join('')}
        </div>
    `;
    
    const renderAccountabilityTracker = (data: GeneratedAccountabilityTracker) => `
        <div class="card">
            <h2>12. Your Growth Tracker</h2>
            <p class="subtitle">The simple way to test ideas and track what works.</p>
            <div class="principle-box">${escapeHtml(data.corePrinciple)}</div>
            ${data.phases.map(phase => `
                <div class="section phase-card">
                    <h3>Phase ${phase.phaseNumber}: ${escapeHtml(phase.title)}</h3>
                    <p class="goal"><strong>Goal:</strong> ${escapeHtml(phase.goal)}</p>
                    <h4>Actions:</h4>
                    <ol>
                        ${phase.actions.map(action => `<li>${escapeHtml(action.description)} (Metric: ${escapeHtml(action.metric)})</li>`).join('')}
                    </ol>
                    <h4>Daily Checklist:</h4>
                    <ul>
                        ${phase.dailyChecklist.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
    `;


    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hormozi AI Business Plan (Offline)</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #111827; color: #E5E7EB; margin: 0; padding: 2rem; line-height: 1.6; }
        .container { max-width: 900px; margin: auto; }
        header { text-align: center; border-bottom: 4px solid #FBBF24; padding-bottom: 1.5rem; margin-bottom: 2rem; }
        h1 { font-size: 3rem; font-weight: 900; margin: 0; color: white; }
        h1 span { color: #FBBF24; }
        h2 { font-size: 2rem; font-weight: 900; color: #FBBF24; border-bottom: 2px solid #4B5563; padding-bottom: 0.5rem; margin-top: 3rem; }
        h3 { font-size: 1.5rem; font-weight: 700; color: white; margin-top: 1.5rem; margin-bottom: 1rem; }
        h4 { font-size: 1.2rem; font-weight: 700; color: #FBBF24; margin-top: 1rem; margin-bottom: 0.5rem; }
        p { margin-bottom: 1rem; }
        ul, ol { padding-left: 20px; margin-bottom: 1rem; }
        li { margin-bottom: 0.5rem; }
        code, pre { font-family: 'Courier New', Courier, monospace; background-color: #1F2937; padding: 0.2em 0.4em; border-radius: 0.25rem; }
        pre { padding: 1rem; white-space: pre-wrap; word-wrap: break-word; }
        .card { background-color: #1F2937; border: 1px solid #374151; padding: 1.5rem; border-radius: 0.75rem; margin-bottom: 2rem; }
        .subtitle { color: #9CA3AF; margin-top: -0.5rem; }
        .section { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #374151; }
        .card > .section:first-of-type { border-top: none; margin-top: 0; padding-top: 0;}
        .highlight { font-size: 1.25rem; font-weight: bold; color: #FBBF24; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .model-card { padding: 1rem; border-radius: 0.5rem; }
        .model-card.old { background-color: #450a0a; border: 1px solid #7f1d1d; }
        .model-card.new { background-color: #14532d; border: 1px solid #166534; }
        .model-card h4 { color: white; }
        .model-card ul { list-style: none; padding: 0; }
        .model-card li { display: flex; justify-content: space-between; font-size: 0.9rem; border-top: 1px solid #4B5563; padding-top: 0.5rem; }
        .profit { color: #4ade80; font-weight: bold; }
        .principle-box { background-color: #111827; border: 1px solid #4B5563; padding: 1rem; border-radius: 0.5rem; text-align: center; font-style: italic; color: #FBBF24; margin-bottom: 1.5rem; }
        .offer-card { background-color: #111827; border: 1px solid #4B5563; padding: 1.5rem; border-radius: 0.5rem; }
        .promise { font-style: italic; font-size: 1.25rem; color: #D1D5DB; text-align: center; margin-bottom: 1rem; }
        .stack { list-style: none; padding: 0; }
        .stack li { background-color: #374151; padding: 0.75rem; border-radius: 0.25rem; border-left: 4px solid #FBBF24; }
        .solution { display: flex; justify-content: space-between; align-items: flex-start; }
        .solution span:first-child { font-weight: bold; }
        .problem { font-size: 0.9rem; color: #9CA3AF; }
        .asset-name { font-size: 0.9rem; font-style: italic; color: #6B7280; }
        .asset-details { background-color: #374151; border-radius: 0.25rem; margin-top: 0.5rem; border-left: 4px solid #FBBF24; }
        .asset-details summary { padding: 0.5rem; cursor: pointer; font-weight: bold; color: #FBBF24; font-size: 0.9rem; }
        .asset-content { padding: 1rem; border-top: 1px solid #4B5563; background-color: #111827; }
        .asset-content pre { font-size: 0.85rem; background-color: #1F2937; padding: 1rem; border-radius: 0.5rem; white-space: pre-wrap; word-wrap: break-word; color: #E5E7EB; }
        .value { font-weight: bold; color: #4ade80; }
        .pricing { text-align: right; margin-top: 1rem; }
        .value-old { text-decoration: line-through; color: #ef4444; }
        .price-new { font-size: 1.5rem; font-weight: 900; color: #FBBF24; }
        .guarantee { background-color: #111827; padding: 1rem; border: 1px solid #4B5563; border-radius: 0.5rem; margin-top: 1rem; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 0.75rem; border: 1px solid #4B5563; text-align: left; }
        thead { background-color: #374151; }
        th { font-weight: bold; color: #FBBF24; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Hormozi AI<span> Business Plan</span></h1>
            <p style="color: #9CA3AF; margin-top: 0.5rem;">Your complete offline business playbook for ${escapeHtml(businessData.businessType)}</p>
        </header>
        <main>
            ${renderDiagnosis(playbook.diagnosis)}
            ${renderMoneyModelAnalysis(playbook.moneyModelAnalysis)}
            ${renderMoneyModelMechanisms(playbook.moneyModelMechanisms)}
            ${renderOffers(playbook)}
            ${renderDownsell(playbook.downsell)}
            ${renderProfitPath(playbook.profitPath)}
            ${renderMarketingModel(playbook.marketingModel)}
            ${renderMoneyModelFunnel(playbook.moneyModel)}
            ${renderSalesFunnel(playbook.salesFunnel)}
            ${renderOperationsPlan(playbook.operationsPlan)}
            ${renderKpiDashboard(playbook.kpiDashboard)}
            ${renderAccountabilityTracker(playbook.accountabilityTracker)}
        </main>
    </div>
</body>
</html>
    `;
  }

  const handleDownloadHtml = async () => {
    if (!currentUser?.playbook || !currentUser.businessData || isDownloading) return;

    setIsDownloading(true);
    setDownloadProgress(0);
    setError(null);
    try {
        setLoadingText("Preparing your plan's text assets...");
        const processedPlaybook = await processAllAssets(currentUser.playbook);
        
        setLoadingText("Generating your offline HTML file...");
        const htmlContent = generateOfflineIndexHtml(processedPlaybook, currentUser.businessData);
        setDownloadProgress(95);

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Hormozi_AI_Business_Plan.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setDownloadProgress(100);

    } catch (e) {
        setError(e instanceof Error ? `HTML Generation Failed: ${e.message}` : "Failed to generate offline HTML file.");
        console.error(e);
    } finally {
        setIsDownloading(false);
        setLoadingText('');
    }
  };


  if (authLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!currentUser) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
              {authView === 'login' && <Auth onLogin={handleLogin} onSwitchToSignup={() => { setAuthView('signup'); setError(null); }} setError={setError} />}
              {authView === 'signup' && <Step1Form onSubmit={handleSignupAndGenerate} onBackToLogin={() => { setAuthView('login'); setError(null); }} isSignupMode={true} />}
              {error && <p className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
            </div>
        </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-full max-w-md p-4">
          <ProgressBar progress={loadingProgress} loadingText={loadingText} />
        </div>
      </div>
    );
  }

  if (!currentUser.playbook) {
    return (
       <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
              <Step1Form onSubmit={(data) => handleSignupAndGenerate(data, {username: currentUser.username, password: ''})} onBackToLogin={() => {}} isSignupMode={false} />
              {error && <p className="mt-4 text-center text-red-40a0">{error}</p>}
          </div>
       </div>
    );
  }

  return (
    <div className="min-h-screen">
      {currentUser && currentUser.playbook && (
        <div className="p-4 md:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter text-center sm:text-left">Your <span className="text-yellow-400">Hormozi AI</span> Business Plan</h1>
              <div className="flex gap-2">
                 <button
                    onClick={handleDownloadHtml}
                    disabled={isDownloading}
                    className="inline-flex justify-center items-center rounded-lg border border-gray-600 shadow-sm px-6 py-3 bg-gray-600 text-base font-bold text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-400 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{minHeight: '52px', minWidth: '220px'}}
                 >
                    {isDownloading ? <CircularProgress progress={downloadProgress} /> : 'Download Offline Plan'}
                 </button>
                 <button onClick={handleStartNew} className="px-4 py-2 bg-gray-700 text-gray-300 font-semibold rounded-md hover:bg-gray-600 transition-colors text-sm">Start New Plan</button>
                 <button onClick={handleLogout} className="px-4 py-2 bg-red-800 text-white font-semibold rounded-md hover:bg-red-700 transition-colors text-sm">Logout</button>
              </div>
            </div>
          {error && <p className="text-center text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}

          <FullPlaybook 
            playbook={currentUser.playbook}
            onPreviewAsset={handlePreviewAsset}
            chatHistory={chatHistory}
            isChatLoading={isChatLoading}
            onSendMessage={async (message) => {
                if(!currentUser.businessData || !currentUser.playbook) return;
                
                const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: message }];
                setChatHistory(newHistory);
                setIsChatLoading(true);

                try {
                    const stream = await generateChatResponseStream(currentUser.businessData, currentUser.playbook, newHistory);
                    let fullResponse = '';
                    setChatHistory(prev => [...prev, { role: 'model', content: '' }]);
                    for await (const chunk of stream) {
                        fullResponse += chunk.text;
                        setChatHistory(prev => {
                            const updatedHistory = [...prev];
                            updatedHistory[updatedHistory.length - 1] = { role: 'model', content: fullResponse };
                            return updatedHistory;
                        });
                    }
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : "An error occurred with the AI chat.";
                    setError(errorMessage);
                    setChatHistory(prev => prev.slice(0, -1));
                } finally {
                    setIsChatLoading(false);
                }
            }}
          />
        </div>
      )}
      
      {assetToPreview && (
        <OfferPreviewModal 
            asset={assetToPreview.asset!} 
            onClose={() => setAssetToPreview(null)}
        />
      )}
    </div>
  );
};

export default App;
