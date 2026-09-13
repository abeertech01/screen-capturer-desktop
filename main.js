const { app, BrowserWindow } = require("electron")

// Is the app ready and initialized ? Show the app window
app.whenReady().then(() => {
  const window = new BrowserWindow({
    frame: false,
    transparent: true,
  })
  window.loadFile("index.html")
})
