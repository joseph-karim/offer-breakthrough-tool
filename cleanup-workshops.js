// Script to clean up duplicate workshop sessions
// This script identifies and removes duplicate workshop sessions created at the same time

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import readline from 'readline';

// Load environment variables
dotenv.config();

// Create Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Create readline interface for user confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function findDuplicateSessions() {
  try {
    // Get all workshop sessions
    const { data: sessions, error } = await supabase
      .from('workshop_sessions')
      .select('*')
      .order('user_id', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    console.log(`Found ${sessions.length} total workshop sessions`);

    // Group sessions by user_id
    const sessionsByUser = {};
    sessions.forEach(session => {
      if (!sessionsByUser[session.user_id]) {
        sessionsByUser[session.user_id] = [];
      }
      sessionsByUser[session.user_id].push(session);
    });

    // Find duplicate sessions (created within 5 seconds of each other)
    const duplicateSessions = [];
    
    Object.keys(sessionsByUser).forEach(userId => {
      const userSessions = sessionsByUser[userId];
      
      // Skip if user has only one session
      if (userSessions.length <= 1) return;
      
      // Sort sessions by creation time (newest first)
      userSessions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      // Group sessions by creation time (within 5 seconds)
      const timeGroups = [];
      let currentGroup = [userSessions[0]];
      
      for (let i = 1; i < userSessions.length; i++) {
        const prevTime = new Date(userSessions[i-1].created_at).getTime();
        const currTime = new Date(userSessions[i].created_at).getTime();
        
        // If created within 5 seconds (5000ms), consider it a duplicate
        if (prevTime - currTime < 5000) {
          currentGroup.push(userSessions[i]);
        } else {
          if (currentGroup.length > 1) {
            timeGroups.push([...currentGroup]);
          }
          currentGroup = [userSessions[i]];
        }
      }
      
      // Add the last group if it has duplicates
      if (currentGroup.length > 1) {
        timeGroups.push(currentGroup);
      }
      
      // Add all duplicates to the list
      timeGroups.forEach(group => {
        // Keep the first session (newest), mark the rest as duplicates
        for (let i = 1; i < group.length; i++) {
          duplicateSessions.push(group[i]);
        }
      });
    });

    return duplicateSessions;
  } catch (error) {
    console.error('Error finding duplicate sessions:', error);
    return [];
  }
}

async function deleteDuplicateSessions(duplicateSessions) {
  try {
    console.log(`Preparing to delete ${duplicateSessions.length} duplicate sessions...`);
    
    // Delete sessions one by one to avoid potential issues with bulk operations
    let deletedCount = 0;
    
    for (const session of duplicateSessions) {
      const { error } = await supabase
        .from('workshop_sessions')
        .delete()
        .eq('id', session.id);
      
      if (error) {
        console.error(`Error deleting session ${session.id}:`, error);
      } else {
        deletedCount++;
        console.log(`Deleted session ${session.id} (${session.name}) created at ${session.created_at}`);
      }
    }
    
    console.log(`Successfully deleted ${deletedCount} duplicate sessions`);
  } catch (error) {
    console.error('Error deleting duplicate sessions:', error);
  }
}

async function main() {
  try {
    console.log('Searching for duplicate workshop sessions...');
    const duplicateSessions = await findDuplicateSessions();
    
    if (duplicateSessions.length === 0) {
      console.log('No duplicate sessions found.');
      rl.close();
      return;
    }
    
    console.log(`Found ${duplicateSessions.length} duplicate sessions:`);
    
    // Display duplicate sessions
    duplicateSessions.forEach((session, index) => {
      console.log(`${index + 1}. ID: ${session.id}, Name: ${session.name}, User: ${session.user_id}, Created: ${session.created_at}`);
    });
    
    // Ask for confirmation before deleting
    rl.question('Do you want to delete these duplicate sessions? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
        await deleteDuplicateSessions(duplicateSessions);
      } else {
        console.log('Operation cancelled. No sessions were deleted.');
      }
      rl.close();
    });
  } catch (error) {
    console.error('Error in main function:', error);
    rl.close();
  }
}

// Run the script
main();
