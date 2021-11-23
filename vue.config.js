
module.exports = {
  configureWebpack: {
    // Webpack configuration applied to web builds and the electron renderer process
  },
  pluginOptions: {
    electronBuilder: {
      externals: ['iohook'],
      nodeIntegration: true
    }
  }
}