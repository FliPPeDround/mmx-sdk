import { request as requestClient, requestJson as requestJsonClient, RequestOpts } from "../client/http";
import { Config, Region } from "../config/schema";
import { loadConfig } from "../config/loader";

interface BaseSDKOptions {
  apiKey?: string;
  region?: Region;
  baseUrl?: string;
  timeout?: number;
}

export class BaseSDK {
  protected config: Config;

  constructor(options: BaseSDKOptions) {
    const { apiKey, region, baseUrl, timeout } = options;
    this.config = loadConfig({
      apiKey,
      baseUrl,
      quiet: true,
      verbose: false,
      timeout,
      noColor: true,
      yes: false,
      dryRun: false,
      help: false,
      nonInteractive: false,
      async: false,
      region,
    })
  }

  protected request(opts: RequestOpts) {
    return requestClient(this.config, opts);
  }

  protected requestJson<T>(opts: RequestOpts): Promise<T> {
    return requestJsonClient<T>(this.config, opts);
  }
}
