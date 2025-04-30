// create-fine-tune.js
// Script to create a fine-tuning job with OpenAI

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
const trainingDataPath = path.join(outputDir, 'training_data.jsonl');
const validationDataPath = path.join(outputDir, 'validation_data.jsonl');
const fileIdsPath = path.join(outputDir, 'file_ids.json');
const jobDetailsPath = path.join(outputDir, 'job_details.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to upload a file to OpenAI
async function uploadFile(filePath, purpose) {
  console.log(`Uploading ${filePath}...`);

  try {
    const response = await openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: purpose
    });

    console.log(`Uploaded ${filePath} successfully. File ID: ${response.id}`);
    return response.id;
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error.message);
    throw error;
  }
}

// Function to create a fine-tuning job
async function createFineTuningJob(trainingFileId, validationFileId) {
  console.log('Creating fine-tuning job...');

  try {
    const response = await openai.fineTuning.jobs.create({
      training_file: trainingFileId,
      validation_file: validationFileId,
      model: 'gpt-4.1-2025-04-14', // Using the specified model
      suffix: 'jtbd-bot'
    });

    console.log(`Fine-tuning job created successfully. Job ID: ${response.id}`);
    return response;
  } catch (error) {
    console.error('Error creating fine-tuning job:', error.message);
    throw error;
  }
}

// Main function to run the fine-tuning process
async function runFineTuning() {
  try {
    // Check if files have already been uploaded
    let fileIds = {};
    if (fs.existsSync(fileIdsPath)) {
      try {
        fileIds = JSON.parse(fs.readFileSync(fileIdsPath, 'utf8'));
        console.log('Found existing file IDs:', fileIds);
      } catch (error) {
        console.warn('Error parsing existing file IDs, will upload new files:', error.message);
        fileIds = {};
      }
    }

    // Upload training and validation files if needed
    if (!fileIds.trainingFileId) {
      fileIds.trainingFileId = await uploadFile(trainingDataPath, 'fine-tune');
    }

    if (!fileIds.validationFileId) {
      fileIds.validationFileId = await uploadFile(validationDataPath, 'fine-tune');
    }

    // Save file IDs
    fs.writeFileSync(fileIdsPath, JSON.stringify(fileIds, null, 2));

    // Check if job has already been created
    let jobDetails = {};
    if (fs.existsSync(jobDetailsPath)) {
      try {
        jobDetails = JSON.parse(fs.readFileSync(jobDetailsPath, 'utf8'));
        console.log('Found existing job details:', jobDetails);
        console.log('To check the status of this job, run: node scripts/check-fine-tune-status.js');
        return;
      } catch (error) {
        console.warn('Error parsing existing job details, will create new job:', error.message);
      }
    }

    // Create fine-tuning job
    const job = await createFineTuningJob(fileIds.trainingFileId, fileIds.validationFileId);

    // Save job details
    fs.writeFileSync(jobDetailsPath, JSON.stringify(job, null, 2));

    console.log('Fine-tuning process initiated successfully.');
    console.log('To check the status of this job, run: node scripts/check-fine-tune-status.js');
  } catch (error) {
    console.error('Error in fine-tuning process:', error);
    process.exit(1);
  }
}

// Run the fine-tuning process
runFineTuning();
