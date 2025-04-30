# JTBD Job Statements Fine-Tuning

This project contains scripts to fine-tune OpenAI's GPT-4.1 model to generate Job-to-be-Done (JTBD) job statements.

## Prerequisites

- Node.js (v14 or higher)
- OpenAI API key with fine-tuning access
- npm or yarn

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set your OpenAI API key as an environment variable:
   ```
   export OPENAI_API_KEY=your_api_key_here
   ```

## Fine-Tuning Process

The fine-tuning process consists of the following steps:

### 1. Prepare Training Data

Run the following command to prepare the training and validation data:

```
npm run prepare-data
```

This will:
- Format the training examples into the required JSONL format
- Split the data into training (80%) and validation (20%) sets
- Save the files to the `output` directory

### 2. Create Fine-Tuning Job

Run the following command to create a fine-tuning job:

```
npm run create-fine-tune
```

This will:
- Upload the training and validation files to OpenAI
- Create a fine-tuning job using the uploaded files
- Save the file IDs to `output/file_ids.json`
- Save the job details to `output/job_details.json`

### 3. Check Fine-Tuning Status

Run the following command to check the status of the fine-tuning job:

```
npm run check-status
```

This will:
- Display the current status of the fine-tuning job
- Show the fine-tuned model ID when the job is complete

### 4. Test the Fine-Tuned Model

After the fine-tuning job is complete, run the following command to test the model:

```
npm run test-model
```

This will:
- Generate a response using the fine-tuned model
- Generate a response using the base model for comparison
- Save the results to `output/test_results.json`

## Files

- `scripts/prepare-data.js`: Prepares the training and validation data
- `scripts/create-fine-tune.js`: Uploads files and creates the fine-tuning job
- `scripts/check-fine-tune-status.js`: Checks the status of the fine-tuning job
- `scripts/test-model.js`: Tests the fine-tuned model

## Output Files

- `output/training_data.jsonl`: Training data in JSONL format
- `output/validation_data.jsonl`: Validation data in JSONL format
- `output/file_ids.json`: File IDs from the upload process
- `output/job_details.json`: Details of the fine-tuning job
- `output/model_details.json`: Details of the fine-tuned model
- `output/test_results.json`: Results of testing the model

## Notes

- The fine-tuning process can take several hours to complete
- The fine-tuned model will be available for use in the OpenAI API after the job completes
- The model name will be in the format `ft:gpt-4-1106-preview:your-org:jtbd-bot:id`
- We're using gpt-4-1106-preview as it's the closest available model to gpt-4.1-2025-04-14
- The training data consists of 35 examples of product/service descriptions and their corresponding job statements
