
import React from 'react';
import { BusinessData, GeneratedPlaybook } from '../../types';

// --- Reusable PDF Components ---
const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => <h1 className="text-5xl font-black text-gray-900 tracking-tight text-center">{children}</h1>;
const Subtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="text-xl text-gray-600 mt-4 text-center">{children}</p>;
const ChapterTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h2 className="text-4xl font-bold text-gray-800 border-b-4 border-yellow-400 pb-3 mb-8 mt-12 break-after-page">{children}</h2>;
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h3 className="text-3xl font-bold text-gray-800 mb-4 mt-8 break-after-avoid">{children}</h3>;
const SubSectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h4 className="text-2xl font-bold text-gray-700 mb-3 mt-6 break-inside-avoid">{children}</h4>;
const P: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <p className={`text-base text-gray-700 leading-relaxed my-4 ${className || ''}`}>{children}</p>;
const Quote: React.FC<{ children: React.ReactNode; author?: string }> = ({ children, author }) => (
    <blockquote className="my-6 p-6 border-l-8 border-gray-300 bg-gray-100 rounded-r-lg break-inside-avoid">
        <p className="text-xl italic text-gray-800 leading-relaxed">"{children}"</p>
        {author && <cite className="block text-right text-gray-600 mt-2 not-italic">- {author}</cite>}
    </blockquote>
);
const UL: React.FC<{ items: (string | React.ReactNode)[] }> = ({ items }) => (
    <ul className="list-disc list-inside space-y-2 my-4 pl-4">
        {items.map((item, i) => <li key={i} className="text-base text-gray-700">{item}</li>)}
    </ul>
);

const HighlightBox: React.FC<{ children: React.ReactNode, title: string, color?: 'yellow' | 'blue' }> = ({ children, title, color = 'yellow' }) => {
    const bgColor = color === 'yellow' ? 'bg-yellow-50' : 'bg-blue-50';
    const borderColor = color === 'yellow' ? 'border-yellow-300' : 'border-blue-300';
    const titleColor = color === 'yellow' ? 'text-yellow-800' : 'text-blue-800';
    return (
        <div className={`my-6 p-6 rounded-lg border-2 ${borderColor} ${bgColor} break-inside-avoid`}>
            <h3 className={`text-2xl font-bold ${titleColor} mb-3`}>{title}</h3>
            {children}
        </div>
    );
};


// Main component
const ConceptsGuidePdf: React.FC<{ businessData: BusinessData; playbook: GeneratedPlaybook; }> = ({ businessData, playbook }) => {
    // The content is now static from the user prompt. Props are kept for consistency.
    return (
        <div className="p-12 bg-white font-sans text-gray-900">
            {/* Header */}
            <header className="mb-12 pb-6 border-b-8 border-yellow-400">
                <Title>$100M Money Models: The Training</Title>
                <Subtitle>The Unofficial Transcript of the Alex Hormozi Training</Subtitle>
            </header>

            <main>
                <ChapterTitle>Introduction: Context is King</ChapterTitle>
                <P>
                    We are going to be covering all of this stuff in the next few hours together. You'll also notice that some of these things correspond with the chapters of the book "$100M Money Models". You'll also know that some of these things are not included in the book, and that is because some of these things are extras. They are Easter eggs; they're my gift to you for actually making it over to the internet where you can watch with your eyeballs and listen with your earballs. I will have things that are additional to the book chapters that go in a little bit more depth because with a book you have to be super, super constrained in terms of attention. With videos, they can be a little bit more engaging, and so I cover a little few more examples, few different examples, and add in some chapters that I ended up cutting out in the final version. So enjoy.
                </P>

                <SectionTitle>Why Does This Book Exist?</SectionTitle>
                <P>
                    The "$100M Offers" book answered the first question: <strong>What do I sell?</strong> Because if you have nothing to sell, there's nothing you can do. Now from there, once you have something to sell, you need somebody to sell it to, because you still can't get money unless you have a person who gives you that money. "$100M Leads" answered that question, which is how to get strangers to want to buy your stuff.
                </P>
                <P>
                    So why does "Money Models" exist? Well, "Money Models" exists between both of these books, which is <strong>how to monetize</strong>. If you have something to sell and then you have people to sell it to, then you have the okay, well how do I get them to give me money? How do I get them to buy more stuff from me? How do I actually make a profit from this? And how do I profitably advertise in order to let even more people know? All of those questions were answered in this book.
                </P>
                <Quote author="Isaac Newton">
                    If I have seen further than others, it is by standing upon the shoulders of giants.
                </Quote>
                <P>
                    My goal is to pass as much on to you as I possibly can and hopefully make you lots and lots of money. I'm gonna die so are you and at least we can share some stuff. Big picture, we're all here because other people in the past documented what they did for generations. We may not remember the names but we do pass on the learnings. And so that's kind of my goal here. Education is the greatest legacy of all.
                </P>
                
                <SectionTitle>The Problem This Book Solves</SectionTitle>
                <P>Most advertising isn't profitable, aka people lose money getting customers. Let me explain how this works. Let's say you make $1,000 in profit per customer over the lifetime (Lifetime Gross Profit or LTGP). It costs you $100 to get a customer (Cost to Acquire a Customer or CAC). Your LTGP to CAC ratio is 10 to 1, which means for every dollar you put in, you get $10 back out. You should make that trade every time.</P>
                <P>But what if you make the thousand dollars in a bulk payment 12 months later? That means you put a hundred dollars out today and then you do all this work and then you get paid a year later. You should still make the trade, but you're gonna have a lot of cash flow problems. You would either have to burn your own savings, which sucks, or you'd have to burn other people's savings through debt and equity, meaning you sell portions of your business in order to get more cash.</P>
                <HighlightBox title="The Better Way: Door #3">
                    <P>Make more than $100 in profit in the first 30 days for this particular instance. This book is door three.</P>
                </HighlightBox>
                
                <SectionTitle>The Solution: Client Financed Acquisition (CFA)</SectionTitle>
                <P>The solution is something I call Client Financed Acquisition or Customer Financed Acquisition (CFA). The point of that is to make money faster. This enters the element of speed into the conversation. Not just how much you spend and how much you make back, but how fast you make it back. Because how fast you make it back can be the thing that unlocks all the growth in your business or tanks your business overnight.</P>
                <P className='font-bold'>Customer Financed Acquisition (CFA) is a process in which gross profit generated from a single client within the first 30 days is greater than the cost of acquiring that customer.</P>
                
                <ChapterTitle>The Three Numbers That Matter</ChapterTitle>
                <P>If you're looking closely, you may notice that there are three numbers that make the biggest difference here.</P>
                <UL items={[
                    "CAC (Cost to Acquire Customer)",
                    "30-Day Payback Period",
                    "Gross Profit (GP)"
                ]} />
                <P>These three metrics triangulate acquisition. CAC is how much it costs, GP is how much profit you make, and a short payback period is how long it takes you to make that money back. Ideally you have low CAC, high GP, and a short payback period. The outcome is more money, faster. The rest of this is all about how.</P>

                <SectionTitle>Deep Dive #1: Cost to Acquire Customer (CAC)</SectionTitle>
                <P>This is all the cost required to sell a new customer: advertising dollars, payroll for media buyers, creative teams, software, sales commissions, salaries, etc. To calculate it, sum all the money you spend to get new customers and divide by how many customers you got.</P>
                <SubSectionTitle>How to Improve CAC</SubSectionTitle>
                <P>Fundamentally, if you had nothing else, you improve CAC by making better offers. Better offers get you higher response rates, and you'll convert a higher percentage of people.</P>
                <Quote>The two most powerful words in advertising are FREE and NEW. Use them.</Quote>
                <HighlightBox title="The Power of FREE: The Penny Gap">
                    <P>Researcher Dan Ariely ran the "Hershey Kiss Test." He would give away Hershey kisses for free or for a penny. The difference? <strong>Nine times more people took the free Hershey Kiss versus the one-penny kiss.</strong></P>
                    <P>If you want to generate maximum lead flow, harness the power of free. If you get too many low-quality leads, don't abandon the offer. Instead, add friction to increase the quality (e.g., more form fields, longer videos to watch, more steps).</P>
                </HighlightBox>

                <SectionTitle>Deep Dive #2: Gross Profit (GP)</SectionTitle>
                <P>Gross profit is the difference between the price and the cost of goods sold (COGS). Most businesses think they need cheaper leads when in reality they need to make more money per customer.</P>
                <P>My observation is that the CAC between competitors is often fairly similar. The difference between the whales and the minnows is how much they make per customer in gross profit.</P>
                <Quote author="Dan Kennedy (paraphrased) & Alex Hormozi">He who can spend the most to acquire a customer wins. My version: He who makes his customer worth more to his business than to his competition wins.</Quote>
                <SubSectionTitle>How to Improve Gross Profit</SubSectionTitle>
                <P>Without altering price or cost structure, the three easiest ways to remember are <strong>more, better, new</strong>.</P>
                 <UL items={[
                    "Sell MORE of the stuff (quantity or duration).",
                    "Sell a BETTER quality version of the thing.",
                    "Sell a NEW complementary thing (e.g. fries and a Coke)."
                ]} />

                <SectionTitle>Deep Dive #3: Payback Period</SectionTitle>
                <P>Payback Period is how long it takes until your gross profit is greater than your CAC. In other words, how long does it take to break even? The shorter it is, the easier it is to scale your advertising.</P>
                <P>The problem is that businesses take too long to break even. They also feel guilty making multiple offers in a row because they think they'll bother people. They are wrong. The people who feel this way are poorer than they should be.</P>
                <P>There are short windows of time that people go into a hyper-buying cycle. If you do not take advantage of this, you will miss out.</P>
                <HighlightBox title="When to Upsell: The 5 Key Moments">
                    <P>You sell at the point of greatest deprivation, not greatest satisfaction. Here are the best times to make another offer:</P>
                     <UL items={[
                        "Immediately after the first sale.",
                        "At the 'next step' (24-72 hours later, e.g., an onboarding call).",
                        "After they have a big win (which creates a new problem to solve).",
                        "At the halfway point of your service.",
                        "The last chance (at the end of your service)."
                    ]} />
                </HighlightBox>
                
                <ChapterTitle>The Three Levels of Advertising</ChapterTitle>
                <HighlightBox title="Level 1: The Bare Minimum" color="blue">
                    <P className="font-bold">Lifetime Gross Profit > CAC</P>
                    <P>You've got to make more money over the lifespan of the customer than it cost you to get them. Ideally, at least 3x more. If you don't have that, you don't have a business.</P>
                </HighlightBox>
                <HighlightBox title="Level 2: The Freedom Level" color="blue">
                    <P className="font-bold">30-Day Gross Profit > CAC</P>
                    <P>You make more money than it costs you to get a customer in 30 days. Why 30 days? Because that's the amount of time any business can borrow money with zero interest in the form of a credit card. You never spend your own money to grow. You can use the credit card to get customers, then pay the card back, then reuse the money. This is customer-financed acquisition.</P>
                </HighlightBox>
                <HighlightBox title="Level 3: The God Tier" color="blue">
                    <P className="font-bold">30-Day Gross Profit > 2x CAC</P>
                    <P>You make gross profit more than twice your CAC in the first 30 days. The result is never being limited by money at all. One customer pays you back for the debt you have but also pays for the next customer. This is the key to unlimited scale for advertising. You have to compound your advertising. This is where you get paid to grow.</P>
                </HighlightBox>

                <ChapterTitle>The 4 Types of Offers That Create Money Models</ChapterTitle>
                <P>A money model is a deliberate series of offers designed to increase how many customers you get, how much they pay, and how fast they pay it.</P>
                <div className='p-4 bg-gray-100 rounded-lg my-4 text-center'>
                    <p className='text-2xl font-bold'>The Four Prongs</p>
                    <p className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-4'>
                        <span className='p-2 bg-yellow-100 rounded'>1. Attraction Offers</span>
                        <span className='p-2 bg-green-100 rounded'>2. Upsell Offers</span>
                        <span className='p-2 bg-blue-100 rounded'>3. Downsell Offers</span>
                        <span className='p-2 bg-purple-100 rounded'>4. Continuity Offers</span>
                    </p>
                </div>
                 <UL items={[
                    "<strong>Attraction Offers:</strong> Liquidate CAC (turn strangers into customers).",
                    "<strong>Upsell Offers:</strong> Maximize profit (get customers to spend more).",
                    "<strong>Downsell Offers:</strong> Maximize conversion (get a 'yes' from people who said 'no').",
                    "<strong>Continuity Offers:</strong> Stabilize cash flow (keep people buying)."
                ]} />
                <P>We will now begin our ride-along apprenticeship through each of these offers.</P>
                
                {/* ... This is where the long list of specific offers begins ... */}
                {/* Attraction Offers */}
                <ChapterTitle>Attraction Offers: Get More Customers</ChapterTitle>
                <SectionTitle>1. Win Your Money Back</SectionTitle>
                <P>You set a goal for your customer and tell them how to reach it. If they reach it, they qualify to get their money back (or get it as store credit). This becomes a high-cashflow, choreographed onboarding process.</P>
                <P>The magic is not in the people who fail; it's that you upsell the winners halfway through. You say, "Hey, you're down 12 pounds. The challenge is just a kickstart to your real goal. Let's credit the money you put down towards your long-term goal right now."</P>
                <HighlightBox title="Key Idea">
                    <P>The criteria to 'win' should be actions that get them results, advertise your business (e.g., social media posts), and get them into sales appointments with you (e.g., mandatory progress check-ins).</P>
                </HighlightBox>

                <SectionTitle>2. Free Giveaways</SectionTitle>
                <P>You advertise a chance to win a big prize (your core service, valued high) in exchange for contact info. After picking one winner, you offer everyone else a "partial scholarship" or a big discount on the prize they already said they wanted.</P>
                <P>This works because you get to sell the hell out of your grand prize. People are highly engaged because they imagine winning it. Then, you contact everyone who didn't win and offer them the thing they already desire at a great price.</P>
                 <HighlightBox title="Key Idea">
                    <P>You must give the grand prize away. Ask detailed qualifying questions in the entry form to get sales ammo. A killer tactic is "Refer a winner and you win too" to get viral leads.</P>
                </HighlightBox>

                <SectionTitle>3. The Decoy Offer</SectionTitle>
                <P>You advertise a lesser, smaller, or simpler version of your premium offer (e.g., "Free 21-Day Transformation"). When leads come in, you present them with two options: the free "decoy" option (which is technically what you advertised but is clearly inferior) and a much more valuable premium option for a price.</P>
                <P>Example: The free version is one workout a week in-person and an at-home course. The premium version is unlimited workouts, personalized nutrition, and a results guarantee. 70-80% of people will choose the premium option. You close almost everyone on something.</P>
                 <HighlightBox title="Key Idea">
                    <P>The contrast between the decoy and the premium offer must be huge. If too many people take the free offer, your free offer is too good, and your paid offer isn't good enough.</P>
                </HighlightBox>
                
                <SectionTitle>4. Buy X, Get Y Free</SectionTitle>
                <P>This is more powerful than a simple discount. "Buy 2, Get 1 Free" is the same as 33% off, but it feels like a much better deal. You can reframe pricing (e.g., sell one $600 boot and give two "free") or offer a true discount (sell one $400 boot and give two "free").</P>
                <P>The key is to make the "Get Y Free" part bigger than the "Buy X" part. "Buy 1, Get 2 Free" is better than "Buy 2, Get 1 Free."</P>
                 <HighlightBox title="Key Idea">
                    <P>The "free" things can be different and lower-cost than the "paid" thing. For example, "Buy one shirt, get three pairs of socks free" can outperform "Buy one shirt, get one shirt free" because of the perception of getting more items.</P>
                </HighlightBox>
                
                <SectionTitle>5. Pay Less Now or Pay More Later</SectionTitle>
                <P>You give people a choice: pay a full price later (e.g., $300 after a 3-hour training) or pay a discounted price now (e.g., $97 now). This removes all risk. You can advertise it as "Free" because they can pay $0 down.</P>
                <P>This works because you get their credit card on file, which dramatically increases show-up rates. Then, on the thank you page or immediately after they agree, you make the "Pay Less Now" offer with a discount and bonuses. Many will take it, giving you immediate cash flow.</P>
                
                <SectionTitle>6. (Bonus) Free With Consumption</SectionTitle>
                <P>You give away a high-value piece of content (webinar, multi-day challenge, PDF, live event). The content provides real value but also systematically breaks the false beliefs a prospect has that prevent them from buying. The bigger the plane, the longer the runway—the more expensive your offer, the more time and value you need to provide for free upfront.</P>
                <P>By the end of the consumption period, you have reverse-engineered trust, and making the sale for your main offer becomes much easier.</P>
                
                {/* Upsell Offers */}
                <ChapterTitle>Upsell Offers: Maximize Profit</ChapterTitle>
                <P>An upsell is simply whatever you offer next. Every offer opens the door to an upsell. They often make up the majority of the profit in a business.</P>

                <SectionTitle>1. The Classic Upsell</SectionTitle>
                <P>The frame for this is "You can't have X without Y." You don't want a burger without fries. You don't want a storage unit without a lock. You give away something for free or cheap (the burger) and then strongly encourage the necessary add-on (the fries).</P>
                <P>A key tactic is the "no-sale sale." After a purchase, you ask, "You don't want anything else, do you?" People are conditioned to say "no," which in this context means "No, I don't want anything *in addition to* the upsell you just assumed I'm taking."</P>
                
                <SectionTitle>2. The Menu Upsell (My Favorite)</SectionTitle>
                <P>This is a deadly four-step process for selling multiple items.</P>
                <ol className="list-decimal list-inside space-y-2 my-4 pl-4 font-semibold">
                    <li><strong>Unsell:</strong> Start by telling them what they DON'T need and crossing it off a list. "You're not trying to gain weight, so we can cross off the weight gainer." This builds immense trust.</li>
                    <li><strong>Prescribe:</strong> Now that they trust you, tell them exactly what they DO need and how to use it. "You're going to take two of these in the morning and one at night." You assume the sale.</li>
                    <li><strong>Ask A or B:</strong> Instead of asking "yes or no," ask a preference question. "Do you prefer vanilla or chocolate?" Either answer is a "yes" to buying.</li>
                    <li><strong>Make it Easy to Pay:</strong> Use the "card on file" close. "Do you want to use the card ending in 1234?" This removes the friction and pain of making a new payment decision.</li>
                </ol>

                <SectionTitle>3. The Anchor Upsell</SectionTitle>
                <P>This is brute force. You offer the premium, wildly expensive item first (e.g., a $16,000 suit). The customer will gasp. This is the "anchor." Then you come to the rescue by offering a much cheaper alternative that has the same primary features but lacks secondary features they don't care about (e.g., a $2,000 suit without the fancy brand name).</P>
                <P>The customer feels like they got a massive deal, and you often sell them for far more than they originally budgeted. Some customers (1 in 10) will actually buy the anchor, dramatically increasing your average profit.</P>

                <SectionTitle>4. The Rollover Upsell</SectionTitle>
                <P>You credit some or all of a customer's previous purchase towards your next, more expensive offer. This works incredibly well to re-engage old customers ("I see I owe you a $500 credit..."), save upset customers ("Let me credit what you paid towards the thing you really need"), and even steal competitors' customers ("I'll credit what you paid them towards my service").</P>
                
                {/* Downsell Offers */}
                <ChapterTitle>Downsell Offers: Maximize Conversion</ChapterTitle>
                <P>A downsell is what you offer after someone says "no." The cardinal rule: NEVER offer the same thing for less money. This destroys trust. Instead, you offer something different for less money. You change what they get or how they pay.</P>
                
                <SectionTitle>1. Payment Plan Downsells</SectionTitle>
                <P>Instead of lowering the price, you just spread it out over time. A key tactic is to present the higher payment-plan price first, then offer a "discount" for paying in full. This rewards paying in full rather than punishing paying over time.</P>

                <SectionTitle>2. Free Trial with Penalty</SectionTitle>
                <P>This is a powerful downsell. You offer a free trial, but they only get it for free if they meet certain terms (the same terms from your Win Your Money Back offer). If they don't do the work (show up, post online, attend check-ins), their card on file gets charged a penalty fee. It's a free trial, but with accountability.</P>

                <SectionTitle>3. Feature Downsells</SectionTitle>
                <P>Here, you lower the price by changing what they get. You can offer less quantity, lower quality, or remove features. A powerful tactic is to remove a very valuable feature (like a guarantee) and only lower the price a little. This often causes the customer to re-sell themselves on the original, higher-priced offer because they now see the value of the feature you removed.</P>
                
                {/* Continuity Offers */}
                <ChapterTitle>Continuity Offers: Stabilize Cash Flow</ChapterTitle>
                <P>Continuity is selling once and getting paid again and again. It dramatically increases Lifetime Value and the overall value of your business.</P>
                
                <SectionTitle>1. Continuity Bonus Offers</SectionTitle>
                <P>You give the customer an awesome, high-value one-time thing (the bonus) if they sign up for your recurring subscription today. The key is that the bonus itself has more perceived value than the first continuity payment. You advertise the free bonus, not the membership.</P>

                <SectionTitle>2. Continuity Discount Offers</SectionTitle>
                <P>You give away products or services for free if the customer commits to a longer-term contract. (e.g., "Get your first 3 months free when you sign up for a year.") There are four ways to apply this discount: upfront (risky cash flow), at the end (rewards commitment), spread over time (good balance), or after the first 1-2 payments (best of both worlds).</P>
                
                <SectionTitle>3. The Waive Fee Offer</SectionTitle>
                <P>You present two options: a month-to-month plan that includes a large one-time setup fee (3-5x the monthly rate), OR a longer-term commitment (e.g., 12 months) where you WAIVE the setup fee entirely. Most people will choose the commitment to avoid the fee. If they cancel early, they simply have to pay the fee they would have paid upfront.</P>
            </main>
        </div>
    );
};

export default ConceptsGuidePdf;