// vue.config.js
module.exports = {
  devServer: {
    host: "test.jiker.vip",
    open: true
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            rootValue: 37.5,
            propList: ['*']
          })
        ]
      }
    }
  }
}