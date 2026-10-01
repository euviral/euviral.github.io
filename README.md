# Euviral

Versão estática do Euviral para GitHub Pages. Não usa React, TypeScript, npm ou backend.

## Publicação
1. Coloque o conteúdo desta pasta na raiz do repositório `euviral.github.io`.
2. No GitHub, abra **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**.
4. Selecione `main` e `/ (root)` e salve.
5. Aguarde a publicação em `https://euviral.github.io/`.

## O que funciona sem backend
- Reels, TikTok e carrossel.
- Gerador local de roteiro.
- Copiar roteiro.
- Edição do texto gerado.
- Histórico local via localStorage.
- Zona segura 9:16.
- PWA e cache offline após a primeira visita.

## IA real
Não coloque chaves secretas de API em `app.js`. Para IA real, adicione um backend/serverless que mantenha a chave no servidor e faça a chamada com segurança.
