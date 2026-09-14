const { app, BrowserWindow, ipcMain } = require("electron")

// Is the app ready and initialized ? Show the app window
app.whenReady().then(() => {
  const window = new BrowserWindow({
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
    frame: false,
    transparent: true,
  })
  window.loadFile("index.html")

  ipcMain.on("capture-screen", () => {
    console.log("Handling capture screen message.")
  })
})
