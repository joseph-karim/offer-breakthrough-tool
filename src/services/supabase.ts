import { createClient } from '@supabase/supabase-js';
import type { WorkshopData } from '../types/workshop';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const saveWorkshopSession = async (
  sessionId: string,
  data: WorkshopData,
  step: number
) => {
  const { error } = await supabase
    .from('workshop_sessions')
    .upsert({
      session_id: sessionId,
      workshop_data: data,
      current_step: step,
      updated_at: new Date().toISOString(),
    });

  if (error) throw error;
};

export const loadWorkshopSession = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('workshop_sessions')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (error) throw error;
  return data;
};

export const updateWorkshopStep = async (sessionId: string, step: number) => {
  const { error } = await supabase
    .from('workshop_sessions')
    .update({ current_step: step, updated_at: new Date().toISOString() })
    .eq('session_id', sessionId);

  if (error) throw error;
}; 