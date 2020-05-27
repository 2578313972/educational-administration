const path = require('path');//引入path模块
function resolve(dir) {
  return path.join(__dirname, dir)//path.join(__dirname)设置绝对路径
}
module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
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
  },
  chainWebpack: (config) => {
    console.log(config);
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('paper', resolve('./src/components/makePapers')) // 试卷路径
    //set第一个参数：设置的别名，第二个参数：设置的路径
  },
}
