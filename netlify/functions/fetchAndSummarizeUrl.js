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
    // Log the incoming request for debugging
    console.log('Function invoked with event:', {
      httpMethod: event.httpMethod,
      path: event.path,
      headers: event.headers,
      bodyLength: event.body ? event.body.length : 0
    });

    // Parse the request body
    const requestBody = JSON.parse(event.body);
    const { url } = requestBody;

    console.log('Parsed request body:', { url });

    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'URL is required' })
      };
    }

    // Get the Perplexity API key from environment variables
    const apiKey = process.env.PERPLEXITY_API_KEY;

    // Log environment variables (excluding sensitive values)
    console.log('Environment variables available:', Object.keys(process.env));
    console.log('PERPLEXITY_API_KEY exists:', !!apiKey);

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Perplexity API key is not configured',
          debug: {
            envVarsAvailable: Object.keys(process.env),
            keyExists: !!apiKey
          }
        })
      };
    }

    // Prepare the API request payload
    const payload = {
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
    };

    console.log('Calling Perplexity API with payload:', {
      model: payload.model,
      messageCount: payload.messages.length,
      temperature: payload.temperature,
      max_tokens: payload.max_tokens,
      url: url
    });

    let summary = '';
    try {
      // Call Perplexity API to analyze the URL
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      console.log('Perplexity API response status:', response.status);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: 'Could not parse error response', message: await response.text() };
        }

        console.error('Perplexity API error:', errorData);
        return {
          statusCode: response.status,
          body: JSON.stringify({
            error: 'Error fetching content from Perplexity API',
            details: errorData,
            status: response.status,
            statusText: response.statusText
          })
        };
      }

      // Process successful response
      const data = await response.json();
      console.log('Perplexity API response data structure:', Object.keys(data));

      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        summary = data.choices[0].message.content || '';
        console.log('Successfully extracted summary, length:', summary.length);
      } else {
        console.error('Unexpected response structure:', data);
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: 'Unexpected response structure from Perplexity API',
            responseStructure: Object.keys(data)
          })
        };
      }
    } catch (apiError) {
      console.error('Error making API request:', apiError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error making request to Perplexity API',
          details: apiError.message
        })
      };
    }

    // Return the successful response with the summary
    console.log('Successfully returning summary, length:', summary.length);
    return {
      statusCode: 200,
      body: JSON.stringify({ summary })
    };
  } catch (error) {
    console.error('Function error:', error);
    console.error('Error stack:', error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
        stack: error.stack,
        type: error.constructor.name
      })
    };
  }
};
