const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // transpileDependencies: true
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://quantapi.51ifind.com/api/v1/', //mock API接口系统
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '/api': ''  //默认所有请求都加了jeecg-boot前缀，需要去掉
        }
      },
      // '/word2pdf': {
      //   target: 'http://mirror1.convertonlinefree.com', // 请求
      //   ws: false,
      //   changeOrigin: true
      // }
    },
    client: {
      // webSocketURL: 'wss://0.0.0.0:8080/ws',
      overlay: false
    },
    
  }

})
