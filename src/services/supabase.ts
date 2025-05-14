import { createClient } from '@supabase/supabase-js';
import type { WorkshopData, WorkshopSession } from '../types/workshop';

// Always use environment variables for Supabase credentials
// For local development, these should be in .env.local file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
  try {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    console.log('Saving workshop session with user ID:', userId);

    if (!userId) {
      console.error('No user ID found when saving workshop session. Auth state:', user);
      // Still attempt to save without user ID to maintain data
    }

    // First check if the session exists
    const { data: existingSession, error: checkError } = await supabase
      .from('workshop_sessions')
      .select('id')
      .eq('session_id', sessionId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" which is expected for new sessions
      console.error('Error checking for existing session:', checkError);
    }

    let saveError;

    if (existingSession) {
      // Session exists, use update instead of upsert
      console.log('Updating existing session:', sessionId);
      const { error } = await supabase
        .from('workshop_sessions')
        .update({
          workshop_data: data,
          current_step: step,
          updated_at: new Date().toISOString(),
          ...(name && { name }),
        })
        .eq('session_id', sessionId);

      saveError = error;
    } else {
      // Session doesn't exist, insert new
      console.log('Creating new session:', sessionId);
      const { error } = await supabase
        .from('workshop_sessions')
        .insert({
          session_id: sessionId,
          workshop_data: data,
          current_step: step,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: userId,
          name: name || 'Untitled Workshop',
        });

      saveError = error;
    }

    if (saveError) {
      console.error('Error saving workshop session:', saveError);
      throw saveError;
    }

    console.log('Workshop session saved successfully:', { sessionId, step });
  } catch (err) {
    console.error('Exception in saveWorkshopSession:', err);
    throw err;
  }
};

export const loadWorkshopSession = async (sessionId: string): Promise<WorkshopSession> => {
  try {
    console.log('Loading workshop session:', sessionId);

    const { data, error } = await supabase
      .from('workshop_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error) {
      console.error('Error loading workshop session:', error);
      throw error;
    }

    if (!data) {
      console.error('No data found for session:', sessionId);
      throw new Error('Session not found');
    }

    console.log('Workshop session loaded successfully:', {
      sessionId,
      step: data.current_step,
      dataKeys: data.workshop_data ? Object.keys(data.workshop_data) : []
    });

    return data;
  } catch (err) {
    console.error('Exception in loadWorkshopSession:', err);
    throw err;
  }
};

export const updateWorkshopStep = async (sessionId: string, step: number) => {
  try {
    console.log('Updating workshop step:', { sessionId, step });

    const { error } = await supabase
      .from('workshop_sessions')
      .update({ current_step: step, updated_at: new Date().toISOString() })
      .eq('session_id', sessionId);

    if (error) {
      console.error('Error updating workshop step:', error);
      throw error;
    }

    console.log('Workshop step updated successfully:', { sessionId, step });
  } catch (err) {
    console.error('Exception in updateWorkshopStep:', err);
    throw err;
  }
};

export const getUserSessions = async (): Promise<WorkshopSession[]> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }

    const userId = userData.user?.id;
    console.log('Getting sessions for user ID:', userId);

    if (!userId) {
      console.error('No user ID found when getting user sessions');
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('workshop_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error getting user sessions:', error);
      throw error;
    }

    console.log(`Found ${data?.length || 0} sessions for user`);
    return data || [];
  } catch (err) {
    console.error('Exception in getUserSessions:', err);
    throw err;
  }
};

export const deleteWorkshopSession = async (sessionId: string) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }

    const userId = userData.user?.id;
    console.log('Deleting session for user ID:', userId);

    if (!userId) {
      console.error('No user ID found when deleting workshop session');
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('workshop_sessions')
      .delete()
      .eq('session_id', sessionId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting workshop session:', error);
      throw error;
    }

    console.log('Workshop session deleted successfully:', sessionId);
  } catch (err) {
    console.error('Exception in deleteWorkshopSession:', err);
    throw err;
  }
};