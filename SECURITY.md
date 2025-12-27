# 🔐 SECURITY.md - SentimentNexus

## Configuración de Variables de Entorno

Este proyecto utiliza variables de entorno para proteger información sensible como tokens de API y credenciales.

### ⚙️ Setup Inicial

1. **Copia el archivo de ejemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Completa tus credenciales en `.env`:**
   ```bash
   # Telegram Bot (Requerido)
   VITE_TELEGRAM_BOT_TOKEN=tu_token_de_botfather
   VITE_TELEGRAM_CHAT_ID=tu_chat_id
   ADMIN_CHAT_ID=tu_chat_id_admin
   ```

3. **NUNCA commitees el archivo `.env` a Git**
   - Ya está en `.gitignore`
   - Solo sube `.env.example` (sin valores reales)

---

## 🚨 Información Sensible

### ❌ NUNCA expongas en el código:
- Bot tokens de Telegram
- API keys
- Chat IDs personales
- Passwords
- Secrets de autenticación

### ✅ Usa siempre:
```typescript
// ✅ CORRECTO
const BOT_TOKEN = process.env.VITE_TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

// ❌ INCORRECTO - NUNCA hagas esto
const BOT_TOKEN = 'hardcoded_token_here';
const ADMIN_CHAT_ID = 'hardcoded_chat_id_here';
```

---

## 🌐 Variables de Entorno en Vercel

Para producción, configura las variables en el dashboard de Vercel:

1. Ve a tu proyecto en vercel.com
2. Settings → Environment Variables
3. Agrega cada variable:
   - `VITE_TELEGRAM_BOT_TOKEN` = tu token
   - `ADMIN_CHAT_ID` = tu chat ID
   - etc.

4. Redeploy para aplicar cambios

---

## 📝 Checklist Antes de Hacer Público el Repo

- [ ] Archivo `.env` en `.gitignore`
- [ ] `.env.example` sin valores reales
- [ ] Tokens removidos del código
- [ ] Variables de entorno en Vercel configuradas
- [ ] README actualizado con instrucciones
- [ ] Documentación sin tokens expuestos

---

## 🔄 Si accidentalmente expusiste un token:

1. **Telegram Bot Token:**
   - Habla con @BotFather
   - Usa `/revoke` para generar nuevo token
   - Actualiza en Vercel y `.env`

2. **API Keys:**
   - Revoca la key antigua en el dashboard del proveedor
   - Genera nueva key
   - Actualiza en todas partes

---

## 📞 Contacto

Si encuentras un problema de seguridad, por favor NO lo reportes públicamente.
Contacta al desarrollador directamente.

---

**Última actualización:** 26 Diciembre 2025
