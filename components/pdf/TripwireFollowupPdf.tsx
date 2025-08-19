
import React from 'react';
import { GeneratedDownsell, GeneratedOffer } from '../../types';

// --- Reusable PDF Components ---
const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => <h1 className="text-4xl font-black text-gray-900 tracking-tight">{children}</h1>;
const Subtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="text-lg text-gray-600 mt-2">{children}</p>;
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-yellow-400 pb-3 mb-6 mt-10 break-after-avoid">{children}</h2>;
const Paragraph: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <p className={`text-base text-gray-700 leading-relaxed my-3 ${className || ''}`}>{children}</p>;
const HighlightBox: React.FC<{ children: React.ReactNode, title?: string }> = ({ children, title }) => (
    <div className="p-6 rounded-lg border border-yellow-200 bg-yellow-50 my-4 break-inside-avoid">
        {title && <h3 className="text-xl font-bold text-yellow-800 mb-2">{title}</h3>}
        {children}
    </div>
);

// --- PDF Content Sections ---
const CelebrationSection: React.FC<{ downsell: GeneratedDownsell }> = ({ downsell }) => (
    <div className="break-inside-avoid">
        <SectionTitle>Congratulations on Your Smart Choice!</SectionTitle>
        <Paragraph>First off, a huge congratulations on grabbing the <strong>{downsell.offer.name}</strong>!</Paragraph>
        <Paragraph>You've already done what 99% of people only talk about: you took action. You've proven that you're serious about solving <strong className="font-semibold">"{downsell.offer.stack[0].problem}"</strong> and getting real results.</Paragraph>
        <HighlightBox title="You've Already Won">
            <Paragraph>By making that small investment, you've received a tool that will give you a quick win. This is the foundation for all future success. Celebrate this step!</Paragraph>
        </HighlightBox>
        <Paragraph>But... what if that quick win was just the beginning? What if it was the key to unlocking a much bigger, life-changing transformation?</Paragraph>
    </div>
);

const TheGapSection: React.FC<{ downsell: GeneratedDownsell; gso: GeneratedOffer }> = ({ downsell, gso }) => (
    <div className="break-inside-avoid">
        <SectionTitle>The Gap: From a Quick Win to a Total Transformation</SectionTitle>
        <Paragraph>The <strong>{downsell.offer.name}</strong> is designed to solve an immediate, frustrating problem. It puts out the "fire" that's right in front of you.</Paragraph>
        <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-bold text-red-800">The Problem You Just Solved</h4>
                 <p className="text-gray-700 mt-2 italic">"{downsell.offer.stack[0].problem}"</p>
            </div>
             <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-bold text-green-800">The Quick Win You Achieved</h4>
                 <p className="text-gray-700 mt-2 italic">"{downsell.offer.stack[0].solution}"</p>
            </div>
        </div>
        <Paragraph className="mt-6">But solving that one problem often reveals a much bigger opportunity. Now that the "fire" is out, you can focus on building the dream house.</Paragraph>
        <HighlightBox title="The Real Goal You're Chasing">
             <p className="text-xl text-center font-bold text-gray-800 italic">"{gso.promise}"</p>
        </HighlightBox>
        <Paragraph>This is the ultimate destination. This is the "dream come true" result. And it requires a complete plan, not just one tool.</Paragraph>
    </div>
);

const GsoIntroSection: React.FC<{ gso: GeneratedOffer }> = ({ gso }) => (
    <div className="break-inside-avoid">
        <SectionTitle>Introducing: The Ultimate Solution</SectionTitle>
        <div className="text-center p-8 bg-gray-800 text-white rounded-lg">
            <h2 className="text-4xl font-black tracking-tight text-yellow-400">{gso.name}</h2>
        </div>
        <Paragraph className="text-center text-lg italic mt-4">This is our complete, A-to-Z system for helping you achieve <strong className="font-semibold">{gso.promise}</strong>.</Paragraph>
        <Paragraph>We created this because we saw too many people get a small win and then get stuck, not knowing how to get to the next level. The <strong>{gso.name}</strong> is the entire roadmap. It contains everything you need, all in one place, to guarantee your success.</Paragraph>
    </div>
);

const GsoStackSection: React.FC<{ gso: GeneratedOffer }> = ({ gso }) => (
     <div className="break-inside-avoid">
        <SectionTitle>What's Inside The "{gso.name}"</SectionTitle>
        <Paragraph>This isn't just one more tool. It's a complete arsenal of solutions, each designed to solve a specific problem on your journey to success.</Paragraph>
        <div className="space-y-3 mt-4">
            {gso.stack.map((item, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg border-l-4 border-green-500 transform transition-all hover:scale-105 hover:shadow-lg break-inside-avoid">
                    <div className="flex justify-between items-start">
                        <p className="font-bold text-gray-800 text-lg flex-grow pr-4">{item.solution}</p>
                        <p className="font-black text-green-600 text-lg whitespace-nowrap">{item.value}</p>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                        <strong className="font-semibold">Solves this frustrating problem:</strong> {item.problem}
                    </p>
                </div>
            ))}
        </div>
    </div>
);

const PriceAndGuaranteeSection: React.FC<{ gso: GeneratedOffer }> = ({ gso }) => (
    <div className="break-inside-avoid">
        <SectionTitle>Your Exclusive Upgrade Offer</SectionTitle>
        <Paragraph>Because you've already taken action and proven you're serious, we want to make this an absolute no-brainer for you.</Paragraph>
        <div className="mt-8 bg-white p-6 rounded-lg border-2 border-yellow-300 text-center">
             <p className="text-lg font-semibold text-gray-600">Total Real World Value:</p>
             <p className="text-4xl font-bold text-red-600 line-through">{gso.totalValue}</p>
             <p className="text-lg font-semibold text-gray-800 mt-6">Your Special Upgrade Price:</p>
             <p className="text-6xl font-black text-yellow-500 animate-pulse">{gso.price}</p>
        </div>
        <div className="mt-12">
            <h3 className="text-xl font-bold text-center text-gray-800">And It's Completely Risk-Free...</h3>
            <HighlightBox>
                <p className="text-2xl text-center text-gray-700 italic leading-relaxed">"{gso.guarantee}"</p>
            </HighlightBox>
            <Paragraph className="text-center">You have absolutely nothing to lose and a life-changing result to gain.</Paragraph>
        </div>
    </div>
);

const CtaSection: React.FC = () => (
    <div className="break-inside-avoid">
        <SectionTitle>Your Two Choices</SectionTitle>
        <Paragraph>Right now you stand at a crossroads. You have two paths you can take.</Paragraph>
        <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="p-4 bg-gray-100 rounded-lg border">
                <h4 className="font-bold text-gray-800 text-center">Path 1: Go It Alone</h4>
                 <Paragraph className="text-sm">You can take the quick win you got from the first offer and try to figure out the rest on your own. You might get there eventually, through trial and error, but it will be slow, frustrating, and expensive.</Paragraph>
            </div>
             <div className="p-4 bg-green-100 rounded-lg border-2 border-green-400">
                <h4 className="font-bold text-green-800 text-center">Path 2: Follow The Proven Roadmap</h4>
                 <Paragraph className="text-sm">You can choose to invest in a complete, step-by-step system that has been proven to work. You can get the result you want faster, easier, and with a guarantee that removes all the risk.</Paragraph>
            </div>
        </div>
        <HighlightBox>
             <p className="text-2xl text-center font-bold text-gray-800">Which path will you choose?</p>
             <p className="text-center mt-4">If you're ready to take the fast track to success, click the link below to upgrade your order now.</p>
        </HighlightBox>
    </div>
);

interface TripwireFollowupPdfProps {
  downsell: GeneratedDownsell;
  gso: GeneratedOffer;
}

const TripwireFollowupPdf: React.FC<TripwireFollowupPdfProps> = ({ downsell, gso }) => {
  if (!downsell?.offer) {
    return <div className="p-8 bg-white font-sans pdf-container">Oops! We could not find the offer information.</div>;
  }
  
  return (
    <div className="p-12 bg-white font-sans text-gray-900">
        <header className="text-center mb-10 pb-4 border-b-4 border-yellow-400">
            <p className="text-yellow-500 font-bold uppercase tracking-widest">Your Growth Path</p>
            <Title>From First Step to Final Victory</Title>
            <Subtitle>You've taken the first step. Now, let's look at the amazing journey ahead.</Subtitle>
        </header>

        <main>
            <CelebrationSection downsell={downsell} />
            <TheGapSection downsell={downsell} gso={gso} />
            <GsoIntroSection gso={gso} />
            <GsoStackSection gso={gso} />
            <PriceAndGuaranteeSection gso={gso} />
            <CtaSection />
        </main>
    </div>
  );
};

export default TripwireFollowupPdf;
