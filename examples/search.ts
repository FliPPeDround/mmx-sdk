import { MiniMaxSDK } from "../src/sdk";

const sdk = new MiniMaxSDK({
  region: 'cn',
});

const res = await sdk.search({
  query: 'FliPPeDround用户的个人信息',
});

console.log(res);
