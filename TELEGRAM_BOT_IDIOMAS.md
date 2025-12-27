# 🤖 BOT DE TELEGRAM - SISTEMA DE IDIOMAS

## 📋 Implementación de Multi-idioma (ES/EN)

Para implementar el sistema de idiomas en el bot de Telegram, necesitas actualizar el código del bot.

---

## 🔧 CÓDIGO PARA EL BOT

### 1. Agregar almacenamiento de preferencias de idioma

```javascript
// Al inicio del archivo, después de las constantes
const userLanguages = new Map(); // Almacenar preferencia de idioma por usuario

// Función para obtener el idioma del usuario
const getUserLanguage = (chatId) => {
  return userLanguages.get(chatId) || 'es'; // Por defecto español
};

// Función para guardar el idioma del usuario
const setUserLanguage = (chatId, language) => {
  userLanguages.set(chatId, language);
};
```

### 2. Crear objeto de traducciones

```javascript
const translations = {
  es: {
    welcome: '🎯 ¡Bienvenido a SentimentNexus!\n\nAnálisis de sentimiento cripto en tiempo real.',
    commands: {
      start: '🚀 Comandos disponibles:',
      analyze: '/analyze - Analizar sentimiento',
      bitcoin: '/bitcoin - Análisis de Bitcoin',
      ethereum: '/ethereum - Análisis de Ethereum',
      gold: '/gold - Análisis de Oro',
      language: '/language - Cambiar idioma',
      help: '/help - Ver ayuda'
    },
    sentiment: {
      title: '📊 Análisis de Sentimiento',
      bullish: '🟢 Alcista',
      bearish: '🔴 Bajista',
      neutral: '🟡 Neutral',
      score: 'Puntuación',
      volatility: 'Volatilidad',
      confidence: 'Confianza'
    },
    language: {
      select: '🌍 Selecciona tu idioma:\n\n🇪🇸 Español\n🇺🇸 English',
      changed: '✅ Idioma cambiado a Español'
    },
    errors: {
      unknown: '❌ Comando no reconocido. Usa /help para ver comandos disponibles.'
    }
  },
  en: {
    welcome: '🎯 Welcome to SentimentNexus!\n\nReal-time crypto sentiment analysis.',
    commands: {
      start: '🚀 Available commands:',
      analyze: '/analyze - Analyze sentiment',
      bitcoin: '/bitcoin - Bitcoin analysis',
      ethereum: '/ethereum - Ethereum analysis',
      gold: '/gold - Gold analysis',
      language: '/language - Change language',
      help: '/help - Show help'
    },
    sentiment: {
      title: '📊 Sentiment Analysis',
      bullish: '🟢 Bullish',
      bearish: '🔴 Bearish',
      neutral: '🟡 Neutral',
      score: 'Score',
      volatility: 'Volatility',
      confidence: 'Confidence'
    },
    language: {
      select: '🌍 Select your language:\n\n🇪🇸 Español\n🇺🇸 English',
      changed: '✅ Language changed to English'
    },
    errors: {
      unknown: '❌ Unknown command. Use /help to see available commands.'
    }
  }
};

// Función helper para obtener traducciones
const t = (chatId, key) => {
  const lang = getUserLanguage(chatId);
  const keys = key.split('.');
  let value = translations[lang];
  
  for (const k of keys) {
    value = value[k];
    if (!value) return key;
  }
  
  return value;
};
```

### 3. Actualizar comando /start

```javascript
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const lang = getUserLanguage(chatId);
  
  const welcomeMessage = t(chatId, 'welcome') + '\n\n' + t(chatId, 'commands.start');
  
  const commands = [
    t(chatId, 'commands.analyze'),
    t(chatId, 'commands.bitcoin'),
    t(chatId, 'commands.ethereum'),
    t(chatId, 'commands.gold'),
    t(chatId, 'commands.language'),
    t(chatId, 'commands.help')
  ].join('\n');
  
  await bot.sendMessage(chatId, welcomeMessage + '\n\n' + commands);
});
```

### 4. Agregar comando /language

```javascript
bot.onText(/\/language/, async (msg) => {
  const chatId = msg.chat.id;
  
  await bot.sendMessage(chatId, t(chatId, 'language.select'), {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🇪🇸 Español', callback_data: 'lang_es' },
          { text: '🇺🇸 English', callback_data: 'lang_en' }
        ]
      ]
    }
  });
});

// Manejar callback de selección de idioma
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  
  if (data.startsWith('lang_')) {
    const language = data.split('_')[1];
    setUserLanguage(chatId, language);
    
    await bot.answerCallbackQuery(query.id);
    await bot.sendMessage(chatId, t(chatId, 'language.changed'));
  }
});
```

### 5. Actualizar comando /bitcoin (ejemplo)

```javascript
bot.onText(/\/bitcoin/, async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    await bot.sendMessage(chatId, '⏳ ' + (getUserLanguage(chatId) === 'es' ? 'Analizando...' : 'Analyzing...'));
    
    const response = await axios.get('https://sentimentnexus.vercel.app/api/sentiment/bitcoin');
    const data = response.data;
    
    const sentimentEmoji = {
      bullish: '🟢',
      bearish: '🔴',
      neutral: '🟡'
    };
    
    const sentimentText = t(chatId, `sentiment.${data.sentiment.toLowerCase()}`);
    
    const message = `
${t(chatId, 'sentiment.title')} - Bitcoin

${sentimentEmoji[data.sentiment.toLowerCase()]} ${sentimentText}
📊 ${t(chatId, 'sentiment.score')}: ${data.score}/100
📈 ${t(chatId, 'sentiment.volatility')}: ${data.volatility}%
🎯 ${t(chatId, 'sentiment.confidence')}: ${data.confidence}%

🌐 sentimentnexus.vercel.app
    `.trim();
    
    await bot.sendMessage(chatId, message);
  } catch (error) {
    await bot.sendMessage(chatId, '❌ Error: ' + error.message);
  }
});
```

---

## 🚀 DESPLIEGUE

### Opción 1: Actualizar en tu servidor actual

1. Conectarte por SSH a tu servidor
2. Editar el archivo del bot: `nano telegram-bot.js`
3. Agregar el código de arriba
4. Reiniciar el bot: `pm2 restart telegram-bot`

### Opción 2: Reemplazar archivo completo

Si prefieres, puedo generar el archivo completo del bot actualizado con todos los cambios.

---

## ✅ VERIFICACIÓN

Después de implementar:

1. Envía `/start` al bot
2. Envía `/language`
3. Selecciona 🇺🇸 English
4. Envía `/bitcoin`
5. Verifica que responda en inglés

---

## 📝 NOTAS

- Las preferencias de idioma se almacenan en memoria
- Si reinicias el bot, los usuarios vuelven a español por defecto
- Para persistencia, necesitarías una base de datos (Redis, MongoDB, etc.)

### Persistencia opcional con archivo JSON

```javascript
const fs = require('fs');
const LANG_FILE = './user_languages.json';

// Cargar idiomas al iniciar
const loadLanguages = () => {
  try {
    if (fs.existsSync(LANG_FILE)) {
      const data = fs.readFileSync(LANG_FILE, 'utf8');
      const langs = JSON.parse(data);
      Object.entries(langs).forEach(([chatId, lang]) => {
        userLanguages.set(parseInt(chatId), lang);
      });
    }
  } catch (error) {
    console.error('Error loading languages:', error);
  }
};

// Guardar idiomas
const saveLanguages = () => {
  try {
    const langs = Object.fromEntries(userLanguages);
    fs.writeFileSync(LANG_FILE, JSON.stringify(langs, null, 2));
  } catch (error) {
    console.error('Error saving languages:', error);
  }
};

// Llamar al inicio
loadLanguages();

// Modificar setUserLanguage
const setUserLanguage = (chatId, language) => {
  userLanguages.set(chatId, language);
  saveLanguages(); // Guardar después de cada cambio
};
```

---

## 🎯 RESULTADO ESPERADO

- ✅ Bot responde en español por defecto
- ✅ Comando `/language` permite cambiar a inglés
- ✅ Todas las respuestas se adaptan al idioma elegido
- ✅ Experiencia consistente con la web

---

¿Quieres que genere el archivo completo del bot con todos los cambios? O prefieres implementarlo manualmente siguiendo esta guía?
