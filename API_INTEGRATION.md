# API Integration Guide

## Overview

SentimentNexus now has a complete service layer ready for real API integration. The architecture supports seamless switching between mock data (development) and real APIs (production).

## Architecture

```
src/services/
├── apiClient.ts           # HTTP client with retry logic
├── marketDataService.ts   # XAU/USD market data
├── sentimentService.ts    # News & sentiment analysis
├── whatsappService.ts     # WhatsApp notifications
└── index.ts              # Service factory & health checks
```

## Feature Flags

Toggle between mock and real APIs in `src/config/constants.ts`:

```typescript
export const FEATURES = {
  ENABLE_MOCK_DATA: true,
  ENABLE_REAL_API: false,  // Set to true for production APIs
  ENABLE_WHATSAPP: true,
  // ...
}
```

## Usage

### Using Services Hook

```typescript
import { useServices } from '@/hooks/useServices';

function MyComponent() {
  const {
    getCurrentPrice,
    getNewsFeed,
    sendAlphaAlert,
    isLoading,
    error,
  } = useServices();

  // Get current price
  const price = await getCurrentPrice();

  // Get news feed
  const news = await getNewsFeed({ category: 'gold', limit: 10 });

  // Send WhatsApp alert
  await sendAlphaAlert(signal, event, config);
}
```

### Direct Service Access

```typescript
import { marketDataService, sentimentService } from '@/services';

// Get historical data
const data = await marketDataService.getHistoricalData({
  symbol: 'XAUUSD',
  interval: '1m',
  limit: 100,
});

// Analyze sentiment
const result = await sentimentService.analyzeSentiment(text);
```

## API Endpoints Configuration

Configure in `src/config/constants.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://api.sentimentnexus.com',
  ENDPOINTS: {
    MARKET_DATA: '/api/v1/market/xauusd',
    NEWS_FEED: '/api/v1/news',
    SENTIMENT: '/api/v1/sentiment',
    WHATSAPP: '/api/v1/integrations/whatsapp',
  },
}
```

## Environment Variables

Create `.env` file:

```bash
VITE_API_URL=https://api.sentimentnexus.com
VITE_WHATSAPP_API_KEY=your_api_key_here
```

## Real API Integration Steps

### 1. Market Data API

**Recommended APIs:**
- Alpha Vantage (free tier available)
- Twelve Data
- Finnhub
- IEX Cloud

**Integration:**
```typescript
// Example with Alpha Vantage
const API_KEY = 'your_key';
const response = await fetch(
  `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey=${API_KEY}`
);
```

### 2. Sentiment Analysis API

**Recommended APIs:**
- OpenAI GPT (sentiment classification)
- Google Cloud Natural Language API
- AWS Comprehend
- Hugging Face Inference API

**Integration:**
```typescript
// Example with OpenAI
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [{
      role: 'system',
      content: 'Analyze sentiment and market impact of this news...'
    }]
  })
});
```

### 3. News Feed API

**Recommended APIs:**
- NewsAPI.org
- Finnhub News
- Alpha Vantage News Sentiment
- NewsData.io

**Integration:**
```typescript
// Example with NewsAPI
const response = await fetch(
  `https://newsapi.org/v2/everything?q=gold&apiKey=${NEWS_API_KEY}`
);
```

### 4. WhatsApp Business API

**Options:**
- Meta WhatsApp Business Platform (official)
- Twilio WhatsApp API
- MessageBird
- Vonage

**Integration:**
```typescript
// Example with Twilio
const response = await fetch(
  `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${ACCOUNT_SID}:${AUTH_TOKEN}`)}`,
    },
    body: new URLSearchParams({
      From: 'whatsapp:+14155238886',
      To: `whatsapp:${phoneNumber}`,
      Body: message,
    }),
  }
);
```

## Error Handling

All services include comprehensive error handling:

```typescript
try {
  const data = await marketDataService.getCurrentPrice();
} catch (error) {
  if (error instanceof ApiClientError) {
    console.error('API Error:', error.status, error.message);
  }
}
```

## Rate Limiting

The API client includes automatic retry with exponential backoff:

```typescript
const defaultRetryConfig = {
  attempts: 3,
  delay: 1000,
  shouldRetry: (error) => error.status >= 500,
};
```

## Testing

Mock services are automatically used when `ENABLE_REAL_API: false`:

```typescript
// Runs tests with mock data
npm test

// Mock services log to console for debugging
console.log('[MockMarketDataService] Would fetch price...');
```

## WebSocket Support

Real-time market data via WebSocket:

```typescript
const unsubscribe = marketDataService.subscribeToRealTimeUpdates(
  'XAUUSD',
  (data) => {
    console.log('Price update:', data.price);
  },
  (error) => {
    console.error('WebSocket error:', error);
  }
);

// Cleanup
unsubscribe();
```

## Security Best Practices

1. **Never commit API keys** - Use environment variables
2. **Validate webhook signatures** - Prevent unauthorized access
3. **Rate limit requests** - Avoid API quota exhaustion
4. **Sanitize user input** - Prevent injection attacks
5. **Use HTTPS only** - Encrypt data in transit

## Health Monitoring

Check service health:

```typescript
import { ServiceHealth } from '@/services';

const health = await ServiceHealth.checkAllServices();
console.log(health);
// { marketData: true, sentiment: true, whatsapp: false }

const mode = ServiceHealth.getServiceMode();
console.log(mode);
// { mode: 'development', usingRealApi: false, ... }
```

## Next Steps

1. ✅ Choose your API providers
2. ✅ Sign up and get API keys
3. ✅ Add keys to `.env` file
4. ✅ Set `ENABLE_REAL_API: true` in constants
5. ✅ Test each service individually
6. ✅ Deploy to production

## Support

For issues or questions about API integration, check:
- Service logs in browser console
- Network tab for request/response details
- API provider documentation
- SentimentNexus GitHub Issues

---

Built with ❤️ for institutional-grade financial intelligence.
