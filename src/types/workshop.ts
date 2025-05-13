import type { StepChats } from './chat';

export interface BigIdea {
  description: string;
  targetCustomers?: string; // Made optional since it's not used in Step 2 anymore
  version: 'initial' | 'refined';
  name?: string;
  format?: string;
}

export interface UnderlyingGoal {
  businessGoal: string;
  constraints?: string; // Made optional since it's not used anymore
}

export interface TriggerEvent {
  id: string;
  description: string;
  source: 'user' | 'assistant';
  emotionalState?: string; // The emotional state during this event
  urgency?: 'high' | 'medium' | 'low'; // Level of urgency
  triggerType?: 'situational' | 'internal' | 'social' | 'performance'; // Type of trigger
}

export interface Job {
  id: string;
  description: string;
  source: 'user' | 'assistant';
  selected?: boolean;
  isOverarching?: boolean;
  type?: 'functional' | 'emotional' | 'social';
  importance?: 'high' | 'medium' | 'low';
  rationale?: string;
}

export interface TargetBuyer {
  id: string;
  description: string;
  source: 'user' | 'assistant';
  selected?: boolean;
  urgency?: number;
  willingness?: number;
  longTermValue?: number;
  solutionFit?: number;
  accessibility?: number;
  shortlisted?: boolean; // Added for step 6 shortlisting
  isTopThree?: boolean; // Added for step 6 top 3 selection
}

export interface Pain {
  id: string;
  description: string;
  buyerSegment: string;
  type: 'functional' | 'emotional' | 'social' | 'anticipated';
  isFire?: boolean; // Frequent, Intense, Recurring, Expensive
  source: 'user' | 'assistant';
  fireScores?: {
    frequency: number; // 1-3 scale
    intensity: number; // 1-3 scale
    recurring: number; // 1-3 scale
    expensive: number; // 1-3 scale
  };
  calculatedFireScore?: number; // Sum of the above (4-12 scale)
}

export interface ProblemUp {
  selectedPains: string[];
  selectedBuyers: string[];
  relevantTriggerIds: string[]; // IDs of triggers linked to the target moment
  targetMoment: string;
  notes: string;
}

export interface TargetProblem {
  id: string;
  description: string;
  selected: boolean;
}

export interface TargetMarketProfile {
  name: string;
  commonTraits: string[];
  commonTriggers: string[];
  coreTransformation?: string;
}

export interface TargetMarket {
  description: string;
  demographics: string;
  psychographics: string;
  notes: string;
}

export interface Offer {
  id: string;
  name: string;
  description: string;
  format: string;
  targetBuyers: string[];
  painsSolved: string[];
  version: 'initial' | 'refined';
}

export interface Summary {
  initialIdea: string;
  refinedIdea: string;
  underlyingGoal: string;
  triggerEvents: string[];
  jobs: string[];
  targetBuyers: string[];
  pains: string[];
  targetMoment: string;
  reflections: Reflections;
}

export interface Reflections {
  keyInsights: string;
  nextSteps: string;
  personalReflection?: string;
}

export interface NextSteps {
  preSellPlan: string;
  workshopReflections: string;
  preSellPlanItems: string[];
  workshopReflectionItems: string[];
}

// New interface for Painstorming Results
export interface PainstormingResults {
  buyer1Pains: string;
  buyer2Pains: string;
  buyer3Pains: string;
  overlappingPains: string;
  ahaMoments: string;
}

// This interface defines the data structure for the 10-step workshop flow
export interface WorkshopData {
  // Step 1: Big Idea
  bigIdea?: BigIdea;

  // Step 2: Underlying Goal
  underlyingGoal?: UnderlyingGoal;

  // Step 3: Trigger Events
  triggerEvents: TriggerEvent[];

  // Step 4: Jobs
  jobs: Job[];

  // Step 5: Target Buyers
  targetBuyers: TargetBuyer[];

  // Step 6: Painstorming
  pains: Pain[];
  painstormingResults?: PainstormingResults;

  // Step 7: Problem Up
  problemUp?: ProblemUp;
  targetProblems?: TargetProblem[];

  // Step 8: Target Market
  targetMarketProfile?: TargetMarketProfile;
  targetMarket?: TargetMarket;

  // Step 9: Refine Idea
  refinedIdea?: BigIdea;
  offer?: Offer;

  // Step 10: Plan Next Steps
  nextSteps?: NextSteps;

  // Summary (for PDF export)
  reflections?: Reflections;

  // Chat messages for each step
  stepChats: StepChats;
}

export interface WorkshopSession {
  id: string;
  session_id: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  current_step: number;
  workshop_data: WorkshopData;
}