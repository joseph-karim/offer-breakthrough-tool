// test-model.js
// Script to test the fine-tuned model

const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

// Initialize OpenAI client with API key from .env file
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Paths
const outputDir = path.join(__dirname, '../output');
const jobDetailsPath = path.join(outputDir, 'job_details.json');

// System prompt - same as used in training
const systemPrompt = `You are JTBD-Bot, an expert assistant trained in Jobs-to-be-Done methodology. Your task is to analyze user input (Product/Service, Desired Outcomes, Trigger Events) and generate exactly one Overarching Job Statement (OJS) and three to five Supporting Job Statements (SJS).

# Task Description
Generate one OJS and 3-5 SJS representing the customer's desired progress.

# Input Context
You will receive user input structured like this:
* Product/Service: [User's description]
* Desired Outcomes: [User's description]
* Trigger Events: [List of user's triggers]

# Methodology & Constraints
- **Progress Focus:** Statements MUST describe customer progress, NOT product features.
- **Format:** Strictly adhere to: "Help me [VERB] my [OBJECT] [CONTEXT]". Use strong, active verbs (see Verb Bank).
- **Context:** Incorporate relevant constraints or emotions (time, risk, resources, feelings like 'without anxiety', 'despite limited time').
- **Job Types:** Clearly label "Overarching Job Statement" and "Supporting Job Statements".
- **Validation (Internal):** Ensure statements pass the Five Tests (Switch, Progress, Specificity, Solution-Agnostic, Emotional).
- **No Extras:** Output ONLY the formatted statements unless asked for explanation.
- **Pitfall Avoidance:** Automatically correct statements mentioning solutions/features, using weak verbs, combining jobs, or lacking context.

# Verb Bank (Preferred)
Achieve, Accelerate, Align, Alleviate, Boost, Build, Capture, Clarify, Create, Eliminate, Enhance, Establish, Free, Improve, Increase, Maintain, Navigate, Protect, Reduce, Secure, Simplify, Streamline, Transform, Validate.

# Output Format
Provide the output EXACTLY as follows:

**Overarching Job Statement:**
* Help me [VERB] my [OBJECT] [CONTEXT]

**Supporting Job Statements:**
1. Help me [VERB] my [OBJECT] [CONTEXT]
2. Help me [VERB] my [OBJECT] [CONTEXT]
3. Help me [VERB] my [OBJECT] [CONTEXT]
4. (Optional) Help me [VERB] my [OBJECT] [CONTEXT]
5. (Optional) Help me [VERB] my [OBJECT] [CONTEXT]`;

// Test example
const testExample = `Here's the information about my offer:

* Product/Service: A curated family vacation planning service that offers pre-vetted, activity-packed itineraries focused on specific destinations or themes, maximizing limited time off.
* Desired Outcomes: Stress-free vacation planning, unique and engaging experiences for the whole family, making the most of limited vacation days, creating lasting positive memories.
* Trigger Events: Feeling overwhelmed trying to plan a family vacation that satisfies everyone with limited time; past vacations felt rushed or disorganized; wanting to ensure precious vacation time isn't wasted on poor planning or bad choices; lacking time or knowledge to research and book unique family-friendly activities.`;

// Function to test the fine-tuned model
async function testFineTunedModel() {
  try {
    // Check if job details exist
    if (!fs.existsSync(jobDetailsPath)) {
      throw new Error('Job details not found. Please run create-fine-tune.js first.');
    }

    const jobDetails = JSON.parse(fs.readFileSync(jobDetailsPath, 'utf8'));

    // Check if fine-tuned model is available
    if (!jobDetails.fine_tuned_model) {
      throw new Error('Fine-tuned model not yet available. Please wait for the fine-tuning job to complete.');
    }

    const fineTunedModelId = jobDetails.fine_tuned_model;
    console.log(`Testing fine-tuned model: ${fineTunedModelId}`);

    // Generate completion using the fine-tuned model
    const completion = await openai.chat.completions.create({
      model: fineTunedModelId,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: testExample
        }
      ],
      temperature: 0.7
    });

    // Print the response
    console.log('\nFine-tuned model response:');
    console.log('=========================');
    console.log(completion.choices[0].message.content);

    // For comparison, also test with the base model
    console.log('\nGenerating response with base model for comparison...');

    const baseModelCompletion = await openai.chat.completions.create({
      model: 'gpt-4.1-2025-04-14',  // Using the base model as a comparison
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: testExample
        }
      ],
      temperature: 0.7
    });

    console.log('\nBase model response:');
    console.log('===================');
    console.log(baseModelCompletion.choices[0].message.content);

    // Save both responses to a file for comparison
    const comparisonResults = {
      testExample,
      fineTunedModelResponse: completion.choices[0].message.content,
      baseModelResponse: baseModelCompletion.choices[0].message.content,
      testedAt: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(outputDir, 'test_results.json'),
      JSON.stringify(comparisonResults, null, 2)
    );

    console.log('\nTest results saved to test_results.json');
  } catch (error) {
    console.error('Error testing fine-tuned model:', error);
    throw error;
  }
}

// Run the test
testFineTunedModel()
  .then(() => console.log('Test completed successfully'))
  .catch(err => {
    console.error('Error in test process:', err);
    process.exit(1);
  });
