const path = require("path");
const { app, BrowserWindow } = require("electron");
require("@electron/remote/main").initialize();
if (require("electron-squirrel-startup")) {
  app.quit();
}

const isDev = process.env.IS_DEV === "true";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true, // 如果为false，则不能访问 Node.js 模块
      contextIsolation: false, // 如果为true，则需要在 preload 中使用 contextBridge
      enableRemoteModule: true, //开启remote模块
    },
  });
  require("@electron/remote/main").enable(mainWindow.webContents);
  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
