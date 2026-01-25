# Visual Based Therapy (MVP)

**Purpose:** a *professional* prototype for therapists / institutes to visualize therapeutic roles (e.g., inner critic, wise adult) via:
- avatar (upload image in v1)
- scripted line
- emotion + intensity
- voice style (demo: browser text-to-speech)
- reflection/debrief notes

This is **not** a self-help medical product. It's a demo build to validate workflows with professionals.

## Features (v1)
- Create a scene (avatar note + optional image, line, emotion, intensity, voice style)
- Preview voice (Web Speech API)
- Save scene to localStorage
- Library list + detail page
- Reflection fields (feelings, thoughts, body, next step)

## Tech
- Vite + React + TypeScript
- react-router-dom
- Local-only persistence via localStorage

## Run locally
1. Install Node.js 18+.
2. In this folder:
   ```bash
   npm install
   npm run dev
   ```
3. Open the printed localhost URL.

## Roadmap (suggested)
- AI avatar generation (OpenAI / SD) + 3D/rigged avatars
- Voice engines (ElevenLabs etc.) + emotion prosody controls
- Role-based interactive dialogue (LLM in role + safety rails)
- Institute mode: templates, classroom demos, accounts
- Export: PDF notes, share links (therapist ↔ client)

## Notes on safety
- Add disclaimers, consent UX, and crisis routing if ever exposed directly to clients.
- For training use, consider anonymization and no storage of personal data by default.

