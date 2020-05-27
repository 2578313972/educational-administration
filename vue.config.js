module.exports = {
  lintOnSave: false,
  // 所有 webpack-dev-server 的选项都支持。
  devServer: {
    port: 8080, // 端口号
    https: false,
    open: true, // 配置自动启动浏览器
    // 配置多个代理
    proxy: {
      '/api': {
        target: 'http://192.168.1.188:12',
        changeOrigin: true
        // pathRewrite: {
        //   "^/api": "" // 去掉接口地址中的api字符串
        // }
      }
    }
  }
}
