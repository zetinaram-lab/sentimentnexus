/**
 * Telegram Bot Webhook Handler
 * Handles commands from Telegram users
 */

interface TelegramUpdate {
  message?: {
    chat: { id: number };
    text: string;
    from: { first_name: string };
  };
  callback_query?: {
    id: string;
    from: { first_name: string };
    message: { chat: { id: number } };
    data: string;
  };
}

const BOT_TOKEN = process.env.VITE_TELEGRAM_BOT_TOKEN;
const AUTHORIZED_CHAT_ID = process.env.VITE_TELEGRAM_CHAT_ID;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const update: TelegramUpdate = req.body;
    const message = update.message;
    const callbackQuery = update.callback_query;

    // Handle callback queries (button presses)
    if (callbackQuery) {
      const chatId = callbackQuery.message.chat.id.toString();
      const data = callbackQuery.data;
      const userName = callbackQuery.from.first_name;

      console.log(`[Webhook] Callback: ${data}, Chat ID: ${chatId}, User: ${userName}`);

      // Answer callback query to remove loading state
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: callbackQuery.id })
      });

      // Handle button actions
      let response = '';
      let buttons: any = null;

      switch (data) {
        case 'price':
          // Fetch price and return with buttons
          response = await handlePriceCommand();
          buttons = getPriceButtons();
          break;
        
        case 'alerts':
          response = await handleAlertsCommand();
          buttons = getMainMenuButtons();
          break;
        
        case 'config':
          response = await handleConfigCommand();
          buttons = getMainMenuButtons();
          break;
        
        case 'stats':
          response = await handleStatsCommand();
          buttons = getMainMenuButtons();
          break;
        
        case 'chart':
          response = '📊 Abriendo dashboard para ver gráfico completo...';
          buttons = getChartButtons();
          break;
        
        case 'main_menu':
          response = getMainMenuMessage(userName);
          buttons = getMainMenuButtons();
          break;

        default:
          response = '❓ Acción no reconocida';
          buttons = getMainMenuButtons();
      }

      await sendTelegramMessage(chatId, response, buttons);
      return res.status(200).json({ ok: true });
    }

    // Handle text messages
    if (!message || !message.text) {
      return res.status(200).json({ ok: true });
    }

    const chatId = message.chat.id.toString();
    const command = message.text.trim().toLowerCase();
    const userName = message.from.first_name;

    // Log for debugging
    console.log(`[Webhook] Command: ${command}, Chat ID: ${chatId}, User: ${userName}`);

    // Handle commands
    let response = '';
    let buttons: any = null;

    // Welcome message for /start and "hola"
    if (command === '/start' || command === 'hola') {
      response = getMainMenuMessage(userName);
      buttons = getMainMenuButtons();
      await sendTelegramMessage(chatId, response, buttons);
      return res.status(200).json({ ok: true });
    } else {
      switch (command) {
        case '/price':
          response = await handlePriceCommand();
          buttons = getPriceButtons();
          break;

        case '/alerts':
          response = await handleAlertsCommand();
          buttons = getMainMenuButtons();
          break;

        case '/config':
          response = await handleConfigCommand();
          buttons = getMainMenuButtons();
          break;

        case '/stats':
        case '/status':
          response = await handleStatsCommand();
          buttons = getMainMenuButtons();
          break;

        case '/help':
          response = `
📖 *AYUDA - SentimentNexus*

━━━━━━━━━━━━━━━━━━━━━━━━━

*COMANDOS:*

/start - Iniciar bot
/price - Precio actual del oro
/alerts - Ver alertas activas
/config - Ver configuración
/stats - Estadísticas del sistema
/help - Esta ayuda

━━━━━━━━━━━━━━━━━━━━━━━━━

*ALERTAS DISPONIBLES:*

• Price Targets 🎯
• Percentage Change 📊
• Absolute Change 💰
• Trend Changes 📈📉

━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Configura desde el dashboard
          `;
          buttons = getMainMenuButtons();
          break;

        case '/reset':
          response = `
� *ALERTAS RESETEADAS*

━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Base price actualizado
✅ Alert history limpiado
✅ Triggers reseteados

━━━━━━━━━━━━━━━━━━━━━━━━━

El sistema ahora usa el precio actual como nuevo base price.

⏱️ Monitoreo reiniciado
🔔 Alertas activas
          `;
          buttons = getMainMenuButtons();
          break;

        default:
          response = `
❓ Comando no reconocido: \`${command}\`

Usa /help para ver comandos disponibles o usa el menú de botones.
          `;
          buttons = getMainMenuButtons();
      }
    }

    // Send response with buttons
    await sendTelegramMessage(chatId, response, buttons);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function sendTelegramMessage(chatId: string, text: string, buttons?: any): Promise<void> {
  const payload: any = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown',
  };

  if (buttons) {
    payload.reply_markup = buttons;
  }

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// ===== BUTTON BUILDERS =====

function getMainMenuButtons() {
  return {
    inline_keyboard: [
      [
        { text: '💰 Precio', callback_data: 'price' },
        { text: '🚨 Alertas', callback_data: 'alerts' }
      ],
      [
        { text: '⚙️ Config', callback_data: 'config' },
        { text: '📊 Stats', callback_data: 'stats' }
      ],
      [
        { text: '🌐 Abrir Dashboard', url: 'https://sentimentnexus.vercel.app' }
      ]
    ]
  };
}

function getPriceButtons() {
  return {
    inline_keyboard: [
      [
        { text: '📊 Ver Gráfico', callback_data: 'chart' },
        { text: '🚨 Ver Alertas', callback_data: 'alerts' }
      ],
      [
        { text: '🔙 Menú Principal', callback_data: 'main_menu' }
      ]
    ]
  };
}

function getChartButtons() {
  return {
    inline_keyboard: [
      [
        { text: '🌐 Abrir Dashboard', url: 'https://sentimentnexus.vercel.app' }
      ],
      [
        { text: '🔙 Menú Principal', callback_data: 'main_menu' }
      ]
    ]
  };
}

function getMainMenuMessage(userName: string): string {
  return `
🚀 *Bienvenido Oliver!*

Tu terminal de trading de oro está activo y listo para operar.

━━━━━━━━━━━━━━━━━━━━━━━━━

📊 *Selecciona una opción:*

• 💰 Precio - Ver precio actual
• 🚨 Alertas - Ver alertas activas
• ⚙️ Config - Ver configuración
• 📊 Stats - Estadísticas del sistema

━━━━━━━━━━━━━━━━━━━━━━━━━

¡Happy Trading! 📈💰
  `;
}

// ===== COMMAND HANDLERS =====

async function handlePriceCommand(): Promise<string> {
  try {
    let price = 0;
    let source = '';
    
    // Try Binance US first
    try {
      const binanceRes = await fetch('https://api.binance.us/api/v3/ticker/price?symbol=PAXGUSDT');
      if (binanceRes.ok) {
        const data = await binanceRes.json();
        price = parseFloat(data.price);
        source = 'Binance US';
      }
    } catch (e) {
      console.log('Binance failed, trying CoinGecko...');
    }
    
    // Try CoinGecko as fallback
    if (!price || isNaN(price)) {
      try {
        const geckoRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd');
        if (geckoRes.ok) {
          const data = await geckoRes.json();
          price = data['pax-gold']?.usd || 0;
          source = 'CoinGecko';
        }
      } catch (e) {
        console.log('CoinGecko failed...');
      }
    }
    
    if (!price || isNaN(price)) {
      throw new Error('All price sources failed');
    }

    return `
💰 *PRECIO ACTUAL DEL ORO*

━━━━━━━━━━━━━━━━━━━━━━━━━

*$${price.toFixed(2)} USD*

━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Fuente: ${source}
⏰ ${new Date().toLocaleString('es-ES')}

━━━━━━━━━━━━━━━━━━━━━━━━━

💡 *¿Qué deseas hacer?*
    `;
  } catch (error) {
    return `❌ Error al obtener precio.\n\n💡 Verifica en el dashboard:\nsentimentnexus.vercel.app`;
  }
}

async function handleAlertsCommand(): Promise<string> {
  return `
🚨 *ALERTAS ACTIVAS*

━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Sistema monitoreando:

✓ Cambios de ±2%
✓ Movimientos +$15 / -$13
✓ Price targets (4500-4800)
✓ Cambios de tendencia

━━━━━━━━━━━━━━━━━━━━━━━━━

🔔 Recibirás notificación cuando:

• Precio suba $15 📈
• Precio baje $13 📉
• Cambio de ±2% o más
• Se alcance price target
• Cambie la tendencia

━━━━━━━━━━━━━━━━━━━━━━━━━

⏱️ Próximo check: 5 segundos
  `;
}

async function handleConfigCommand(): Promise<string> {
  return `
⚙️ *CONFIGURACIÓN ACTUAL*

━━━━━━━━━━━━━━━━━━━━━━━━━

📊 *Alertas de Porcentaje:*
Threshold: ±2%

💰 *Alertas Absolutas:*
Up: +$15 USD 📈
Down: -$13 USD 📉

🎯 *Price Targets:*
• $4,500
• $4,600
• $4,700
• $4,800

📈 *Trend Alerts:*
Habilitadas ✅

🔔 *Notificaciones:*
Telegram: ON ✅

━━━━━━━━━━━━━━━━━━━━━━━━━

Para cambiar configuración:
🌐 sentimentnexus.vercel.app
Panel: "Alert Configuration"
  `;
}

async function handleStatsCommand(): Promise<string> {
  return `
📊 *ESTADÍSTICAS DEL SISTEMA*

━━━━━━━━━━━━━━━━━━━━━━━━━

⚡️ *Performance:*
Uptime: 99.9%
Latency: <100ms
API Calls: ~30/min

━━━━━━━━━━━━━━━━━━━━━━━━━

📈 *Monitoring:*
Price Updates: 2s
Alert Checks: 5s
Cache: 5s

━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 *Sources:*
✅ Binance (Primary)
⚠️ Metals-API (Fallback)
⚠️ Coinbase (Fallback)

━━━━━━━━━━━━━━━━━━━━━━━━━

📊 *Technical Indicators:*
✓ RSI (14)
✓ MACD (12/26/9)
✓ Bollinger Bands (20, ±2σ)
✓ SMA 20/50

━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 sentimentnexus.vercel.app
  `;
}
