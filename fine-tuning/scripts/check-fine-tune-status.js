// check-fine-tune-status.js
// Script to check the status of a fine-tuning job

const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Paths
const outputDir = path.join(__dirname, '../output');
const jobDetailsPath = path.join(outputDir, 'job_details.json');

// Function to check the status of a fine-tuning job
async function checkFineTuningStatus(jobId) {
  console.log(`Checking status of fine-tuning job ${jobId}...`);

  try {
    const response = await openai.fineTuning.jobs.retrieve(jobId);

    console.log('Job Status:', response.status);
    console.log('Created At:', new Date(response.created_at * 1000).toLocaleString());

    if (response.finished_at) {
      console.log('Finished At:', new Date(response.finished_at * 1000).toLocaleString());
    }

    console.log('Model:', response.fine_tuned_model || 'Not yet available');
    console.log('Training File:', response.training_file);
    console.log('Validation File:', response.validation_file);

    if (response.status === 'succeeded') {
      console.log('\nFine-tuning completed successfully!');
      console.log('Fine-tuned Model ID:', response.fine_tuned_model);
      console.log('\nYou can now use this model in your application.');
    } else if (response.status === 'failed') {
      console.error('\nFine-tuning failed.');
      if (response.error) {
        console.error('Error:', response.error);
      }
    } else {
      console.log('\nFine-tuning is still in progress.');
      console.log('Run this script again later to check the status.');
    }

    return response;
  } catch (error) {
    console.error('Error checking fine-tuning status:', error.message);
    throw error;
  }
}

// Main function to check the fine-tuning status
async function checkStatus() {
  try {
    // Check if job details exist
    if (!fs.existsSync(jobDetailsPath)) {
      console.error('No job details found. Please run create-fine-tune.js first.');
      process.exit(1);
    }

    // Read job details
    const jobDetails = JSON.parse(fs.readFileSync(jobDetailsPath, 'utf8'));

    if (!jobDetails.id) {
      console.error('Invalid job details. No job ID found.');
      process.exit(1);
    }

    // Check status
    await checkFineTuningStatus(jobDetails.id);
  } catch (error) {
    console.error('Error checking fine-tuning status:', error);
    process.exit(1);
  }
}

// Run the status check
checkStatus();
