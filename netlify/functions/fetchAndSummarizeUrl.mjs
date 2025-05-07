// Netlify function to fetch and summarize URL content using Perplexity API
import { Context } from "@netlify/functions";
import fetch from "node-fetch";

export default async (req, context) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Log the incoming request for debugging
    console.log('Function invoked with request:', {
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries())
    });

    // Parse the request body
    const requestBody = await req.json();
    const { url } = requestBody;

    console.log('Parsed request body:', { url });

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get the Perplexity API key from environment variables
    const apiKey = Netlify.env.get("PERPLEXITY_API_KEY");

    // Log environment variables (excluding sensitive values)
    console.log('PERPLEXITY_API_KEY exists:', !!apiKey);

    if (!apiKey) {
      return new Response(JSON.stringify({
        error: 'Perplexity API key is not configured',
        debug: {
          keyExists: !!apiKey
        }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
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

      // Call Perplexity API to analyze the URL
      const response = await fetch('https://api.perplexity.ai/chat/completions', requestOptions);

      console.log('Perplexity API response status:', response.status);
      console.log('Perplexity API response headers:', Object.fromEntries([...response.headers.entries()]));

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: 'Could not parse error response', message: await response.text() };
        }

        console.error('Perplexity API error:', errorData);
        return new Response(JSON.stringify({
          error: 'Error fetching content from Perplexity API',
          details: errorData,
          status: response.status,
          statusText: response.statusText
        }), {
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Process successful response
      const data = await response.json();
      console.log('Perplexity API response data structure:', Object.keys(data));

      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        summary = data.choices[0].message.content || '';
        console.log('Successfully extracted summary, length:', summary.length);
      } else {
        console.error('Unexpected response structure:', data);
        return new Response(JSON.stringify({
          error: 'Unexpected response structure from Perplexity API',
          responseStructure: Object.keys(data)
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (apiError) {
      console.error('Error making API request:', apiError);
      return new Response(JSON.stringify({
        error: 'Error making request to Perplexity API',
        details: apiError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Return the successful response with the summary
    console.log('Successfully returning summary, length:', summary.length);
    return new Response(JSON.stringify({ summary }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Function error:', error);
    console.error('Error stack:', error.stack);
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: error.message,
      stack: error.stack,
      type: error.constructor.name
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
