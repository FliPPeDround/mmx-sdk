<img src="https://file.cdn.minimax.io/public/MMX.png" alt="MiniMax" width="100%" />

> **⚠️ 已弃用** — 此仓库已合并到官方 [mmx-cli](https://github.com/MiniMax-AI/cli)。请使用[官方版本](https://github.com/MiniMax-AI/cli)。详情请查看 [#122](https://github.com/MiniMax-AI/cli/pull/122)。

<p align="center">
  <strong>MiniMax AI 开放平台 SDK</strong><br>
  在任意 Node.js 应用中生成文字、图像、视频、语音和音乐。
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/mmx-sdk"><img src="https://img.shields.io/npm/v/mmx-sdk.svg" alt="npm version" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT" /></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg" alt="Node.js >= 18" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> · <a href="https://platform.minimax.io">国际版平台</a> · <a href="https://platform.minimaxi.com">国内版平台</a>
</p>

***
**[FliPPeDround](https://github.com/flippedround)**

**前端工程师** · **开源爱好者** · **正在找工作**

<samp>
对我的项目感兴趣？查看我的简历 · <a href='https://flippedround.site/'>resume</a>
</samp>

***

## 功能特性

- **文本对话** — 多轮对话、流式输出、系统提示词、JSON 格式输出
- **图像生成** — 文生图，支持比例和批量控制
- **视频生成** — 异步生成，进度追踪
- **语音合成** — 30+ 音色、语速调节、流式播放
- **音乐生成** — 文生音乐，支持自定义歌词
- **图像理解** — 图片描述与识别
- **网络搜索** — MiniMax 搜索引擎
- **双区域** — 国际版（`api.minimax.io`）和国内版（`api.minimaxi.com`）自动切换

## 安装

```bash
npm install mmx-sdk
```

> 需要 [Node.js](https://nodejs.org) 18+

> **需要 MiniMax Token 套餐** — [国际版](https://platform.minimax.io/subscribe/token-plan) · [国内版](https://platform.minimaxi.com/subscribe/token-plan)

## 快速开始

```typescript
import { MiniMaxSDK } from 'mmx-sdk';

const sdk = new MiniMaxSDK({ apiKey: 'sk-xxxxx' });

// 文本对话
const response = await sdk.chat({ message: '你好，MiniMax！' });
console.log(response);

// 图像生成
const image = await sdk.generateImage({ prompt: '一只穿宇航服的猫' });
console.log(image);

// 语音合成
await sdk.speech({ text: '你好！', out: 'hello.mp3' });

// 视频生成（异步）
const { taskId } = await sdk.generateVideo({ prompt: '海浪拍打礁石', async: true });
const task = await sdk.getVideoTask({ taskId });

// 音乐生成
const music = await sdk.generateMusic({ prompt: '欢快的流行乐', lyrics: '[主歌] 啦啦啦，阳光照' });

// 网络搜索
const results = await sdk.search({ query: 'MiniMax AI 最新动态' });

// 图像理解
const description = await sdk.describeImage({ image: 'photo.jpg' });

// 查询配额
const quota = await sdk.getQuota();
```

## API 参考

### `new MiniMaxSDK(options)`

使用选项初始化 SDK：

```typescript
const sdk = new MiniMaxSDK({
  apiKey: 'sk-xxxxx',      // 你的 API 密钥
  region: 'global',       // 'global' 或 'cn'，默认自动检测
  baseUrl: '...',         // 自定义基础 URL（可选）
  timeout: 60000,         // 请求超时时间（毫秒，可选）
});
```

### `sdk.chat(request)`

发送聊天消息，支持流式输出和多轮对话。

```typescript
// 非流式
const response = await sdk.chat({ message: '你好！' });

// 流式
const stream = await sdk.chat({ message: '你好！', stream: true });
for await (const event of stream) {
  console.log(event);
}
```

### `sdk.speech(request)`

将文本合成为语音。

```typescript
// 非流式
await sdk.speech({ text: '你好！', out: 'hello.mp3' });

// 流式
const stream = await sdk.speech({ text: '你好！', stream: true });
for await (const chunk of stream) {
  // 处理音频片段
}
```

### `sdk.voices(language?)`

获取可用的系统音色。

```typescript
const voices = await sdk.voices();
const chineseVoices = await sdk.voices('Chinese');
```

### `sdk.generateImage(request)`

根据文本提示生成图像。

```typescript
const image = await sdk.generateImage({
  prompt: '一只穿宇航服的猫',
  n: 3,
  aspectRatio: '16:9',
});
```

### `sdk.generateVideo(request)`

根据文本提示生成视频。

```typescript
// 异步（返回任务 ID）
const { taskId } = await sdk.generateVideo({
  prompt: '海浪拍打礁石',
  async: true,
});

// 同步（等待完成）
const video = await sdk.generateVideo({
  prompt: '机器人作画',
});
```

### `sdk.getVideoTask({ taskId })`

获取视频生成任务状态。

```typescript
const task = await sdk.getVideoTask({ taskId: '123456' });
```

### `sdk.downloadVideo(request)`

通过文件 ID 下载生成的视频。

```typescript
await sdk.downloadVideo({ fileId: '176844028768320', out: 'video.mp4' });
```

### `sdk.generateMusic(request)`

根据文本提示生成音乐。

```typescript
// 非流式
const music = await sdk.generateMusic({
  prompt: '欢快的流行乐',
  lyrics: '[主歌] 啦啦啦，阳光照',
});

// 流式
const stream = await sdk.generateMusic({ prompt: '爵士风', stream: true });
for await (const chunk of stream) {
  // 处理音频片段
}
```

### `sdk.search({ query })`

执行网络搜索。

```typescript
const results = await sdk.search({ query: 'MiniMax AI 最新动态' });
```

### `sdk.describeImage(request)`

描述或分析图像。

```typescript
const description = await sdk.describeImage({
  image: 'photo.jpg',      // 文件路径、URL 或文件 ID
  prompt: '这是什么品种的猫？',
});
```

### `sdk.getQuota()`

获取当前 API 配额使用情况。

```typescript
const quota = await sdk.getQuota();
```

## 许可证

[MIT](LICENSE)
