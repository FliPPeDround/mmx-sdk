import { BaseSDK } from "../base";
import { imageEndpoint } from "../../client/endpoints";
import { ImageRequest, ImageResponse } from "../../types/api";
import { ModelPartial } from "..";

export class ImageSDK extends BaseSDK {
  async generate(request: ModelPartial<ImageRequest>): Promise<ImageResponse> {
    const body = {
      ...request,
      model: request.model ?? "image-01",
      n: request.n ?? 1,
    };
    const url = imageEndpoint(this.config.baseUrl);

    const res = await this.requestJson<ImageResponse>({
      url,
      method: "POST",
      body,
    });

    return res;
  }
}
