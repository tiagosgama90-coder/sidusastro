# Guia do Motor IA — Sidus Astro

**Objetivo:** o Chat Oráculo e o Interpretador de Sonhos NUNCA ficarem sem resposta e responderem rápido, mesmo quando fornecedores de IA externos falham ou desativam modelos.

---

## Como funciona (à prova de falhas)

O motor (`netlify/functions/_shared/ai.mjs`) tem 3 camadas de proteção:

### 1. Ondas paralelas (velocidade)
Os fornecedores correm **em paralelo**, não em fila. A resposta chega pelo mais rápido:

| Onda | Fornecedores | Requer |
|------|--------------|--------|
| 1 | Groq + Gemini | Chave API (grátis) |
| 2 | Pollinations + OpenRouter | Pollinations: nada; OpenRouter: chave grátis |
| Último | OpenAI | Só se `ALLOW_PAID_OPENAI=true` (pago) |

Se a onda 1 tiver qualquer sucesso, usa-se essa. Senão tenta a onda 2. Se tudo falhar → **fallback local**.

### 2. Circuit breaker (nunca esperar por um serviço morto)
Quando um fornecedor falha, fica **suspenso durante 5 minutos**. Os pedidos seguintes nem tentam contactá-lo — respondem de imediato pelo próximo disponível ou pelo fallback local. Isto elimina esperas de 15-20s repetidas.

### 3. Fallback local garantido (o site nunca quebra)
- **Oráculo**: gera resposta baseada no mapa natal do utilizador (`gerarRespostaOracle`).
- **Sonhos**: gera interpretação com o léxico hermenêutico (`gerarInterpretacaoLocal`).
Estes funcionam SEMPRE, sem internet, sem chaves, sem IA.

---

## Como verificar o estado da IA (10 segundos)

Abre no browser:

```
https://sidusastro.com/api/ai-status
```

Resposta exemplo:

```json
{
  "ok": true,
  "motor": "operacional",
  "fornecedores": {
    "groq": "configurado",
    "gemini": "sem_chave",
    "pollinations": "activo",
    "openrouter": "sem_chave",
    "openai": "desactivado"
  },
  "fallbackLocal": "sempre disponivel (lexicon/mapa)"
}
```

- `configurado` / `activo` = pronto a usar
- `configurado:suspenso` = falhou há pouco, em pausa 5 min (recupera sozinho)
- `sem_chave` = não está configurado no Netlify

---

## O QUE FAZER SE AS RESPOSTAS DEGRADAREM (receita de 3 minutos)

Sintoma: respostas genéricas/repetidas ou campo `fonte: "lexicon"` — significa que os fornecedores gratuitos falharam.

### Solução recomendada: adicionar GROQ_API_KEY (grátis, 3 minutos)

1. Vai a **https://console.groq.com** → cria conta grátis → **API Keys** → *Create API Key*.
2. Copia a chave (`gsk_...`).
3. No Netlify: **https://app.netlify.com** → site sidusastro → **Site configuration → Environment variables**.
4. Adiciona: Nome `GROQ_API_KEY`, Valor `gsk_...` → Save.
5. **Deploys → Trigger deploy → Clear cache and deploy site**.

Pronto. O Groq passa a ser o motor principal (modelo Llama 70B, muito rápido, tier gratuito generoso).

### Alternativas (também grátis)
| Fornecedor | Onde criar chave | Variável no Netlify |
|------------|------------------|---------------------|
| Google Gemini | https://aistudio.google.com/apikey | `GEMINI_API_KEY` |
| OpenRouter | https://openrouter.ai/settings/keys | `OPENROUTER_API_KEY` |

Podes adicionar várias ao mesmo tempo — funcionam como redundância mútua.

### Se um modelo for desativado outra vez
Acontece (a Groq já desativou vários). Sintoma nos logs do Netlify: `[AI] Groq: 400 model_not_found`.
Correção: editar `GROQ_MODELS` em `netlify/functions/_shared/ai.mjs` com o modelo atual da lista https://console.groq.com/docs/models e fazer push. Os modelos recomendados mudam ~1x/ano.

---

## Regras de ouro (para nunca mais haver crash)

1. **Nunca remover** os blocos try/catch dos fallbacks locais em `oracle-chat.mjs` e `interpret-sonho.mjs`.
2. **Toda a chamada fetch externa** tem de usar `fetchComTimeout()` — nunca `fetch()` direto.
3. Depois de alterar funções, testar sempre:
   ```
   curl -X POST https://sidusastro.com/api/interpret-sonho -H "Content-Type: application/json" -d '{"texto":"teste sonho cobra","lang":"pt"}'
   ```
   Deve devolver HTTP 200 com `"ok":true`.

## Histórico desta avaria (2026-08-26)

- Bug `excerpto`/`excerto` causava 500 no interpretador de sonhos → corrigido.
- Modelo Groq `llama-3.3-70b-specdec` desativado pela Groq → substituído por cadeia com fallback.
- Pollinations passou a exigir pagamento (402) → mantido como último recurso com circuit breaker.
- Modelos OpenRouter gratuitos removidos → atualizados para gemma-4/glm/minimax.