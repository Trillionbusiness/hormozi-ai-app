
import React from 'react';
import { GeneratedDownsell } from '../../types';

// --- Reusable PDF Components ---
const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => <h1 className="text-4xl font-black text-gray-900 tracking-tight">{children}</h1>;
const Subtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="text-lg text-gray-600 mt-2">{children}</p>;
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-yellow-400 pb-2 mb-4">{children}</h2>;
const Paragraph: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <p className={`text-base text-gray-700 leading-relaxed my-3 ${className || ''}`}>{children}</p>;
const HighlightBox: React.FC<{ children: React.ReactNode, title?: string }> = ({ children, title }) => (
    <div className="p-6 rounded-lg border border-blue-200 bg-blue-50 my-4 break-inside-avoid">
        {title && <h3 className="text-xl font-bold text-blue-800 mb-2">{title}</h3>}
        {children}
    </div>
);

const DownsellPamphletPdf: React.FC<{ downsell: GeneratedDownsell }> = ({ downsell }) => {
    if (!downsell?.offer) {
        return <div className="p-8 bg-white font-sans">Could not load offer information.</div>;
    }

    return (
        <div className="p-12 bg-white font-sans text-gray-900">
            <header className="text-center">
                <p className="text-blue-500 font-bold uppercase tracking-widest">A Special Invitation</p>
                <Title>The "{downsell.offer.name}" Offer</Title>
                <Subtitle>"{downsell.offer.promise}"</Subtitle>
            </header>

            <main className="mt-10">
                <SectionTitle>Why We Made This For You</SectionTitle>
                <Paragraph>{downsell.rationale}</Paragraph>
                <HighlightBox title="The Goal">
                    <Paragraph>This isn't our main program, but it's a powerful first step. We created this to give you a quick, valuable win and show you what's possible when you have the right tools.</Paragraph>
                </HighlightBox>

                <SectionTitle>Here's Exactly What You Get:</SectionTitle>
                <div className="space-y-3">
                    {downsell.offer.stack.map((item, index) => (
                        <div key={index} className="p-4 bg-gray-100 border-l-4 border-green-500 rounded-r-lg shadow-sm">
                            <div className="flex justify-between items-start">
                                <p className="font-bold text-lg text-gray-800 flex-grow pr-4">{item.solution}</p>
                                <p className="font-black text-green-600 text-lg whitespace-nowrap">{item.value}</p>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">
                                <strong className="font-semibold">This solves the problem of:</strong> {item.problem}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-10 grid grid-cols-2 gap-8 items-center">
                    <div className="text-right">
                        <p className="text-lg text-gray-600">Total Value:</p>
                        <p className="text-4xl font-bold text-red-500 line-through">{downsell.offer.totalValue}</p>
                        <p className="text-lg text-gray-800 mt-4">Your Investment Today:</p>
                        <p className="text-5xl font-black text-blue-600">{downsell.offer.price}</p>
                    </div>
                    <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
                        <h4 className="text-xl font-bold text-blue-800">Our Simple Promise</h4>
                        <p className="italic text-gray-700 mt-2">"{downsell.offer.guarantee}"</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DownsellPamphletPdf;
