import React from 'react';
import { 
    GeneratedPlaybook, GeneratedDiagnosis, GeneratedMoneyModelAnalysis, ModelComparison, GeneratedMoneyModel, 
    MoneyModelStep, GeneratedOperationsPlan, OperationalActivity, TeamRole, GeneratedOffer, OfferStackItem, 
    GeneratedDownsell, GeneratedMarketingModel, MarketingModelStep, GeneratedSalesFunnel, FunnelStage, 
    GeneratedProfitPath, ProfitPathStep, GeneratedMoneyModelMechanisms, MoneyModelMechanism,
    GeneratedAccountabilityTracker, TrackerPhase
} from '../../types';

// --- STYLING HELPER COMPONENTS ---

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-10 break-inside-avoid">
        <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-yellow-400 pb-3 mb-6">{title}</h2>
        <div className="space-y-4">{children}</div>
    </div>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 break-inside-avoid ${className || ''}`}>
        <h3 className="text-xl font-bold text-gray-700 mb-2">{title}</h3>
        {children}
    </div>
);

const P: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <p className={`text-base text-gray-700 leading-relaxed ${className || ''}`}>{children}</p>
);

const UL: React.FC<{ items: string[] | React.ReactNode[] }> = ({ items }) => (
    <ul className="list-disc list-inside space-y-2 pl-2">
        {items.map((item, i) => <li key={i} className="text-base text-gray-700">{item}</li>)}
    </ul>
);

const OL: React.FC<{ items: string[] | React.ReactNode[] }> = ({ items }) => (
    <ol className="list-decimal list-inside space-y-2 pl-2">
        {items.map((item, i) => <li key={i} className="text-base text-gray-700">{item}</li>)}
    </ol>
);

// --- PDF SECTION COMPONENTS ---

const DiagnosisSection: React.FC<{ diagnosis: GeneratedDiagnosis }> = ({ diagnosis }) => (
    <Section title="1. Where Your Business Is Now (Your Diagnosis)">
        <P>The first step to getting where you want to go is knowing exactly where you are. This is the honest truth about your business right now.</P>
        <SubSection title="Your Current Stage">
             <P className="font-bold text-2xl text-yellow-600">{diagnosis.currentStage}</P>
             <P className="mt-2">This means your primary focus should be on [main focus based on stage, e.g., 'getting customers and proving your offer']. Don't get distracted by shiny objects.</P>
        </SubSection>
        <SubSection title="Your Primary Role">
            <P className="font-bold text-2xl text-gray-800">{diagnosis.yourRole}</P>
            <P className="mt-2">At this stage, you are the engine of the business. You have to be willing to do the work, learn, and lead from the front.</P>
        </SubSection>
        <SubSection title="The Constraints (What's Holding You Back)">
             <P>These are the bottlenecks. Solving these is the key to unlocking growth.</P>
            <UL items={diagnosis.constraints.map(c => <span className="font-semibold">"{c}"</span>)} />
        </SubSection>
        <SubSection title="Your Action Plan (The Path Forward)">
             <P>This isn't a long list of 100 things. It's the 3-4 most important actions you must take to get to the next level.</P>
            <OL items={diagnosis.actions.map(a => <span className="font-semibold">{a}</span>)} />
        </SubSection>
    </Section>
);

const ModelCard: React.FC<{ model: ModelComparison; type: 'old' | 'new' }> = ({ model, type }) => (
    <div className={`p-6 rounded-lg border-2 flex flex-col break-inside-avoid ${type === 'old' ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
        <h4 className={`font-bold text-2xl ${type === 'old' ? 'text-red-800' : 'text-green-800'}`}>{model.title}</h4>
        <P className="mt-2 mb-4 flex-grow text-lg">{model.description}</P>
        <div className="space-y-2 mt-auto">
            {model.metrics.map((metric, i) => (
                <div key={i} className="flex justify-between text-base border-t border-gray-300 pt-2">
                    <span className="text-gray-600">{metric.label}:</span>
                    <span className="font-bold text-gray-800">{metric.value}</span>
                </div>
            ))}
        </div>
    </div>
);

const MoneyModelAnalysisSection: React.FC<{ analysis: GeneratedMoneyModelAnalysis }> = ({ analysis }) => (
    <Section title="2. Your Money Plan: Before and After">
        <P>This is the most important part of your business. A bad money plan can kill a great product. A great money plan can make a good product unstoppable. Here's how we fix yours.</P>
        <div className="grid grid-cols-2 gap-6">
            <ModelCard model={analysis.oldModel} type="old" />
            <ModelCard model={analysis.newModel} type="new" />
        </div>
        <SubSection title="Understanding The Goal: LTV to CAC Ratio">
            <P>LTV (Lifetime Value) is the total profit a customer brings you. CAC (Customer Acquisition Cost) is what you pay to get them. We want the LTV to be MUCH higher than the CAC.</P>
            <P className="text-center font-bold text-3xl my-4 text-yellow-600">{analysis.ltvCacAnalysis.targetRatio}</P>
            <P className="italic">{analysis.ltvCacAnalysis.explanation}</P>
        </SubSection>
        <SubSection title="Your New Profit Economics">
            <P>Here’s the math for your new model. This shows how you can be profitable from day one with each new customer.</P>
            <div className="space-y-2 mt-4 text-xl">
                 <div className="flex justify-between items-center"><span className="text-gray-600">Target LTV (in 30 days):</span> <span className="font-bold text-green-600">{analysis.projectedEconomics.targetLTV}</span></div>
                 <div className="flex justify-between items-center"><span className="text-gray-600">Estimated CAC:</span> <span className="font-bold text-red-600">-{analysis.projectedEconomics.estimatedCAC}</span></div>
                 <hr className="my-2"/>
                 <div className="flex justify-between items-center"><span className="font-bold text-gray-800">IMMEDIATE PROFIT:</span> <span className="font-extrabold text-yellow-500">{analysis.projectedEconomics.immediateProfit}</span></div>
            </div>
            <P className="mt-4 italic">{analysis.projectedEconomics.explanation}</P>
        </SubSection>
    </Section>
);

const MoneyModelMechanismsSection: React.FC<{ data: GeneratedMoneyModelMechanisms }> = ({ data }) => (
    <Section title="3. Your Money Model Toolkit">
        <div className="text-center p-6 bg-yellow-50 rounded-lg border-2 border-yellow-200 break-inside-avoid">
            <h3 className="text-2xl font-bold text-yellow-800">The Core Principle</h3>
            <P className="italic text-xl">"{data.corePrinciple}"</P>
        </div>
        <P>A money model is built from four types of offers. Here is the best tactic for you from each category.</P>
        {data.mechanisms.map(mech => (
            <div key={mech.tacticName} className="p-4 bg-gray-50 rounded-lg border-l-8 border-gray-300 mt-4 break-inside-avoid">
                <p className="font-bold text-gray-500 uppercase">{mech.mechanismType} Offer</p>
                <h4 className="text-2xl font-bold text-gray-800">{mech.tacticName}</h4>
                <SubSection title="Strategy For Your Business" className="bg-white mt-3">
                    <P>{mech.strategy}</P>
                </SubSection>
                <SubSection title="Example Offer" className="bg-white mt-3">
                    <P className="italic">"{mech.example}"</P>
                </SubSection>
                 <SubSection title="How to Implement It" className="bg-white mt-3">
                    <P className="whitespace-pre-wrap">{mech.implementationNotes}</P>
                </SubSection>
            </div>
        ))}
    </Section>
);

const MoneyModelFunnelSection: React.FC<{ model: GeneratedMoneyModel }> = ({ model }) => (
    <Section title="4. Your Money-Making Steps (The Funnel)">
         <div className="text-center p-6 bg-yellow-50 rounded-lg border-2 border-yellow-200 break-inside-avoid">
            <h3 className="text-2xl font-bold text-yellow-800">The Core Principle</h3>
            <P className="italic text-xl">"{model.corePrinciple}"</P>
        </div>
        <P className="mt-4">This is the exact sequence of offers you will use to guide a customer from stranger to happy client, profitably.</P>
        <div className="space-y-6 mt-4">
            {model.steps.sort((a,b) => a.stepNumber - b.stepNumber).map(step => (
                <div key={step.stepNumber} className="p-6 bg-gray-50 rounded-lg border-l-8 border-gray-300 break-inside-avoid">
                    <p className="text-base font-bold text-gray-500">STEP {step.stepNumber}</p>
                    <h4 className="text-2xl font-bold text-gray-800">{step.title}: {step.offerName} - <span className="text-green-600">{step.price}</span></h4>
                    <p className="font-mono text-sm uppercase tracking-wider text-blue-700 bg-blue-100 inline-block px-2 py-1 rounded mt-2">{step.hormoziTactic}</p>
                    <SubSection title="Why this step works:" className="bg-white mt-4">
                        <P>{step.rationale}</P>
                    </SubSection>
                     <SubSection title="How to do it:" className="bg-white mt-4">
                        <P className="whitespace-pre-wrap">{step.details}</P>
                    </SubSection>
                </div>
            ))}
        </div>
        <div className="text-center p-6 bg-gray-100 rounded-lg mt-6 break-inside-avoid">
            <h3 className="text-2xl font-bold text-gray-800">Summary of The Model</h3>
            <P className="text-lg">{model.summary}</P>
        </div>
    </Section>
);

const OperationsPlanSection: React.FC<{ plan: GeneratedOperationsPlan }> = ({ plan }) => (
    <Section title="5. How Your Business Will Run (Operations)">
        <div className="text-center p-6 bg-yellow-50 rounded-lg border-2 border-yellow-200 break-inside-avoid">
            <h3 className="text-2xl font-bold text-yellow-800">The Core Principle</h3>
            <P className="italic text-xl">"{plan.corePrinciple}"</P>
        </div>
        <SubSection title="High-Leverage Activities">
             <P>Focus your time on the activities that produce the biggest results. Here's what matters most.</P>
            <table className="w-full text-left text-base mt-4">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-3 font-bold">Outcome</th>
                        <th className="p-3 font-bold">Activity</th>
                        <th className="p-3 font-bold">Time</th>
                        <th className="p-3 font-bold">Frequency</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700">
                    {plan.outcomesAndActivities.map((item, i) => (
                        <tr key={i} className="border-b border-gray-200">
                            <td className="p-3 font-semibold">{item.outcome}</td>
                            <td className="p-3">{item.activity}</td>
                            <td className="p-3">{item.timeAllocation}</td>
                            <td className="p-3">{item.frequency}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </SubSection>
        <SubSection title="Your Primary Bottleneck">
            <P>{plan.bottleneckAnalysis}</P>
        </SubSection>
        <SubSection title="Proposed Team Roles">
            <P>As you grow, you'll need to hire. Here are the first roles to consider, based on your business.</P>
            {plan.proposedRoles.map((role, i) => (
                <div key={i} className="p-4 bg-white rounded-md border-2 border-gray-200 mt-3 break-inside-avoid">
                    <h5 className="font-bold text-xl text-gray-800">{role.roleTitle}</h5>
                    <p className="text-sm text-gray-500 mb-3"><strong className="font-semibold">Key Metric:</strong> {role.keyMetric}</p>
                    <P><strong className="font-semibold">Core Responsibilities:</strong></P>
                    <UL items={role.responsibilities} />
                    <P className="mt-3"><strong className="font-semibold">Example Daily Structure:</strong></P>
                    <pre className="text-sm bg-gray-100 p-3 rounded whitespace-pre-wrap font-sans">{role.dailyStructure}</pre>
                </div>
            ))}
        </SubSection>
    </Section>
);

const OfferCard: React.FC<{ offer: GeneratedOffer, title: string, color: 'yellow' | 'blue' }> = ({ offer, title, color }) => (
    <div className={`p-6 bg-${color}-50 rounded-lg border-2 border-${color}-200 break-inside-avoid flex flex-col`}>
        <h3 className={`text-2xl font-bold text-${color}-800`}>{title}</h3>
        <h4 className="text-xl font-bold text-gray-800 mt-2">{offer.name}</h4>
        <P className="italic text-lg">"{offer.promise}"</P>

        <div className="my-4 flex-grow">
            <p className="font-bold text-gray-800 text-lg">What you get:</p>
            <div className="space-y-2 mt-2">
            {offer.stack.map((item, i) => (
                <div key={i} className="p-3 bg-white border-l-4 border-green-400 rounded-r-md shadow-sm break-inside-avoid">
                    <div className="flex justify-between items-start">
                        <p className="font-bold text-gray-800 flex-grow pr-2">{item.solution}</p>
                        <p className="font-black text-green-600 whitespace-nowrap">{item.value}</p>
                    </div>
                    <P className="text-sm"><strong className="font-semibold">Solves:</strong> {item.problem}</P>
                </div>
            ))}
            </div>
        </div>

        <div className="mt-auto">
            <div className="text-right my-4">
                <P className="text-lg">Total Value:</P>
                <p className="text-3xl font-bold text-red-500 line-through">{offer.totalValue}</p>
            </div>
            <div className="text-right my-4">
                <P className="text-lg">Your Price:</P>
                <p className={`text-4xl font-black text-${color}-500`}>{offer.price}</p>
            </div>
            <div className={`p-4 bg-${color}-100 border-t-4 border-${color}-300 rounded-md break-inside-avoid`}>
                <p className={`font-bold text-lg text-${color}-900`}>Our Promise:</p>
                <P className={`italic text-${color}-900`}>"{offer.guarantee}"</P>
            </div>
        </div>
    </div>
);


const OffersSection: React.FC<{ offer1: GeneratedOffer; offer2: GeneratedOffer; downsell: GeneratedDownsell }> = ({ offer1, offer2, downsell }) => (
    <Section title="6. Your Irresistible Offers">
        <P>An offer so good, people feel stupid saying no. That's the goal. Here are two "Grand Slam" options, plus a smaller "Hello" offer to attract new customers.</P>
        <div className="grid grid-cols-2 gap-6 mt-4">
            <OfferCard offer={offer1} title="Grand Slam Offer 1" color="yellow" />
            <OfferCard offer={offer2} title="Grand Slam Offer 2" color="yellow"/>
        </div>
        <div className="mt-6 break-inside-avoid">
             <P className="text-lg font-bold">Your "Hello" Offer:</P>
             <P className="italic">{downsell.rationale}</P>
             <div className="mt-2">
                <OfferCard offer={downsell.offer} title={downsell.offer.name} color="blue" />
             </div>
        </div>
    </Section>
);

const MarketingModelSection: React.FC<{ model: GeneratedMarketingModel }> = ({ model }) => (
    <Section title="7. How to Find Your Customers (Marketing)">
        <P>You have an amazing offer. Now it's time to show it to people who are desperate for the solution you provide. Here are four proven ways to do that.</P>
        <div className="space-y-6 mt-4">
        {model.steps.map((step, i) => (
            <div key={i} className="p-6 bg-gray-50 rounded-lg border-l-8 border-yellow-300 break-inside-avoid">
                <h4 className="text-2xl font-bold text-gray-800">{step.method}</h4>
                <SubSection title="Strategy" className="bg-white mt-3">
                    <P>{step.strategy}</P>
                </SubSection>
                 <SubSection title="Example" className="bg-white mt-3">
                    <P>{step.example}</P>
                </SubSection>
                {step.template && (
                    <SubSection title="Copy-Paste Template" className="bg-white mt-3">
                        <pre className="text-sm bg-gray-100 p-3 border border-gray-200 rounded whitespace-pre-wrap font-sans">{step.template}</pre>
                    </SubSection>
                )}
            </div>
        ))}
        </div>
    </Section>
);

const PhaseWorksheet: React.FC<{ phase: TrackerPhase }> = ({ phase }) => (
    <div className="break-before-page pt-10">
        <h3 className="text-3xl font-bold text-gray-800 border-b-4 border-yellow-400 pb-3 mb-6">Phase {phase.phaseNumber}: {phase.title}</h3>
        <div className="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg text-center">
             <h4 className="text-xl font-bold text-yellow-800">Your Goal For This Phase:</h4>
             <p className="text-lg text-gray-700 italic mt-1">"{phase.goal}"</p>
        </div>
        
        <h4 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Key Actions To Complete</h4>
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
                         </div>
                     </div>
                 </div>
            ))}
        </div>

        <h4 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Daily Checklist</h4>
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

const AccountabilityTrackerSection: React.FC<{ tracker: GeneratedAccountabilityTracker }> = ({ tracker }) => (
    <Section title="8. Your Action Unleashed Playbook">
        <div className="text-center p-6 bg-yellow-50 rounded-lg border-2 border-yellow-200 break-inside-avoid">
            <h3 className="text-2xl font-bold text-yellow-800">The Core Principle</h3>
            <P className="italic text-xl">"{tracker.corePrinciple}"</P>
        </div>
        <P>This is your worksheet. Complete each phase to build unstoppable momentum. Your goal is simple: take action, learn, and repeat.</P>
        {tracker.phases.map((phase) => (
             <PhaseWorksheet key={phase.phaseNumber} phase={phase} />
        ))}
    </Section>
);


const FullPlaybookPdf: React.FC<{ playbook: GeneratedPlaybook }> = ({ playbook }) => {
  return (
    <div className="p-8 bg-white font-sans text-gray-900" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <header className="text-center mb-12 pb-6 border-b-8 border-yellow-400">
            <h1 className="text-5xl font-black tracking-tight">Your Super Simple Business Plan</h1>
            <p className="text-xl text-gray-600 mt-4">A complete, step-by-step guide to growing your business, based on the timeless principles of Alex Hormozi.</p>
        </header>
        
        <main>
            {playbook.diagnosis && <DiagnosisSection diagnosis={playbook.diagnosis} />}
            {playbook.moneyModelAnalysis && <MoneyModelAnalysisSection analysis={playbook.moneyModelAnalysis} />}
            {playbook.moneyModelMechanisms && <MoneyModelMechanismsSection data={playbook.moneyModelMechanisms} />}
            {playbook.moneyModel && <MoneyModelFunnelSection model={playbook.moneyModel} />}
            {playbook.operationsPlan && <OperationsPlanSection plan={playbook.operationsPlan} />}
            {playbook.offer1 && playbook.offer2 && playbook.downsell && <OffersSection offer1={playbook.offer1} offer2={playbook.offer2} downsell={playbook.downsell} />}
            {playbook.marketingModel && <MarketingModelSection model={playbook.marketingModel} />}
            {playbook.accountabilityTracker && <AccountabilityTrackerSection tracker={playbook.accountabilityTracker} />}
        </main>
         <footer className="mt-12 pt-6 border-t-8 border-yellow-400 text-center break-before-page">
            <h2 className="text-3xl font-bold text-gray-800">The Plan Works If You Do.</h2>
            <p className="text-lg text-gray-600 mt-2">You have the roadmap. Now it's time to take the first step.</p>
        </footer>
    </div>
  );
};

export default FullPlaybookPdf;