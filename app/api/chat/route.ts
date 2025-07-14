import { NextResponse } from 'next/server';

// Configure the route to be dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const API_KEY = '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';
const MODEL = 'deepseek/deepseek-r1-0528-qwen3-8b:free';
const BASE_URL = 'https://api.openrouter.ai/api/v1';

// This is the handler for POST requests
export async function POST(request: Request) {
  try {
    // Log the incoming request
    console.log('Received chat request');

    const { message, language = 'english' } = await request.json();
    console.log('Request payload:', { message, language });

    // Log the API request details (excluding sensitive data)
    console.log('Making API request to OpenRouter');

    const requestBody = {
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are an educational AI assistant for students. Always answer in a concise paragraph or, if appropriate, in clear bullet points. Focus on being clear, direct, and helpful. Your responses should be educational, informative, and focused on the NCERT curriculum. If you do not know the answer, say so honestly. Use the language specified by the user. Help students prepare for exams and understand concepts easily.
          
          If you don't know something, be honest and say so.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://kalika.vercel.app',
        'X-Title': 'Kalika - Educational Platform',
      },
      body: JSON.stringify(requestBody),
    });

    // Log the response status
    console.log('API Response status:', response.status);

    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      try {
        const errorText = await response.text();
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error?.message || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      throw new Error(errorMessage);
    }

    let data;
    try {
      data = await response.json();
      console.log('API Response data:', data);
    } catch (e) {
      console.error('Failed to parse response:', e);
      throw new Error('Invalid response from API');
    }
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid API response format:', data);
      throw new Error('Invalid response format from API');
    }

    // Log successful response
    console.log('Successfully processed chat request');

    return NextResponse.json({ 
      response: data.choices[0].message.content.trim()
    });

  } catch (error) {
    // Enhanced error logging
    console.error('Chat API Error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to process your request',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// This is the handler for GET requests (optional, for testing)
export async function GET() {
  return NextResponse.json({ status: 'API is working' });
} 