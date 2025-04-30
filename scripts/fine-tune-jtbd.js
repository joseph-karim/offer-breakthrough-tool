// Fine-tuning script for JTBD Job Statements
// This script implements the step-by-step guide for fine-tuning GPT-4.1
// to generate Overarching and Supporting Job Statements

import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Configuration
const config = {
  baseModel: 'gpt-4.1', // The model to fine-tune
  suffix: 'jtbd-job-statements', // Custom suffix for the fine-tuned model
  trainingFile: 'training_data.jsonl',
  validationFile: 'validation_data.jsonl',
  outputDir: path.join(process.cwd(), 'fine-tuning-output')
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Main function to orchestrate the fine-tuning process
async function runFineTuning() {
  console.log('Starting JTBD Job Statements fine-tuning process...');

  try {
    // Step 1: Prepare and validate the training data
    console.log('Step 1: Preparing and validating training data...');
    await prepareTrainingData();

    // Step 2: Upload the training and validation files
    console.log('Step 2: Uploading training and validation files...');
    const { trainingFileId, validationFileId } = await uploadFiles();

    // Step 3: Create the fine-tuning job
    console.log('Step 3: Creating fine-tuning job...');
    const jobId = await createFineTuningJob(trainingFileId, validationFileId);

    // Step 4: Monitor the fine-tuning job
    console.log('Step 4: Monitoring fine-tuning job...');
    await monitorFineTuningJob(jobId);

    console.log('Fine-tuning process completed successfully!');
  } catch (error) {
    console.error('Error during fine-tuning process:', error);
    process.exit(1);
  }
}

// Function to prepare and validate the training data
async function prepareTrainingData() {
  // This function would normally create the JSONL files from raw data
  // In this case, we're assuming the data is already prepared in the correct format

  // Check if the training and validation files exist
  if (!fs.existsSync(config.trainingFile)) {
    throw new Error(`Training file ${config.trainingFile} not found`);
  }

  if (!fs.existsSync(config.validationFile)) {
    throw new Error(`Validation file ${config.validationFile} not found`);
  }

  // Validate the JSONL format
  validateJsonlFormat(config.trainingFile, 'training');
  validateJsonlFormat(config.validationFile, 'validation');

  console.log('Training and validation data validated successfully');
}

// Function to validate JSONL format
function validateJsonlFormat(filePath, fileType) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.trim().split('\n');

  console.log(`Validating ${fileType} file with ${lines.length} examples`);

  for (let i = 0; i < lines.length; i++) {
    try {
      const json = JSON.parse(lines[i]);

      // Check for required structure
      if (!json.messages || !Array.isArray(json.messages)) {
        throw new Error(`Line ${i+1}: Missing or invalid 'messages' array`);
      }

      // Check for system, user, and assistant messages
      const hasSystemMessage = json.messages.some(msg => msg.role === 'system');
      const hasUserMessage = json.messages.some(msg => msg.role === 'user');
      const hasAssistantMessage = json.messages.some(msg => msg.role === 'assistant');

      if (!hasSystemMessage) {
        throw new Error(`Line ${i+1}: Missing system message`);
      }

      if (!hasUserMessage) {
        throw new Error(`Line ${i+1}: Missing user message`);
      }

      if (!hasAssistantMessage) {
        throw new Error(`Line ${i+1}: Missing assistant message`);
      }

    } catch (error) {
      throw new Error(`Error validating ${fileType} file at line ${i+1}: ${error.message}`);
    }
  }
}

// Function to upload the training and validation files
async function uploadFiles() {
  try {
    // Upload training file
    const trainingResponse = await openai.files.create({
      file: fs.createReadStream(config.trainingFile),
      purpose: 'fine-tune'
    });

    console.log(`Training file uploaded with ID: ${trainingResponse.id}`);

    // Upload validation file
    const validationResponse = await openai.files.create({
      file: fs.createReadStream(config.validationFile),
      purpose: 'fine-tune'
    });

    console.log(`Validation file uploaded with ID: ${validationResponse.id}`);

    // Save file IDs to a config file for reference
    const fileIds = {
      trainingFileId: trainingResponse.id,
      validationFileId: validationResponse.id,
      uploadedAt: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(config.outputDir, 'file_ids.json'),
      JSON.stringify(fileIds, null, 2)
    );

    return {
      trainingFileId: trainingResponse.id,
      validationFileId: validationResponse.id
    };
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
}

// Function to create the fine-tuning job
async function createFineTuningJob(trainingFileId, validationFileId) {
  try {
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
      path.join(config.outputDir, 'job_details.json'),
      JSON.stringify(jobDetails, null, 2)
    );

    return job.id;
  } catch (error) {
    console.error('Error creating fine-tuning job:', error);
    throw error;
  }
}

// Function to monitor the fine-tuning job
async function monitorFineTuningJob(jobId) {
  try {
    let job;
    let isCompleted = false;

    console.log(`Starting to monitor fine-tuning job ${jobId}`);

    // Poll the job status every 60 seconds until it's completed
    while (!isCompleted) {
      job = await openai.fineTuning.jobs.retrieve(jobId);

      console.log(`Job status: ${job.status}`);

      // Check if the job is completed or failed
      if (job.status === 'succeeded') {
        isCompleted = true;
        console.log('Fine-tuning job completed successfully!');
        console.log(`Fine-tuned model ID: ${job.fine_tuned_model}`);

        // Save the fine-tuned model ID to a file
        const modelDetails = {
          fineTunedModelId: job.fine_tuned_model,
          baseModel: config.baseModel,
          completedAt: new Date().toISOString()
        };

        fs.writeFileSync(
          path.join(config.outputDir, 'model_details.json'),
          JSON.stringify(modelDetails, null, 2)
        );
      } else if (job.status === 'failed') {
        isCompleted = true;
        throw new Error(`Fine-tuning job failed: ${job.error || 'Unknown error'}`);
      } else {
        // Job is still in progress, wait for 60 seconds before checking again
        console.log('Job still in progress, checking again in 60 seconds...');
        await new Promise(resolve => setTimeout(resolve, 60000));
      }
    }

    return job.fine_tuned_model;
  } catch (error) {
    console.error('Error monitoring fine-tuning job:', error);
    throw error;
  }
}

// Run the fine-tuning process
runFineTuning();
