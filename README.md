# AI Image-to-Audio Accessibility Platform

[Live demo](https://ita-orpin.vercel.app) | [CI](https://github.com/MarcoFernstaedt/image_accessibility_tool/actions)

A blind-first Next.js application that converts an uploaded image into a concise visual description and spoken MP3 output. The interface is designed for keyboard and screen-reader use rather than treating accessibility as a later enhancement.

## What it demonstrates

- End-to-end image-to-description-to-speech pipeline
- Binary image and audio transport through a Next.js API route
- Keyboard-operable upload, playback, and download workflow
- Screen-reader status announcements with semantic controls
- Server-side file validation, rate limiting, and bot protection
- Deterministic visual-contract tests and production build verification

## Architecture

1. The browser submits an image with multipart `FormData`.
2. The API validates the file type and size.
3. OpenAI vision produces a concise description.
4. Text-to-speech converts the description to MP3 audio.
5. The API returns binary audio to the browser.
6. The UI creates a local Blob URL for playback and download while announcing progress through accessible status regions.

## Technology

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS
- OpenAI vision and text-to-speech APIs
- Arcjet rate limiting, shield, and bot protection
- Vercel deployment

## Accessibility contract

- Keyboard-only operation for the complete workflow
- Programmatic labels and semantic heading structure
- `aria-live` progress and error announcements
- No visual-only status or interaction requirement
- Accessible audio playback and download controls

The automated contract test protects key accessibility and visual-system requirements. Manual assistive-technology testing is still part of release acceptance because automated checks cannot prove the complete screen-reader experience.

## Run locally

Requirements:

- Node.js 20 or newer
- npm
- OpenAI API key
- Arcjet key

```bash
git clone https://github.com/MarcoFernstaedt/image_accessibility_tool.git
cd image_accessibility_tool
npm ci
cp .env.example .env.local
npm run dev
```

Configure `.env.local` with your own credentials. Never commit that file.

## Verification

```bash
npm test
npm run lint
npm run build
```

GitHub Actions runs the same test, lint, and production-build gates for every push and pull request.

## Security and privacy boundaries

- Uploaded content is processed server-side and is not intentionally persisted by this application.
- File type and size are validated before model invocation.
- Rate limiting and bot protection reduce abuse but do not replace platform-level monitoring.
- Images and generated descriptions are sent to the configured AI provider; do not upload sensitive material without reviewing that provider's data-handling terms.
- Secrets remain server-side and must be supplied through environment variables.

## Repository map

```text
app/
  api/describe-image/route.ts   image validation and AI/audio pipeline
  page.tsx                      accessible upload and playback interface
tests/visual-contract.mjs       deterministic interface contract
.env.example                    required configuration names only
```

## License

MIT. See [LICENSE](LICENSE).
