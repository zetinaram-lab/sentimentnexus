/**
 * Netlify Serverless Function: Send WhatsApp Message
 * Endpoint: /.netlify/functions/send-whatsapp
 */

import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

// Note: Install twilio with: npm install twilio
// Configure environment variables in Netlify dashboard:
// - TWILIO_ACCOUNT_SID
// - TWILIO_AUTH_TOKEN

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse request body
    const { message, to, type = 'alert' } = JSON.parse(event.body || '{}');

    if (!message || !to) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: message, to' }),
      };
    }

    // Import Twilio dynamically to avoid bundling issues
    const twilio = await import('twilio');
    
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials not configured');
    }

    const client = twilio.default(accountSid, authToken);

    // Send WhatsApp message
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
    });

    console.log('[WhatsApp] Message sent:', {
      sid: result.sid,
      status: result.status,
      to: to,
      type: type,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        messageId: result.sid,
        status: result.status,
      }),
    };
  } catch (error: any) {
    console.error('[WhatsApp] Error sending message:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Failed to send WhatsApp message',
      }),
    };
  }
};

export { handler };
