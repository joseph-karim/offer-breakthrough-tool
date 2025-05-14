// Netlify function to fetch and summarize URL content using Perplexity API
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
    const apiKey = process.env.PERPLEXITY_API_KEY || (typeof Netlify !== 'undefined' ? Netlify.env.get("PERPLEXITY_API_KEY") : null);

    // Log environment variables (excluding sensitive values)
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
      model: 'sonar', // Using the correct model name from the documentation
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
      // Log the API key length for debugging (don't log the actual key)
      console.log('API key length:', apiKey.length);
      console.log('API key first 4 chars:', apiKey.substring(0, 4));

      // Prepare the request options
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      };

      console.log('Making request to Perplexity API with options:', {
        method: requestOptions.method,
        headers: Object.keys(requestOptions.headers),
        bodyLength: requestOptions.body.length
      });

      // Make the request using the native https module
      const perplexityResponse = await new Promise((resolve, reject) => {
        const requestBody = JSON.stringify(payload);

        const options = {
          hostname: 'api.perplexity.ai',
          path: '/chat/completions',
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
          console.log('Perplexity API response status:', res.statusCode);
          console.log('Perplexity API response headers:', res.headers);

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

      console.log('Perplexity API response received');

      // Check if the response was successful
      if (perplexityResponse.statusCode !== 200) {
        console.error('Perplexity API error:', perplexityResponse.body);
        return {
          statusCode: perplexityResponse.statusCode,
          body: JSON.stringify({
            error: 'Error fetching content from Perplexity API',
            details: perplexityResponse.body,
            status: perplexityResponse.statusCode
          })
        };
      }

      // Process successful response
      const data = perplexityResponse.body;
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
