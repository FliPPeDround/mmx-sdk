import { BaseSDK } from "./base";
import { ChatSDK } from "./text/chat";
import { SpeechSDK } from "./speech/synthesize";
import { ImageSDK } from "./image/generate";
import { VideoAsyncGenerateRequest, VideoDownloadRequest, VideoSDK } from "./video/generate";
import { MusicGenerateRequest, MusicSDK } from "./music/generate";
import { SearchResponse, SearchSDK } from "./search/query";
import { ImageDescribeRequest, VisionSDK, VlmResponse } from "./vision/describe";
import { QuotaSDK } from "./quota/show";
import type {
  ChatRequest,
  ChatResponse,
  StreamEvent,
  SpeechRequest,
  SpeechResponse,
  ImageRequest,
  ImageResponse,
  VideoResponse,
  VideoTaskResponse,
  MusicResponse,
  QuotaResponse,
  SystemVoiceInfo,
} from "../types/api";
import type { Region } from "../config/schema";

interface MiniMaxSDKOptions {
  apiKey?: string;
  region?: Region;
  baseUrl?: string;
  timeout?: number;
}

export type ModelPartial<T> = 'model' extends keyof T
  ? Omit<T, 'model'> & { model?: T['model'] }
  : T;

export class MiniMaxSDK extends BaseSDK {
  private chatSDK: ChatSDK;
  private speechSDK: SpeechSDK;
  private imageSDK: ImageSDK;
  private videoSDK: VideoSDK;
  private musicSDK: MusicSDK;
  private searchSDK: SearchSDK;
  private visionSDK: VisionSDK;
  private quotaSDK: QuotaSDK;

  constructor(options: MiniMaxSDKOptions) {
    super(options);
    this.chatSDK = new ChatSDK(options);
    this.speechSDK = new SpeechSDK(options);
    this.imageSDK = new ImageSDK(options);
    this.videoSDK = new VideoSDK(options);
    this.musicSDK = new MusicSDK(options);
    this.searchSDK = new SearchSDK(options);
    this.visionSDK = new VisionSDK(options);
    this.quotaSDK = new QuotaSDK(options);
  }

  chat(request: Partial<ChatRequest> & { stream: true }): Promise<AsyncGenerator<StreamEvent>>;
  chat(request: Partial<ChatRequest>): Promise<ChatResponse>;
  chat(request: Partial<ChatRequest>): Promise<ChatResponse | AsyncGenerator<StreamEvent>> {
    return this.chatSDK.chat(request);
  }

  speech(request: Partial<SpeechRequest> & { stream: true }): Promise<AsyncGenerator<SpeechResponse>>;
  speech(request: Partial<SpeechRequest>): Promise<SpeechResponse>;
  speech(request: Partial<SpeechRequest>): Promise<SpeechResponse | AsyncGenerator<SpeechResponse>> {
    return this.speechSDK.speech(request);
  }

  voices(language?: string): Promise<SystemVoiceInfo[]> {
    return this.speechSDK.voices(language);
  }

  generateImage(request: ModelPartial<ImageRequest>): Promise<ImageResponse> {
    return this.imageSDK.generate(request);
  }

  generateVideo(request: VideoAsyncGenerateRequest & { async: true }): Promise<{taskId: string}>;
  generateVideo(request: ModelPartial<VideoAsyncGenerateRequest>): Promise<VideoResponse>;
  generateVideo(request: VideoAsyncGenerateRequest): Promise<VideoResponse | {taskId: string}> {
    return this.videoSDK.generate(request);
  }

  getVideoTask({taskId}: {taskId: string}): Promise<VideoTaskResponse> {
    return this.videoSDK.getTask({taskId});
  }

  downloadVideo(request: VideoDownloadRequest) {
    return this.videoSDK.download(request);
  }

  generateMusic(request: ModelPartial<MusicGenerateRequest> & { stream: true }): Promise<AsyncGenerator<Uint8Array<ArrayBuffer>>>;
  generateMusic(request: ModelPartial<MusicGenerateRequest>): Promise<MusicResponse>;
  generateMusic(request: ModelPartial<MusicGenerateRequest>): Promise<MusicResponse | AsyncGenerator<Uint8Array<ArrayBuffer>>> {
    return this.musicSDK.generate(request);
  }

  search({ query }: { query: string }): Promise<SearchResponse> {
    return this.searchSDK.query(query);
  }

  describeImage(request: ImageDescribeRequest): Promise<VlmResponse> {
    return this.visionSDK.describe(request);
  }

  getQuota(): Promise<QuotaResponse> {
    return this.quotaSDK.info();
  }
}


export * from "../types/api";
