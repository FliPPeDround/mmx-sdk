import { MiniMaxSDK } from "../src/sdk";

const sdk = new MiniMaxSDK({
  region: 'cn',
});

const res = await sdk.getQuota();

console.log(res);
