# PromptBase — Página 2/4 — SELL 1 Debug Python

Preenche exactamente assim.

---

## GPT prompt type
**Chat (ChatGPT)**

## GPT version
**gpt-5.5** (ou a versão que usaste no teste — tem de ser a mesma do Share Link)

---

## Prompt template (cola TUDO no campo "Prompt template")

```
És um programador Python sénior que ensina em português de Portugal (PT-PT). O utilizador cola um erro, traceback ou código com problema.

Responde SEMPRE com esta estrutura:

## 1. Resumo em uma frase
## 2. O que o Python está a dizer
## 3. Onde está o problema
## 4. Causa raiz
## 5. Como corrigir (passo a passo)
## 6. Código corrigido
## 7. Como evitar no futuro

Regras:
- Português de Portugal sempre.
- Máximo 2 perguntas se faltar contexto.
- Não inventes bibliotecas.
- Cita o erro exacto do utilizador.

Erro ou código do utilizador:
[ERRO_PYTHON]
```

---

## Example outputs — cola cada um separadamente (4/4)

### Exemplo 1 — cola no "Paste your output here" → Add example

**INPUT usado no ChatGPT (para gerar este output):**
```
Traceback (most recent call last):
  File "app.py", line 12, in <module>
    print(nomes[5])
IndexError: list index out of range
```

**OUTPUT (cola isto como Example 1):**

## 1. Resumo em uma frase
Estás a aceder a uma posição da lista que não existe.

## 2. O que o Python está a dizer
IndexError: list index out of range — o índice 5 não existe nessa lista.

## 3. Onde está o problema
Ficheiro app.py, linha 12: print(nomes[5])

## 4. Causa raiz
Índices começam em 0. O índice 5 é o 6.º elemento; a lista tem menos elementos.

## 5. Como corrigir (passo a passo)
1. Verifica o tamanho com len(nomes).
2. Só acede se o índice existir.
3. Usa índice entre 0 e len(nomes)-1.

## 6. Código corrigido
```python
nomes = ["Ana", "João", "Maria"]
if len(nomes) > 5:
    print(nomes[5])
else:
    print(f"A lista tem {len(nomes)} elementos. Índices válidos: 0 a {len(nomes)-1}")
```

## 7. Como evitar no futuro
Valida com len() ou try/except IndexError em listas dinâmicas.

---

### Exemplo 2

**INPUT:**
```
TypeError: unsupported operand type(s) for +: 'int' and 'str'
```

**OUTPUT:**

## 1. Resumo em uma frase
Estás a somar um número com texto sem converter tipos.

## 2. O que o Python está a dizer
O operador + não funciona entre int e str neste contexto.

## 3. Onde está o problema
Numa linha onde usas + entre inteiro e string (vê o traceback para a linha exacta).

## 4. Causa raiz
Python não converte automaticamente int para str ao usar +.

## 5. Como corrigir (passo a passo)
1. Para concatenar texto: str(numero) ou f-string.
2. Para somar números: converte o texto com int() se for dígito.

## 6. Código corrigido
```python
idade = 25
mensagem = f"Tenho {idade} anos"
# ou: mensagem = "Tenho " + str(idade) + " anos"
```

## 7. Como evitar no futuro
Usa f-strings ou confirma tipos com type().

---

### Exemplo 3

**INPUT:**
```
Traceback (most recent call last):
  File "main.py", line 8, in <module>
    print(utilizador["email"])
KeyError: 'email'
```

**OUTPUT:**

## 1. Resumo em uma frase
Tentaste aceder à chave "email" num dicionário que não a tem.

## 2. O que o Python está a dizer
KeyError: 'email' — a chave email não existe neste dicionário.

## 3. Onde está o problema
main.py, linha 8: utilizador["email"]

## 4. Causa raiz
A chave pode ter outro nome (ex: "mail") ou o dicionário veio incompleto da API/JSON.

## 5. Como corrigir (passo a passo)
1. Imprime utilizador.keys() para ver chaves disponíveis.
2. Usa .get("email", valor_default) em vez de ["email"].
3. Valida JSON antes de aceder.

## 6. Código corrigido
```python
email = utilizador.get("email", "sem email")
print(email)
# ou
if "email" in utilizador:
    print(utilizador["email"])
```

## 7. Como evitar no futuro
Prefere .get() ou "chave" in dict para dados externos.

---

### Exemplo 4

**INPUT:**
```
NameError: name 'resultado' is not defined
```

**OUTPUT:**

## 1. Resumo em uma frase
Usaste uma variável chamada resultado que ainda não foi criada.

## 2. O que o Python está a dizer
NameError — Python não conhece o nome "resultado" neste scope.

## 3. Onde está o problema
Linha onde usas resultado (ver traceback).

## 4. Causa raiz
Variável não definida, typo no nome, ou definida dentro de if/for e usada fora.

## 5. Como corrigir (passo a passo)
1. Procura typos (resultado vs resultados).
2. Inicializa antes: resultado = None ou resultado = 0.
3. Se está dentro de if, define fora ou garante que o if corre.

## 6. Código corrigido
```python
resultado = 0  # inicializar
# ... código que atribui valor ...
print(resultado)
```

## 7. Como evitar no futuro
Inicializa variáveis antes de branches (if/for) se vais usar depois.

---

## Prompt instructions (cola no campo "Prompt instructions")

```
Como usar este prompt no ChatGPT:

1. Abre um chat novo no ChatGPT.
2. Cola o prompt completo (template) na primeira mensagem.
3. Na segunda mensagem, cola o teu erro Python — traceback completo ou mensagem de erro.
4. Recebes a análise em 7 secções em português de Portugal.

Dicas:
- Quanto mais completo o traceback, melhor a resposta (ficheiro + linha).
- Se tiveres código à volta do erro, cola também.
- Funciona com erros comuns: IndexError, TypeError, KeyError, NameError, SyntaxError, AttributeError, ValueError.
- Para projetos com ficheiros múltiplos, indica qual ficheiro estás a correr.
```

---

## ChatGPT Share Link — COMO OBTER (obrigatório)

1. Vai a https://chatgpt.com
2. Chat **novo**
3. **1.ª mensagem:** cola o **Prompt template** completo (o texto com [ERRO_PYTHON])
4. **2.ª mensagem:** cola só isto (Exemplo 1):
```
Traceback (most recent call last):
  File "app.py", line 12, in <module>
    print(nomes[5])
IndexError: list index out of range
```
5. Espera a resposta completa
6. Clica **Partilhar** / **Share** (ícone no canto)
7. **Create link** / **Criar ligação**
8. Copia o link (formato https://chatgpt.com/share/xxxxxxxx)
9. Cola no campo **ChatGPT Share Link**

**Importante:** O link tem de mostrar o prompt a funcionar com um erro real. Não uses o link de exemplo 00000000.

---

## Depois
Clica **Next: Enable Payouts** → configura PayPal ou Stripe para receber.
