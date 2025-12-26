import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message } = req.body;
    const botToken = process.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.VITE_TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return res.status(500).json({ 
        error: 'Telegram credentials not configured',
        hint: 'Add VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID to Vercel environment variables'
      });
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.description || 'Failed to send message');
    }

    return res.status(200).json({ 
      success: true,
      messageId: data.result.message_id 
    });
  } catch (error: any) {
    console.error('Telegram error:', error);
    return res.status(500).json({ 
      error: error.message,
      success: false 
    });
  }
}
