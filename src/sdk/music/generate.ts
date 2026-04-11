import { BaseSDK } from "../base";
import { musicEndpoint } from "../../client/endpoints";
import { MusicRequest, MusicResponse } from "../../types/api";
import { ModelPartial } from "..";

export interface MusicGenerateRequest extends MusicRequest {
  /** Vocal style, e.g. "warm male baritone", "bright female soprano", "duet with harmonies" */
  vocals?: string;
  /** Music genre, e.g. folk, pop, jazz */
  genre?: string;
  /** Mood or emotion, e.g. warm, melancholic, uplifting */
  mood?: string;
  /** Instruments to feature, e.g. "acoustic guitar, piano" */
  instruments?: string;
  /** Tempo description, e.g. fast, slow, moderate */
  tempo?: string;
  /** Exact tempo in beats per minute */
  bpm?: number;
  /** Musical key, e.g. C major, A minor, G sharp */
  key?: string;
  /** Elements to avoid in the generated music */
  avoid?: string;
  /** Use case context, e.g. "background music for video", "theme song" */
  use_case?: string;
  /** Song structure, e.g. "verse-chorus-verse-bridge-chorus" */
  structure?: string;
  /** Reference tracks or artists, e.g. "similar to Ed Sheeran, Taylor Swift" */
  references?: string;
  /** Additional fine-grained requirements not covered above */
  extra?: string;
  /** Generate instrumental music (no vocals) */
  instrumental?: boolean;
  /** Use case */
  useCase?: string;
}

export class MusicSDK extends BaseSDK {
  buildPrompt(request: ModelPartial<MusicGenerateRequest>) {
    const structuredParts: string[] = [];
    if (request.vocals)      structuredParts.push(`Vocals: ${request.vocals as string}`);
    if (request.genre)       structuredParts.push(`Genre: ${request.genre as string}`);
    if (request.mood)        structuredParts.push(`Mood: ${request.mood as string}`);
    if (request.instruments) structuredParts.push(`Instruments: ${request.instruments as string}`);
    if (request.tempo)       structuredParts.push(`Tempo: ${request.tempo as string}`);
    if (request.bpm)         structuredParts.push(`BPM: ${request.bpm as number}`);
    if (request.key)         structuredParts.push(`Key: ${request.key as string}`);
    if (request.avoid)       structuredParts.push(`Avoid: ${request.avoid as string}`);
    if (request.useCase)     structuredParts.push(`Use case: ${request.useCase as string}`);
    if (request.structure)   structuredParts.push(`Structure: ${request.structure as string}`);
    if (request.references)  structuredParts.push(`References: ${request.references as string}`);
    if (request.extra)       structuredParts.push(`Extra: ${request.extra as string}`);

    let lyrics = request.lyrics;
    let prompt = request.prompt;

    if (request.instrumental || !lyrics || lyrics === '无歌词' || lyrics === 'no lyrics') {
      lyrics = '[intro] [outro]';
      structuredParts.push('Style: instrumental, no vocals, pure music');
    }

    if (structuredParts.length > 0) {
      const structured = structuredParts.join('. ');
      prompt = prompt ? `${prompt}. ${structured}` : structured;
    }
    return prompt;
  }
  async *generateStream(body: ModelPartial<MusicGenerateRequest>): AsyncGenerator<Uint8Array<ArrayBuffer>> {
    const url = musicEndpoint(this.config.baseUrl);

    const res = await this.request({
      url,
      method: 'POST',
      body,
      stream: true,
    });

    const reader = res.body?.getReader();
    if (!reader) throw new Error('No response body');

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield value;
      }
    } finally {
      reader.releaseLock();
    }
  }

  async generate(request: ModelPartial<MusicGenerateRequest> & { stream: true }): Promise<AsyncGenerator<Uint8Array<ArrayBuffer>>>;
  async generate(request: ModelPartial<MusicGenerateRequest>): Promise<MusicResponse>;
  async generate(request: ModelPartial<MusicGenerateRequest>): Promise<MusicResponse | AsyncGenerator<Uint8Array<ArrayBuffer>>> {
    const body: MusicGenerateRequest = {
      ...request,
      model: request.model ?? 'music-2.5',
      prompt: this.buildPrompt(request),
      audio_setting: {
        format: request.audio_setting?.format ?? 'mp3',
        sample_rate: request.audio_setting?.sample_rate ?? 44100,
        bitrate: request.audio_setting?.bitrate ?? 256000,
      },
      output_format: 'hex',
    }

    const url = musicEndpoint(this.config.baseUrl);

    if (request.stream) {
      return this.generateStream(body);
    }

    const res = await this.requestJson<MusicResponse>({
      url,
      method: 'POST',
      body,
    });

    return res;
  }
}
