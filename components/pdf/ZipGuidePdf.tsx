
import React from 'react';
import { BusinessData, GeneratedPlaybook } from '../../types';

// --- Reusable PDF Components ---
const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => <h1 className="text-5xl font-black text-gray-900 tracking-tight">{children}</h1>;
const Subtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="text-xl text-gray-600 mt-2">{children}</p>;
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-yellow-400 pb-3 mb-6 mt-10 break-after-avoid">{children}</h2>;
const P: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <p className={`text-base text-gray-700 leading-relaxed my-3 ${className || ''}`}>{children}</p>;

const FolderItem: React.FC<{ name: string, description: string }> = ({ name, description }) => (
    <div className="flex items-start mt-4">
        <div className="flex-shrink-0">
            <span className="text-3xl" role="img" aria-label="folder">📁</span>
        </div>
        <div className="ml-4">
            <p className="font-bold text-lg text-gray-800">{name}</p>
            <p className="text-gray-600">{description}</p>
        </div>
    </div>
);

interface ZipGuidePdfProps {
  businessData: BusinessData;
  playbook: GeneratedPlaybook;
}

const ZipGuidePdf: React.FC<ZipGuidePdfProps> = ({ businessData, playbook }) => {
    return (
        <div className="p-12 bg-white font-sans text-gray-900">
            <header className="text-center mb-12 pb-6 border-b-8 border-yellow-400">
                <Title>START HERE: Your Business Plan Guide</Title>
                <Subtitle>A quick guide to your new business assets for <strong className="text-gray-800">{businessData.businessType}</strong>.</Subtitle>
            </header>

            <main>
                <SectionTitle>Welcome to Your Growth Kit</SectionTitle>
                <P>Congratulations! You now have a complete, AI-powered business plan based on the principles of Alex Hormozi. This isn't just a collection of documents; it's a step-by-step roadmap to get more customers, make more money, and grow your business.</P>
                <P>We've organized everything into folders to make it easy to find what you need. The best way to navigate all your new files is with the included `index.html` dashboard.</P>

                <SectionTitle>Your First Step: Where to Begin</SectionTitle>
                <P>Feeling overwhelmed? Don't be. Here's your simple starting plan:</P>
                <div className="mt-4 p-8 border-4 border-dashed border-yellow-400 bg-yellow-50 rounded-lg">
                    <ol className="list-decimal list-inside space-y-4 text-xl">
                        <li>
                            <strong className="font-bold">Unzip this file</strong> to a new folder on your computer.
                        </li>
                        <li>
                            <strong className="font-bold">Open the `index.html` file</strong> in your web browser (like Chrome, Firefox, or Safari).
                        </li>
                        <li>
                            <strong className="font-bold">Use the dashboard</strong> on that page to explore and download all your documents. It has links to everything!
                        </li>
                    </ol>
                    <P className="mt-6">The `index.html` file is your central hub. Start there, and everything else will make perfect sense.</P>
                </div>

                <P className="mt-8 text-center font-semibold">You have the plan. Now go do the work. Good luck!</P>
            </main>
        </div>
    );
};

export default ZipGuidePdf;
