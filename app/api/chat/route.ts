import { NextResponse } from 'next/server';

// Configure the route to be dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'nvidia/nemotron-3-super-120b-a12b:free';
const BASE_URL = 'https://openrouter.ai/api/v1';

// This is the handler for POST requests
export async function POST(request: Request) {
  try {
    // Log the incoming request
    console.log('Received chat request');

    const { message, language = 'english' } = await request.json();
    console.log('Request payload:', { message, language });

    if (!API_KEY) {
      throw new Error('Missing OPENROUTER_API_KEY environment variable');
    }

    console.log('Making API request to OpenRouter');

    const requestBody = {
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are an educational AI assistant for students. Always answer every question asked, and whenever the user asks multiple questions, respond to each one clearly. Use clear examples, simple explanations, and direct teaching language. Keep answers aligned with NCERT and exam preparation. If the user asks for steps, show them in an ordered list. If the user asks for definitions, give a short definition first and then a brief explanation. Do not leave questions unanswered.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.3,
      max_tokens: 1200,
      top_p: 0.95,
      frequency_penalty: 0.2,
      presence_penalty: 0.2,
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://kalika-edu.vercel.app',
        'X-Title': 'Kalika Education Platform',
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