# 🚨 LAS 5 CLÁUSULAS QUE ARRUINAN A UN FREELANCER

## Guía para Análisis de IA - ContractGuard

Esta guía define exactamente qué debe buscar la IA en cada contrato para proteger freelancers.

---

## 1. 💰 CLÁUSULA DE PAGO (Payment Terms)

### ❌ RED FLAGS:
- **"Net 90"** o más de 60 días para pago
- **"Payment upon client approval"** (el cliente controla cuándo se paga)
- **"No upfront deposit"** (todo el riesgo para el freelancer)
- **"Payment contingent on project success"** (definición vaga de "éxito")
- **"Payment via equity/stock options only"** (sin dinero real)

### ✅ CLÁUSULA SEGURA:
```
Payment Schedule:
- 30% upfront upon contract signing
- 40% at project midpoint (specific milestone defined)
- 30% upon final delivery and acceptance (max 7 days review period)
- Late payments incur 1.5% monthly interest
- All payments via bank transfer within Net 15
```

### 🎯 ALTERNATIVA SUGERIDA:
"Establecer hitos de pago específicos con fechas y porcentajes. Mínimo 25-30% adelanto para cubrir costos iniciales."

---

## 2. 📜 PROPIEDAD INTELECTUAL (IP Rights)

### ❌ RED FLAGS:
- **"All IP belongs to client from day 1"** (freelancer pierde control antes de cobrar)
- **"Client owns all drafts and variations"** (no puedes usar tu propio trabajo en portfolio)
- **"Unlimited revisions included"** (scope creep garantizado)
- **"Work for hire - no attribution"** (pierdes crédito por tu trabajo)
- **"IP transfer includes all future uses"** (cliente puede revender tu trabajo sin pagarte)

### ✅ CLÁUSULA SEGURA:
```
Intellectual Property:
- Freelancer retains IP until final payment is received
- Upon full payment, exclusive IP rights transfer to Client
- Freelancer retains right to use work in portfolio (non-confidential portions)
- Client has unlimited future use within original scope only
- New uses (resale, sublicensing) require additional negotiation
```

### 🎯 ALTERNATIVA SUGERIDA:
"IP se transfiere SOLO después del pago final. Freelancer retiene derecho a usar el trabajo en portfolio (con permiso si es confidencial)."

---

## 3. ⚖️ RESPONSABILIDAD Y GARANTÍAS (Liability & Warranties)

### ❌ RED FLAGS:
- **"Unlimited liability"** (freelancer puede perder más que lo ganado)
- **"Freelancer indemnifies client for all damages"** (asumes TODO el riesgo legal)
- **"No liability cap"** (un error puede costarte tu casa)
- **"Warranties extend indefinitely"** (estás atado al proyecto por siempre)
- **"Freelancer liable for third-party claims"** (defiendes al cliente legalmente)

### ✅ CLÁUSULA SEGURA:
```
Liability:
- Freelancer's total liability capped at 2x the total project fee
- No liability for indirect, consequential, or punitive damages
- Client indemnifies Freelancer for misuse of deliverables
- Warranty period: 30 days post-delivery for defects only
- No warranty for client modifications or third-party integrations
```

### 🎯 ALTERNATIVA SUGERIDA:
"Limitar responsabilidad a 2x el valor del proyecto (estándar de industria). Sin responsabilidad por daños indirectos o uso indebido del cliente."

---

## 4. 🔄 ALCANCE Y REVISIONES (Scope & Revisions)

### ❌ RED FLAGS:
- **"Unlimited revisions"** (proyecto nunca termina)
- **"Scope can be modified by client at any time"** (scope creep sin control)
- **"Additional work at same rate"** (no se paga extra por cambios)
- **"Client can add tasks without renegotiation"** (explotan tu tiempo)
- **"Timeline is flexible based on client needs"** (proyecto perpetuo)

### ✅ CLÁUSULA SEGURA:
```
Scope of Work:
- Specific deliverables listed in Appendix A
- Includes 2 rounds of minor revisions (defined as <20% changes)
- Major revisions (>20% changes) billed at $X/hour with new timeline
- Scope changes require written Change Order and additional payment
- Timeline: [X weeks] from kickoff, extendable only by written agreement
```

### 🎯 ALTERNATIVA SUGERIDA:
"Definir EXACTAMENTE qué incluye el proyecto. Máximo 2-3 rondas de revisiones menores. Cambios mayores = nuevo presupuesto y timeline."

---

## 5. 🚪 TERMINACIÓN Y "KILL FEE" (Termination)

### ❌ RED FLAGS:
- **"Client can terminate at any time without cause"** (sin protección)
- **"No payment for work completed if terminated early"** (pierdes todo)
- **"30-day termination notice (both ways)"** (freelancer debe avisar 30 días, cliente no)
- **"Client keeps all work if terminated"** (pierdes trabajo Y dinero)
- **"No kill fee or cancellation penalty"** (cliente no tiene consecuencias)

### ✅ CLÁUSULA SEGURA:
```
Termination:
- Either party may terminate with 14 days written notice
- If client terminates: Pay for all work completed + 50% of remaining fee (kill fee)
- If freelancer terminates: Return of deposit minus work completed
- Client receives all completed deliverables only if kill fee is paid
- Mutual termination: Prorated payment for work completed
```

### 🎯 ALTERNATIVA SUGERIDA:
"Si el cliente cancela, paga trabajo completado + 50% del resto (kill fee). Esto protege tu tiempo y cubre el costo de oportunidad."

---

## 📊 SISTEMA DE SCORING PARA IA

### CÁLCULO DE RISK SCORE:

```
Base Score: 100

RESTAR por cada Red Flag encontrado:
- Pago (Red Flag): -20 puntos
- IP Rights (Red Flag): -15 puntos
- Liability (Red Flag): -20 puntos
- Scope (Red Flag): -15 puntos
- Termination (Red Flag): -10 puntos

Yellow Flags (versiones menos severas): -5 puntos cada una

Score Final:
- 90-100: Bajo Riesgo ✅ (contrato seguro)
- 70-89: Riesgo Medio ⚠️ (negociar algunas cláusulas)
- 50-69: Alto Riesgo 🚨 (renegociar o rechazar)
- <50: Muy Alto Riesgo ❌ (rechazar inmediatamente)
```

---

## 🎯 PROMPTS ESPECÍFICOS PARA GEMINI PRO

### Prompt de Análisis:
```
Analiza este contrato de freelance en busca de estas 5 cláusulas críticas:
1. Términos de pago (busca: Net 90+, sin adelanto, pago condicionado)
2. Propiedad intelectual (busca: IP del cliente antes de pagar, sin portfolio rights)
3. Responsabilidad (busca: unlimited liability, sin cap, indemnity ilimitado)
4. Alcance (busca: unlimited revisions, scope flexible sin costo)
5. Terminación (busca: sin kill fee, puede cancelar sin pagar)

Para cada Red Flag encontrado:
- Cita la cláusula exacta
- Explica el riesgo en 1 línea
- Sugiere una cláusula alternativa lista para copiar/pegar
- Asigna severity: HIGH, MEDIUM, LOW

Calcula Risk Score: 100 - (Red Flags HIGH × 20) - (MEDIUM × 15) - (LOW × 5)

Responde en JSON:
{
  "riskScore": number,
  "severity": "LOW|MEDIUM|HIGH|CRITICAL",
  "redFlags": [{
    "category": "payment|ip|liability|scope|termination",
    "clause": "texto exacto del contrato",
    "risk": "explicación corta",
    "severity": "HIGH|MEDIUM|LOW",
    "alternativeClause": "cláusula sugerida lista para copiar",
    "points": -20
  }],
  "safeClauses": [{
    "category": string,
    "clause": string,
    "note": string
  }],
  "recommendations": [{
    "priority": 1-5,
    "action": "qué hacer",
    "reasoning": "por qué"
  }],
  "overallAssessment": "resumen ejecutivo en 2-3 líneas"
}
```

---

## 💡 CASOS REALES DE DISASTER CONTRACTS

### Ejemplo 1: Diseñador perdió $15K
**Cláusula:** "Client owns all IP from day 1. Payment Net 120."
**Problema:** Cliente usó el diseño en campaña, nunca pagó. Diseñador no pudo reclamar porque IP ya no era suyo.
**Red Flag Score:** -40 (IP -20, Pago -20)

### Ejemplo 2: Developer atrapado 6 meses
**Cláusula:** "Unlimited revisions. Scope flexible."
**Problema:** Proyecto de 2 meses se volvió 6 meses. Cliente pedía cambios infinitos sin pagar extra.
**Red Flag Score:** -30 (Scope -15, Termination sin kill fee -15)

### Ejemplo 3: Copywriter demandado
**Cláusula:** "Freelancer indemnifies client for all claims. Unlimited liability."
**Problema:** Cliente usó copy para fraude. Demandaron al copywriter también. Sin liability cap, casi quiebra.
**Red Flag Score:** -20 (Liability -20)

---

## ✅ CHECKLIST PARA VALIDAR ANÁLISIS DE IA

Antes de mostrar resultados al usuario, verificar:

- [ ] Se identificaron las 5 categorías críticas
- [ ] Cada Red Flag tiene alternativa específica (no genérica)
- [ ] Risk Score calcula correctamente según fórmula
- [ ] Alternativas son copy-paste ready (no requieren experiencia legal)
- [ ] Se detectó el idioma correctamente (ES/EN)
- [ ] Severity levels son apropiados (HIGH para pago/liability, MEDIUM para scope)
- [ ] Recommendations están priorizadas (1 = más urgente)
- [ ] No hay "legalese" - todo en lenguaje simple
- [ ] Se incluye disclaimer: "Not legal advice"

---

**Última actualización:** 27 Diciembre 2025
**Para:** ContractGuard AI Analysis Engine
