# AI Image-to-Audio Accessibility Platform

A blind-first AI system that converts images into real-time spoken descriptions using computer vision and text-to-speech.

This platform allows blind and low-vision users to immediately understand visual content through audio.

---

## Features

- Secure image uploads via multipart FormData
- AI-generated visual descriptions optimized for accessibility
- Real-time MP3 audio generation
- Instant in-browser playback
- One-click audio download
- Full screen-reader and keyboard accessibility
- Server-side validation and abuse protection
- Production-grade rate limiting and bot protection

---

## Tech Stack

Frontend:
- Next.js (App Router)
- TypeScript
- Tailwind CSS

Backend:
- Next.js API Routes (Node.js runtime)
- OpenAI Vision + Text-to-Speech

Security & Performance:
- Arcjet (rate limiting, bot protection, shield)
- File validation (type + size)
- Binary streaming via Buffer + Blob

Accessibility:
- aria-live status updates
- Semantic labels and headings
- Keyboard-only navigation support

---

## System Flow

1. User uploads an image using FormData.
2. Backend validates file type and size.
3. Raw image bytes are converted to a base64 Data URL.
4. Vision model generates a concise description.
5. Description is converted into MP3 speech via Text-to-Speech.
6. Raw audio binary is streamed back to the browser.
7. Frontend creates a Blob URL for instant playback and download.
8. Screen readers announce status updates in real time.

---

## Accessibility Design

This project was built with blind and low-vision users as the primary audience:

- Real-time announcements using aria-live
- Fully labeled form controls
- Keyboard-only navigation support
- Descriptive audio player labeling
- No reliance on visual-only feedback

---

## Why This Matters

Most AI vision demos stop at text output. This platform closes the loop by delivering immediate spoken audio, creating a direct sensory translation from vision to sound.

It demonstrates real-world skills in:

- Binary data transport
- Media streaming over HTTP
- AI inference pipelines
- Accessibility engineering
- Full-stack systems design

---

## Future Improvements

- Live camera capture
- Multiple voice options
- Language auto-detection
- Batch uploads
- Mobile PWA support

---

## License

MIT