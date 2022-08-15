const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    proxy: {
      '/api': {
        target: 'http://mharry.eastasia.cloudapp.azure.com:8080',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
      }
    }
  }
})
