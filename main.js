const {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  desktopCapturer,
  shell,
  Tray,
  nativeImage,
} = require("electron")
const path = require("node:path")
const fs = require("node:fs")
const os = require("node:os")

const appIcon = nativeImage.createFromPath(
  path.join(__dirname, "assets/camera.png"),
)

// Resize the single high-res source icon down to whatever size a given UI spot needs
function getIcon(size) {
  const icon = appIcon.resize({ width: size, height: size, quality: "best" })
  if (process.platform === "darwin") {
    icon.setTemplateImage(true)
  }
  return icon
}

// Is the app ready and initialized ? Show the app window
app.whenReady().then(() => {
  const window = new BrowserWindow({
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
    frame: false,
    transparent: true,
    show: false,
    icon: getIcon(256),
  })
  const tray = new Tray(getIcon(process.platform === "darwin" ? 22 : 16))
  tray.on("click", () => {
    if (window.isVisible()) {
      window.hide()
    } else {
      window.show()
    }
  })

  window.loadFile("index.html")

  ipcMain.on("capture-screen", async () => {
    const screenSize = screen.getPrimaryDisplay().workAreaSize
    const screens = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: {
        width: screenSize.width,
        height: screenSize.height,
      },
    })

    const img = screens[0].thumbnail.toPNG()
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const fileName = `screenshot-${timestamp}.png`
    const filePath = path.join(os.homedir(), fileName)

    fs.writeFile(filePath, img, (err) => {
      shell.openExternal(`file://${filePath}`)
    })
  })
})
