const { dependencies } = require('./package.json');

module.exports = {
  configureWebpack: {
    // Webpack configuration applied to web builds and the electron renderer process
  },
  pluginOptions: {
    electronBuilder: {
      externals: [...Object.keys(dependencies)],
      nodeIntegration: true,
      builderOptions: {
        "appId": "io.github.onlyeat3.show-keys",
        "productName": "show-keys",//项目名，也是生成的安装文件名，即aDemo.exe
        "copyright": "Copyright © 2021 onlyeat3. All rights reserved.",//版权信息
        "directories": {
          "output": "./dist_electron"//输出文件路径
        },
        extraResources: {
          "from": 'src/assets',
          to: './'
        },
        "win": {//win相关配置
          "target": [
            {
              "target": "nsis",//利用nsis制作安装程序
              "arch": [
                "x64"//64位
              ]
            }
          ]
        },
        "nsis": {
          "oneClick": false, // 是否一键安装
          "allowElevation": true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          "allowToChangeInstallationDirectory": true, // 允许修改安装目录
          "createDesktopShortcut": true, // 创建桌面图标
          "createStartMenuShortcut": true,// 创建开始菜单图标
          "shortcutName": "show-keys", // 图标名称
          artifactName: "show-keys-installer.exe",
          deleteAppDataOnUninstall: true
        },
      }
    }
  }
}