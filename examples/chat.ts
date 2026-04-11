import { MiniMaxSDK } from '../src/sdk';

const sdk = new MiniMaxSDK({
  region: 'cn',
});

const res = await sdk.chat({
  messages: [{ role: 'user', content: '你好' }],
});


// const stream = await sdk.chat({
//   messages: [{ role: 'user', content: '你好' }],
//   stream: true,
// });

console.log(res);
