module.exports = {
  lintOnSave: true,
    // 所有 webpack-dev-server 的选项都支持。
    devServer: {
      host: "localhost",
      port: 8080, // 端口号
      https: false,
      open: true, //配置自动启动浏览器
      // 配置多个代理
      proxy: {
        "/FY": {
          target: "http://api.fanyi.baidu.com/api/trans/vip/translate",
          changeOrigin: true,
          pathRewrite: {
            "^/FY": "" // 去掉接口地址中的api字符串
          }
        }
      }
    }
}
