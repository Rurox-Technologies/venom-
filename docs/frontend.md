# Frontend Guide

## Stack

- Next.js App Router
- TailwindCSS
- Framer Motion
- JavaScript (no TypeScript in app code)

## Run Locally

```bash
cd frontend
npm install
npm run dev
```

## UI Composition

- `src/app/page.jsx`: main dashboard shell
- `components/chat/*`: chat timeline and input
- `components/sidebar/*`: memory and history panel
- `components/voice/*`: voice button and visuals
- `components/settings/*`: provider toggle + personality selector

## Theme Direction

- Futuristic dark OS aesthetic
- Glassmorphism cards
- Motion-driven interactions
- Responsive desktop/mobile layout

## Next Frontend Steps

- Connect to backend endpoints with real async states
- Add optimistic rendering and streamed responses
- Add microphone capture + waveform binding
- Add conversation history persistence
