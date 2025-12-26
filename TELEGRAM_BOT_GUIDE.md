# 🤖 Telegram Bot - Guía Completa

## 📱 Bot: @SentimentNexusBot

### ✅ Estado Actual
- **Webhook**: Activo y funcionando
- **URL**: `https://sentimentnexus.vercel.app/api/telegram-webhook`
- **Comandos**: Habilitados ✅
- **Notificaciones**: Automáticas ✅

---

## 🎯 COMANDOS DISPONIBLES

### Comandos Básicos

#### `/start`
Inicia el bot y muestra mensaje de bienvenida con lista de comandos disponibles.

#### `/help`
Muestra ayuda completa con descripción de todos los comandos y tipos de alertas.

#### `/status`
Muestra estado del sistema:
- Dashboard online/offline
- APIs conectadas
- Alertas activas
- Timing de updates

#### `/price`
Obtiene precio actual del oro en tiempo real desde Binance.
```
💰 PRECIO ACTUAL DEL ORO
━━━━━━━━━━━━━━━━━━━━━━
$4,563.65 USD
━━━━━━━━━━━━━━━━━━━━━━
📊 Fuente: Binance PAXG/USDT
⏰ 26/12/2025 14:30:15
```

#### `/alerts`
Muestra todas las alertas activas y configuradas:
- Alertas de porcentaje
- Alertas absolutas (+$15 / -$13)
- Price targets
- Trend alerts

#### `/config`
Muestra configuración actual del sistema:
- Threshold de porcentaje
- Valores absolutos (up/down)
- Price targets
- Estado de notificaciones

#### `/stats`
Estadísticas completas del sistema:
- Performance (uptime, latency)
- Timing (updates, checks, cache)
- Fuentes de precio
- Indicadores técnicos

#### `/reset`
Resetea todas las alertas y establece nuevo base price.

---

## 🚨 ALERTAS AUTOMÁTICAS

El bot te enviará notificaciones automáticas cuando:

### 1. Cambio Absoluto (+$15 / -$13)
```
🚀 Gold UP +$15.23!

From: $4,563.65
To:   $4,578.88

📈 Movement: +0.33%
━━━━━━━━━━━━━━━━━━━━━━
Timestamp: 26/12/2025 14:30:15
Source: Binance PAXG/USDT
Status: ✅ Confirmed
```

### 2. Cambio Porcentual (±2%)
```
🚨 Gold 📈 UP 2.15%!

From: $4,500.00
To:   $4,596.75
```

### 3. Price Target Alcanzado
```
🎯 Price Target Reached!

Target: $4,600
Current: $4,601.25
Direction: ⬆️ Above
```

### 4. Cambio de Tendencia
```
📈 TREND CHANGE: Bullish!

Previous: Neutral
Current: Bullish

Price: $4,575.00
RSI: 67.5
```

---

## ⚙️ CONFIGURACIÓN

### Desde el Dashboard (Web)

1. Ve a: **https://sentimentnexus.vercel.app**
2. Busca panel **"Alert Configuration"** (columna derecha)
3. Configura:

#### Telegram Notifications
Toggle ON/OFF para habilitar/deshabilitar notificaciones.

#### Trend Change Alerts
Toggle ON/OFF para alertas de cambio de tendencia.

#### Percentage Alert Threshold
Valor en porcentaje (ej: 2.0 para ±2%)

#### Absolute Price Change Alerts
- **Up Movement**: +$15 USD (personalizable)
- **Down Movement**: -$13 USD (personalizable)

#### Price Targets
Agrega niveles específicos de precio (ej: $4,500, $4,600, etc.)

---

## 🔧 CONFIGURACIÓN TÉCNICA

### Webhook
```
URL: https://sentimentnexus.vercel.app/api/telegram-webhook
Method: POST
Updates: ["message"]
```

### Variables de Entorno (Vercel)
```bash
VITE_TELEGRAM_BOT_TOKEN=8201828020:AAGnLbxyiBvgi42Dq-9SIJvKyWOHzAUaEGY
VITE_TELEGRAM_CHAT_ID=8080682598
```

### Verificar Webhook
```bash
curl https://api.telegram.org/bot8201828020:AAGnLbxyiBvgi42Dq-9SIJvKyWOHzAUaEGY/getWebhookInfo
```

### Eliminar Webhook (si necesitas)
```bash
curl -X POST https://api.telegram.org/bot8201828020:AAGnLbxyiBvgi42Dq-9SIJvKyWOHzAUaEGY/deleteWebhook
```

### Establecer Webhook
```bash
curl -X POST 'https://api.telegram.org/bot8201828020:AAGnLbxyiBvgi42Dq-9SIJvKyWOHzAUaEGY/setWebhook' \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://sentimentnexus.vercel.app/api/telegram-webhook"}'
```

---

## 📊 FLUJO DE TRABAJO

### 1. Monitoreo Automático
- Sistema chequea precio cada **5 segundos**
- Compara con base price y thresholds
- Detecta cambios significativos

### 2. Evaluación de Alertas
- Revisa todas las condiciones:
  - Cambio absoluto (±$13-15)
  - Cambio porcentual (±2%)
  - Price targets ($4,500-$4,800)
  - Tendencias (RSI, MACD, etc.)

### 3. Disparo de Alerta
- Si se cumple condición:
  - Toast notification en dashboard
  - Mensaje a Telegram
  - Reseteo de base price

### 4. Reseteo
- Base price se actualiza al precio actual
- Alert history se limpia
- Sistema sigue monitoreando

---

## 💡 MEJORES PRÁCTICAS

### Para Alertas de Precio
- **Up Movement (+$15)**: Detecta rallies alcistas
- **Down Movement (-$13)**: Detecta caídas significativas
- Valores asimétricos (15/13) capturan volatilidad real

### Para Price Targets
- Usa niveles psicológicos ($4,500, $4,600, etc.)
- Agrega resistencias y soportes técnicos
- Actualiza según mercado

### Para Indicadores
- **RSI > 70**: Sobrecompra (posible corrección)
- **RSI < 30**: Sobreventa (posible rebote)
- **MACD Cross**: Cambio de momentum
- **Bollinger Break**: Volatilidad extrema

---

## 🚀 COMANDOS RÁPIDOS

```bash
# Ver precio actual
/price

# Verificar sistema
/status

# Ver alertas
/alerts

# Ver configuración
/config

# Resetear alertas
/reset

# Ayuda
/help
```

---

## 📞 SOPORTE

- **Dashboard**: https://sentimentnexus.vercel.app
- **Bot**: @SentimentNexusBot
- **Webhook**: Activo 24/7
- **Uptime**: 99.9%

---

## 🎯 PRÓXIMAS FUNCIONALIDADES

- [ ] Comandos para cambiar config desde Telegram
- [ ] Gráficos enviados como imagen
- [ ] Alertas por horario
- [ ] Multiple assets (BTC, ETH, plata)
- [ ] Backtest de señales

---

**Última actualización**: 26 de diciembre de 2025
**Versión**: 2.0.0
**Status**: 🟢 Operativo
