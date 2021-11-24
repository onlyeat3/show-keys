'use strict'
import electron, { ipcMain, app, BrowserWindow, protocol, screen } from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import ioHook from 'iohook';
import path from 'path';
import keycode from 'keycode';
import utils from './utils'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import log from 'electron-log';

const isDevelopment = process.env.NODE_ENV !== 'production'


const Menu = electron.Menu;
const Tray = electron.Tray;
//托盘对象
var appTray = null;

function preventDragbarContext (win) {
  var WM_INITMENU = 0x116;//278
  win.hookWindowMessage(WM_INITMENU, function (e) {
    win.setEnabled(false);
    setTimeout(() => {
      win.setEnabled(true);
    }, 100);
    return true;
  })
}
ioHook.setDebug(false)
ioHook.useRawcode(true);
ioHook.start(false);

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let win = null;
async function createWindow () {
  // Create the browser window.
  let size = screen.getPrimaryDisplay().workAreaSize;
  let x = size.width * 0.1;
  let y = size.height * 0.8;
  let width = 300;
  let height = 80;
  /**
   * Initial window options
   */
  win = new BrowserWindow({
    height: height,
    useContentSize: true,
    width: width,
    titleBarStyle: 'hidden',
    frame: false,
    x: x,
    y: y,
    center: false,
    minWidth: width,
    minHeight: height,
    maxWidth: width,
    minHeight: height,
    resizable: false,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: true,
    fullscreen: false,
    fullscreenable: false,
    title: 'show-keys',
    skipTaskbar: true,
    transparent: false,
    hasShadow: true,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  //---- 设置-webkit-app-region:drag后需要处理右键菜单
  preventDragbarContext(win);

  //----系统托盘图标 begin------//
  //系统托盘右键菜单
  var trayMenuTemplate = [
    {
      label: '退出',
      click: function () {
        app.quit();
        app.quit();//因为程序设定关闭为最小化，所以调用两次关闭，防止最大化时一次不能关闭的情况
      }
    }
  ];
  let iconPath = '';
  //系统托盘图标目录
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // 测试环境
    iconPath = 'src/assets/logo.ico'
  } else {
    // 正式环境
    iconPath = path.join(path.dirname(app.getPath('exe')), 'resources/logo.ico');
  }
  appTray = new Tray(iconPath);//app.ico是app目录下的ico文件
  //图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

  //设置此托盘图标的悬停提示内容
  appTray.setToolTip('我的托盘图标');

  //设置此图标的上下文菜单
  appTray.setContextMenu(contextMenu);
  //单击右下角小图标显示应用
  appTray.on('click', function () {
    win.show();
  })

  win.on('close', (e) => {
    //回收BrowserWindow对象
    if (win.isMinimized()) {
      win = null;
    } else {
      e.preventDefault();
      win.minimize();
    }
  });
  //----系统托盘图标 end------//
  //监听按键
  let currentKeys = [];
  ioHook.on('keydown', (event) => {
    let keyName = utils.parseKeyName(event);
    if (keyName && currentKeys.indexOf(keyName) < 0) {
      currentKeys.push(keyName);
      win.webContents.send('current-keys-change', currentKeys);
    }
  });

  ioHook.on('keyup', (event) => {
    let keyName = utils.parseKeyName(event);
    if (keyName) {
      currentKeys.splice(currentKeys.indexOf(keyName), 1);
      win.webContents.send('current-keys-change', currentKeys);
    }
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
    win.webContents.openDevTools();
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  const { Menu } = require('electron');
  Menu.setApplicationMenu(null);
  // hide menu for Mac 
  if (process.platform == 'darwin') {
    app.dock.hide();
  }
  createWindow()
})


app.on('before-quit', () => {
  // 卸载iohook监听
  ioHook.unload();
  ioHook.stop();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
