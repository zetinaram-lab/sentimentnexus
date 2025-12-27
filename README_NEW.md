# 🚀 SentimentNexus

**Institutional Intelligence Terminal for Gold Market Analysis**

![Status](https://img.shields.io/badge/status-live-success)
![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Cost](https://img.shields.io/badge/cost-FREE-brightgreen)

> Terminal de inteligencia financiera profesional con precios en tiempo real, indicadores técnicos avanzados, y sistema de alertas automáticas. 100% gratis.

**🌐 Live Demo**: [sentimentnexus.vercel.app](https://sentimentnexus.vercel.app)

---

## ✨ Características Principales

### 💰 **Precios en Tiempo Real**
- Precio del oro actualizado cada 2 segundos
- Fuente: Binance PAXG (oro tokenizado 1:1)
- 100% gratis, sin límites de requests
- Sistema de fallback automático

### 📊 **Indicadores Técnicos Profesionales**
- **RSI** (Relative Strength Index) - Detecta sobrecompra/sobreventa
- **MACD** (Moving Average Convergence Divergence) - Análisis de momentum
- **Bollinger Bands** - Medición de volatilidad
- **SMA 20/50** - Medias móviles para tendencias
- **Recomendaciones automáticas** (BUY/SELL/HOLD)

### 🔔 **Sistema de Alertas Inteligentes**
- Alertas de precio objetivo ($4,500, $4,600, etc.)
- Notificaciones de cambio porcentual (±2%)
- Detección automática de cambios de tendencia
- Notificaciones instantáneas a Telegram

### 📱 **Integración Telegram**
- Bot personalizado (@SentimentNexusBot)
- Alertas automáticas ilimitadas
- 100% gratis, sin costo por mensaje
- Setup en 3 minutos

---

## 🎯 Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 7.3.0
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Deployment**: Vercel
- **API**: Binance (PAXG), Telegram Bot API
- **Serverless**: Vercel Functions

---

## 🚀 Quick Start

### **1. Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/sentimentnexus.git
cd sentimentnexus
```

### **2. Instalar dependencias**
```bash
npm install
```

### **3. Configurar variables de entorno (opcional)**
```bash
# .env.local
VITE_TELEGRAM_BOT_TOKEN=tu_token_aqui  # Solo si quieres notificaciones
VITE_TELEGRAM_CHAT_ID=tu_chat_id_aqui
```

### **4. Ejecutar en desarrollo**
```bash
npm run dev
```

La app estará en: http://localhost:5173

### **5. Build para producción**
```bash
npm run build
npm run preview
```

---

## 📱 Setup de Telegram (3 minutos)

### **Paso 1: Crear Bot**
1. Abre Telegram y busca: **@BotFather**
2. Envía: `/newbot`
3. Elige nombre: "SentimentNexus Alerts"
4. Elige username: "sentimentnexus_bot"
5. **Copia el token** que te da

### **Paso 2: Obtener Chat ID**
1. Busca tu bot en Telegram
2. Haz click en **START**
3. Ejecuta en terminal:
```bash
curl -s "https://api.telegram.org/bot<TU_TOKEN>/getUpdates" | python3 -m json.tool
```
4. **Copia tu Chat ID** del resultado

### **Paso 3: Configurar en Vercel**
```bash
vercel env add VITE_TELEGRAM_BOT_TOKEN production
# Pega tu token

vercel env add VITE_TELEGRAM_CHAT_ID production
# Pega tu chat ID

vercel --prod
```

✅ **¡Listo!** Recibirás alertas automáticas en Telegram

---

## 📊 Uso del Dashboard

### **Panel de Indicadores Técnicos**
```
📈 RSI: 45.32 (Neutral)
📊 MACD: 🟢 Bullish (+1.23)
📉 Bollinger Bands: $4,520 - $4,600
💡 Recommendation: HOLD
```

**Interpretación:**
- **RSI < 30**: Sobreventa → Considerar compra
- **RSI > 70**: Sobrecompra → Considerar venta
- **MACD Histogram > 0**: Momentum alcista
- **Precio cerca Bollinger Lower**: Posible rebote

### **Panel de Alertas**
```typescript
// Configuración recomendada
{
  priceTargets: [4500, 4600, 4700, 4800],
  percentageThreshold: 2,  // Alerta al ±2%
  enableTrendAlerts: true,
  notificationEnabled: true
}
```

**Tipos de alertas:**
1. 🎯 **Price Target**: "Precio alcanzó $4,600"
2. 🚨 **Percentage Change**: "Oro subió +2.5%"
3. 📊 **Trend Change**: "Tendencia cambió a BAJISTA"

---

## 🔧 Arquitectura

```
sentimentnexus/
├── src/
│   ├── components/          # UI components
│   │   ├── TechnicalIndicatorsPanel.tsx
│   │   ├── AlertsPanel.tsx
│   │   ├── MarketChart.tsx
│   │   └── ...
│   ├── services/           # Business logic
│   │   ├── realGoldPriceService.ts
│   │   ├── alertService.ts
│   │   ├── technicalIndicators.ts
│   │   └── telegramService.ts
│   ├── hooks/              # Custom hooks
│   │   ├── useRealTimePrices.ts
│   │   ├── useAlerts.ts
│   │   └── ...
│   ├── context/            # Global state
│   │   └── MarketContext.tsx
│   └── config/             # Configuration
│       └── constants.ts
├── api/                    # Serverless functions
│   └── send-telegram.ts
└── ...
```

---

## 💡 Indicadores Técnicos - Guía Rápida

### **RSI (Relative Strength Index)**
```
Objetivo: Identificar extremos de mercado
Período: 14
Señales:
  • RSI > 70 = Overbought (Sobrecompra)
  • RSI < 30 = Oversold (Sobreventa)
  • RSI 30-70 = Neutral
```

### **MACD**
```
Objetivo: Detectar cambios de momentum
Componentes:
  • MACD Line: EMA(12) - EMA(26)
  • Signal Line: EMA(9) del MACD
  • Histogram: MACD - Signal
Señales:
  • Histogram > 0 = Bullish
  • Histogram < 0 = Bearish
```

### **Bollinger Bands**
```
Objetivo: Medir volatilidad
Configuración: 20 períodos, ±2 std dev
Señales:
  • Precio cerca upper = Sobrecompra
  • Precio cerca lower = Sobreventa
  • Bandas estrechas = Breakout inminente
```

---

## 🎓 Recursos de Aprendizaje

- [Technical Analysis Explained](https://www.investopedia.com/technical-analysis-4689657)
- [RSI Strategy Guide](https://www.investopedia.com/articles/active-trading/042114/overbought-or-oversold-use-relative-strength-index-find-out.asp)
- [MACD Tutorial](https://www.investopedia.com/terms/m/macd.asp)
- [Bollinger Bands Guide](https://www.investopedia.com/terms/b/bollingerbands.asp)

---

## 📚 Documentación Adicional

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**: Guía completa de deployment
- **[API_INTEGRATION.md](./API_INTEGRATION.md)**: Integración de APIs
- **[FREE_SETUP.md](./FREE_SETUP.md)**: Setup 100% gratis
- **[ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md)**: Funcionalidades avanzadas

---

## 🚦 Roadmap

### ✅ **Completado**
- [x] Deployment en Vercel
- [x] Precios en tiempo real (Binance PAXG)
- [x] Indicadores técnicos (RSI, MACD, Bollinger)
- [x] Sistema de alertas inteligentes
- [x] Integración Telegram
- [x] Recomendaciones de trading
- [x] Dashboard responsive

### 🔄 **Próximo** (Opcional)
- [ ] Multi-asset support (plata, platino, cobre)
- [ ] Historical data & backtesting
- [ ] AI sentiment analysis
- [ ] Portfolio tracking
- [ ] Mobile app (React Native)
- [ ] Dark/Light theme toggle

---

## 💰 Costo Total

**$0.00** 🎉

- ✅ Binance API: Gratis, ilimitado
- ✅ Telegram Bot: Gratis, ilimitado
- ✅ Vercel Hosting: Gratis (100GB bandwidth/mes)
- ✅ Domain: Gratis (.vercel.app)
- ✅ Serverless Functions: Gratis (100K invocations/mes)

**No credit card required. Forever free.**

---

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles

---

## 👨‍💻 Autor

**Tu Nombre**
- Portfolio: [tu-portfolio.com](https://tu-portfolio.com)
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [tu-linkedin](https://linkedin.com/in/tu-perfil)

---

## 🙏 Agradecimientos

- [shadcn/ui](https://ui.shadcn.com/) por los componentes UI
- [Recharts](https://recharts.org/) por los gráficos
- [Binance](https://www.binance.com/) por la API gratuita
- [Telegram](https://telegram.org/) por el Bot API
- [Vercel](https://vercel.com/) por el hosting

---

## ⭐ Star History

Si este proyecto te resulta útil, **¡dale una estrella!** ⭐

---

## 📞 Soporte

¿Tienes preguntas? Abre un [Issue](https://github.com/tu-usuario/sentimentnexus/issues)

---

**Made with ❤️ and TypeScript**

_"The goal of a successful trader is to make the best trades. Money is secondary."_ - Alexander Elder
