# 🚀 SentimentNexus - Funcionalidades Avanzadas

## 🎯 Características Implementadas

### 1. 📊 **Indicadores Técnicos Profesionales**

#### **RSI (Relative Strength Index)**
- **Propósito**: Identifica condiciones de sobrecompra/sobreventa
- **Cálculo**: Período de 14
- **Señales**:
  - RSI > 70 = Sobrecompra (🔴 Considerar vender)
  - RSI < 30 = Sobreventa (🟢 Considerar comprar)
  - RSI 30-70 = Neutral (🟡 Esperar)
- **Visualización**: Barra de progreso con código de colores

#### **MACD (Moving Average Convergence Divergence)**
- **Propósito**: Detecta cambios de momentum y tendencia
- **Componentes**:
  - MACD Line: EMA(12) - EMA(26)
  - Signal Line: EMA(9) del MACD
  - Histogram: MACD - Signal
- **Señales**:
  - Histogram > 0 = 🟢 Alcista (bullish)
  - Histogram < 0 = 🔴 Bajista (bearish)
- **Visualización**: Grid con valores numéricos y colores

#### **Bollinger Bands**
- **Propósito**: Medir volatilidad y identificar extremos
- **Configuración**: 20 períodos, ±2 desviaciones estándar
- **Componentes**:
  - Banda Superior (Upper)
  - Banda Media (SMA 20)
  - Banda Inferior (Lower)
- **Señales**:
  - Precio cerca de banda superior = Sobrecompra
  - Precio cerca de banda inferior = Sobreventa
  - Bandas estrechas = Baja volatilidad (posible breakout)
- **Visualización**: Representación visual con indicador de posición actual

#### **Moving Averages (SMA)**
- **SMA 20**: Media móvil corto plazo
- **SMA 50**: Media móvil mediano plazo
- **Señales**:
  - Precio > SMA = 🟢 Tendencia alcista
  - Precio < SMA = 🔴 Tendencia bajista
  - Golden Cross (SMA 20 cruza arriba SMA 50) = Señal alcista fuerte

#### **Recomendaciones Automáticas**
El sistema combina todos los indicadores para generar:
- **BUY** 🟢: RSI < 30 + Precio < Bollinger Lower + MACD histogram > 0
- **SELL** 🔴: RSI > 70 + Precio > Bollinger Upper + MACD histogram < 0
- **HOLD** 🟡: Condiciones neutrales, esperar señales claras

---

### 2. 🔔 **Sistema de Alertas Inteligentes**

#### **Alertas de Precio Objetivo**
- **Configuración**: Define múltiples niveles de precio
- **Trigger**: Cuando el precio cruza el objetivo (arriba o abajo)
- **Ejemplos**:
  - Precio objetivo: $4,600
  - Alerta cuando: Precio sube de $4,550 → $4,605
  - Mensaje: "🎯 Price Target Reached! Target: $4,600 | Current: $4,605"

#### **Alertas de Cambio Porcentual**
- **Configuración**: Umbral de porcentaje (default: 2%)
- **Trigger**: Cuando el precio se mueve ±X% desde el precio base
- **Reset**: El precio base se actualiza después de cada alerta
- **Ejemplos**:
  - Base: $4,500
  - Umbral: 2%
  - Alerta si: Precio sube a $4,590 (+2%) o baja a $4,410 (-2%)
  - Mensaje: "🚨 Gold 📈 UP 2.00%! From: $4,500 To: $4,590"

#### **Alertas de Cambio de Tendencia**
- **Propósito**: Detectar reversiones de tendencia temprano
- **Detección**: Análisis de movimiento de precios
- **Estados**:
  - 🚀 Bullish (Alcista)
  - 📉 Bearish (Bajista)
  - ➡️ Neutral
- **Trigger**: Cuando cambia de un estado a otro
- **Ejemplo**: "📊 Trend Change! From: 🚀 BULLISH → To: 📉 BEARISH"

#### **Configuración de Alertas**
```typescript
{
  priceTargets: [4500, 4600, 4700, 4800],  // Objetivos de precio
  percentageThreshold: 2,                    // Umbral de cambio %
  enableTrendAlerts: true,                   // Activar alertas de tendencia
  notificationEnabled: true,                 // Enviar a Telegram
}
```

#### **Notificaciones**
- **Toast (en app)**: Notificación visual instantánea
- **Telegram**: Mensaje automático a tu bot
- **Historial**: Últimas 5 alertas en el panel

---

### 3. 💰 **Precios en Tiempo Real**

#### **Fuente de Datos**
- **API**: Binance (PAXG - PAX Gold)
- **Ticker**: PAXGUSDT
- **Actualización**: Cada 2 segundos
- **Costo**: 100% GRATIS, ilimitado

#### **PAXG (PAX Gold)**
- **Qué es**: Token respaldado 1:1 con oro físico
- **Equivalencia**: 1 PAXG = 1 onza troy de oro
- **Precisión**: Refleja precio spot real del oro
- **Ventajas**:
  - Precio actualizado en tiempo real
  - Sin límites de requests
  - No requiere API key

#### **Sistema de Fallback**
```typescript
1. Binance PAXG (Principal) → Gratis, ilimitado
2. Coinbase (Backup) → Estimado via BTC
3. Cache (Fallback) → Último precio conocido
```

---

### 4. 📱 **Integración Telegram**

#### **Configuración**
1. Bot: @SentimentNexusBot
2. Token: Configurado en Vercel
3. Chat ID: Tu ID personal
4. Función: `/api/send-telegram`

#### **Tipos de Mensajes**
1. **Alertas de Precio**: Cambios significativos
2. **Alertas de Tendencia**: Reversiones detectadas
3. **Objetivos Alcanzados**: Price targets
4. **Recomendaciones**: Señales de trading
5. **Updates**: Nuevas funcionalidades

#### **Formato de Mensajes**
```markdown
🚨 *Gold 📈 UP 2.50%*

From: $4,500.00
To: $4,612.50

📊 Indicators:
• RSI: 68.45 (Near Overbought)
• MACD: 🟢 Bullish (+2.34)
• Recommendation: HOLD

_SentimentNexus - Live Alert_
```

---

## 📈 **Dashboard Layout**

### **Columna Izquierda**
- **News Feed**: Eventos de mercado en tiempo real
- **Technical Indicators**: RSI, MACD, Bollinger Bands, SMAs

### **Columna Central**
- **Market Chart**: Gráfico de precios con Recharts
- Precio actual, cambio, volumen
- Histórico de últimos 100 puntos

### **Columna Derecha**
- **Analytics Panel**: Estadísticas y métricas
- **Alerts Panel**: Configuración de alertas
- **WhatsApp Settings**: Configuración (legacy)

---

## 🎓 **Cómo Usar**

### **1. Monitoreo Básico**
- Observa el precio en tiempo real en el chart
- Revisa indicadores técnicos en el panel izquierdo
- Sigue recomendaciones BUY/SELL/HOLD

### **2. Configurar Alertas**
```
1. Abre el panel "Alert Configuration"
2. Activa "Telegram Notifications"
3. Define price targets (ej: 4600, 4700)
4. Ajusta umbral porcentual (default: 2%)
5. Activa "Trend Change Alerts"
```

### **3. Interpretar Señales**

#### **Señal de COMPRA** 🟢
```
Condiciones:
✅ RSI < 30 (Oversold)
✅ Precio cerca de Bollinger Lower
✅ MACD histogram positivo
✅ Precio por debajo de SMA 20

Acción: Considerar entrada larga (buy)
```

#### **Señal de VENTA** 🔴
```
Condiciones:
✅ RSI > 70 (Overbought)
✅ Precio cerca de Bollinger Upper
✅ MACD histogram negativo
✅ Precio por encima de SMA 20

Acción: Considerar toma de ganancias (sell)
```

#### **Señal NEUTRAL** 🟡
```
Condiciones:
⚪ RSI entre 30-70
⚪ Precio dentro de bandas
⚪ MACD sin señal clara

Acción: Esperar mejor momento de entrada
```

---

## 🔧 **Arquitectura Técnica**

### **Servicios**
- `realGoldPriceService.ts`: Fetching de precios con fallbacks
- `alertService.ts`: Sistema de alertas y notificaciones
- `technicalIndicators.ts`: Cálculos de indicadores técnicos
- `telegramService.ts`: Integración con Telegram Bot API

### **Hooks**
- `useRealTimePrices`: Actualización automática de precios
- `useAlerts`: Monitoreo y trigger de alertas
- `useDataStream`: Mock data para desarrollo

### **Componentes**
- `TechnicalIndicatorsPanel`: Visualización de indicadores
- `AlertsPanel`: Configuración y historial de alertas
- `MarketChart`: Gráfico principal con Recharts

### **API Endpoints**
- `GET /api/send-telegram`: Enviar notificaciones
- Binance: `https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT`

---

## 📊 **Performance**

### **Métricas**
- **Build Time**: 2.45s
- **Bundle Size**: 162KB (main chunk)
- **Update Frequency**: 2 segundos
- **API Calls**: ~1800/hora (Binance - gratis)

### **Optimizaciones**
- Cache de precios (10 segundos)
- Lazy loading de componentes
- Debouncing de alertas
- Memoización de cálculos técnicos

---

## 🎯 **Roadmap Completado**

### ✅ **Fase 1: Deployment**
- Vercel hosting
- Custom domain
- Environment variables

### ✅ **Fase 2: Clean Architecture**
- Service layer pattern
- Custom hooks
- Centralized constants
- Error boundaries

### ✅ **Fase 3: Real Data**
- Binance PAXG integration
- Telegram bot setup
- Serverless functions

### ✅ **Fase 4: Advanced Features**
- Technical indicators (RSI, MACD, Bollinger)
- Smart alerts system
- Trading recommendations
- Telegram notifications

---

## 🚀 **Próximos Pasos Opcionales**

### **Fase 5: Multi-Asset Support**
- Plata (Silver - PAXSUSDT)
- Platino (Platinum)
- Cobre (Copper)
- Dashboard multi-asset

### **Fase 6: AI Integration**
- Sentiment analysis de noticias
- Predicciones con ML
- Recomendaciones personalizadas
- NLP para eventos de mercado

### **Fase 7: Portfolio Tracking**
- Tracking de posiciones
- P&L calculation
- Trade history
- Performance analytics

---

## 💡 **Tips de Trading**

### **Uso de RSI**
- No operar solo con RSI
- Combinar con otros indicadores
- RSI divergence es señal potente
- Funciona mejor en mercados laterales

### **Uso de MACD**
- Crossovers (cruces) son señales clave
- Histogram muestra momentum
- Divergencias indican reversiones
- Funciona mejor en tendencias

### **Uso de Bollinger Bands**
- Bandas estrechas = Baja volatilidad
- Breakouts después de contracción
- "Bollinger Bounce" en banda inferior/superior
- Price walking the bands = Tendencia fuerte

### **Gestión de Riesgo**
- ⚠️ Nunca operar solo con indicadores
- ⚠️ Usar stop loss siempre
- ⚠️ Confirmar con múltiples timeframes
- ⚠️ No arriesgar más del 2% por trade

---

## 📞 **Soporte**

### **Problemas Comunes**

**1. Alertas no se envían**
```bash
# Verificar configuración
# Vercel Dashboard > Environment Variables
VITE_TELEGRAM_BOT_TOKEN=tu_token
VITE_TELEGRAM_CHAT_ID=tu_chat_id
```

**2. Indicadores no aparecen**
```
Causa: Menos de 50 puntos de datos
Solución: Esperar 2-3 minutos para acumular data
```

**3. Precio no actualiza**
```bash
# Verificar en consola del navegador
# Debe aparecer cada 2 segundos:
[useRealTimePrices] Updated price: { price: 4560, source: 'binance-paxg' }
```

---

## 🎉 **¡Disfruta tu Terminal de Inteligencia Financiera!**

**SentimentNexus** es ahora una plataforma profesional de análisis técnico con:
- ✅ Precios en tiempo real (gratis)
- ✅ Indicadores técnicos avanzados
- ✅ Sistema de alertas inteligentes
- ✅ Notificaciones automáticas
- ✅ Recomendaciones de trading
- ✅ 100% Open Source

**URL Live**: https://sentimentnexus.vercel.app

**Costo Total**: $0.00 🎁

---

_"Trading is not about being right, it's about making money when you're right and losing little when you're wrong."_ 📈
