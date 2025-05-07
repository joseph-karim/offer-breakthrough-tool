// Netlify function to fetch and summarize URL content using Perplexity API
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse the request body
    const requestBody = JSON.parse(event.body);
    const { url } = requestBody;

    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'URL is required' })
      };
    }

    // Get the Perplexity API key from environment variables
    const apiKey = process.env.PERPLEXITY_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Perplexity API key is not configured' })
      };
    }

    // Call Perplexity API to analyze the URL
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'sonar-medium-online', // Using medium model for balance of cost/capability
        messages: [
          {
            role: 'system',
            content: `You are an expert business analyst. Summarize the provided web content from the URL, focusing on the person's/company's core services, expertise, typical clients, and any stated problems they solve. Extract key phrases and offerings that could form the basis of a scalable product or service. The user is a service-based entrepreneur looking to create a more scalable offer (like a course, productized service, template, workshop, software tool).`
          },
          {
            role: 'user',
            content: `Please analyze the content at this URL and provide a summary of their expertise and potential scalable offer starting points: ${url}`
          }
        ],
        temperature: 0.4, // Lower temperature for more factual extraction
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Perplexity API error:', errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Error fetching content from Perplexity API', details: errorData })
      };
    }

    const data = await response.json();
    const summary = data.choices[0]?.message?.content || '';

    return {
      statusCode: 200,
      body: JSON.stringify({ summary })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message })
    };
  }
};
