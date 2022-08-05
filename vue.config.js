const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5030',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
      }
    }
  }
})
