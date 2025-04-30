// create-fine-tuning-job.js
// Script to create and monitor a fine-tuning job

const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Paths
const outputDir = path.join(__dirname, '../output');
const fileIdsPath = path.join(outputDir, 'file_ids.json');

// Configuration
const config = {
  baseModel: 'gpt-4.1-2025-04-14', // The model to fine-tune
  suffix: 'jtbd-job-statements', // Custom suffix for the fine-tuned model
};

// Function to create a fine-tuning job
async function createFineTuningJob() {
  try {
    // Read file IDs from the JSON file
    if (!fs.existsSync(fileIdsPath)) {
      throw new Error('File IDs not found. Please run upload-files.js first.');
    }

    const fileIds = JSON.parse(fs.readFileSync(fileIdsPath, 'utf8'));
    const { trainingFileId, validationFileId } = fileIds;

    console.log(`Creating fine-tuning job with training file ${trainingFileId} and validation file ${validationFileId}`);

    // Create the fine-tuning job
    const job = await openai.fineTuning.jobs.create({
      training_file: trainingFileId,
      validation_file: validationFileId,
      model: config.baseModel,
      suffix: config.suffix
    });

    console.log(`Fine-tuning job created with ID: ${job.id}`);

    // Save job details to a file for reference
    const jobDetails = {
      jobId: job.id,
      model: config.baseModel,
      suffix: config.suffix,
      trainingFileId,
      validationFileId,
      createdAt: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(outputDir, 'job_details.json'),
      JSON.stringify(jobDetails, null, 2)
    );

    console.log('Job details saved to job_details.json');
    return job.id;
  } catch (error) {
    console.error('Error creating fine-tuning job:', error);
    throw error;
  }
}

// Function to monitor the fine-tuning job
async function monitorFineTuningJob(jobId) {
  try {
    console.log(`Starting to monitor fine-tuning job ${jobId}`);

    // Initial check
    let job = await openai.fineTuning.jobs.retrieve(jobId);
    console.log(`Initial job status: ${job.status}`);

    // If the job is already completed or failed, return
    if (job.status === 'succeeded' || job.status === 'failed') {
      handleJobCompletion(job);
      return;
    }

    // Otherwise, set up an interval to check the status
    console.log('Job is in progress. Will check status every 60 seconds.');
    console.log('Press Ctrl+C to stop monitoring (the job will continue running).');

    const intervalId = setInterval(async () => {
      try {
        job = await openai.fineTuning.jobs.retrieve(jobId);
        console.log(`Job status: ${job.status}`);

        if (job.status === 'succeeded' || job.status === 'failed') {
          clearInterval(intervalId);
          handleJobCompletion(job);
        }
      } catch (error) {
        console.error('Error checking job status:', error);
      }
    }, 60000); // Check every 60 seconds
  } catch (error) {
    console.error('Error monitoring fine-tuning job:', error);
    throw error;
  }
}

// Function to handle job completion
function handleJobCompletion(job) {
  if (job.status === 'succeeded') {
    console.log('Fine-tuning job completed successfully!');
    console.log(`Fine-tuned model ID: ${job.fine_tuned_model}`);

    // Save the fine-tuned model ID to a file
    const modelDetails = {
      fineTunedModelId: job.fine_tuned_model,
      baseModel: config.baseModel,
      completedAt: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(outputDir, 'model_details.json'),
      JSON.stringify(modelDetails, null, 2)
    );

    console.log('Model details saved to model_details.json');
  } else if (job.status === 'failed') {
    console.error(`Fine-tuning job failed: ${job.error || 'Unknown error'}`);
  }
}

// Run the process
async function run() {
  try {
    const jobId = await createFineTuningJob();
    await monitorFineTuningJob(jobId);
  } catch (error) {
    console.error('Error in fine-tuning process:', error);
    process.exit(1);
  }
}

run();
