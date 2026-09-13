progressed till = 24:10

## Tweaking the window

`new BrowserWindow()` takes a single options object (`BrowserWindowConstructorOptions`). Electron's docs list 60-70+, but you'll realistically touch only a small set of them in your regular use.<br>
Some of them are: width, height, x/y (screen position), minWidth/minHeight, maxWidth/maxHeight, resizable, maximizable, minimizable, title, icon, frame, alwaysOnTop, webPreferences (a nested object)...<br>

### What are in this project's use case

#### `new BrowserWindow({ frame: false,... })`

Setting it to `false` makes the frame gone. So, you can't have the top bar, where it has options to maximize/minimize or make it disappear.<br>
<img src="assets/frameless-ss.png" width="400" ><br>
So, how do we drag the window in this scenario?<br>
There is a cheeky way to do that in this situation — you can make any part of the the window able to drag the window. For example the window has a navbar (written in the html file or the frontend). Now add the `draggable` property:

```css
.navbar{
  ...
  -webkit-app-region: drag;
}
```

#### `new BrowserWindow({ transparent: true,... })`

Setting it to `true` makes the window transparent. So, you can see through the window and see the desktop or other apps behind it.<br>

<img src="assets/transparent-ss.png" width="400"><br>
