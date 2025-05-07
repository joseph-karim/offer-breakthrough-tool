// Simple script to test the Perplexity API
const fetch = require('node-fetch');

async function testPerplexityAPI() {
  try {
    // Get the API key from environment variables or use the provided one
    const apiKey = process.env.PERPLEXITY_API_KEY || "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";
    
    console.log('API key length:', apiKey.length);
    console.log('API key first 4 chars:', apiKey.substring(0, 4));
    
    // Prepare the request payload
    const payload = {
      model: 'sonar-medium-online',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: 'Hello, can you summarize the content at this URL: https://www.example.com'
        }
      ],
      temperature: 0.4,
      max_tokens: 1000
    };
    
    console.log('Making request to Perplexity API...');
    
    // Call Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries([...response.headers.entries()]));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      try {
        const errorJson = JSON.parse(errorText);
        console.error('Error details:', errorJson);
      } catch (e) {
        console.error('Could not parse error as JSON');
      }
      return;
    }
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      console.log('Message content:', data.choices[0].message.content);
    } else {
      console.error('Unexpected response structure:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testPerplexityAPI();
