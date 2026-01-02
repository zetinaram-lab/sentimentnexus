# 🤖 AUDITORÍA BOT TELEGRAM - SENTIMENTNEXUS
**Fecha:** 1 de Enero de 2026  
**Bot:** @SentimentNexusBot  
**Status:** ⚠️ REQUIERE ATENCIÓN

---

## 📊 RESUMEN EJECUTIVO

### ✅ LO QUE FUNCIONA BIEN (8/10)
1. **Arquitectura sólida**: Webhook handler bien estructurado
2. **Menú interactivo**: Botones inline bien diseñados
3. **Comandos completos**: /start, /price, /alerts, /config, /stats, /help, /admin, /reset
4. **Análisis inteligente**: Comando de análisis técnico con niveles de soporte/resistencia
5. **Tracking de usuarios**: Sistema de sesiones para monitorear actividad
6. **Notificaciones admin**: Alerta cuando nuevo usuario inicia bot
7. **Fallback de APIs**: Binance US → CoinGecko (resiliente)
8. **Mensajes profesionales**: Formato Markdown bien aplicado

### ⚠️ PROBLEMAS IDENTIFICADOS

#### 🚨 CRÍTICO (BLOQUEANTE)
1. **Nombre hardcodeado en mensaje de bienvenida**
   - **Archivo:** `api/telegram-webhook.ts` línea 397
   - **Problema:** `🚀 *Bienvenido Oliver!*` (debería ser dinámico)
   - **Impacto:** Todos los usuarios ven "Oliver" en lugar de su nombre
   - **Fix:** Usar `${userName}` variable

#### ⚠️ IMPORTANTE (DEGRADACIÓN)
2. **Webhook probablemente no configurado en producción**
   - **Evidencia:** No hay archivo `.env` (solo `.env.example`)
   - **Impacto:** Bot no recibe updates en tiempo real
   - **Fix:** Configurar webhook en Vercel + Telegram

3. **Comandos de análisis avanzado incompletos**
   - **Archivo:** `api/telegram-webhook.ts` líneas 600+
   - **Comandos:** `/trend`, `/predict`, `/summary` tienen respuestas mock
   - **Impacto:** Usuarios esperan análisis real pero reciben data estática
   - **Fix:** Integrar con APIs reales o datos del dashboard

4. **Admin command sin validación robusta**
   - **Archivo:** `api/telegram-webhook.ts` línea 221
   - **Problema:** Solo valida `chatId === ADMIN_CHAT_ID` (fácil de bypassear si no se configura)
   - **Impacto:** Riesgo de seguridad si ADMIN_CHAT_ID no está en variables de entorno
   - **Fix:** Validación más estricta + logging de intentos no autorizados

5. **User tracking solo en memoria (se pierde en redeploys)**
   - **Archivo:** `api/telegram-webhook.ts` línea 29
   - **Problema:** `const userSessions = new Map()` (ephemeral)
   - **Impacto:** Pierdes estadísticas de usuarios cada vez que Vercel hace cold start
   - **Fix:** Usar Redis, Supabase, o archivo JSON persistente

#### 💡 MEJORAS OPCIONALES
6. **No hay rate limiting**
   - **Impacto:** Usuario puede spammear comandos
   - **Fix:** Implementar cooldown de 2-3 segundos entre comandos

7. **Análisis técnico usa datos estáticos**
   - **Archivo:** `api/telegram-webhook.ts` líneas 590-650
   - **Problema:** Niveles de soporte/resistencia hardcodeados ($4500, $4600)
   - **Impacto:** Análisis puede estar desactualizado si precio se mueve mucho
   - **Fix:** Calcular niveles dinámicamente con datos históricos

8. **No hay logging estructurado**
   - **Problema:** Solo `console.log` básicos
   - **Impacto:** Difícil debuggear en producción
   - **Fix:** Implementar logger (Winston, Pino) o integrar con Vercel Analytics

---

## 🔧 PLAN DE ACCIÓN PRIORIZADO

### 🚨 FASE 1: FIXES CRÍTICOS (30 minutos)

#### Fix #1: Nombre dinámico en bienvenida (5 min)
```typescript
// ANTES (línea 397):
function getMainMenuMessage(userName: string): string {
  return `
🚀 *Bienvenido Oliver!*

// DESPUÉS:
function getMainMenuMessage(userName: string): string {
  return `
🚀 *Bienvenido ${userName}!*
```

#### Fix #2: Configurar webhook en Telegram (10 min)
```bash
# 1. Obtener BOT_TOKEN de Vercel env vars
# 2. Configurar webhook:
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://sentimentnexus.vercel.app/api/telegram-webhook",
    "max_connections": 40,
    "allowed_updates": ["message", "callback_query"]
  }'

# 3. Verificar:
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

#### Fix #3: Variables de entorno en Vercel (15 min)
```bash
# Ir a: https://vercel.com/zetinaram-lab/sentimentnexus/settings/environment-variables

# Agregar (si no existen):
VITE_TELEGRAM_BOT_TOKEN=<tu_bot_token_de_BotFather>
VITE_TELEGRAM_CHAT_ID=<tu_chat_id_de_userinfobot>
ADMIN_CHAT_ID=<tu_chat_id_para_comando_admin>

# Redeploy después de agregar variables
```

---

### ⚠️ FASE 2: MEJORAS IMPORTANTES (2 horas)

#### Mejora #1: Análisis técnico real (1 hora)
- Calcular niveles de soporte/resistencia dinámicamente
- Usar datos históricos del dashboard (si existen)
- Agregar indicadores reales: RSI, MACD (si tienes API con históricos)

#### Mejora #2: Persistencia de usuarios (30 min)
**Opción A: Supabase (recomendado)**
```typescript
// Crear tabla en Supabase:
CREATE TABLE bot_users (
  chat_id TEXT PRIMARY KEY,
  username TEXT,
  first_seen TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW(),
  command_count INTEGER DEFAULT 0
);

// Reemplazar Map con queries a Supabase
```

**Opción B: Archivo JSON en repo (más simple pero menos escalable)**
```typescript
// Escribir userSessions a archivo JSON cada 5 minutos
// Leer al inicio del handler
```

#### Mejora #3: Rate limiting (30 min)
```typescript
const lastCommandTime = new Map<string, number>();

function isRateLimited(chatId: string): boolean {
  const now = Date.now();
  const last = lastCommandTime.get(chatId) || 0;
  
  if (now - last < 3000) { // 3 segundos cooldown
    return true;
  }
  
  lastCommandTime.set(chatId, now);
  return false;
}

// En handler:
if (isRateLimited(chatId)) {
  await sendTelegramMessage(chatId, '⏱️ Espera 3 segundos antes del siguiente comando.');
  return res.status(200).json({ ok: true });
}
```

---

### 💡 FASE 3: FEATURES AVANZADAS (4+ horas)

#### Feature #1: Comandos de predicción reales
- Integrar modelo ML simple (linear regression con últimos 20 precios)
- O usar API externa de predicción (si existe)

#### Feature #2: Alertas personalizadas por usuario
- Cada usuario define sus propios price targets
- Almacenar en Supabase/Redis

#### Feature #3: Análisis de sentimiento
- Integrar con `/src/services/telegramService.ts` que ya tiene `sendNewsAlert`
- Scrapear noticias de oro y enviar alertas con impacto (bullish/bearish)

#### Feature #4: Export de datos
- Comando `/export` que envía CSV con historial de precios

---

## 📋 CHECKLIST DE VALIDACIÓN

### ✅ Antes de deployar fixes:
- [ ] Fix nombre dinámico aplicado
- [ ] Webhook configurado y verificado
- [ ] Variables de entorno en Vercel
- [ ] Test manual: enviar `/start` al bot
- [ ] Test: Click en botones inline (deben responder)
- [ ] Test: Comando `/price` debe mostrar precio real
- [ ] Test: Comando `/admin` (solo admin debe tener acceso)
- [ ] Logs en Vercel Functions para debuggear

### ✅ Después de mejoras:
- [ ] Rate limiting probado (spammear comandos)
- [ ] User tracking persiste después de redeploy
- [ ] Análisis técnico con niveles actualizados
- [ ] Documentación actualizada (README)

---

## 🌐 ENDPOINTS Y URLs

### **Bot Telegram:**
- Username: `@SentimentNexusBot`
- Webhook URL: `https://sentimentnexus.vercel.app/api/telegram-webhook`

### **Archivos clave:**
- Handler principal: `/api/telegram-webhook.ts` (992 líneas)
- Service layer: `/src/services/telegramService.ts` (233 líneas)
- Env vars: `.env.example` (referencia)

### **Comandos disponibles:**
```
/start - Menú principal con botones
/price - Precio actual del oro
/alerts - Ver alertas configuradas
/config - Configuración actual
/stats - Estadísticas del sistema
/help - Lista de comandos
/admin - Panel admin (solo autorizado)
/reset - Resetear alertas (todos los usuarios)
```

### **Botones inline:**
- `price` → Muestra precio + botones de actualizar/análisis
- `alerts` → Muestra alertas activas
- `analysis` → Análisis técnico con niveles
- `stats` → Estadísticas del sistema
- `trend` → Tendencia del mercado (mock)
- `predict` → Proyección futura (mock)
- `summary` → Resumen diario (mock)
- `main_menu` → Volver al menú principal

---

## 🔒 SEGURIDAD

### ✅ Lo que está bien:
- Webhook solo acepta POST
- Parse mode Markdown (no permite scripts maliciosos)
- Chat ID validation para comando admin

### ⚠️ Vulnerabilidades potenciales:
1. **ADMIN_CHAT_ID puede no estar configurado** → cualquiera puede intentar `/admin`
2. **No hay validación de input** → usuario puede enviar texto muy largo
3. **API keys en código** → usar env vars (ya está bien hecho)

### 🔧 Recomendaciones:
```typescript
// Agregar en handler principal:
if (!ADMIN_CHAT_ID || ADMIN_CHAT_ID === "YOUR_ADMIN_CHAT_ID_HERE") {
  console.error('[Security] ADMIN_CHAT_ID not configured!');
  // Disable admin command
}

// Validar longitud de input:
if (message.text.length > 500) {
  await sendTelegramMessage(chatId, '❌ Mensaje muy largo');
  return res.status(200).json({ ok: true });
}
```

---

## 📊 MÉTRICAS ACTUALES (estimadas)

**Sin datos reales porque user tracking es ephemeral**, pero basado en código:

- **Comandos disponibles:** 8 (start, price, alerts, config, stats, help, admin, reset)
- **Botones inline:** 8 (price, alerts, analysis, stats, trend, predict, summary, main_menu)
- **APIs integradas:** 2 (Binance US, CoinGecko)
- **Latencia esperada:** <500ms (fetch APIs + respuesta Telegram)
- **Rate limit:** ∞ (sin límite actualmente)
- **Persistencia:** Ninguna (Map en memoria)

---

## 🎯 RECOMENDACIÓN FINAL

### **PRIORIDAD MÁXIMA (HOY):**
1. ✅ Fix nombre hardcodeado: `Oliver` → `${userName}`
2. ✅ Configurar webhook en Telegram
3. ✅ Verificar variables de entorno en Vercel

**Tiempo estimado:** 30 minutos  
**Impacto:** De 6/10 → 8/10 funcionalidad

### **SIGUIENTE SEMANA:**
4. ⚠️ Implementar rate limiting (anti-spam)
5. ⚠️ Persistencia de usuarios (Supabase o JSON)
6. ⚠️ Logging estructurado para debuggear

**Tiempo estimado:** 2 horas  
**Impacto:** De 8/10 → 9/10 funcionalidad

### **FUTURO (cuando tengas tiempo):**
7. 💡 Análisis técnico real (niveles dinámicos)
8. 💡 Comandos de predicción con ML
9. 💡 Alertas personalizadas por usuario

**Tiempo estimado:** 4-6 horas  
**Impacto:** De 9/10 → 10/10 funcionalidad (bot profesional completo)

---

## 🚀 SIGUIENTE PASO INMEDIATO

**¿Qué quieres hacer primero?**

1. **"Fix crítico del nombre"** → Te hago el cambio en 2 minutos
2. **"Configurar webhook"** → Te doy los comandos exactos
3. **"Verificar env vars"** → Revisamos Vercel juntos
4. **"Todo lo anterior"** → Ejecutamos las 3 fases críticas (30 min)

**Dime qué prefieres y empezamos.** 🎯
