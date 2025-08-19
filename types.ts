export interface BusinessData {
  country: string;
  currency: string;
  businessType: string;
  location: string;
  monthlyRevenue: string;
  employees: string;
  marketingMethods: string;
  biggestChallenge: string;
  coreOffer: string;
  targetClient: string;
  offerTimeline: string;
  hasSalesTeam: string;
  monthlyAdSpend: string;
  profitGoal: string;
  hasCertifications: string;
  hasTestimonials: string;
  physicalCapacity: string;
  ancillaryProducts: string;
  perceivedMaxPrice: string;
  dailyTimeCommitment: string;
  businessStage?: 'new' | 'existing';
  fundingStatus?: 'funded' | 'bootstrapped';
  category?: string;
}

export interface GeneratedDiagnosis {
  currentStage: string;
  yourRole: string;
  constraints: string[];
  actions: string[];
}

export interface ModelComparison {
    title: string;
    description: string;
    metrics: { label: string; value: string }[];
}

export interface LtvCacAnalysis {
    automationLevel: string;
    targetRatio: string;
    explanation: string;
}

export interface ProjectedEconomics {
    estimatedCAC: string;
    targetLTV: string;
    projectedRatio: string;
    immediateProfit: string;
    explanation: string;
}

export interface GeneratedMoneyModelAnalysis {
    oldModel: ModelComparison;
    newModel: ModelComparison;
    ltvCacAnalysis: LtvCacAnalysis;
    projectedEconomics: ProjectedEconomics;
}

export interface OfferStackItem {
  problem: string;
  solution: string;
  value: string; // e.g., "$2,000"
  asset: {
    name: string;
    type: 'template' | 'framework' | 'checklist' | 'script' | 'guide';
    content: string; // The full text content of the asset
  };
}

export interface GeneratedOffer {
  name: string;
  promise: string;
  stack: OfferStackItem[];
  strategyBehindStack: string; // New field for the strategic rationale
  totalValue: string; // e.g., "$20,000"
  guarantee: string;
  price: string;
}

export interface GeneratedDownsell {
  rationale: string;
  offer: GeneratedOffer;
}

export interface ProfitPathStep {
  title: string;
  action: string;
  example: string;
  script?: string;
}

export interface GeneratedProfitPath {
  steps: ProfitPathStep[];
}

export interface MarketingModelStep {
    method: string;
    strategy: string;
    example: string;
    template?: string;
}

export interface GeneratedMarketingModel {
    steps: MarketingModelStep[];
}

export interface MoneyModelStep {
  stepNumber: number;
  title: string; // e.g., "Step 1: The Attraction Offer"
  offerName: string; // e.g., "The 6-Week Transformation Challenge"
  price: string; // e.g., "$499 Upfront"
  rationale: string; // "This is a high-commitment front-end offer..."
  hormoziTactic: string; // "Tactic: 'Win Your Money Back' Challenge"
  details: string; // "Detailed description of the offer."
}

export interface GeneratedMoneyModel {
  title: string; // "The Client-Financed Acquisition Model"
  corePrinciple: string; // "Goal: Gross Profit in 30 days > 2x (CAC + COGS)"
  steps: MoneyModelStep[];
  summary: string;
}

export interface OperationalActivity {
  outcome: string; 
  activity: string; 
  timeAllocation: string;
  frequency: string;
}

export interface TeamRole {
  roleTitle: string; 
  responsibilities: string[];
  dailyStructure: string;
  keyMetric: string;
}

export interface GeneratedOperationsPlan {
  title: string;
  corePrinciple: string;
  outcomesAndActivities: OperationalActivity[];
  bottleneckAnalysis: string;
  proposedRoles: TeamRole[];
}

export interface FunnelStage {
  stageName: string; 
  goal: string; 
  adCopy: {
    headline: string;
    body: string;
    cta: string;
  };
  landingPage: {
    headline: string;
    elements: string[];
    keyFocus: string;
  };
  salesProcess: {
      step: string;
      scriptFocus: string;
  };
  keyMetric: string;
}

export interface GeneratedSalesFunnel {
  title: string;
  corePrinciple: string;
  stages: FunnelStage[];
}

export interface Kpi {
  name: string;
  perspective: 'Financial' | 'Customer' | 'Operational' | 'Marketing';
  description: string;
  formula: string;
  howToMeasure: string;
  example: string;
  importance: string;
}

export interface GeneratedKpiDashboard {
  title: string;
  corePrinciple: string;
  kpis: Kpi[];
}

export interface MoneyModelMechanism {
  mechanismType: 'Attraction' | 'Upsell' | 'Downsell' | 'Continuity';
  tacticName: string; // e.g., "Win Your Money Back" or "Menu Upsell"
  strategy: string; // Explanation of how this tactic applies to the user's business
  example: string; // A concrete example of an offer using this tactic
  implementationNotes: string; // Practical advice on how to implement it
}

export interface GeneratedMoneyModelMechanisms {
  title: string; // e.g., "Your $100M Money Model Toolkit"
  corePrinciple: string; // "These are the four engines of cash flow for your business. Master them, and you'll never worry about money again."
  mechanisms: MoneyModelMechanism[]; // An array containing one recommended tactic for each of the 4 types.
}

export interface TrackerAction {
  id: string;
  description: string;
  metric: string;
  isComplete: boolean;
  resultNotes: string;
}

export interface TrackerPhase {
  phaseNumber: number;
  title: string;
  goal: string;
  actions: TrackerAction[];
  dailyChecklist: string[];
}

export interface GeneratedAccountabilityTracker {
    title: string;
    corePrinciple: string;
    phases: TrackerPhase[];
}

export interface GeneratedPlaybook {
  diagnosis: GeneratedDiagnosis;
  moneyModelAnalysis: GeneratedMoneyModelAnalysis;
  moneyModel: GeneratedMoneyModel;
  moneyModelMechanisms: GeneratedMoneyModelMechanisms;
  operationsPlan: GeneratedOperationsPlan;
  offer1: GeneratedOffer;
  offer2: GeneratedOffer;
  profitPath: GeneratedProfitPath;
  downsell: GeneratedDownsell;
  marketingModel: GeneratedMarketingModel;
  salesFunnel: GeneratedSalesFunnel;
  kpiDashboard: GeneratedKpiDashboard;
  accountabilityTracker: GeneratedAccountabilityTracker;
}

// User data structure for Firestore
export interface UserData {
  uid: string;
  email: string;
  playbook: GeneratedPlaybook | null;
  businessData: BusinessData | null;
}


export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}