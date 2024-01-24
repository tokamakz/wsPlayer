export default {
  esm: {
    type: 'babel',
    mjs: true,
  },

  lessInBabelMode: true, // import './index.less'; =>  import './index.css';
  // 配置额外的 babel plugin
  extraBabelPlugins: [
    [
      require.resolve('babel-plugin-module-resolver'), // 将 @ 转换为对应路径
      {
        root: ['./'],
        alias: {
          '@': './es',
        },
      },
    ],
  ],
};
