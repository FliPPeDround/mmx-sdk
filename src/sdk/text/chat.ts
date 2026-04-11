import { BaseSDK } from "../base";
import { chatEndpoint } from "../../client/endpoints";
import { ChatRequest, ChatResponse, StreamEvent } from "../../types/api";
import { parseSSE } from "../../client/stream";

export class ChatSDK extends BaseSDK {
  async *chatStream(body: Partial<ChatRequest>): AsyncGenerator<StreamEvent> {
    const url = chatEndpoint(this.config.baseUrl);

    const res = await this.request({
      url,
      method: 'POST',
      body: {
        ...body,
        stream: true,
      },
      stream: true,
      authStyle: 'x-api-key',
    });

    for await (const event of parseSSE(res)) {
      if (event.data === '[DONE]') break;
      try {
        const parsed = JSON.parse(event.data) as StreamEvent;
        yield parsed;
      } catch {
        // Skip unparseable chunks
      }
    }
  }

  async chat(request: Partial<ChatRequest> & { stream: true }): Promise<AsyncGenerator<StreamEvent>>;
  async chat(request: Partial<ChatRequest>): Promise<ChatResponse>;
  async chat(request: Partial<ChatRequest>): Promise<ChatResponse | AsyncGenerator<StreamEvent>> {
    const body = {
      ...request,
      model: request.model ?? 'MiniMax-M2.7',
      max_tokens: request.max_tokens ?? 4096,
    } as ChatRequest;
    const url = chatEndpoint(this.config.baseUrl);

    if (body.stream) {
      return this.chatStream(body);
    }

    const res = await this.requestJson<ChatResponse>({
      url,
      method: 'POST',
      body,
      authStyle: 'x-api-key',
    });

    return res;
  }
}
