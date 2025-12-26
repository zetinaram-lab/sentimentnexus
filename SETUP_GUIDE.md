# 🚀 Guía de Configuración: Precios Reales y WhatsApp Alerts

## 📊 Paso 1: Configurar API de Precios del Oro (GRATIS)

### Opción A: Finnhub (Recomendada) - 60 llamadas/minuto GRATIS

1. **Registro:**
   - Ve a: https://finnhub.io/register
   - Crea cuenta gratis
   - Copia tu API Key del dashboard

2. **Configurar en el proyecto:**
   ```bash
   # Crea archivo .env.local
   cp .env.example .env.local
   
   # Edita .env.local y agrega:
   VITE_FINNHUB_API_KEY=tu_api_key_aqui
   ```

3. **Verificar:**
   - Reinicia el servidor: `npm run dev`
   - El terminal mostrará precios reales del oro
   - Actualización cada 2 segundos

---

## 📱 Paso 2: Configurar WhatsApp Alerts (Twilio)

### Opción: Twilio (La más fácil y confiable)

1. **Crear cuenta Twilio:**
   - Ve a: https://www.twilio.com/try-twilio
   - Regístrate (incluye $15 USD de crédito gratis)
   - Verifica tu número de teléfono

2. **Activar WhatsApp Sandbox:**
   ```
   1. En el dashboard de Twilio: Messaging > Try it out > Send a WhatsApp message
   2. Envía un WhatsApp al número que aparece
   3. Manda el código que te dan (ej: "join abc-xyz")
   4. Recibirás confirmación
   ```

3. **Obtener credenciales:**
   ```
   Account SID: Dashboard > Account Info
   Auth Token: Dashboard > Account Info (click en "show")
   WhatsApp Number: +1 415 523 8886 (número sandbox de Twilio)
   ```

4. **Configurar en el proyecto:**
   ```env
   # .env.local
   VITE_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
   VITE_TWILIO_AUTH_TOKEN=tu_auth_token_aqui
   VITE_TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   VITE_YOUR_WHATSAPP_NUMBER=whatsapp:+52XXXXXXXXXX  # Tu número con código de país
   ```

5. **Activar en la app:**
   ```typescript
   // src/config/constants.ts
   export const FEATURES = {
     ENABLE_REAL_API: true,
     ENABLE_WHATSAPP: true,
     // ...
   }
   ```

---

## 🔧 Paso 3: Implementar el Servicio WhatsApp

Vamos a crear un endpoint simple con Netlify Functions (gratis):

### 3.1 Crear la función serverless:

```bash
# Crear carpeta
mkdir -p netlify/functions

# Instalar Twilio
npm install twilio
```

### 3.2 Crear archivo `netlify/functions/send-whatsapp.ts`:

```typescript
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const handler = async (event: any) => {
  // Solo permite POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message, to } = JSON.parse(event.body);

    const result = await client.messages.create({
      body: message,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${to}`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        messageId: result.sid 
      }),
    };
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
    };
  }
};
```

### 3.3 Configurar Netlify:

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"
```

### 3.4 Agregar variables de entorno en Netlify:

```
Site settings > Environment variables:
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
```

---

## 🧪 Paso 4: Probar Todo

### Probar Precios Reales:

```bash
# Terminal
npm run dev

# Abre: http://localhost:8080
# Deberías ver precios reales del oro (~$2650/oz)
```

### Probar WhatsApp:

```typescript
// En la consola del navegador:
fetch('/.netlify/functions/send-whatsapp', {
  method: 'POST',
  body: JSON.stringify({
    message: '🚨 Test Alert: Gold price at $2650',
    to: '+521234567890'  // Tu número
  })
})
```

---

## 📋 Checklist Final

- [ ] API Key de Finnhub configurada
- [ ] Cuenta Twilio creada
- [ ] WhatsApp Sandbox activado
- [ ] Variables de entorno configuradas
- [ ] Función serverless desplegada
- [ ] Test de precio real funciona
- [ ] Test de WhatsApp funciona

---

## 💡 Tips Importantes

### Costos:
- **Finnhub:** GRATIS (60 calls/min)
- **Twilio:** $15 USD gratis, luego ~$0.005 por mensaje
- **Netlify Functions:** 125,000 requests GRATIS/mes

### Límites:
- Actualizar precio cada 2 segundos = 1,296 calls/día (dentro del límite gratis)
- Máximo 10 alertas WhatsApp por hora (configurable)

### Alternativas si no quieres usar Twilio:

1. **WhatsApp Business API (oficial):**
   - Más complejo de configurar
   - Requiere verificación de negocio
   - Gratis después de la configuración

2. **MessageBird:**
   - Similar a Twilio
   - También tiene créditos gratuitos

3. **Vonage (ex-Nexmo):**
   - €2 de crédito gratis
   - Buena documentación

---

## 🆘 Troubleshooting

### "No API key configured"
```bash
# Verifica que el archivo exista:
cat .env.local

# Reinicia el servidor:
npm run dev
```

### "Twilio authentication failed"
```bash
# Verifica las credenciales:
echo $TWILIO_ACCOUNT_SID
echo $TWILIO_AUTH_TOKEN
```

### "WhatsApp not receiving messages"
```bash
# 1. Verifica que hayas hecho join al sandbox
# 2. El número debe incluir código de país: +52XXXXXXXXXX
# 3. Formato correcto: whatsapp:+52XXXXXXXXXX
```

---

## 📚 Recursos

- [Finnhub Docs](https://finnhub.io/docs/api)
- [Twilio WhatsApp Quickstart](https://www.twilio.com/docs/whatsapp/quickstart)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)

---

¿Necesitas ayuda? Abre un issue en GitHub o contáctame.

**¡Buena suerte! 🚀**
