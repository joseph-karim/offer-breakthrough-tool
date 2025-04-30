#!/bin/bash

# Script to run the entire fine-tuning process

# API key is now hardcoded in the scripts
echo "Using the provided OpenAI API key"

# Install dependencies
echo "Installing dependencies..."
npm install

# Step 1: Prepare training data
echo "Step 1: Preparing training data..."
npm run prepare-data

# Check if the data preparation was successful
if [ ! -f "output/training_data.jsonl" ] || [ ! -f "output/validation_data.jsonl" ]; then
  echo "Error: Training data preparation failed"
  exit 1
fi

# Step 2: Upload files to OpenAI
echo "Step 2: Uploading files to OpenAI..."
npm run upload-files

# Check if the file upload was successful
if [ ! -f "output/file_ids.json" ]; then
  echo "Error: File upload failed"
  exit 1
fi

# Step 3: Create and monitor fine-tuning job
echo "Step 3: Creating and monitoring fine-tuning job..."
npm run create-job

# Check if the job creation was successful
if [ ! -f "output/job_details.json" ]; then
  echo "Error: Job creation failed"
  exit 1
fi

# The job monitoring is asynchronous, so we need to wait for it to complete
echo "Fine-tuning job created. You can check the status using the OpenAI dashboard."
echo "Once the job is complete, you can test the model using:"
echo "npm run test-model"

# Print instructions for updating the model ID in the application
echo ""
echo "After the fine-tuning job completes, update the model ID in src/config/fineTunedModels.ts"
echo "with the ID from output/model_details.json"
