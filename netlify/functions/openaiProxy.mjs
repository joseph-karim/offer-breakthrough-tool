// Netlify function to proxy OpenAI API calls
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
    const { endpoint, payload } = requestBody;

    if (!endpoint) {
      return new Response(JSON.stringify({ error: 'OpenAI endpoint is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!payload) {
      return new Response(JSON.stringify({ error: 'Request payload is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get the OpenAI API key from environment variables
    const apiKey = Netlify.env.get("OPENAI_API_KEY");
    
    // Log environment variables (excluding sensitive values)
    console.log('OPENAI_API_KEY exists:', !!apiKey);
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key is not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Determine the full OpenAI API URL
    const baseUrl = 'https://api.openai.com/v1';
    const apiUrl = `${baseUrl}/${endpoint}`;

    console.log('Making request to OpenAI API:', {
      url: apiUrl,
      method: 'POST',
      payloadKeys: Object.keys(payload)
    });

    // Call OpenAI API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    console.log('OpenAI API response status:', response.status);

    // Get the response data
    const data = await response.json();

    // If the response is not OK, return the error
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      return new Response(JSON.stringify({ 
        error: 'Error calling OpenAI API', 
        details: data.error || data 
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Return the successful response
    return new Response(JSON.stringify(data), {
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
