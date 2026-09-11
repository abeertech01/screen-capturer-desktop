const { app, BrowserWindow } = require("electron")

// Is the app ready and initialized ? Show the app window
app.whenReady().then(() => {
  const window = new BrowserWindow()
  window.loadFile("index.html")
})
