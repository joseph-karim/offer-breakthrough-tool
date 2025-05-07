// Netlify function to proxy OpenAI API calls
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
    const { endpoint, payload } = requestBody;

    if (!endpoint) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'OpenAI endpoint is required' })
      };
    }

    if (!payload) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request payload is required' })
      };
    }

    // Get the OpenAI API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'OpenAI API key is not configured' })
      };
    }

    // Determine the full OpenAI API URL
    const baseUrl = 'https://api.openai.com/v1';
    const apiUrl = `${baseUrl}/${endpoint}`;

    // Call OpenAI API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    // Get the response data
    const data = await response.json();

    // If the response is not OK, return the error
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: 'Error calling OpenAI API', 
          details: data.error || data 
        })
      };
    }

    // Return the successful response
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message })
    };
  }
};
