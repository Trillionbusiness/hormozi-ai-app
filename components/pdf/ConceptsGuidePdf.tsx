
import React from 'react';
import { BusinessData, GeneratedPlaybook } from '../../types';

// --- Reusable PDF Components ---
const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => <h1 className="text-5xl font-black text-gray-900 tracking-tight">{children}</h1>;
const Subtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="text-xl text-gray-600 mt-2">{children}</p>;
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-yellow-400 pb-3 mb-6 mt-10 break-after-avoid">{children}</h2>;
const P: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <p className={`text-base text-gray-700 leading-relaxed my-3 ${className || ''}`}>{children}</p>;
const HighlightBox: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => (
    <div className="p-6 rounded-lg border-2 border-yellow-200 bg-yellow-50 my-4 break-inside-avoid">
        <h3 className="text-xl font-bold text-yellow-800 mb-2">{title}</h3>
        {children}
    </div>
);
const SubP: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <p className={`text-sm text-gray-600 leading-relaxed mt-2 ${className || ''}`}>{children}</p>;


interface ConceptsGuidePdfProps {
  businessData: BusinessData;
  playbook: GeneratedPlaybook;
}

const ConceptsGuidePdf: React.FC<ConceptsGuidePdfProps> = ({ businessData, playbook }) => {
    return (
        <div className="p-12 bg-white font-sans text-gray-900">
            <header className="text-center mb-12 pb-6 border-b-8 border-yellow-400">
                <Title>Your Business Concepts Explained</Title>
                <Subtitle>Simple explanations for the powerful ideas in your new business plan for your <strong className="text-gray-800">{businessData.businessType}</strong>.</Subtitle>
            </header>

            <main>
                <SectionTitle>Idea #1: Create an Offer So Good People Feel Stupid Saying No</SectionTitle>
                <P>This is the foundation of the whole plan. Instead of just selling a product or service, you create a "Grand Slam Offer." It's a giant package of value that solves a customer's dream problem from every angle, making it an easy "yes."</P>
                <HighlightBox title="The Value Equation: How to Build Your Offer">
                    <P>Every good offer maximizes the good stuff and minimizes the bad stuff. Here's the formula:</P>
                    <div className="text-center my-4 p-4 bg-white rounded-md">
                        <p className="text-lg font-bold">(Dream Outcome × Likelihood of Success) ÷ (Time Delay × Effort & Sacrifice)</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="p-3 bg-green-50 rounded-md">
                            <h4 className="font-bold text-green-800">Dream Outcome:</h4>
                            <SubP>What does your customer secretly wish for? We increase this by painting a vivid picture of their perfect future.</SubP>
                        </div>
                        <div className="p-3 bg-green-50 rounded-md">
                             <h4 className="font-bold text-green-800">Likelihood of Success:</h4>
                            <SubP>How can we prove it will work for them? We increase this with guarantees, testimonials, and step-by-step plans.</SubP>
                        </div>
                        <div className="p-3 bg-red-50 rounded-md">
                             <h4 className="font-bold text-red-800">Time Delay:</h4>
                            <SubP>How long until they get the result? We decrease this by offering quick wins and done-for-you assets.</SubP>
                        </div>
                         <div className="p-3 bg-red-50 rounded-md">
                             <h4 className="font-bold text-red-800">Effort & Sacrifice:</h4>
                            <SubP>How hard is it for them to do? We decrease this with templates, checklists, and easy-to-follow guides.</SubP>
                        </div>
                    </div>
                </HighlightBox>

                <SectionTitle>Idea #2: Get Customers to Pay You to Get More Customers</SectionTitle>
                <P>This is the secret to growing fast without running out of money. It's called "Client-Financed Acquisition" (CFA).</P>
                 <HighlightBox title="The Golden Rule of Growth">
                    <P>For every new customer, the money you make from them in the first 30 days should be at least double what it cost you to get them.</P>
                    <div className="text-center my-4 p-4 bg-white rounded-md">
                        <p className="text-lg font-bold">30-Day Profit > 2x (Cost to Get Customer + Cost to Deliver Service)</p>
                    </div>
                    <P>When you follow this rule, you have a money machine. Each new customer gives you the cash to go out and find two more customers, creating explosive growth.</P>
                </HighlightBox>
                <P>Your plan is built around this idea, using a sequence of offers (your "Money Model Funnel") to make sure you get paid upfront.</P>
                
                <SectionTitle>Idea #3: Find the One Thing That's Holding You Back</SectionTitle>
                <P>A business is like a hose with kinks in it. You don't need to fix the whole hose; you just need to find the biggest kink and straighten it to get the water flowing again.</P>
                <HighlightBox title="The Four Core Constraints (The 'Kinks')">
                    <P>Almost every business problem falls into one of these four categories. Your plan identifies which one is your biggest problem right now so you can focus all your energy there.</P>
                    <ol className="list-decimal list-inside space-y-2 mt-3 text-gray-700">
                        <li><strong className="font-semibold">Leads:</strong> You don't have enough people to talk to about your offer.</li>
                        <li><strong className="font-semibold">Sales:</strong> People are interested, but they aren't buying. You can't turn conversations into cash.</li>
                        <li><strong className="font-semibold">Delivery:</strong> You're selling, but you can't keep customers happy, get them results, or deliver your service without burning out.</li>
                        <li><strong className="font-semibold">Profit:</strong> You might be busy and making sales, but at the end of the month, there's no money left.</li>
                    </ol>
                </HighlightBox>

                <SectionTitle>Idea #4: The Four Money-Making Tools</SectionTitle>
                <P>A great business doesn't just have one offer. It has a set of four types of offers that work together to maximize profit and customer happiness.</P>
                <HighlightBox title="Your Toolkit of Offers">
                    <P>Your plan gives you specific examples of these, but here's what they are:</P>
                     <ol className="list-decimal list-inside space-y-2 mt-3 text-gray-700">
                        <li><strong className="font-semibold">Attraction Offer:</strong> A small, cheap, easy-to-buy thing that turns a stranger into a first-time customer. In your plan, this is your "Hello" Offer.</li>
                        <li><strong className="font-semibold">Upsell Offer:</strong> An offer made right after someone buys, to increase the value of the sale immediately. Your "Profit Path" is a series of these.</li>
                        <li><strong className="font-semibold">Downsell Offer:</strong> A different, often cheaper, offer for people who say "no" to your main offer. It helps you make money from people who would otherwise leave.</li>
                        <li><strong className="font-semibold">Continuity Offer:</strong> A subscription or recurring payment (like a membership) that creates predictable, stable income every month.</li>
                    </ol>
                </HighlightBox>

                <div className="mt-12 text-center p-8 bg-gray-800 text-white rounded-lg break-before-page">
                    <h3 className="text-3xl font-black text-yellow-400">Now You Know The Secrets</h3>
                    <P className="text-lg mt-2 text-gray-300">These simple ideas are the engine behind your entire business plan. Understand them, and you'll be able to grow your business beyond your wildest dreams. Now, go back to your plan and see how they all fit together!</P>
                </div>
            </main>
        </div>
    );
};

export default ConceptsGuidePdf;
