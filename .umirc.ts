import { defineConfig } from 'dumi';

export default defineConfig({
  devServer: {
    port: 8002,
  },
  title: 'magic-videoplayer',
  mode: 'site',
  description: '基于React的UI组件库',
  theme: {
    '@primary-color': '#1e66eb', //test
    '@c-primary': '#47a5dc', //test
    //test  "@c-primary": "#47a5dc",
  },
  hash: true,
  // ignoreMomentLocale: true,
  inlineLimit: 1000000,
  // mfsu: {
  //   development : {
  //     output : "./.mfsu-dev",
  //   },
  //   // production : {
  //   //   output : "./mfsu-prod",
  //   // }
  // }

  // 更多配置: https://d.umijs.org/config
});
