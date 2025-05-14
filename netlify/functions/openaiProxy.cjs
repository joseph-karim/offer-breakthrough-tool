// Netlify function to proxy OpenAI API calls
// Using native https module instead of node-fetch for maximum compatibility
import https from 'https';

export const handler = async function(event, context) {
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
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch (e) {
      console.error('Error parsing request body:', e);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request body' })
      };
    }

    const { endpoint, payload } = requestBody;
    console.log('Parsed request body:', { endpoint, payloadKeys: Object.keys(payload || {}) });

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
    const apiKey = process.env.OPENAI_API_KEY || (typeof Netlify !== 'undefined' ? Netlify.env.get("OPENAI_API_KEY") : null);

    // Log environment variables (excluding sensitive values)
    console.log('OPENAI_API_KEY exists:', !!apiKey);

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'OpenAI API key is not configured',
          debug: {
            envVarsAvailable: Object.keys(process.env),
            keyExists: !!apiKey
          }
        })
      };
    }

    // Determine the full OpenAI API URL
    const baseUrl = 'api.openai.com';
    const apiPath = `/v1/${endpoint}`;

    console.log('Making request to OpenAI API:', {
      host: baseUrl,
      path: apiPath,
      method: 'POST',
      payloadKeys: Object.keys(payload)
    });

    // Make the request using the native https module
    const openaiResponse = await new Promise((resolve, reject) => {
      const requestBody = JSON.stringify(payload);

      const options = {
        hostname: baseUrl,
        path: apiPath,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Content-Length': Buffer.byteLength(requestBody)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        // Log response status
        console.log('OpenAI API response status:', res.statusCode);
        console.log('OpenAI API response headers:', res.headers);

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            resolve({ statusCode: res.statusCode, body: parsedData });
          } catch (e) {
            console.error('Error parsing response:', e);
            resolve({ statusCode: res.statusCode, body: data, error: e });
          }
        });
      });

      req.on('error', (error) => {
        console.error('Error making request:', error);
        reject(error);
      });

      req.write(requestBody);
      req.end();
    });

    console.log('OpenAI API response received');

    // Check if the response was successful
    if (openaiResponse.statusCode !== 200) {
      console.error('OpenAI API error:', openaiResponse.body);
      return {
        statusCode: openaiResponse.statusCode,
        body: JSON.stringify({
          error: 'Error calling OpenAI API',
          details: openaiResponse.body,
          status: openaiResponse.statusCode
        })
      };
    }

    // Get the response data
    const data = openaiResponse.body;

    // Return the successful response
    return {
      statusCode: 200,
      body: JSON.stringify(data)
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
