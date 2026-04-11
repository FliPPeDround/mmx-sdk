import { BaseSDK } from "../base";
import { quotaEndpoint } from "../../client/endpoints";
import type { QuotaResponse } from "../../types/api";

export class QuotaSDK extends BaseSDK {
  async info(): Promise<QuotaResponse> {
    const url = quotaEndpoint(this.config.baseUrl);
    const res = await this.requestJson<QuotaResponse>({ url });

    return res;
  }
}
