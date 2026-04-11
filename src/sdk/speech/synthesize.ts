import { BaseSDK } from "../base";
import { speechEndpoint, voicesEndpoint } from "../../client/endpoints";
import { SpeechRequest, SpeechResponse, VoiceListResponse } from "../../types/api";
import { parseSSE } from "../../client/stream";
import { filterByLanguage } from "../../commands/speech/voices";

export class SpeechSDK extends BaseSDK {
  async speech(request: Partial<SpeechRequest> & { stream: true }): Promise<AsyncGenerator<SpeechResponse>>;
  async speech(request: Partial<SpeechRequest>): Promise<SpeechResponse>;
  async speech(request: Partial<SpeechRequest>): Promise<SpeechResponse | AsyncGenerator<SpeechResponse>> {
    const body: SpeechRequest = {
      ...request,
      model: request.model ?? "speech-2.8-hd",
      text: request.text ?? "",
      voice_setting: {
        voice_id: request.voice_setting?.voice_id ?? "English_expressive_narrator",
      },
      audio_setting: {
        format: request.audio_setting?.format ?? "mp3",
        sample_rate: request.audio_setting?.sample_rate ?? 32000,
        bitrate: request.audio_setting?.bitrate ?? 128000,
        channel: request.audio_setting?.channel ?? 1,
      },
      output_format: 'hex',
    };

    const url = speechEndpoint(this.config.baseUrl);

    if (body.stream) {
      return this.speechStream(body);
    }

    const res = await this.requestJson<SpeechResponse>({
      url,
      method: "POST",
      body,
    });

    return res;
  }

  private async *speechStream(body: SpeechRequest): AsyncGenerator<SpeechResponse> {
    const url = speechEndpoint(this.config.baseUrl);

    const res = await this.request({
      url,
      method: "POST",
      body: {
        ...body,
      },
      stream: true,
    });

    for await (const event of parseSSE(res)) {
      if (!event.data || event.data === '[DONE]') break;
      try {
        const parsed = JSON.parse(event.data) as SpeechResponse;
        yield parsed;
      } catch {
        // Skip unparseable chunks
      }
    }
  }

  async voices(language?: string) {
    const url = voicesEndpoint(this.config.baseUrl);

    const res = await this.requestJson<VoiceListResponse>({
      url,
      method: "POST",
      body: { voice_type: 'system' },
    });

    const voices = res.system_voice ?? [];
    if (language) {
      const filtered = filterByLanguage(voices, language);
      return filtered;
    }
    return voices;
  }
}
