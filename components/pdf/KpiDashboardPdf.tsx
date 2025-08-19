
import React from 'react';
import { GeneratedKpiDashboard, Kpi } from '../../types';

// --- Reusable PDF Components ---
const PdfPage: React.FC<{ children: React.ReactNode, footerText: string }> = ({ children, footerText }) => (
    <div style={{ width: '800px', display: 'flex', flexDirection: 'column', backgroundColor: 'white', fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <div className="flex-grow p-12 flex flex-col">
            {children}
        </div>
        <footer className="p-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
            <span>The Hormozi AI Helper</span>
            <span>{footerText}</span>
        </footer>
    </div>
);

const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => <h1 className="text-4xl font-black text-gray-900 tracking-tight">{children}</h1>;
const Subtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="text-lg text-gray-600 mt-2">{children}</p>;
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-yellow-400 pb-3 mb-6">{children}</h2>;
const P: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <p className={`text-base text-gray-700 leading-relaxed ${className || ''}`}>{children}</p>;
const SubSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 ${className || ''}`}>
        <h3 className="text-lg font-bold text-gray-700 mb-2">{title}</h3>
        {children}
    </div>
);

// --- PDF Specific Components ---

const KpiCard: React.FC<{ kpi: Kpi }> = ({ kpi }) => {
    const perspectiveColors = {
        Financial: 'border-green-400',
        Customer: 'border-blue-400',
        Operational: 'border-purple-400',
        Marketing: 'border-pink-400',
    };
    const colorClass = perspectiveColors[kpi.perspective] || 'border-gray-400';

    return (
        <div className={`p-6 bg-white rounded-lg border-l-8 ${colorClass} shadow-md mb-6 break-inside-avoid`}>
            <div className="flex justify-between items-start">
                <h4 className="text-2xl font-bold text-gray-800 flex-grow pr-4">{kpi.name}</h4>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-200 px-2 py-1 rounded">{kpi.perspective}</span>
            </div>
            <P className="mt-2">{kpi.description}</P>
            
            <SubSection title="Why This Is Important For You" className="bg-yellow-50 border-yellow-200">
                 <P className="italic">{kpi.importance}</P>
            </SubSection>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
                <SubSection title="How to Measure" className="bg-gray-100">
                    <P>{kpi.howToMeasure}</P>
                </SubSection>
                <SubSection title="Simple Formula" className="bg-gray-100">
                    <P className="font-mono">{kpi.formula}</P>
                </SubSection>
            </div>
            <SubSection title="A Simple Example" className="bg-gray-100 mt-4">
                <P>{kpi.example}</P>
            </SubSection>
        </div>
    );
};

const KpiDashboardPdf: React.FC<{ kpiDashboard: GeneratedKpiDashboard }> = ({ kpiDashboard }) => {
  return (
    <PdfPage footerText="Your Business Scorecard">
        <header className="text-center mb-10">
            <Title>{kpiDashboard.title}</Title>
            <Subtitle>"{kpiDashboard.corePrinciple}"</Subtitle>
        </header>

        <main>
            {kpiDashboard.kpis.map((kpi, index) => (
                <KpiCard key={index} kpi={kpi} />
            ))}
        </main>
    </PdfPage>
  );
};

export default KpiDashboardPdf;
