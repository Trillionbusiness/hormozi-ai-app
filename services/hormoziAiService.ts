import { GoogleGenAI, Type, GenerateContentResponse, Content } from "@google/genai";
import { 
    BusinessData, GeneratedPlaybook, OfferStackItem, GeneratedDiagnosis, 
    GeneratedMoneyModelAnalysis, GeneratedMoneyModel, GeneratedMoneyModelMechanisms, 
    GeneratedOperationsPlan, GeneratedOffer, GeneratedDownsell, GeneratedProfitPath, 
    GeneratedMarketingModel, GeneratedSalesFunnel, GeneratedKpiDashboard, ChatMessage,
    GeneratedAccountabilityTracker
} from '../types';

let ai: GoogleGenAI | null = null;
let initializationError: string | null = null;

try {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === '') {
    throw new Error("API_KEY was not provided during the build process. Please check your Netlify environment variables and build command.");
  }
  ai = new GoogleGenAI({ apiKey });
} catch (e) {
  initializationError = e instanceof Error ? e.message : "An unknown error occurred during AI initialization.";
  console.error("Hormozi AI Service Initialization Failed:", initializationError);
}

const getAiInstance = (): GoogleGenAI => {
    if (initializationError) {
        throw new Error(`AI Service failed to initialize: ${initializationError}`);
    }
    if (!ai) {
        // This case should theoretically be caught by the initializationError check, but it's here for safety.
        throw new Error("AI client is not available. Initialization may have failed silently.");
    }
    return ai;
};


const escapeStringForJson = (str: string | undefined | null): string => {
    if (!str) return '';
    return str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
};

const hormoziMonetizationEngine = `
You are an expert business consultant modeled after Alex Hormozi. Your analysis and recommendations are grounded in the principles outlined in "$100M Offers," "$100M Leads," and "$100M Money Models." Your tone is direct, intelligent, and relentlessly focused on creating tangible value. All generated content must be simple, clear, and written at a 3rd-grade reading level. Use active voice and simple verbs.

Your core philosophy is built on achieving cash flow velocity to create a self-funding, "impossible to kill" business. The central equation is: 30-Day Gross Profit > 2x(CAC + COGS). This means every customer must fund the acquisition and fulfillment of the next customer within 30 days.

You will diagnose businesses based on the four core constraints:
1.  Leads: Not enough qualified prospects.
2.  Sales: Inability to convert prospects into customers.
3.  Delivery: Inability to retain customers or fulfill profitably.
4.  Profit: Successful on the surface but poor cash flow/margins.

You will architect solutions using the four primary money model mechanisms:
1.  Attraction Offers: To convert strangers into first-time buyers profitably on day one.
2.  Upsell Offers: To maximize immediate transaction value.
3.  Downsell Offers: To monetize prospects who say "no" to the initial offer.
4.  Continuity Offers: To engineer predictable, recurring revenue.

You will construct "Grand Slam Offers" using the Value Equation: (Dream Outcome x Perceived Likelihood of Achievement) / (Time Delay x Effort & Sacrifice).

The advice you give must be practical, actionable, and customer-centric. Every piece of the playbook you generate must serve the ultimate goal of creating a scalable, profitable business that is not constrained by cash.

Here is a library of Hormozi's core tactical frameworks and mindset principles. You MUST use these concepts to inform your analysis and recommendations, referencing them where appropriate.

--- MOZI MONEY MINUTE & TACTICAL LIBRARY ---

Words I like: The reason it’s taking so long is because you're in a rush. Big things don't happen on small timelines.

Mozi Money Minute: Kill The Price Question
When a prospect asks "How much is it?" you must reply: "It depends on your goal - what made you reach out today?" This reframes the conversation around value, not cost. Price without context is always too expensive. Give them the context first.

Words I like: Stop crying. It’s not happening as fast as you want because you’re not as good as you think you are.

Mozi Money Minute: My biggest split test winner of all time
The largest conversion gains often come from split-testing the tools and integrations in your funnel (schedulers, form builders, page builders). Different tools have different inherent conversion rates. Test them before committing; the revenue impact can be massive.

Words I like: In sales, the person who talks the first after price, loses. Sometimes the best thing to say is nothing.

Mozi Minute: The Silent Close Technique
After asking for the sale, remain silent for at least 8 seconds. This gives the prospect's brain time to process the decision without interruption. Research shows this can increase purchases by 32%. The average salesperson only waits 2.7 seconds.

Words I like: If you can be in a bad mood for no reason, you might as well be in a good mood for no reason.

Mozi Minute: Triple Review Merch Hack
Offer exclusive, high-quality merchandise (e.g., a cool t-shirt) in exchange for honest reviews on three platforms (Google, Yelp, Facebook). The cost per review is minimal, and it creates walking billboards for your brand.

Words I like: If you can’t sit still, ignore notifications, and focus on one task for eight hours straight, never expect to build something great.

Mozi Money Minute: 50% Conversion Rate Boost
Run all marketing copy (emails, web pages, scripts) through a reading level calculator like the Hemingway App. Simplify the language until it is below a 3rd-grade reading level. This makes your message easier for smart people to understand and possible for everyone else.

Words I like: People worry too much about if it’s scalable and not enough about whether it’s valuable.

Mozi Money Minute: Give away better stuff to better people
To generate high-quality leads, give away something with a real hard cost for free, but only to highly qualified prospects. Example: "If you make over $1M per year, I will spend 5 hours with you 1-on-1 to solve [problem]." This attracts your ideal customer and makes the subsequent sale much easier.

Words I like: Most people optimize for income. The wealthy optimize for enterprise value.

Mozi Minute: Wealth Alchemy
The path to significant wealth involves two arbitrage plays: LTV to CAC, and CAC to Enterprise Value. If you spend $10 (CAC) to acquire a customer who generates $30 in annual EBITDA, and your company trades at a 10x multiple, that $10 spend just added $300 to your company's value (a 30x return). The wealthy reinvest profits for another 30x gain instead of taking distributions.

Words I like: You can beat most people if you just stick with it for a year.

Mozi Minute: Cost Centers to Cash Cows
Analyze every expense in your business and ask: "How can customers pay for this?" or "Is there a better version of this that they would pay for?" Example: A gym's water cooler (cost center) becomes a profit center by selling branded water bottles and protein shakes next to it.

Words I like: A good partner multiplies your strengths. A bad one multiplies your weaknesses.

Mozi Minute: TEAM Scoring Method for Partnerships
Evaluate potential partners based on what you lack, using the TEAM acronym:
- Time: Do they have the hours you don't?
- Expertise: Do they have skills you don't?
- Assets: Do they have resources (lists, connections, audience) you don't?
- Money: Can they provide capital?
The best partners bring more than just money.

Words I like: If you can be in a bad mood for no reason, you might as well be in a good mood for no reason.

Mozi Minute: Onboarding = Profit Center
Turn customer onboarding from a cost center into a profit center by integrating affiliate deals. During the onboarding call, have your team guide new customers to sign up for necessary tools and services using your affiliate links. The recurring commissions can often pay for the entire onboarding team.

Words I like: If you’re charging the same amount during your busy times as your empty times, you’re losing money.

Mozi Minute: Time-Based Pricing
If your business has peak and off-peak hours, your prices should reflect that. Charge a premium for high-demand times and offer a discount for low-demand times. This maximizes revenue from your existing capacity. Example: A gym charges less for morning-only access and more for peak evening hours.

Words I like: The easiest way to lose in life is to try to avoid looking bad.

Mozi Minute: 5 Negotiation Tactics That Work
1. BATNA (Best Alternative To a Negotiated Agreement): The person who needs the deal less, wins. Always have other options lined up.
2. Anchor First & Move Small: Set the first number to control the conversation. Make tiny concessions.
3. Multiple Equivalent Offers: Present 2-3 options you'd be happy with to make them reveal what they value.
4. Strategic Reciprocity: Give small concessions on terms to get bigger concessions on price.
5. Framing: Frame your price as an investment with a return, not a cost.

Words I like: Sales isn’t about having the perfect pitch - it’s about asking the right question at the right time.

Mozi Minute: The "One-Question Close"
After presenting your offer, ask: "Based on what we discussed, do you feel like this solves your problem?" Then, shut up for 8+ seconds. If they say "yes," you move to payment. If they say "no," they reveal their true objection.

Words I like: You only need to get rich once. So you might as well work as hard as you can to get it done as fast as you can.

Mozi Money Minute: 5 Horsemen of Stagnation
Common plateaus and the hard choices to solve them:
1. Serve too many avatars → Narrow to your most profitable one and raise prices.
2. Underpriced → Raise prices on new customers, then give existing customers a notice period before their price increases.
3. Overcompensated staff → Change comp for new hires first to gain leverage, then adjust for existing team.
4. Overextended (grew too fast) → Find an operational winner to manage or cut your losses.
5. More than one business → Prune the distraction. Focus on your main thing.

Words I like: Customers forget what you promised, but they never forget how you made them feel.

Mozi Minute: Pick One, Get Both
To leverage the Peak-End bias, after a customer signs up, offer them a choice between two bonuses (e.g., "Bonus A or Bonus B?"). After they choose, surprise them by saying, "You know what? Since you’re awesome, how about I just give you both." This creates delight at a critical moment for no extra cost.

Words I like: The first three months determine the next three years.

Mozi Minute: The 90-Day Payment Lock-In
Customer default risk drops significantly after 3 successful payments. Actively manage this window.
- Days 1-30: High-touch onboarding, focus on quick wins.
- Days 31-60: Stack value, highlight results before the next payment.
- Days 61-90: Lock-in with a review, show them their progress and the future plan.

Words I like: Nothing is ever expensive in isolation, only in relation. But the key to sales is comparing your price to the right other number.

Mozi Minute: The Contrast Close
Frame your price relative to the cost of their problem.
1. State the cost of their problem annually (e.g., "$300k/year in wasted ad spend").
2. Break it down monthly (e.g., "$25k/month").
3. Present your solution's cost (e.g., "$5k/month").
4. Show the contrast ratio (e.g., "Every $1 you invest saves you $5").

Words I like: If you want premium customers, stop selling cheap stuff.

Mozi Minute: $97 beats $47
Testing a higher front-end price (e.g., $97 vs. $49) often attracts a higher quality customer with a significantly higher Lifetime Value (LTV), even if the initial conversion rate is slightly lower. Your front-end price is a customer quality filter.

Words I like: People will believe your future the moment you show it to them.

Mozi Minute: The “Live Demo” Pitch
Instead of just promising future results, give a tiny, live taste of the experience on the sales call. Fix one headline, correct one piece of form, play a live call from another client. Tiny, tangible proof beats a big promise every time.

Words I like: Curiosity is stronger than desire when it comes to getting someone's attention.

Mozi Minute: The Competitor Callback Hack
A highly effective voicemail script: "Hi, this is [your name] calling in regards to [their direct competitor]. Give me a call back when you get a chance." This creates immense curiosity and triggers competitive anxiety, resulting in a high callback rate.

Words I Like: Staying focused as an entrepreneur is like staying sober as an addict. It’s not a one time victory. You have to fight it all day, everyday. Then, wake up & do it again tomorrow.

Mozi Money Minute: WHAT WHO WHEN
A framework for execution in meetings. For every priority action item (WHAT), assign an owner (WHO), and get a commitment for a deadline in hours, not days (WHEN). "What stops you from doing it in the next X hours?"

Words I like: If you could only pick one skill in business, it would be to get other people to do stuff for you.

Mozi Money Minute: 4 Part Persuasion
To persuade someone, make them aware of four things:
1. Add good stuff they get for taking the action.
2. Take away bad stuff for taking the action.
3. Add bad stuff if they do nothing.
4. Take away good stuff if they do nothing.

Words I like: People don't leave companies, they leave conversations that never happened.

Mozi Minute: 67% Increase in Retention
Customers whose problems are resolved in under 5 minutes are 67% more likely to stay. Respond to EVERY inquiry within 5 minutes, even if it's just to acknowledge and set expectations. Speed beats perfection in customer service.

Words I like: How to become an expert: Do more repetitions than anyone else in a narrow field.

Mozi Money Minute: More or better?
Focus your effort where the expected return is highest.
- If you have 1 sales rep, hiring a second rep (+100% output) is better than training the first for a +20% improvement.
- If you have 20 reps, training the whole team for a +20% improvement is likely easier than hiring and training 4 more reps for the same +20% gain.

Words I like: Most businesses obsess over getting more leads when they haven't even fixed what happens when the phone rings.

Mozi Money Minute: BAMFAM (Book-A-Meeting-From-A-Meeting)
Never end a conversation without scheduling the next one. A prospect should never be in "no man's land." If they are hesitant to schedule the next call, treat that as an objection and handle it on the spot.

Words I like: The person who asks the most times gets the most. But they only get those shots on goal because they know how to get into scoring position.

Mozi Money Minute: The 3-7-30 Method for Follow-Up
- First 3 Days: High-value touches (case study, transformation, insight).
- Next 7 Days: Every other day, focus on removing one specific objection per email.
- Next 30 Days: Two touches per week, alternating success stories and industry insights.

Words I like: If you can’t explain why you believe what you believe, it’s not your belief, it’s someone else’s.

Mozi Minute: Money Making Clarity Test
Have every employee write down, in one paragraph, how their specific job makes the company money. Review it with their manager. If they can't articulate it, they don't understand their role's impact, and it's a management failure.

Words I like: When it’s easy, do more. When it’s hard do different.

Mozi Money Minute: Double Weeks
To accelerate a slow department, increase the meeting cadence. Instead of one weekly meeting, have two. This creates two deadlines per week instead of one, effectively doubling the pace of execution and iteration.
 
Words I like: If you want better clients, stop selling cheap stuff.

Mozi Minute: The Premium-Only Menu
Most service businesses kill their profit by offering a "budget tier." In reality, both budget and premium clients choose it. You end up with a business full of your worst offering. The fix: Remove ALL budget options. Only show 3 premium choices. Budget clients will self-disqualify, and quality prospects will show up ready to invest.

Words I like: People help people before they help businesses.

Mozi Minute: The Gift-Review Loop
Have an employee surprise a customer with an unexpected gift. Then, as the owner, ask the customer to leave a review specifically to help that employee get a bonus. The customer feels they are helping a person, not a business, which dramatically increases compliance.

Words I like: The only thing crazier than chasing your goals is expecting other people to understand them.

Mozi Minute: The 4R Customer Journey
Systematically design a customer journey to achieve four outcomes:
- Retain: Map out their first 90 days.
- Review: Ask for a review 72 hours after their first win.
- Refer: Systematize asking for a referral at the moment of peak excitement.
- Resell: Offer the upsell at the moment of greatest need for the next solution.

Words I Like: If you want better friends, get used to seeing them less. Better friends are busy friends.

Mozi Money Minute: Solve For Compounding
To build a massive business, your work needs to stack. There are only two ways:
1. Make something people never stop buying (recurring revenue).
2. Build a network of people who never stop selling (distribution, affiliates).
Without one, you're always starting from zero each month.

Words I like: The best way to hit next year’s goals is to not wait until next year to work on them.

Mozi Money Minute: 80% Gross Margins on Services
Aim for >80% gross margins on services. If you charge $1000, your direct cost of delivery should be less than $200. This provides the cash flow to pay for overhead and reinvest in growth. Most competitors are broke; don't copy their pricing.

Words I like: If your business isn't growing, you're probably being efficient at the wrong things.

Mozi Minute: The Ad Spend Wall
Three bottlenecks stop ads from scaling:
1. Mediocre Creative: You need to produce 10x more ad variations.
2. Weak Free Offer: Your lead magnet must be better than your competitor's paid product.
3. Insufficient Backend LTV: Your monetization isn't strong enough to afford higher CPAs at scale.

Words I like: What got you from zero to a million isn't what's going to get you from 10 to 30 million.

Mozi Minute: The Daily Cost Close
To overcome price objections, break the cost down into a small daily amount ("pennies-a-day"). People compare daily costs to daily purchases (like coffee), not large expenses (like rent). Frame it as "$33 per day," not "$12,000 per year."

Words I like: Many entrepreneurs try to fix demand when they actually have a supply problem.

Mozi Minute: Supply vs Demand Constraints
Diagnose your primary constraint with one question: "If I doubled my marketing budget tomorrow, would I double my business or create a nightmare?"
- Nightmare → Supply constrained. Fix operations, raise prices, or hire.
- Doubled business → Demand constrained. Fix marketing and sales.

Words I like: The fastest way to make more money is to find the conversations that never happened.

Mozi Minute: Better Voicemail Makes You More
Change your generic voicemail to a specific promise: "Hi, you've reached [business]. We're with a customer, but if you leave your name and number, [Sarah] will personally call you back within 15 minutes. And because we made you wait, we'll give you [a valuable free offer]." This creates accountability, removes uncertainty, and boosts callbacks.

Words I like: The reason it's taking so long is because you're in a rush. 

Mozi Minute: The 20 Year Master
Obsessing over "scaling fast" often leads to scaling slowest because entrepreneurs skip foundations. Sometimes you have to slow down to build the proper systems, which allows you to speed up later. You can't have a baby in a month by getting 9 women pregnant.

Words I like: If you have < $10,000 saved up, don’t buy crypto. Invest in the ability to make money.

Mozi Money Minute: Order of Magnitude
Stop thinking in 10% increments. You can't A/B test your way to a 10x. Ask: "What would it take to 10x our [metric]?" The answer is usually a fundamentally different and bigger move, not a small optimization.

Words I like: The cost of settling is higher than the price of ambition. You just pay it later.

Mozi Money Minute: 80/90 Cost Theory
Going from 80% to 90% gross margins isn't a 12.5% improvement in profit; it's a 100% improvement in cost efficiency. At 80% margins, it costs $20 to make $100. At 90% margins, it costs $10. Your cost per sale is halved, giving you double the cash to reinvest.

Words I like: Either sell or don’t sell. No half measures. 

Mozi Money Minute: It’s a bad deal silly (Referrals)
To get partners to refer you, don't offer a 20% fee. Give them one of your services to sell as their own and let them keep 100% of the revenue. You do the work, which gets you the customer, and then you upsell that customer to your core services. Reverse engineer the offer from the partner's perspective.

Words I like: A lot of poor people stay poor because they’re too cheap to get rich.

Mozi Money Minute: Pricing Upsells
Price your upsells fractally. About 20% of your customers have 5x the buying power. If your main offer is $100, create a $500 upsell. If 1 in 5 (20%) take it, you double your revenue. Then, offer a 5x upsell to those buyers ($2,500). If 1 in 5 of them take it, you triple your revenue. Premium clients want premium options.

Words I like: The best marketing is the kind that works.

Mozi Minute: Sign “In the way” Hack
A simple, handwritten A-frame sign placed directly in a customer's walking path is more effective than expensive designed signs. Use it as an internal promotions board, rotating between "gives" (jokes, tips) and "asks" (special offers) to train customers to read it.

Words I like: The market tells you what works, not your feelings. Your job is to listen and act.

Mozi Minute: Test, Don't Guess.
Most people fail because they marry their ideas. Winners date their ideas. Run small, cheap tests on everything: your offer, your ads, your price. If a test wins, you bet big. If it loses, you kill it fast. The market tells you what works, not your feelings. Your job is to listen and act.

Mozi Minute: Messy Action > Perfect Inaction.
The goal isn't to get it right, it's to get it going. Your first plan will be wrong. That's fine. The market will tell you what's right, but only after you take action. Go get feedback from the market with your wallet, not your feelings.

--- NEW PRINCIPLES FROM 'THE NEW SECRET CHAPTER' ---

Words I like: If you want to make money fast, ironically, many times it comes fastest from giving things away. Those who give the most, get the most.

Mozi Money Minute: Get Flow First.
The core business philosophy: Get Flow. Monetize Flow. Then Add Friction. First, generate as much demand and as many leads as possible, even if it's for free. This is the "flow." Once you have a steady stream of interested people, figure out how to make money from them ("monetize flow"). Only after you have a predictable system for making money should you add friction (more steps, higher prices) to improve the quality of your customers and your life. Don't put the cart before the horse.

Words I like: The point of creating a promotion is to enhance your grand slam offer, not change it.

Mozi Money Minute: The Wrapping Paper Principle.
Think of free and discount promotions as wrapping paper for your core premium offer. Their job is to enhance the offer and make it more attractive, not to change what's inside. You can wrap a gift in recycled newspaper or you can put it in a Chanel bag with matte black paper. The gift inside is the same, but the perceived value and attractiveness is wildly different. Use promotions to make your offer irresistible to a cold audience.

Mozi Money Minute: The $50k Burger Math.
High-value offers make your advertising dramatically more profitable. Example: Business #1 sells something for $100 with a $50 profit. Business #2 sells something for $10,000 with a $9,500 profit. To make $9,500, Business #1 needs to make 190 sales. Business #2 only needs one. If you show the $10k offer to the same 190 people, you might only close 5% of them. But that's 9.5 sales, which equals $90,250 in profit. That is 9.5x more profitable than the low-ticket offer. Higher prices can make you more money even with far fewer customers.

Words I like: Bottom line: If I only had one offer to make to convert or my family would be killed, it would be a free offer. I'd rather wade through crappy leads, then figure out how to add friction, than look at an empty calendar.

Mozi Money Minute: The Penny Gap.
The difference in response between something that costs $0.01 and something that is FREE is massive. Researcher Dan Ariely called this the "penny gap." In marketing terms, you can get up to 9x more leads for a free offer than for a one-cent offer. Free is the most powerful offer of all time because it is "something for nothing." If you need to generate maximum lead flow, harness the power of free.

Mozi Money Minute: The 5 Levers of Friction.
When a free offer generates too many low-quality leads, don't abandon the offer. Instead, add friction to increase the quality of the leads you get. The more hoops someone has to jump through, the more qualified they are.
1. Increased Qualifications: State who the offer is for ("You must be a homeowner over 25"). This weeds people out.
2. Increased Information Requirement: Ask for more information in your forms. A phone number is "heavier" than an email. An income question is "heavier" than a name.
3. Increased Number of Steps: A 5-step form (name, email, phone, survey, booking) will get you fewer, but far better, leads than a simple 1-step email opt-in.
4. Forced Consumption: Require prospects to watch a 20-minute video before they can access the call booking link. This pre-indoctrinates them.
5. Advertisement Length: A longer ad, video, or sales page will naturally filter out less-interested people. The people who make it to the end are more committed.

Mozi Money Minute: The Two-Step Sale.
The biggest benefit of a small discount offer (e.g., $19 for a consultation) isn't the money you collect. It's that you get the customer's payment card on file. This makes future sales and upsells seamless because you can just ask, "Do you want to use the card you have on file?" It also dramatically reduces no-shows for appointments, because people almost always show up for things they have paid for, even if it's a small amount. This paves the way for a smooth, multi-step sales process.
`;


// --- SCHEMAS ---

const offerSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        promise: { type: Type.STRING },
        stack: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    problem: { type: Type.STRING },
                    solution: { type: Type.STRING },
                    value: { type: Type.STRING, description: "The specific monetary value of this solution, e.g., '$2,000'." },
                    asset: {
                        type: Type.OBJECT,
                        description: "A mandatory downloadable asset. If the solution IS a tangible asset (template, etc.), this contains its content. If the solution is a service or concept, this contains a 'how-to' guide for it.",
                        properties: {
                            name: { type: Type.STRING, description: "The filename for the asset, e.g., 'High-Converting Ad Template'." },
                            type: { type: Type.STRING, description: "The type of asset, e.g., 'template', 'framework', 'checklist', 'script', 'guide'." },
                            content: { type: Type.STRING, description: "The full, ready-to-use text content of the asset or guide, formatted in simple Markdown." }
                        },
                        required: ["name", "type", "content"]
                    }
                },
                required: ["problem", "solution", "value", "asset"]
            }
        },
        strategyBehindStack: { type: Type.STRING, description: "The strategic rationale behind the composition of the value stack. Explain why these specific elements were chosen to solve the client's problem and create an irresistible offer." },
        totalValue: { type: Type.STRING, description: "The sum total monetary value of all items in the stack, e.g., '$20,000'." },
        guarantee: { type: Type.STRING },
        price: { type: Type.STRING }
    },
    required: ["name", "promise", "stack", "strategyBehindStack", "totalValue", "guarantee", "price"]
};

const diagnosisSchema = {
    type: Type.OBJECT,
    properties: {
        currentStage: { type: Type.STRING },
        yourRole: { type: Type.STRING },
        constraints: { type: Type.ARRAY, items: { type: Type.STRING } },
        actions: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["currentStage", "yourRole", "constraints", "actions"]
};

const modelComparisonSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        metrics: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    label: { type: Type.STRING },
                    value: { type: Type.STRING }
                },
                required: ["label", "value"]
            }
        }
    },
    required: ["title", "description", "metrics"]
};


const moneyModelAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        oldModel: modelComparisonSchema,
        newModel: modelComparisonSchema,
        ltvCacAnalysis: {
            type: Type.OBJECT,
            properties: {
                automationLevel: { type: Type.STRING },
                targetRatio: { type: Type.STRING },
                explanation: { type: Type.STRING }
            },
            required: ["automationLevel", "targetRatio", "explanation"]
        },
        projectedEconomics: {
            type: Type.OBJECT,
            properties: {
                estimatedCAC: { type: Type.STRING },
                targetLTV: { type: Type.STRING },
                projectedRatio: { type: Type.STRING },
                immediateProfit: { type: Type.STRING },
                explanation: { type: Type.STRING }
            },
            required: ["estimatedCAC", "targetLTV", "projectedRatio", "immediateProfit", "explanation"]
        }
    },
    required: ["oldModel", "newModel", "ltvCacAnalysis", "projectedEconomics"]
};

const moneyModelStepSchema = {
    type: Type.OBJECT,
    properties: {
        stepNumber: { type: Type.INTEGER, description: "The sequential number of the step, starting at 1." },
        title: { type: Type.STRING, description: "The title of the step, e.g., 'Step 1: The Attraction Offer'." },
        offerName: { type: Type.STRING, description: "The specific name of the offer in this step." },
        price: { type: Type.STRING, description: "The price point for this offer, e.g., '$499 Upfront'." },
        rationale: { type: Type.STRING, description: "The strategic reason for this step in the sequence." },
        hormoziTactic: { type: Type.STRING, description: "The specific Hormozi tactic being used, e.g., 'Win Your Money Back Challenge'." },
        details: { type: Type.STRING, description: "A detailed breakdown of what this step entails and how to execute it." }
    },
    required: ["stepNumber", "title", "offerName", "price", "rationale", "hormoziTactic", "details"]
};

const moneyModelSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A compelling title for the entire money model, e.g., 'The Client-Financed Acquisition Model'." },
        corePrinciple: { type: Type.STRING, description: "The core financial objective of the model, e.g., 'Generate >2x (CAC + COGS) in Gross Profit within 30 days'." },
        steps: {
            type: Type.ARRAY,
            items: moneyModelStepSchema
        },
        summary: { type: Type.STRING, description: "A concluding summary of why this model is powerful for the business." }
    },
    required: ["title", "corePrinciple", "steps", "summary"]
};

const moneyModelMechanismSchema = {
    type: Type.OBJECT,
    properties: {
        mechanismType: { type: Type.STRING, description: "The type of mechanism: 'Attraction', 'Upsell', 'Downsell', or 'Continuity'." },
        tacticName: { type: Type.STRING, description: "The name of the specific tactic, e.g., 'Win Your Money Back Challenge'." },
        strategy: { type: Type.STRING, description: "A detailed explanation of how this tactic applies to the user's business." },
        example: { type: Type.STRING, description: "A concrete example of an offer using this tactic for this business." },
        implementationNotes: { type: Type.STRING, description: "Practical, step-by-step advice on how to implement this tactic." }
    },
    required: ["mechanismType", "tacticName", "strategy", "example", "implementationNotes"]
};

const moneyModelMechanismsSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        corePrinciple: { type: Type.STRING },
        mechanisms: {
            type: Type.ARRAY,
            description: "An array of exactly 4 mechanisms, one for each type: Attraction, Upsell, Downsell, Continuity.",
            items: moneyModelMechanismSchema
        }
    },
    required: ["title", "corePrinciple", "mechanisms"]
};

const operationsPlanSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        corePrinciple: { type: Type.STRING },
        outcomesAndActivities: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    outcome: { type: Type.STRING },
                    activity: { type: Type.STRING },
                    timeAllocation: { type: Type.STRING },
                    frequency: { type: Type.STRING }
                },
                required: ["outcome", "activity", "timeAllocation", "frequency"]
            }
        },
        bottleneckAnalysis: { type: Type.STRING },
        proposedRoles: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    roleTitle: { type: Type.STRING },
                    responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                    dailyStructure: { type: Type.STRING },
                    keyMetric: { type: Type.STRING }
                },
                required: ["roleTitle", "responsibilities", "dailyStructure", "keyMetric"]
            }
        }
    },
    required: ["title", "corePrinciple", "outcomesAndActivities", "bottleneckAnalysis", "proposedRoles"]
};

const profitPathSchema = {
    type: Type.OBJECT,
    properties: {
        steps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    action: { type: Type.STRING },
                    example: { type: Type.STRING },
                    script: { type: Type.STRING, description: "Optional script. Provide if applicable." }
                },
                required: ["title", "action", "example"]
            }
        }
    },
    required: ["steps"]
};

const marketingModelSchema = {
    type: Type.OBJECT,
    properties: {
        steps: {
            type: Type.ARRAY,
            description: "Exactly 4 marketing model steps.",
            items: {
                type: Type.OBJECT,
                properties: {
                    method: { type: Type.STRING },
                    strategy: { type: Type.STRING },
                    example: { type: Type.STRING },
                    template: { type: Type.STRING, description: "Optional template. Provide if applicable." }
                },
                required: ["method", "strategy", "example"]
            }
        }
    },
    required: ["steps"]
};

const salesFunnelSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        corePrinciple: { type: Type.STRING },
        stages: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    stageName: { type: Type.STRING },
                    goal: { type: Type.STRING },
                    adCopy: {
                        type: Type.OBJECT,
                        properties: {
                            headline: { type: Type.STRING },
                            body: { type: Type.STRING },
                            cta: { type: Type.STRING }
                        },
                        required: ["headline", "body", "cta"]
                    },
                    landingPage: {
                        type: Type.OBJECT,
                        properties: {
                            headline: { type: Type.STRING },
                            elements: { type: Type.ARRAY, items: { type: Type.STRING } },
                            keyFocus: { type: Type.STRING }
                        },
                        required: ["headline", "elements", "keyFocus"]
                    },
                    salesProcess: {
                        type: Type.OBJECT,
                        properties: {
                            step: { type: Type.STRING },
                            scriptFocus: { type: Type.STRING }
                        },
                        required: ["step", "scriptFocus"]
                    },
                    keyMetric: { type: Type.STRING }
                },
                required: ["stageName", "goal", "adCopy", "landingPage", "salesProcess", "keyMetric"]
            }
        }
    },
    required: ["title", "corePrinciple", "stages"]
};

const kpiDashboardSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        corePrinciple: { type: Type.STRING },
        kpis: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    perspective: { type: Type.STRING, description: "'Financial', 'Customer', 'Operational', or 'Marketing'" },
                    description: { type: Type.STRING },
                    formula: { type: Type.STRING },
                    howToMeasure: { type: Type.STRING },
                    example: { type: Type.STRING },
                    importance: { type: Type.STRING }
                },
                required: ["name", "perspective", "description", "formula", "howToMeasure", "example", "importance"]
            }
        }
    },
    required: ["title", "corePrinciple", "kpis"]
};

const downsellSchema = {
    type: Type.OBJECT,
    properties: {
        rationale: { type: Type.STRING },
        offer: offerSchema
    },
    required: ["rationale", "offer"]
};

const trackerActionSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "A unique identifier for the action, e.g., 'action-1-1'." },
        description: { type: Type.STRING, description: "A specific, tangible action the user must take." },
        metric: { type: Type.STRING, description: "The single, specific metric to track the outcome of this action." },
        isComplete: { type: Type.BOOLEAN, description: "The initial state, always false." },
        resultNotes: { type: Type.STRING, description: "The initial state, always an empty string." }
    },
    required: ["id", "description", "metric", "isComplete", "resultNotes"]
};

const trackerPhaseSchema = {
    type: Type.OBJECT,
    properties: {
        phaseNumber: { type: Type.INTEGER, description: "The sequential number of the phase (1, 2, or 3)." },
        title: { type: Type.STRING, description: "A compelling title for the phase, e.g., 'Phase 1: The 7-Day Sprint - Your First Leads'." },
        goal: { type: Type.STRING, description: "The single, clear objective of this phase." },
        actions: {
            type: Type.ARRAY,
            description: "An array of 3-5 high-impact, actionable tasks for this phase.",
            items: trackerActionSchema
        },
        dailyChecklist: {
            type: Type.ARRAY,
            description: "A short list of 2-3 simple, daily recurring tasks for this phase.",
            items: { type: Type.STRING }
        }
    },
    required: ["phaseNumber", "title", "goal", "actions", "dailyChecklist"]
};

const accountabilityTrackerSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        corePrinciple: { type: Type.STRING },
        phases: {
            type: Type.ARRAY,
            description: "An array of exactly 3 sequential phases: Sprint, Systemize, Scale.",
            items: trackerPhaseSchema
        }
    },
    required: ["title", "corePrinciple", "phases"]
};


// --- HELPER FUNCTIONS ---

const generate = async <T,>(prompt: string, schema: any): Promise<T> => {
    const ai = getAiInstance();
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as T;
    } catch (e) {
        console.error("AI Generation Error:", e, "Prompt:", prompt);
        if (e instanceof Error) {
          throw new Error(`Failed to generate valid JSON for the requested content: ${e.message}`);
        }
        throw new Error("An unknown error occurred during AI generation.");
    }
};

const createBusinessContextPrompt = (data: BusinessData): string => {
    const escapedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, escapeStringForJson(value)])
    ) as Record<keyof BusinessData, string>;
    
    let businessStageContext = '';
    if (escapedData.businessStage === 'new') {
        businessStageContext = `
This is a brand new business idea. The user is starting from scratch.
Funding Status: ${escapedData.fundingStatus === 'bootstrapped' ? 'Bootstrapping (no money)' : 'Has funding/capital'}.
IMPORTANT: Tailor your advice for someone at the very beginning of their journey.
- For 'bootstrapped' businesses, focus on sweat equity, low-cost client acquisition (e.g., cold outreach, organic content), and getting to cash flow positive as fast as possible. Your advice should be scrappy and action-oriented.
- For 'funded' businesses, advise on how to intelligently deploy capital for faster growth, testing paid channels, and building systems early. Your advice should focus on leverage and speed.
`;
    } else {
        businessStageContext = `This is an existing business looking to improve and grow.`;
    }

    return `
You are Hormozi AI, an expert business consultant modeled after Alex Hormozi. You are direct, intelligent, and focused on creating immense value and scalable systems. Your advice is practical, actionable, and always customer-centric.

Analyze the following business and generate the requested output in the specified JSON format. Do not include any explanatory text before or after the JSON.

Business Situation:
${businessStageContext}

Business Data:
- Country: ${escapedData.country}
- Currency: ${escapedData.currency}
- Business Type: ${escapedData.businessType}
- Location: ${escapedData.location}
- Monthly Revenue: ${escapedData.monthlyRevenue} ${escapedData.currency}
- Employees: ${escapedData.employees}
- Marketing Methods: ${escapedData.marketingMethods}
- Biggest Challenge: ${escapedData.biggestChallenge}
- Core Offer: ${escapedData.coreOffer}
- Target Client: ${escapedData.targetClient}
- Offer Timeline: ${escapedData.offerTimeline}
- Has Sales Team: ${escapedData.hasSalesTeam}
- Monthly Ad Spend: ${escapedData.monthlyAdSpend} ${escapedData.currency}
- Profit Goal: ${escapedData.profitGoal} ${escapedData.currency}
- Has Certifications: ${escapedData.hasCertifications}
- Has Testimonials: ${escapedData.hasTestimonials}
- Physical Capacity: ${escapedData.physicalCapacity}
- Ancillary Products: ${escapedData.ancillaryProducts}
- Perceived Max Price (value of perfect result): ${escapedData.perceivedMaxPrice} ${escapedData.currency}
- Daily Time Commitment for Growth: ${escapedData.dailyTimeCommitment} hours
`;
};

// --- EXPORTED GENERATION FUNCTIONS ---

export const generateDiagnosis = async (data: BusinessData): Promise<GeneratedDiagnosis> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Based on the business data, provide a diagnosis using Alex Hormozi's stages of business growth. Identify their current stage, their primary role, their top 3-4 constraints, and the top 3-4 actions they must take to get to the next stage. Be brutally honest and direct.`;
    return generate<GeneratedDiagnosis>(prompt, diagnosisSchema);
};

export const generateMoneyModelAnalysis = async (data: BusinessData): Promise<GeneratedMoneyModelAnalysis> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Analyze the business's current money model and propose a new, more effective one based on Hormozi's principles. Compare the 'Old Model' vs. 'New Model'. Project the LTV/CAC analysis and the potential immediate profit from a new customer under the new model. Be specific with numbers, making reasonable assumptions where necessary.`;
    return generate<GeneratedMoneyModelAnalysis>(prompt, moneyModelAnalysisSchema);
};

export const generateMoneyModelMechanisms = async (data: BusinessData): Promise<GeneratedMoneyModelMechanisms> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Generate a "Money Model Toolkit". Provide one specific, powerful tactic for each of the four mechanism types: Attraction, Upsell, Downsell, and Continuity. For each tactic, explain the strategy, provide a concrete example tailored to this business, and give practical implementation notes.`;
    return generate<GeneratedMoneyModelMechanisms>(prompt, moneyModelMechanismsSchema);
};

export const generateMoneyModel = async (data: BusinessData): Promise<GeneratedMoneyModel> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Design a complete, step-by-step money model (value ladder) for this business. Give it a compelling title and core principle. Detail 3-5 sequential steps, each with a specific offer, price point, rationale, and a relevant Hormozi tactic. The goal is to maximize LTV and achieve a client-financed acquisition model.`;
    return generate<GeneratedMoneyModel>(prompt, moneyModelSchema);
};

export const generateOffer1 = async (data: BusinessData): Promise<GeneratedOffer> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Create a compelling "Grand Slam Offer". This is their core, high-ticket offer. It must solve a major pain point and be packed with value. The value stack must have 5-8 elements, each with a downloadable asset (template, guide, etc.). The guarantee must be bold. The price should be a 10x discount from the total value. For each asset, provide the FULL, ready-to-use text content in simple Markdown. This is not a summary; it is the complete asset itself.`;
    return generate<GeneratedOffer>(prompt, offerSchema);
};

export const generateOffer2 = async (data: BusinessData): Promise<GeneratedOffer> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Create a SECOND, alternative "Grand Slam Offer". It should solve the same core problem as the first but from a different angle. Follow all rules: compelling name, dream promise, 5-8 value stack items each with a full Markdown asset, a bold guarantee, and a 10x value-to-price ratio. For each asset, provide the FULL, ready-to-use text content in simple Markdown.`;
    return generate<GeneratedOffer>(prompt, offerSchema);
};

export const generateDownsell = async (data: BusinessData): Promise<GeneratedDownsell> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Create a "Downsell" or "Tripwire" offer. This is a low-cost, high-value, easy-to-say-yes-to offer that solves one small, specific problem. Explain the rationale. The offer should have a name, promise, a stack of 2-4 items (each with a full Markdown asset), a guarantee, and a low price point (e.g., $7-$47). For each asset, provide the FULL, ready-to-use text content in simple Markdown.`;
    return generate<GeneratedDownsell>(prompt, downsellSchema);
};

export const generateMarketingModel = async (data: BusinessData): Promise<GeneratedMarketingModel> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Create a 4-step marketing model to attract ideal customers. Use Hormozi's lead gen strategies (e.g., warm outreach, content, paid ads, referrals). For each of the 4 methods, provide the specific strategy, a concrete example, and a copy-pasteable template if applicable.`;
    return generate<GeneratedMarketingModel>(prompt, marketingModelSchema);
};

export const generateSalesFunnel = async (data: BusinessData): Promise<GeneratedSalesFunnel> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Design a simple, high-converting Sales Funnel. Give it a title and core principle. Detail 2-3 key stages. For each stage, specify the goal, provide ad copy, describe landing page elements, outline the sales process, and identify the single most important metric.`;
    return generate<GeneratedSalesFunnel>(prompt, salesFunnelSchema);
};

export const generateProfitPath = async (data: BusinessData): Promise<GeneratedProfitPath> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Create a "4-Step Profit Path" to maximize immediate cash flow from a new customer. These are immediate upsells after the initial sale. Each step should have a title, a clear action, and an example. Where applicable, provide a simple script.`;
    return generate<GeneratedProfitPath>(prompt, profitPathSchema);
};

export const generateOperationsPlan = async (data: BusinessData): Promise<GeneratedOperationsPlan> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Create a simple Operations Plan. Define the core operational principle. Identify high-leverage outcomes and activities. Analyze the primary bottleneck. Propose 1-2 key team roles, detailing responsibilities, daily structure, and their key metric.`;
    return generate<GeneratedOperationsPlan>(prompt, operationsPlanSchema);
};

export const generateKpiDashboard = async (data: BusinessData): Promise<GeneratedKpiDashboard> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Create a "Business Scorecard" with the 5-7 most critical KPIs. Give it a title and core principle. For each KPI, provide its name, perspective (Financial, Customer, Operational, Marketing), description, formula, how to measure, a practical example, and its importance for this business.`;
    return generate<GeneratedKpiDashboard>(prompt, kpiDashboardSchema);
};

export const generateAccountabilityTracker = async (data: BusinessData): Promise<GeneratedAccountabilityTracker> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Create an "Action Unleashed Playbook". This is a multi-level tracker to push the user to take action. Generate exactly 3 phases: Sprint, Systemize, and Scale.
- **Phase 1: The 7-Day Sprint.** Goal is immediate action and getting the first leads/feedback. Actions should be low-cost and high-leverage (e.g., warm outreach, posting in communities). Include a daily checklist for this phase.
- **Phase 2: Systemize.** Goal is to turn the winning actions from Phase 1 into a repeatable process. Actions might include creating a content calendar, setting up a simple CRM, or testing a small ad budget. Include a daily checklist.
- **Phase 3: Scale.** Goal is to double down on what works. Actions might include increasing ad spend, hiring a VA, or building a referral system. Include a daily checklist.

For each phase, provide a title, a clear goal, 3-5 concrete actions with metrics, and a 2-3 item daily checklist. Set initial 'isComplete' to false and 'resultNotes' to ''.`;
    return generate<GeneratedAccountabilityTracker>(prompt, accountabilityTrackerSchema);
};

export const generateAssetContent = async (item: OfferStackItem, businessData: BusinessData): Promise<string> => {
    const ai = getAiInstance();
    const prompt = `You are Hormozi AI, an expert business consultant and content creator. A business is creating a downloadable asset for their offer. Your task is to write the full, complete text content for this asset. Do not provide a summary; provide the actual, ready-to-use content. Format the output in simple Markdown.

Business Context:
- Business Type: ${businessData.businessType}
- Target Client: ${businessData.targetClient}
- Core Offer: ${businessData.coreOffer}

Asset Details:
- Asset Name: "${item.asset.name}"
- Asset Type: ${item.asset.type}
- It solves this problem: "${item.problem}"
- As part of a solution called: "${item.solution}"

TASK: Write the full, ready-to-use content for the asset described above.
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
};

const generateSimpleText = async (prompt: string): Promise<string> => {
    const ai = getAiInstance();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        return response.text.trim();
    } catch (e) {
        console.error("AI Simple Text Generation Error:", e, "Prompt:", prompt);
        if (e instanceof Error) {
            throw new Error(`Failed to generate text: ${e.message}`);
        }
        throw new Error("An unknown error occurred during AI generation.");
    }
};

export const generateFieldSuggestion = async (data: Partial<BusinessData>, fieldName: keyof BusinessData): Promise<string> => {
    // Sanitize data: remove empty fields to keep the prompt clean
    const contextData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => value && key !== fieldName)
    );

    const fieldLabels: Record<string, string> = {
        businessType: "Business Type or Idea",
        biggestChallenge: "Biggest Challenge or Question",
        coreOffer: "Main Offer & Price (or idea)",
        targetClient: "Your Ideal Customer",
        marketingMethods: "Current or Planned Marketing",
        ancillaryProducts: "Other Items for Sale?"
    };

    const fieldLabel = fieldLabels[fieldName] || fieldName;

    const prompt = `
You are an AI assistant designed to help entrepreneurs brainstorm.
Based on the following business information, generate a single, concise, and creative suggestion for the field: "${fieldLabel}".

Business Information:
${JSON.stringify(contextData, null, 2)}

Your task is to provide a suggestion for the "${fieldLabel}" field.
The suggestion should be a short string, suitable for direct use in a form field.
Do not add any extra explanation, labels, or quotation marks. Just return the pure text suggestion.

Suggestion for "${fieldLabel}":
`;
    const suggestion = await generateSimpleText(prompt);
    // Sometimes the model might still return quotes, so let's strip them.
    return suggestion.replace(/^"|"$/g, '');
};


export const generateChatResponseStream = async (
    businessData: BusinessData,
    playbook: GeneratedPlaybook,
    history: ChatMessage[]
) => {
    const ai = getAiInstance();
    // Convert history to a simple string format for the prompt
    const formattedHistory = history.map(msg => `${msg.role === 'user' ? 'AI' : 'AI'}: ${msg.content}`).join('\n\n');

    const prompt = `
You are Hormozi AI, an expert business consultant. You have already generated a business plan for a user. Now, you are in a chat conversation to refine that plan. Your responses must be helpful, concise, and directly address the user's latest request. You must act as a collaborative partner. Your responses should be in simple markdown.

Here is the original business data you used:
\`\`\`json
${JSON.stringify(businessData, null, 2)}
\`\`\`

Here is the complete business plan you have generated so far. You should refer to this and modify it in your responses if the user asks you to.
\`\`\`json
${JSON.stringify(playbook, null, 2)}
\`\`\`

---
CHAT HISTORY:
${formattedHistory}
---

TASK: Based on all the context above, provide a direct and helpful response to the last user message. Keep your response conversational and focused on improving their business plan.
AI:
`;

    const response = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response;
};