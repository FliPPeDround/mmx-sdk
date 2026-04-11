import { MiniMaxSDK } from "../src/sdk";
import { writeFileSync } from 'fs';

const sdk = new MiniMaxSDK({
  region: 'cn',
});

// const voices = await sdk.voices("chinese");

const res = await sdk.speech({
  text: '哈儿果，哈儿果，哈儿吃了补脑壳，老人吃了考大学，婆娘吃了要跑脱，太婆吃了开摩托，外爷吃了打魂斗罗。',
  voice_setting: {
    voice_id: 'Chinese (Mandarin)_Mature_Woman'
  },
});

console.log(res.data);
writeFileSync('output.mp3', Buffer.from(res.data.audio!, 'hex'));
