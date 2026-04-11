import { MiniMaxSDK } from "../src/sdk";

const sdk = new MiniMaxSDK({
  region: 'cn',
});

const res = await sdk.generateImage({
  prompt: '一只可爱的橘猫，在乡间小路上，抱着一个拟人化的地球，哭泣',
});

console.log(res);
