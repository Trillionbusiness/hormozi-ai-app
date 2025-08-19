
import React from 'react';
import { GeneratedPlaybook, GeneratedOffer, OfferStackItem } from '../../types';

// --- Reusable PDF Page Wrapper ---
const PdfSlide: React.FC<{ children: React.ReactNode; pageNumber: number; totalPages: number; themeColor?: 'yellow' | 'blue' | 'gray' }> = ({ children, pageNumber, totalPages, themeColor = 'gray' }) => (
    <div className="bg-white font-sans" style={{ width: '800px', minHeight: '1080px', display: 'flex', flexDirection: 'column', pageBreakAfter: 'always' }}>
        <div className="flex-grow p-12 flex flex-col">
            {children}
        </div>
        <footer className={`p-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center bg-${themeColor}-50`}>
            <span>The Hormozi AI Helper / Your Growth Plan</span>
            <span>Page {pageNumber} of {totalPages}</span>
        </footer>
    </div>
);


// --- Individual Slide Components ---

const TitleSlide: React.FC<{ title: string, subtitle: string }> = ({ title, subtitle }) => (
    <div className="text-center flex flex-col justify-center items-center h-full bg-gray-50 text-gray-800 rounded-lg p-8 border-4 border-yellow-400">
        <p className="text-yellow-600 font-bold uppercase tracking-widest">A Simple Plan to Help You Grow</p>
        <h1 className="text-6xl font-black tracking-tighter mt-4 text-gray-900">{title}</h1>
        <p className="text-xl text-gray-600 mt-6 max-w-2xl">{subtitle}</p>
        <div className="mt-24 border-t-2 border-yellow-400 w-1/4"></div>
    </div>
);

const ProblemSlide: React.FC<{ diagnosis: GeneratedPlaybook['diagnosis'] }> = ({ diagnosis }) => (
    <>
        <h2 className="text-4xl font-bold text-gray-800 border-b-4 border-red-400 pb-2">First, Let's Look at The Real Problem</h2>
        <p className="text-lg text-gray-600 mt-4">Every business is held back by one or two key things. Based on what you told us, here's what's slowing you down the most:</p>
        <div className="mt-8 space-y-6">
            {diagnosis.constraints.map((constraint, i) => (
                <div key={i} className="p-6 bg-red-50 border-l-4 border-red-500">
                    <p className="text-xl text-gray-800 leading-relaxed">"{constraint}"</p>
                </div>
            ))}
        </div>
        <div className="mt-auto pt-8">
            <p className="text-gray-600 text-center">This isn't just a small issue; it's the main bottleneck preventing you from reaching your goals. The good news? We have a plan to fix it.</p>
        </div>
    </>
);

const VisionSlide: React.FC<{ diagnosis: GeneratedPlaybook['diagnosis'] }> = ({ diagnosis }) => (
    <>
        <h2 className="text-4xl font-bold text-gray-800 border-b-4 border-green-400 pb-2">Now, Imagine The Perfect Future</h2>
        <p className="text-lg text-gray-600 mt-4">Instead of focusing on the problem, let's paint a picture of the dream outcome. What if...</p>
        <div className="mt-8 p-8 bg-green-50 border-l-4 border-green-500">
            <p className="text-2xl text-gray-800 leading-relaxed">...you could successfully <strong className="font-semibold">{diagnosis.actions[0]}</strong>?</p>
        </div>
        <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-700">What would that mean for your business?</h3>
            <ul className="list-disc list-inside text-lg text-gray-600 mt-4 space-y-2">
                <li>More money, less stress.</li>
                <li>Happier customers who get better results.</li>
                <li>A predictable system for growth.</li>
                <li>More freedom and time for you.</li>
            </ul>
        </div>
         <div className="mt-auto pt-8">
            <p className="text-gray-600 text-center font-semibold">This isn't just a fantasy. This is the goal. The following offers are the vehicle to get you there.</p>
        </div>
    </>
);

const OfferPromiseSlide: React.FC<{ offer: GeneratedOffer; type: 'Grand Slam' | 'Tripwire' }> = ({ offer, type }) => {
    const themeColor = type === 'Grand Slam' ? 'yellow' : 'blue';
    const offerTypeName = type === 'Grand Slam' ? "Your 'Grand Slam' Offer" : "Your 'Hello' Offer";
    return (
        <div className={`text-center flex flex-col justify-center items-center h-full bg-${themeColor}-50 rounded-lg p-8 border-2 border-${themeColor}-200`}>
            <p className={`font-bold uppercase tracking-widest text-${themeColor}-600`}>{offerTypeName}</p>
            <h2 className={`text-5xl font-black tracking-tighter mt-4 text-gray-900`}>{offer.name}</h2>
            <div className={`mt-12 border-t border-${themeColor}-400 w-1/4`}></div>
            <p className="text-2xl text-gray-700 mt-12 max-w-2xl italic leading-relaxed">"{offer.promise}"</p>
        </div>
    );
};

const ValueStackSlide: React.FC<{ offer: GeneratedOffer; type: 'Grand Slam' | 'Tripwire' }> = ({ offer, type }) => {
    const themeColor = type === 'Grand Slam' ? 'yellow' : 'blue';
    return (
         <>
            <h2 className={`text-4xl font-bold text-gray-800 border-b-4 border-${themeColor}-400 pb-2`}>Here's Everything You Get</h2>
            <p className="text-lg text-gray-600 mt-4">To make this offer irresistible, we've "stacked" the value. We identified every problem you might face and provided a specific solution for each one.</p>
            <div className="mt-6 space-y-3">
                {offer.stack.map((item, index) => (
                    <div key={index} className="bg-gray-100 p-3 rounded-lg border-l-4 border-gray-300 transform transition-all hover:scale-105">
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-gray-800 text-lg flex-grow pr-4">{item.solution}</p>
                        <p className="font-black text-green-600 text-lg whitespace-nowrap">{item.value}</p>
                      </div>
                      <p className="text-gray-600 text-xs mt-1">
                        <span className="font-semibold">This solves the problem of:</span> {item.problem}
                      </p>
                    </div>
                ))}
            </div>
        </>
    );
};

const PriceRevealSlide: React.FC<{ offer: GeneratedOffer, type: 'Grand Slam' | 'Tripwire' }> = ({ offer, type }) => {
    const themeColor = type === 'Grand Slam' ? 'yellow' : 'blue';
     return (
        <div className="flex flex-col h-full">
            <h2 className={`text-4xl font-bold text-gray-800 border-b-4 border-${themeColor}-400 pb-2`}>The Value vs. Your Investment</h2>
            <p className="text-lg text-gray-600 mt-4">Logically, you might be thinking an offer this valuable would be incredibly expensive. And you'd be right.</p>
            
            <div className="flex-grow flex flex-col items-center justify-center text-center mt-8">
                <p className="text-2xl font-semibold text-gray-600">The total value of everything you get is:</p>
                <p className="text-7xl font-bold text-red-500 line-through my-4">{offer.totalValue}</p>

                <p className="text-2xl font-semibold text-gray-800 mt-12">But because we want to guarantee your success, you won't pay that. Your investment is just:</p>
                <p className={`text-8xl font-black text-${themeColor}-500 my-4 animate-pulse`}>{offer.price}</p>
            </div>
        </div>
    );
};

const GuaranteeSlide: React.FC<{ offer: GeneratedOffer, type: 'Grand Slam' | 'Tripwire' }> = ({ offer, type }) => {
    const themeColor = type === 'Grand Slam' ? 'yellow' : 'blue';
    return (
        <>
            <h2 className={`text-4xl font-bold text-gray-800 border-b-4 border-${themeColor}-400 pb-2`}>And It's Completely Risk-Free</h2>
            <div className="mt-12 text-center flex-grow flex flex-col items-center justify-center">
                <h3 className="text-2xl font-bold text-gray-500 uppercase">Our Unbeatable Promise To You</h3>
                <div className={`mt-4 p-12 bg-${themeColor}-50 rounded-lg border-2 border-${themeColor}-200 w-full max-w-3xl`}>
                    <p className="text-3xl text-gray-700 italic leading-relaxed">"{offer.guarantee}"</p>
                </div>
                <p className="mt-8 text-gray-600 max-w-2xl text-lg">This guarantee means you can't lose. The only way you lose is by not taking this opportunity to solve your problem once and for all.</p>
            </div>
        </>
    );
};

const CtaSlide: React.FC = () => (
     <div className="text-center flex flex-col justify-center items-center h-full">
        <h2 className="text-5xl font-black text-gray-800">So, What's Next?</h2>
        <p className="text-xl text-gray-600 mt-6 max-w-2xl">You have a clear picture of the problem, the solution, and an irresistible offer to get you there. The choice is yours.</p>
        <div className="mt-12 pt-12 border-t-2 border-yellow-400 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-800">Your Next Steps:</h3>
            <ol className="text-lg text-gray-700 mt-4 space-y-2 list-decimal list-inside">
                <li>Choose the Grand Slam offer that excites you most.</li>
                <li>Commit to taking action.</li>
                <li>Let's talk to finalize the details and get you started on your growth journey.</li>
            </ol>
        </div>
     </div>
);


const OfferPresentationPdf: React.FC<{ playbook: GeneratedPlaybook }> = ({ playbook }) => {
    const slides: { component: React.ReactNode, theme: 'yellow' | 'blue' | 'gray' }[] = [];

    // --- Build the slide deck ---
    slides.push({ component: <TitleSlide title="Your Growth Blueprint" subtitle={playbook.diagnosis.yourRole} />, theme: 'gray' });
    slides.push({ component: <ProblemSlide diagnosis={playbook.diagnosis} />, theme: 'gray' });
    slides.push({ component: <VisionSlide diagnosis={playbook.diagnosis} />, theme: 'gray' });

    // Offer 1 Slides
    slides.push({ component: <OfferPromiseSlide offer={playbook.offer1} type="Grand Slam" />, theme: 'yellow' });
    slides.push({ component: <ValueStackSlide offer={playbook.offer1} type="Grand Slam" />, theme: 'yellow' });
    slides.push({ component: <PriceRevealSlide offer={playbook.offer1} type="Grand Slam" />, theme: 'yellow' });
    slides.push({ component: <GuaranteeSlide offer={playbook.offer1} type="Grand Slam" />, theme: 'yellow' });
    
    // Offer 2 Slides
    slides.push({ component: <OfferPromiseSlide offer={playbook.offer2} type="Grand Slam" />, theme: 'yellow' });
    slides.push({ component: <ValueStackSlide offer={playbook.offer2} type="Grand Slam" />, theme: 'yellow' });
    slides.push({ component: <PriceRevealSlide offer={playbook.offer2} type="Grand Slam" />, theme: 'yellow' });
    slides.push({ component: <GuaranteeSlide offer={playbook.offer2} type="Grand Slam" />, theme: 'yellow' });
    
    // Downsell/Tripwire Offer Slides
    slides.push({ component: <OfferPromiseSlide offer={playbook.downsell.offer} type="Tripwire" />, theme: 'blue' });
    slides.push({ component: <ValueStackSlide offer={playbook.downsell.offer} type="Tripwire" />, theme: 'blue' });
    slides.push({ component: <PriceRevealSlide offer={playbook.downsell.offer} type="Tripwire" />, theme: 'blue' });
    
    // Closing Slide
    slides.push({ component: <CtaSlide />, theme: 'gray' });

    const totalPages = slides.length;

  return (
    <div>
        {slides.map((slide, index) => (
            <PdfSlide key={index} pageNumber={index + 1} totalPages={totalPages} themeColor={slide.theme}>
                {slide.component}
            </PdfSlide>
        ))}
    </div>
  );
};

export default OfferPresentationPdf;
