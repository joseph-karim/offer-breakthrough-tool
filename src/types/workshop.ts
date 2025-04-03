import type { StepChats, AIMessage, ChatSuggestion } from './chat';

export interface AntiGoals {
  market: string;
  offer: string;
  delivery: string;
  lifestyle: string;
  values: string;
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
}

export interface Market {
  id: string;
  description: string;
  source: 'user' | 'assistant';
  selected?: boolean;
}

export interface Problem {
  id: string;
  description: string;
  ranking?: number;
  selected: boolean;
}

export interface Offer {
  id: string;
  name: string;
  description: string;
  format: string;
  selected: boolean;
}

export interface WorkshopData {
  antiGoals: AntiGoals;
  triggerEvents: TriggerEvent[];
  jobs: Job[];
  markets: Market[];
  problems: Problem[];
  selectedOffer?: Offer;
  stepChats: StepChats;
  marketDemandAnalysis?: string;
  pricing?: { strategy: string; justification: string };
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