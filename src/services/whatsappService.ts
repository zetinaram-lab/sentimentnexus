/**
 * WhatsApp Integration Service
 * Handles sending alerts and notifications via WhatsApp Business API
 */

import { apiClient } from './apiClient';
import { API_CONFIG, WHATSAPP_CONFIG } from '@/config/constants';
import { AlphaSignal, MarketEvent } from '@/types';

/**
 * WhatsApp message payload
 */
export interface WhatsAppMessage {
  to: string; // Phone number in E.164 format
  type: 'text' | 'template' | 'interactive';
  content: string;
  preview_url?: boolean;
}

/**
 * WhatsApp message status
 */
export interface WhatsAppMessageStatus {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  error?: string;
}

/**
 * WhatsApp webhook payload
 */
export interface WhatsAppWebhookPayload {
  event: 'message' | 'status' | 'error';
  data: unknown;
  timestamp: string;
}

/**
 * Alert configuration
 */
export interface AlertConfig {
  phoneNumber: string;
  enablePriceAlerts: boolean;
  enableAlphaSignals: boolean;
  enableNewsAlerts: boolean;
  priceThreshold?: number; // Percentage change threshold
}

/**
 * WhatsApp Service
 */
export class WhatsAppService {
  /**
   * Send a text message
   */
  static async sendMessage(message: WhatsAppMessage): Promise<WhatsAppMessageStatus> {
    try {
      // Validate message length
      if (message.content.length > WHATSAPP_CONFIG.MAX_MESSAGE_LENGTH) {
        throw new Error(
          `Message exceeds maximum length of ${WHATSAPP_CONFIG.MAX_MESSAGE_LENGTH} characters`
        );
      }

      const response = await apiClient.post<WhatsAppMessageStatus>(
        `${API_CONFIG.ENDPOINTS.WHATSAPP}/send`,
        message
      );

      return response.data;
    } catch (error) {
      console.error('[WhatsAppService] Failed to send message:', error);
      throw error;
    }
  }

  /**
   * Send alpha signal alert
   */
  static async sendAlphaSignalAlert(
    signal: AlphaSignal,
    event: MarketEvent,
    config: AlertConfig
  ): Promise<WhatsAppMessageStatus> {
    const direction = signal.direction === 'up' ? '📈' : '📉';
    const priceChangePercent = (signal.priceChange / 2650) * 100; // Approximate base price

    const message = `
🚨 *ALPHA SIGNAL DETECTED*

${direction} *${event.source}*: "${event.content}"

⏱️ Lag: ${signal.lagSeconds}s
💰 Price Change: ${signal.priceChange.toFixed(2)} (${priceChangePercent.toFixed(2)}%)
📊 Correlation Score: ${signal.correlationScore}/100
🎯 Reliability: ${event.reliability.toUpperCase()}

_SentimentNexus Terminal_
    `.trim();

    return this.sendMessage({
      to: config.phoneNumber,
      type: 'text',
      content: message,
      preview_url: false,
    });
  }

  /**
   * Send price movement alert
   */
  static async sendPriceAlert(
    currentPrice: number,
    previousPrice: number,
    threshold: number,
    config: AlertConfig
  ): Promise<WhatsAppMessageStatus> {
    const change = currentPrice - previousPrice;
    const changePercent = (change / previousPrice) * 100;

    if (Math.abs(changePercent) < threshold) {
      throw new Error('Price change below threshold');
    }

    const direction = change > 0 ? '📈' : '📉';
    const emoji = change > 0 ? '🟢' : '🔴';

    const message = `
${emoji} *PRICE ALERT*

XAU/USD ${direction} ${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%

Current: $${currentPrice.toFixed(2)}
Previous: $${previousPrice.toFixed(2)}
Change: ${change > 0 ? '+' : ''}$${change.toFixed(2)}

_SentimentNexus Terminal_
    `.trim();

    return this.sendMessage({
      to: config.phoneNumber,
      type: 'text',
      content: message,
    });
  }

  /**
   * Send news event alert
   */
  static async sendNewsAlert(
    event: MarketEvent,
    config: AlertConfig
  ): Promise<WhatsAppMessageStatus> {
    const impactEmoji = {
      bullish: '🟢',
      bearish: '🔴',
      neutral: '🟡',
    };

    const message = `
${impactEmoji[event.impact]} *NEWS ALERT*

📰 *${event.source}*
${event.content}

Impact: ${event.impact.toUpperCase()}
Reliability: ${event.reliability.toUpperCase()}

_SentimentNexus Terminal_
    `.trim();

    return this.sendMessage({
      to: config.phoneNumber,
      type: 'text',
      content: message,
    });
  }

  /**
   * Verify webhook signature (for security)
   */
  static verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    // This would use crypto to verify HMAC signature
    // Implementation depends on WhatsApp Business API requirements
    console.log('[WhatsAppService] Webhook verification not yet implemented');
    return true;
  }

  /**
   * Handle incoming webhook
   */
  static async handleWebhook(payload: WhatsAppWebhookPayload): Promise<void> {
    try {
      console.log('[WhatsAppService] Received webhook:', payload.event);

      switch (payload.event) {
        case 'message':
          // Handle incoming message
          console.log('[WhatsAppService] Incoming message:', payload.data);
          break;
        case 'status':
          // Handle message status update
          console.log('[WhatsAppService] Message status update:', payload.data);
          break;
        case 'error':
          // Handle error
          console.error('[WhatsAppService] Webhook error:', payload.data);
          break;
        default:
          console.warn('[WhatsAppService] Unknown webhook event:', payload.event);
      }
    } catch (error) {
      console.error('[WhatsAppService] Failed to handle webhook:', error);
      throw error;
    }
  }

  /**
   * Test connection
   */
  static async testConnection(apiKey: string): Promise<boolean> {
    try {
      // Temporarily set API key
      const originalToken = apiClient['defaultHeaders']['Authorization'];
      apiClient.setAuthToken(apiKey);

      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.WHATSAPP}/health`);

      // Restore original token
      if (originalToken) {
        apiClient['defaultHeaders']['Authorization'] = originalToken;
      } else {
        apiClient.clearAuthToken();
      }

      return response.status === 200;
    } catch (error) {
      console.error('[WhatsAppService] Connection test failed:', error);
      return false;
    }
  }
}

/**
 * Mock WhatsApp Service (for development/testing)
 */
export class MockWhatsAppService {
  static async sendMessage(message: WhatsAppMessage): Promise<WhatsAppMessageStatus> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log('[MockWhatsAppService] Would send message:', {
      to: message.to,
      preview: message.content.substring(0, 100),
    });

    return {
      id: `msg_${Date.now()}`,
      status: 'sent',
      timestamp: new Date().toISOString(),
    };
  }

  static async sendAlphaSignalAlert(
    signal: AlphaSignal,
    event: MarketEvent,
    config: AlertConfig
  ): Promise<WhatsAppMessageStatus> {
    console.log('[MockWhatsAppService] Alpha signal alert:', {
      eventId: event.id,
      lag: signal.lagSeconds,
      phoneNumber: config.phoneNumber,
    });

    return this.sendMessage({
      to: config.phoneNumber,
      type: 'text',
      content: 'Mock alpha signal alert',
    });
  }

  static async sendPriceAlert(
    currentPrice: number,
    previousPrice: number,
    threshold: number,
    config: AlertConfig
  ): Promise<WhatsAppMessageStatus> {
    console.log('[MockWhatsAppService] Price alert:', {
      currentPrice,
      previousPrice,
      threshold,
    });

    return this.sendMessage({
      to: config.phoneNumber,
      type: 'text',
      content: 'Mock price alert',
    });
  }

  static async sendNewsAlert(
    event: MarketEvent,
    config: AlertConfig
  ): Promise<WhatsAppMessageStatus> {
    console.log('[MockWhatsAppService] News alert:', {
      eventId: event.id,
      source: event.source,
    });

    return this.sendMessage({
      to: config.phoneNumber,
      type: 'text',
      content: 'Mock news alert',
    });
  }

  static async testConnection(apiKey: string): Promise<boolean> {
    console.log('[MockWhatsAppService] Testing connection with API key:', apiKey.substring(0, 10) + '...');
    await new Promise((resolve) => setTimeout(resolve, 500));
    return apiKey.length >= WHATSAPP_CONFIG.MIN_API_KEY_LENGTH;
  }
}
