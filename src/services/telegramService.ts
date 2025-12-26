/**
 * Telegram Bot Service (100% FREE FOREVER)
 * No credit card, no limits, completely free
 * 
 * Setup:
 * 1. Open Telegram and search for @BotFather
 * 2. Send /newbot and follow instructions
 * 3. Copy your bot token
 * 4. Add to .env: VITE_TELEGRAM_BOT_TOKEN=your_token
 * 5. Start chat with your bot
 * 6. Get your chat ID from: https://api.telegram.org/bot<token>/getUpdates
 */

interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: 'Markdown' | 'HTML';
}

interface TelegramResponse {
  ok: boolean;
  result?: any;
  description?: string;
}

export class TelegramService {
  private static readonly API_URL = 'https://api.telegram.org/bot';
  private static readonly BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
  
  /**
   * Send message via Telegram
   */
  static async sendMessage(chatId: string, message: string): Promise<boolean> {
    if (!this.BOT_TOKEN) {
      console.warn('[TelegramService] No bot token configured');
      return false;
    }

    try {
      const url = `${this.API_URL}${this.BOT_TOKEN}/sendMessage`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        } as TelegramMessage),
      });

      const data: TelegramResponse = await response.json();

      if (!data.ok) {
        throw new Error(data.description || 'Telegram API error');
      }

      console.log('[TelegramService] Message sent successfully');
      return true;
    } catch (error) {
      console.error('[TelegramService] Failed to send message:', error);
      return false;
    }
  }

  /**
   * Send alpha signal alert
   */
  static async sendAlphaAlert(
    chatId: string,
    signal: {
      source: string;
      content: string;
      lag: number;
      priceChange: number;
      score: number;
    }
  ): Promise<boolean> {
    const direction = signal.priceChange > 0 ? '📈' : '📉';
    const emoji = signal.score > 80 ? '🔥' : signal.score > 60 ? '⚡' : '💡';
    
    const message = `
${emoji} *ALPHA SIGNAL DETECTED*

${direction} *${signal.source}*
"${signal.content}"

⏱️ *Lag:* ${signal.lag.toFixed(1)}s
💰 *Price Change:* $${signal.priceChange.toFixed(2)} (${((signal.priceChange / 2650) * 100).toFixed(2)}%)
📊 *Correlation Score:* ${signal.score}/100

_SentimentNexus Terminal_
    `.trim();

    return this.sendMessage(chatId, message);
  }

  /**
   * Send price alert
   */
  static async sendPriceAlert(
    chatId: string,
    data: {
      currentPrice: number;
      previousPrice: number;
      changePercent: number;
    }
  ): Promise<boolean> {
    const direction = data.changePercent > 0 ? '📈' : '📉';
    const emoji = Math.abs(data.changePercent) > 1 ? '🚨' : '💡';
    
    const message = `
${emoji} *GOLD PRICE ALERT*

XAU/USD ${direction} ${data.changePercent > 0 ? '+' : ''}${data.changePercent.toFixed(2)}%

*Current:* $${data.currentPrice.toFixed(2)}
*Previous:* $${data.previousPrice.toFixed(2)}
*Change:* $${(data.currentPrice - data.previousPrice).toFixed(2)}

_SentimentNexus Terminal_
    `.trim();

    return this.sendMessage(chatId, message);
  }

  /**
   * Send news alert
   */
  static async sendNewsAlert(
    chatId: string,
    news: {
      source: string;
      content: string;
      impact: 'bullish' | 'bearish' | 'neutral';
      reliability: 'high' | 'medium' | 'low';
    }
  ): Promise<boolean> {
    const impactEmoji = {
      bullish: '🟢',
      bearish: '🔴',
      neutral: '🟡',
    };

    const message = `
${impactEmoji[news.impact]} *NEWS ALERT*

📰 *${news.source}*
${news.content}

*Impact:* ${news.impact.toUpperCase()}
*Reliability:* ${news.reliability.toUpperCase()}

_SentimentNexus Terminal_
    `.trim();

    return this.sendMessage(chatId, message);
  }

  /**
   * Test connection and get updates
   */
  static async testConnection(): Promise<{ success: boolean; chatId?: string }> {
    if (!this.BOT_TOKEN) {
      return { success: false };
    }

    try {
      const url = `${this.API_URL}${this.BOT_TOKEN}/getMe`;
      const response = await fetch(url);
      const data: TelegramResponse = await response.json();

      if (!data.ok) {
        return { success: false };
      }

      // Try to get updates to find chat ID
      const updatesUrl = `${this.API_URL}${this.BOT_TOKEN}/getUpdates`;
      const updatesResponse = await fetch(updatesUrl);
      const updatesData: TelegramResponse = await updatesResponse.json();

      if (updatesData.ok && updatesData.result && updatesData.result.length > 0) {
        const lastUpdate = updatesData.result[updatesData.result.length - 1];
        const chatId = lastUpdate.message?.chat?.id?.toString();
        
        return { success: true, chatId };
      }

      return { success: true };
    } catch (error) {
      console.error('[TelegramService] Test connection failed:', error);
      return { success: false };
    }
  }

  /**
   * Get bot info
   */
  static async getBotInfo(): Promise<any> {
    if (!this.BOT_TOKEN) {
      throw new Error('No bot token configured');
    }

    const url = `${this.API_URL}${this.BOT_TOKEN}/getMe`;
    const response = await fetch(url);
    const data = await response.json();

    return data.result;
  }
}

/**
 * Helper: Get your Telegram Chat ID
 * 
 * Instructions:
 * 1. Send a message to your bot
 * 2. Call this function
 * 3. Copy your chat ID
 */
export async function getMyTelegramChatId(): Promise<string | null> {
  const result = await TelegramService.testConnection();
  
  if (result.chatId) {
    console.log('Your Telegram Chat ID:', result.chatId);
    return result.chatId;
  }
  
  console.log('Send a message to your bot first, then call this function again');
  return null;
}
