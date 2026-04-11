import { MiniMaxSDK } from "../src/sdk";

const sdk = new MiniMaxSDK({
  region: 'cn',
});

const res = await sdk.describeImage({
  prompt: '描述这张图片',
  image: 'https://camo.githubusercontent.com/f86216888100a0b9a2a82a1a6a9c6c4378ffc304416190a359fac1171876fb2e/68747470733a2f2f66696c652e63646e2e6d696e696d61782e696f2f7075626c69632f4d4d582e706e67',
});

console.log(res);
