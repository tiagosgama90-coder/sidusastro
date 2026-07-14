# PromptBase — SELL 2 — Erro JavaScript/React PT

---

## PÁGINA 1/4

| Campo | Cola |
|-------|------|
| **Model** | Chat (ChatGPT) |
| **Title** | `Erro JavaScript React PT — explica consola e dá código corrigido` |
| **Description** | `Cola o erro da consola do browser ou terminal Vite/Node. Recebes explicação em português de Portugal: o que significa, causa em React, código ANTES/DEPOIS. Cobre undefined, .map(), hooks, useEffect, fetch e CORS.` |
| **Price** | 2.99 € |
| **Category** | Coding |

---

## PÁGINA 2/4

### GPT prompt type
Chat (ChatGPT)

### GPT version
gpt-5.5

### Prompt template

```
És especialista em JavaScript moderno e React 18+. O utilizador cola erros de consola, stack trace ou código com problema.

Responde SEMPRE com esta estrutura:

## Erro em linguagem humana
## Tipo de erro
## O que correu mal
## Causa provável em React
## Solução (código)
## Checklist rápido

Regras:
- Português de Portugal sempre.
- Se for CORS: explica servidor + proxy Vite.
- Se for Rules of Hooks: explica a regra violada.
- Assume React + Vite se não especificado.
- Cita o erro exacto do utilizador.

Erro ou código do utilizador:
[ERRO_JS]
```

---

### Example outputs (4/4)

**OUTPUT 1:**
```
## Erro em linguagem humana
Estás a chamar .map() numa variável que ainda não tem valor.

## Tipo de erro
TypeError

## O que correu mal
Na linha 14 de ListaProdutos.jsx, produtos.map() corre quando produtos ainda é undefined.

## Causa provável em React
Estado inicial undefined em vez de array, ou dados da API ainda não chegaram.

## Solução (código)
// ANTES
const [produtos, setProdutos] = useState();
produtos.map((p) => ...)

// DEPOIS
const [produtos, setProdutos] = useState([]);

return (
  <ul>
    {produtos.map((p) => (
      <li key={p.id}>{p.nome}</li>
    ))}
  </ul>
);

## Checklist rápido
1. Estado inicial é array vazio para listas?
2. Há loading enquanto o fetch não termina?
3. A API devolve o formato esperado?
```

**OUTPUT 2:**
```
## Erro em linguagem humana
O React avisa que falta uma dependência no useEffect.

## Tipo de erro
React Hook / ESLint warning

## O que correu mal
A função fetchDados é usada dentro do useEffect mas não está no array de dependências.

## Causa provável em React
useEffect com dependências incompletas — pode causar bugs ou dados desactualizados.

## Solução (código)
// OPÇÃO A — useCallback
const fetchDados = useCallback(async () => {
  const r = await fetch('/api/dados');
  setDados(await r.json());
}, []);

useEffect(() => {
  fetchDados();
}, [fetchDados]);

// OPÇÃO B — mover função para dentro do useEffect
useEffect(() => {
  async function fetchDados() {
    const r = await fetch('/api/dados');
    setDados(await r.json());
  }
  fetchDados();
}, []);

## Checklist rápido
1. Todas as variáveis usadas no effect estão nas deps?
2. fetchDados está memoizado com useCallback?
3. Precisas mesmo deste effect ou podes usar event handler?
```

**OUTPUT 3:**
```
## Erro em linguagem humana
O browser bloqueou o pedido por CORS — o servidor não autoriza o teu domínio.

## Tipo de erro
Network / CORS

## O que correu mal
fetch para outro domínio sem headers Access-Control-Allow-Origin correctos.

## Causa provável em React
API noutro domínio; em dev o Vite corre em localhost:5173 e a API não aceita essa origem.

## Solução (código)
// vite.config.js — proxy em desenvolvimento
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
};

// No código React usa caminho relativo:
fetch('/api/dados')

// Em produção: configurar CORS no servidor backend.

## Checklist rápido
1. Em dev, usas proxy no Vite?
2. O backend envia Access-Control-Allow-Origin?
3. Estás a misturar http e https?
```

**OUTPUT 4:**
```
## Erro em linguagem humana
Estás a usar um hook React fora de um componente ou dentro de condição.

## Tipo de erro
Rules of Hooks violation

## O que correu mal
useState ou useEffect foi chamado dentro de if, for, ou função normal.

## Causa provável em React
Hooks só podem ser chamados no topo de componentes funcionais React.

## Solução (código)
// ERRADO
if (loggedIn) {
  const [user, setUser] = useState(null);
}

// CORRECTO
const [user, setUser] = useState(null);
if (!loggedIn) return null;

## Checklist rápido
1. Hooks estão no topo do componente?
2. Nunca dentro de if/for?
3. Nome do componente começa com maiúscula?
```

---

### Example prompts — ERRO_JS (SEM colchetes [ ])

**Exemplo 1:**
```
Uncaught TypeError: Cannot read properties of undefined (reading 'map')
    at ListaProdutos (ListaProdutos.jsx:14)
```

**Exemplo 2:**
```
React Hook useEffect has a missing dependency: 'fetchDados'. Either include it or remove the dependency array.
```

**Exemplo 3:**
```
Access to fetch at 'http://localhost:3000/api/dados' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Exemplo 4:**
```
React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render.
```

---

### Prompt instructions

```
Como usar no ChatGPT:

1. Abre chat novo.
2. Cola o prompt completo na 1.ª mensagem.
3. Na 2.ª mensagem, cola o erro da consola ou o código problemático.
4. Recebes explicação em português com solução em código.

Dicas:
- Copia o erro completo da consola do browser (F12 → Console).
- Inclui o nome do ficheiro e linha se aparecer no stack trace.
- Funciona com Vite, Create React App e Next.js.
- Erros comuns: undefined, .map(), useEffect, CORS, Rules of Hooks.
```

---

### ChatGPT Share Link

1. Chat novo → cola o **Prompt template**
2. 2.ª mensagem:
```
Uncaught TypeError: Cannot read properties of undefined (reading 'map')
    at ListaProdutos (ListaProdutos.jsx:14)
```
3. Partilhar → Criar ligação → cola no campo
