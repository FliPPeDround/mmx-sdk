import dts from 'bun-plugin-dts';

await Bun.build({
  entrypoints: ['./src/sdk/index.ts'],
  outdir: './dist',
  plugins: [dts()], // 添加插件
});
