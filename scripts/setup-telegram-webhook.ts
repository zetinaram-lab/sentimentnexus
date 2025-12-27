/**
 * Setup Telegram Bot Webhook
 * Configures the bot to receive commands
 * 
 * Usage: Set BOT_TOKEN in your environment or replace below
 */

const BOT_TOKEN = process.env.VITE_TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const WEBHOOK_URL = 'https://sentimentnexus.vercel.app/api/telegram-webhook';

async function setupWebhook() {
  try {
    console.log('🔧 Configurando webhook...');
    
    // Set webhook
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        allowed_updates: ['message'],
      }),
    });

    const data = await response.json();

    if (data.ok) {
      console.log('✅ Webhook configurado correctamente!');
      console.log('URL:', WEBHOOK_URL);
      
      // Get webhook info
      const infoResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
      const info = await infoResponse.json();
      
      console.log('\n📊 Información del webhook:');
      console.log(JSON.stringify(info.result, null, 2));
      
      // Send test message
      console.log('\n📤 Enviando mensaje de prueba...');
      const chatId = process.env.VITE_TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID_HERE';
      const testResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `
🤖 *Bot Configurado Correctamente!*

━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Webhook: Activo
✅ Comandos: Habilitados
✅ Notificaciones: ON

━━━━━━━━━━━━━━━━━━━━━━━━━

📱 *Prueba estos comandos:*

/start - Iniciar bot
/help - Ver ayuda
/status - Estado del sistema
/price - Precio actual
/alerts - Ver alertas
/config - Ver configuración
/stats - Estadísticas

━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Ahora puedes controlar el sistema directamente desde Telegram!

🌐 sentimentnexus.vercel.app
          `,
          parse_mode: 'Markdown',
        }),
      });

      const testData = await testResponse.json();
      
      if (testData.ok) {
        console.log('✅ Mensaje de prueba enviado!');
      } else {
        console.log('❌ Error enviando mensaje:', testData.description);
      }
      
    } else {
      console.error('❌ Error configurando webhook:', data.description);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

setupWebhook();
