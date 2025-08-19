import React from 'react';
import { GeneratedPlaybook, BusinessData } from '../../types';

// Reusable PDF Components
const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => <h1 className="text-4xl font-black text-gray-900 tracking-tight text-center">{children}</h1>;
const Subtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="text-xl text-gray-600 mt-3 text-center italic">{children}</p>;
const SectionTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <h2 className={`text-3xl font-bold text-gray-800 border-b-4 border-yellow-400 pb-3 mb-6 mt-10 break-after-avoid ${className}`}>{children}</h2>;
const P: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <p className={`text-base text-gray-700 leading-relaxed my-3 ${className || ''}`}>{children}</p>;

interface LandingPagePdfProps {
    playbook: GeneratedPlaybook;
    businessData: BusinessData;
}

const LandingPagePdf: React.FC<LandingPagePdfProps> = ({ playbook, businessData }) => {
    const offer = playbook.offer1; // Use the first Grand Slam Offer as the basis
    const diagnosis = playbook.diagnosis;

    return (
        <div className="p-12 bg-white font-sans text-gray-900">
            <header className="mb-10 pb-6 border-b-8 border-yellow-400">
                <div className="text-center p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-500">[Your Logo Here]</p>
                </div>
                <Title>{offer.promise}</Title>
                <Subtitle>The only solution designed for {businessData.targetClient} to achieve amazing results, guaranteed.</Subtitle>
            </header>

            <main>
                <SectionTitle>Are You Struggling With...</SectionTitle>
                <P>If you're like most {businessData.targetClient}, you're probably dealing with some of these frustrating problems:</P>
                <ul className="list-none space-y-3 mt-4">
                    {diagnosis.constraints.map((constraint, i) => (
                        <li key={i} className="p-4 bg-red-50 border-l-4 border-red-400 text-red-800 font-semibold text-lg">
                            <span className="font-bold text-xl mr-2">!</span> {constraint}
                        </li>
                    ))}
                </ul>
                <P className="mt-4">It's not your fault. You just haven't had the right plan. Until now.</P>

                <SectionTitle>Introducing: The "{offer.name}"</SectionTitle>
                <P>This is not just another course or service. It's a complete, done-with-you system designed to get you from where you are now to where you want to be, faster than you ever thought possible.</P>

                <SectionTitle>Here's Everything You Get to Guarantee Your Success</SectionTitle>
                <div className="space-y-3">
                    {offer.stack.map((item, index) => (
                        <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm break-inside-avoid">
                            <div className="flex justify-between items-start">
                                <p className="font-bold text-lg text-gray-800 flex-grow pr-4">✅ {item.solution}</p>
                                <p className="font-black text-green-600 text-lg whitespace-nowrap">{item.value}</p>
                            </div>
                            <p className="text-gray-600 text-sm mt-1 ml-7">
                                <strong className="font-semibold">Solves:</strong> {item.problem}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center p-8 bg-gray-800 text-white rounded-lg break-inside-avoid">
                    <h3 className="text-2xl font-bold">Total Value: <span className="text-red-400 line-through">{offer.totalValue}</span></h3>
                    <h3 className="text-4xl font-black mt-4">Your Investment Today: <span className="text-yellow-400">{offer.price}</span></h3>
                </div>

                <SectionTitle className="text-center">Your Success is Guaranteed</SectionTitle>
                <div className="p-8 border-4 border-dashed border-yellow-400 bg-yellow-50 rounded-lg text-center break-inside-avoid">
                    <h3 className="text-2xl font-bold text-gray-800">Our Promise To You</h3>
                    <P className="italic text-xl mt-2">"{offer.guarantee}"</P>
                    <P className="mt-4">You have nothing to lose and everything to gain. The only risk is doing nothing.</P>
                </div>
                
                <div className="mt-12 text-center p-8 bg-green-500 text-white rounded-lg break-inside-avoid">
                     <h3 className="text-4xl font-black">Ready to Get Started?</h3>
                     <P className="text-lg mt-2 text-green-100">Click the button below to claim your spot and start your transformation today!</P>
                     <div className="mt-6 p-4 bg-white text-green-600 font-bold text-2xl rounded">
                        [ YOUR CALL TO ACTION BUTTON HERE ]
                     </div>
                </div>

            </main>
        </div>
    );
};

export default LandingPagePdf;