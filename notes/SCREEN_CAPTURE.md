## Screen Capture Mechanism

In order to capture screen we need two modules from `electron`. They are `screen` and `desktopCapturer`:

```js
const { ..., screen, desktopCapturer } = require("electron")
```

`screen` provides the screen information and `desktopCapturer` enables us to capture the screen.<br><br>

Now code the screen capturer feature in the main process:

```js
// main.js
const {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  desktopCapturer,
  shell,
} = require("electron")
const path = require("node:path")
const fs = require("node:fs")
......
...

app.whenReady().then(() => {
  ......
  ...
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
    const filePath = path.join(__dirname, fileName)

    fs.writeFile(filePath, img, (err) => {
      shell.openExternal(`file://${filePath}`)
    })
  })
})
```

## Creating Tray icon

The basic way to add a tray is this

```js
//main.js
const {..., Tray} = require("electron")

app.whenReady().then(() => {
  ...
  const iconPath = path.join(__dirname, "assets/camera.ico")
  const tray = new Tray(iconPath)
  tray.on("click", () => {
    if (window.isVisible()) {
      window.hide()
    } else {
      window.show()
    }
  })
})
```

To scale icon without manual resizing, here is how you do it:

```js
//main.js
const {..., Tray, nativeImage} = require("electron")
const path = require("node:path")

const appIcon = nativeImage.createFromPath(
  path.join(__dirname, "assets/camera.png")
)

function getIcon(size){
  const icon = appIcon.resize({width: size, height: size, quality: "best"})
  if(process.platform === "darwin") {
    icon.setTemplateImage(true)
  }
  return icon
}

app.whenReady().then(() => {
  const window = new BrowserWindow({
    ...,
    icon: getIcon(256)
  })
  const tray = new Tray(getIcon(process.platform === "darwin" ? 22 : 16))
  ...
})
```
