import type { StepChats } from './chat';

export interface BigIdea {
  description: string;
  targetCustomers: string;
  version: 'initial' | 'refined';
  name?: string;
  format?: string;
}

export interface UnderlyingGoal {
  businessGoal: string;
  constraints: string;
  antiGoals: string;
}

export interface TriggerEvent {
  id: string;
  description: string;
  source: 'user' | 'assistant';
}

export interface Job {
  id: string;
  description: string;
  source: 'user' | 'assistant';
  selected?: boolean;
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
}

export interface Pain {
  id: string;
  description: string;
  buyerSegment: string;
  type: 'functional' | 'emotional' | 'social' | 'anticipated';
  isFire?: boolean; // Frequent, Intense, Requires action, Expensive
  source: 'user' | 'assistant';
}

export interface ProblemUp {
  selectedPains: string[];
  selectedBuyers: string[];
  targetMoment: string;
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
}

export interface WorkshopData {
  bigIdea?: BigIdea;
  underlyingGoal?: UnderlyingGoal;
  triggerEvents: TriggerEvent[];
  jobs: Job[];
  targetBuyers: TargetBuyer[];
  pains: Pain[];
  problemUp?: ProblemUp;
  refinedIdea?: BigIdea;
  offer?: Offer;
  stepChats: StepChats;
  reflections?: Reflections;
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