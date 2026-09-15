const {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  desktopCapturer,
  shell,
  Tray,
  nativeImage,
  Menu,
} = require("electron")
const path = require("node:path")
const fs = require("node:fs")
const os = require("node:os")

const appIcon = nativeImage.createFromPath(
  path.join(__dirname, "assets/camera.png"),
)

// Resize the single high-res source icon down to whatever size a given UI spot needs.
// `template: true` marks it as a macOS template image (auto-tinted mono icon) - only
// appropriate for the tray, not the Dock/window icon, which should stay full color.
function getIcon(size, { template = false } = {}) {
  const icon = appIcon.resize({ width: size, height: size, quality: "best" })
  if (template && process.platform === "darwin") {
    icon.setTemplateImage(true)
  }
  return icon
}

// Is the app ready and initialized ? Show the app window
app.whenReady().then(() => {
  // BrowserWindow's `icon` option doesn't drive the macOS Dock icon in dev mode - set it explicitly
  if (process.platform === "darwin") {
    app.dock.setIcon(getIcon(512))
  }

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
  const tray = new Tray(
    getIcon(process.platform === "darwin" ? 22 : 16, { template: true }),
  )
  tray.on("click", () => {
    if (window.isVisible()) {
      window.hide()
    } else {
      window.show()
    }
  })

  const menuTemplate = [
    {
      label: "Quit",
      click: () => {
        app.quit()
      },
    },
  ]
  const contextMenu = Menu.buildFromTemplate(menuTemplate)
  tray.setContextMenu(contextMenu)

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
