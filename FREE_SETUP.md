# 🆓 Guía 100% GRATIS - Sin Tarjeta de Crédito

## ¡Todo Completamente Gratis Forever!

Esta guía te muestra cómo usar **SentimentNexus** sin pagar NADA, nunca.

---

## 📊 Opción 1: Precios del Oro GRATIS

### **Método A: Yahoo Finance (Ilimitado, Sin Registro)**

✅ **100% Gratis**  
✅ **Sin registro**  
✅ **Sin límites**  
✅ **Ya configurado en la app**

**NO NECESITAS HACER NADA** - Ya funciona out of the box!

```bash
# La app usa automáticamente Yahoo Finance
# Actualización cada 2 segundos
# Sin configuración necesaria
```

### **Método B: Metals.dev API (50 requests/mes)**

Si Yahoo Finance falla, puedes usar Metals.dev:

1. **Registro (30 segundos):**
   - Ve a: https://metals.dev/
   - Click en "Get Free API Key"
   - Ingresa tu email (no necesitas tarjeta)
   - Copia tu API Key

2. **Configurar:**
   ```bash
   # En Vercel dashboard > Settings > Environment Variables
   VITE_METALS_DEV_KEY=tu_api_key_aqui
   ```

3. **Listo:**
   - 50 requests/mes = suficiente si actualizas cada 5 minutos
   - Completamente gratis para siempre

---

## 📱 Opción 2: Notificaciones GRATIS con Telegram

### **Telegram Bot (Ilimitado, Sin Costo NUNCA)**

✅ **100% Gratis para siempre**  
✅ **Sin límites de mensajes**  
✅ **Sin tarjeta de crédito**  
✅ **Más fácil que WhatsApp**

### **Configuración (3 minutos):**

#### Paso 1: Crear tu Bot
```
1. Abre Telegram
2. Busca: @BotFather
3. Envía: /newbot
4. Elige un nombre: "SentimentNexus Alerts"
5. Elige un username: "sentimentnexus_bot"
6. Copia el TOKEN que te da
```

#### Paso 2: Obtener tu Chat ID
```
1. Busca tu bot en Telegram
2. Envíale cualquier mensaje (ej: "Hola")
3. Ve a esta URL en el navegador:
   https://api.telegram.org/bot<TU_TOKEN>/getUpdates
   
4. Busca "chat":{"id": XXXXXXXXX
5. Ese número es tu Chat ID
```

#### Paso 3: Configurar en Vercel
```bash
# En Vercel dashboard > Settings > Environment Variables
VITE_TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHI...
VITE_TELEGRAM_CHAT_ID=123456789
```

#### Paso 4: Probar
```bash
# En consola del navegador:
await fetch('/.netlify/functions/send-telegram', {
  method: 'POST',
  body: JSON.stringify({
    message: '🚨 Test: Gold at $2650'
  })
})
```

---

## 🎯 Comparación de Opciones

| Feature | Yahoo Finance | Telegram | Costo Total |
|---------|--------------|----------|-------------|
| Registro | No necesario | 2 minutos | $0 |
| Tarjeta | No | No | $0 |
| Límites | Ilimitado | Ilimitado | $0 |
| Actualización | Tiempo real | Instantáneo | $0 |
| **TOTAL** | **GRATIS** | **GRATIS** | **$0** |

---

## 🚀 Setup Rápido (5 minutos total)

### **Opción Súper Rápida (Solo Telegram):**

```bash
# 1. Crear bot con @BotFather en Telegram (2 min)
# 2. Obtener token y chat ID (1 min)
# 3. Agregar a Vercel (1 min)
# 4. Listo! (1 min de pruebas)
```

### **Variables de Entorno (Solo estas):**

```env
# Telegram (GRATIS FOREVER)
VITE_TELEGRAM_BOT_TOKEN=tu_token_del_botfather
VITE_TELEGRAM_CHAT_ID=tu_chat_id

# Opcional: Metals.dev si quieres backup
VITE_METALS_DEV_KEY=tu_api_key_opcional
```

---

## 📝 Crear Función Telegram (Sin Costo)

Crea: `netlify/functions/send-telegram.ts`

```typescript
import type { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message } = JSON.parse(event.body || '{}');
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

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

    return {
      statusCode: 200,
      body: JSON.stringify({ success: data.ok }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export { handler };
```

---

## ✅ Checklist Final

- [ ] App desplegada en Vercel (GRATIS)
- [ ] Precios funcionando con Yahoo Finance (GRATIS, ya configurado)
- [ ] Bot de Telegram creado (GRATIS, 2 minutos)
- [ ] Variables en Vercel configuradas (GRATIS)
- [ ] Función Telegram agregada (GRATIS)
- [ ] Test de alerta funcionando (GRATIS)

**Costo Total: $0.00 🎉**

---

## 🎁 Bonus: Alternativas También Gratis

### **Notificaciones Email (GRATIS):**
- EmailJS: 200 emails/mes gratis
- SendGrid: 100 emails/día gratis
- Mailgun: 5,000 emails/mes primer mes gratis

### **Más APIs de Oro GRATIS:**
- CurrencyAPI.com: 300 requests/mes
- ExchangeRate-API: 1,500 requests/mes
- MetalsAPI: 50 requests/mes

---

## 📚 Recursos

- Telegram Bots: https://core.telegram.org/bots
- Yahoo Finance API: https://www.yahoofinanceapi.com/
- Netlify Functions: https://docs.netlify.com/functions/overview/

---

## 💬 ¿Preguntas?

**P: ¿De verdad es TODO gratis?**  
R: Sí, 100%. No se necesita tarjeta de crédito en ningún paso.

**P: ¿Hay límites ocultos?**  
R: No. Yahoo Finance es ilimitado. Telegram es ilimitado. Vercel y Netlify tienen planes gratis muy generosos.

**P: ¿Cuánto dura lo "gratis"?**  
R: Para siempre. No son trials.

**P: ¿Puedo escalar después?**  
R: Sí, puedes agregar APIs pagadas cuando quieras, pero no es necesario.

---

**¡Disfruta tu terminal de inteligencia financiera GRATIS! 🚀**

_Sin suscripciones, sin sorpresas, sin costos ocultos._
