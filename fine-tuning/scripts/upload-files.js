// upload-files.js
// Script to upload training and validation files to OpenAI

const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Paths
const outputDir = path.join(__dirname, '../output');
const trainingFilePath = path.join(outputDir, 'training_data.jsonl');
const validationFilePath = path.join(outputDir, 'validation_data.jsonl');

// Function to upload files to OpenAI
async function uploadFiles() {
  try {
    console.log('Uploading training file...');
    const trainingFile = await openai.files.create({
      file: fs.createReadStream(trainingFilePath),
      purpose: 'fine-tune'
    });
    console.log(`Training file uploaded with ID: ${trainingFile.id}`);

    console.log('Uploading validation file...');
    const validationFile = await openai.files.create({
      file: fs.createReadStream(validationFilePath),
      purpose: 'fine-tune'
    });
    console.log(`Validation file uploaded with ID: ${validationFile.id}`);

    // Save file IDs to a JSON file for later use
    const fileIds = {
      trainingFileId: trainingFile.id,
      validationFileId: validationFile.id,
      uploadedAt: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(outputDir, 'file_ids.json'),
      JSON.stringify(fileIds, null, 2)
    );

    console.log('File IDs saved to file_ids.json');
    return fileIds;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
}

// Run the upload process
uploadFiles()
  .then(() => console.log('Files uploaded successfully'))
  .catch(err => {
    console.error('Error in upload process:', err);
    process.exit(1);
  });
