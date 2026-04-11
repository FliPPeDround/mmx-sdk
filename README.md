<img src="https://file.cdn.minimax.io/public/MMX.png" alt="MiniMax" width="100%" />

<p align="center">
  <strong>SDK for the MiniMax AI Platform</strong><br>
  Generate text, images, video, speech, and music — from any Node.js application.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/mmx-sdk"><img src="https://img.shields.io/npm/v/mmx-sdk.svg" alt="npm version" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT" /></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg" alt="Node.js >= 18" /></a>
</p>

<p align="center">
  <a href="README_CN.md">中文文档</a> · <a href="https://platform.minimax.io">Global Platform</a> · <a href="https://platform.minimaxi.com">CN Platform</a>
</p>

***
**[FliPPeDround](https://github.com/flippedround)**

**Frontend Engineer** · **Open Source Enthusiast** · **Open to Work**

<samp>
Interested in my projects? Check out my resume · <a href='https://flippedround.site/'>resume</a>
</samp>

***

## Features

- **Text** — Multi-turn chat, streaming, system prompts, JSON output
- **Image** — Text-to-image with aspect ratio and batch controls
- **Video** — Async video generation with progress tracking
- **Speech** — TTS with 30+ voices, speed control, streaming playback
- **Music** — Text-to-music with optional lyrics
- **Vision** — Image understanding and description
- **Search** — Web search powered by MiniMax
- **Dual Region** — Seamless Global (`api.minimax.io`) and CN (`api.minimaxi.com`) support

## Install

```bash
npm install mmx-sdk
```

> Requires [Node.js](https://nodejs.org) 18+

> **Requires a MiniMax Token Plan** — [Global](https://platform.minimax.io/subscribe/token-plan) · [CN](https://platform.minimaxi.com/subscribe/token-plan)

## Quick Start

```typescript
import { MiniMaxSDK } from 'mmx-sdk';

const sdk = new MiniMaxSDK({ apiKey: 'sk-xxxxx' });

// Text chat
const response = await sdk.chat({ message: 'What is MiniMax?' });
console.log(response);

// Image generation
const image = await sdk.generateImage({ prompt: 'A cat in a spacesuit' });
console.log(image);

// Speech synthesis
await sdk.speech({ text: 'Hello!', out: 'hello.mp3' });

// Video generation (async)
const { taskId } = await sdk.generateVideo({ prompt: 'Ocean waves at sunset', async: true });
const task = await sdk.getVideoTask({ taskId });

// Music generation
const music = await sdk.generateMusic({ prompt: 'Upbeat pop', lyrics: '[verse] La da dee, sunny day' });

// Web search
const results = await sdk.search({ query: 'MiniMax AI latest news' });

// Image vision
const description = await sdk.describeImage({ image: 'photo.jpg' });

// Check quota
const quota = await sdk.getQuota();
```

## API Reference

### `new MiniMaxSDK(options)`

Initialize the SDK with options:

```typescript
const sdk = new MiniMaxSDK({
  apiKey: 'sk-xxxxx',      // Your API key
  region: 'global',       // 'global' or 'cn', auto-detected by default
  baseUrl: '...',         // Custom base URL (optional)
  timeout: 60000,         // Request timeout in ms (optional)
});
```

### `sdk.chat(request)`

Send a chat message with support for streaming and multi-turn conversations.

```typescript
// Non-streaming
const response = await sdk.chat({ message: 'Hello!' });

// Streaming
const stream = await sdk.chat({ message: 'Hello!', stream: true });
for await (const event of stream) {
  console.log(event);
}
```

### `sdk.speech(request)`

Synthesize speech from text.

```typescript
// Non-streaming
await sdk.speech({ text: 'Hello!', out: 'hello.mp3' });

// Streaming
const stream = await sdk.speech({ text: 'Hello!', stream: true });
for await (const chunk of stream) {
  // process audio chunks
}
```

### `sdk.voices(language?)`

Get available system voices.

```typescript
const voices = await sdk.voices();
const chineseVoices = await sdk.voices('Chinese');
```

### `sdk.generateImage(request)`

Generate images from text prompts.

```typescript
const image = await sdk.generateImage({
  prompt: 'A cat in a spacesuit',
  n: 3,
  aspectRatio: '16:9',
});
```

### `sdk.generateVideo(request)`

Generate videos from text prompts.

```typescript
// Async (returns task ID)
const { taskId } = await sdk.generateVideo({
  prompt: 'Ocean waves at sunset',
  async: true,
});

// Sync (waits for completion)
const video = await sdk.generateVideo({
  prompt: 'A robot painting',
});
```

### `sdk.getVideoTask({ taskId })`

Get video generation task status.

```typescript
const task = await sdk.getVideoTask({ taskId: '123456' });
```

### `sdk.downloadVideo(request)`

Download a generated video by file ID.

```typescript
await sdk.downloadVideo({ fileId: '176844028768320', out: 'video.mp4' });
```

### `sdk.generateMusic(request)`

Generate music from text prompts.

```typescript
// Non-streaming
const music = await sdk.generateMusic({
  prompt: 'Upbeat pop',
  lyrics: '[verse] La da dee, sunny day',
});

// Streaming
const stream = await sdk.generateMusic({ prompt: 'Jazz', stream: true });
for await (const chunk of stream) {
  // process audio chunks
}
```

### `sdk.search({ query })`

Perform a web search.

```typescript
const results = await sdk.search({ query: 'MiniMax AI latest news' });
```

### `sdk.describeImage(request)`

Describe or analyze an image.

```typescript
const description = await sdk.describeImage({
  image: 'photo.jpg',      // file path, URL, or file ID
  prompt: 'What breed is this cat?',
});
```

### `sdk.getQuota()`

Get your current API quota usage.

```typescript
const quota = await sdk.getQuota();
```

## License

[MIT](LICENSE)
