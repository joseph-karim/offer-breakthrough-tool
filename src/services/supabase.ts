import { createClient } from '@supabase/supabase-js';
import type { WorkshopData, WorkshopSession } from '../types/workshop';

// For local development, use hardcoded values
const isLocalDevelopment = window.location.hostname === 'localhost';

// Get values from environment variables or use hardcoded values for local development
const supabaseUrl = isLocalDevelopment
  ? 'https://qequpzsgbzsysyllnrmx.supabase.co'
  : import.meta.env.VITE_SUPABASE_URL;

const supabaseAnonKey = isLocalDevelopment
  ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlcXVwenNnYnpzeXN5bGxucm14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MzA0MjIsImV4cCI6MjA1ODUwNjQyMn0.joz0QS25pcuoKoHsF6NpXiIhcF-OLXeq8FJiVkQRxiA'
  : import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Is local development:', isLocalDevelopment);
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key (first 10 chars):', supabaseAnonKey?.substring(0, 10));

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration');
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const saveWorkshopSession = async (
  sessionId: string,
  data: WorkshopData,
  step: number,
  name?: string
) => {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;

  const { error } = await supabase
    .from('workshop_sessions')
    .upsert({
      session_id: sessionId,
      workshop_data: data,
      current_step: step,
      updated_at: new Date().toISOString(),
      user_id: userId,
      ...(name && { name }),
    });

  if (error) throw error;
};

export const loadWorkshopSession = async (sessionId: string): Promise<WorkshopSession> => {
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

export const getUserSessions = async (): Promise<WorkshopSession[]> => {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('workshop_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const deleteWorkshopSession = async (sessionId: string) => {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('workshop_sessions')
    .delete()
    .eq('session_id', sessionId)
    .eq('user_id', userId);

  if (error) throw error;
};