module.exports = {
  productionSourceMap: false,
  //关闭eslint
  lintOnSave: false,
  devServer: {
    open:true,
    host: 'localhost',
    port: 8080,
    proxy: {
      "/api": {
        target: "http://gmall-h5-api.atguigu.cn",
        // pathRewrite: { '^/api': '' },
      },
    },
  },
};
