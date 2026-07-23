# Patrimônio 10X

App de mentoria financeira (web) implementado a partir do documento de arquitetura
`ARQUITETURA_Patrimonio_10X.md`. Stack **React + Vite** no front, **Supabase**
(Postgres + Auth + Edge Functions) no back e **Claude API** no Mentor IA.

> Observação: o documento propõe Flutter como app final. Esta implementação
> entrega a **versão web funcional** do produto (o protótipo era React), com
> backend real, autenticação, persistência e o Mentor IA de verdade.

## Como rodar

```bash
npm install
npm run dev
```

Abre em http://localhost:5173.

- **Sem configurar o Supabase** → o app roda em *modo demo* com dados de exemplo
  (útil para ver a UI na hora).
- **Com Supabase configurado** → login/cadastro reais, dados por usuário (RLS),
  plano mensal persistido e Mentor IA via Edge Function.

## App mobile (Android, via Capacitor)

O app é empacotado com **Capacitor** como app Android nativo (a mesma base React
roda dentro do app). Requisitos: Android SDK + JDK 21 (o JBR do Android Studio serve).

```bash
npm run build            # gera dist/
npx cap sync android     # copia dist/ para o projeto Android
cd android
./gradlew assembleDebug  # gera o APK
```

O APK sai em `android/app/build/outputs/apk/debug/app-debug.apk`.

Instalar num celular (com depuração USB ligada e `adb` no PATH):

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

Para abrir no Android Studio: `npx cap open android`.
Para iOS seria `npx cap add ios` — mas exige um Mac com Xcode.

## Configurar o Supabase (para o modo real)

1. **URL + chave** — em `.env.local`, preencha `VITE_SUPABASE_URL` com a URL do
   seu projeto (Project Settings → Data API → *Project URL*, algo como
   `https://xxxx.supabase.co`). A chave publicável já está preenchida.

2. **Schema** — duas opções:
   - **SQL Editor (mais rápido):** abra o Studio do seu projeto → SQL Editor →
     cole o conteúdo de `supabase/schema.sql` → *Run*.
   - **CLI:**
     ```bash
     npx supabase link --project-ref <ref-do-projeto>
     npx supabase db push
     ```

3. **Mentor IA (Edge Function)** — precisa de uma chave da Anthropic:
   ```bash
   npx supabase functions deploy mentor
   npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
   # opcional: npx supabase secrets set ANTHROPIC_MODEL=claude-haiku-4-5
   ```
   A chave da Claude **fica só no servidor** — nunca vai para o navegador.

## Estrutura

```
src/
  main.jsx            # bootstrap React
  App.jsx             # app inteiro (dashboard, metas, mentor, aprender, calculadora)
  screens/Auth.jsx    # login / cadastro
  hooks/useSession.js # sessão de auth do Supabase
  lib/
    supabase.js       # client (usa VITE_SUPABASE_*)
    api.js            # leitura/escrita de dados + Mentor IA
supabase/
  schema.sql          # schema completo para colar no SQL Editor
  migrations/         # 0001 (tabelas + RLS + trigger) e 0002 (seed de catálogo)
  functions/mentor/   # Edge Function do Mentor IA (Claude API)
  config.toml         # config do Supabase CLI (dev local)
```

## Segurança / conformidade

- **RLS** em todas as tabelas de usuário (`user_id = auth.uid()`).
- **Bootstrap automático:** ao criar a conta, um trigger cria o perfil, o perfil
  financeiro (padrões: iniciante, Nubank, R$2.000) e semeia as 10 metas da
  Escada do Patrimônio.
- **Chave secreta** e **chave da Anthropic** nunca vão para o cliente.
- Disclaimers educacionais e guardrails da IA conforme seções 1.1, 6 e 7 do documento.
