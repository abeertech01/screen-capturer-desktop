To let the end users to use the product, we have to make it ready for production.

Install `electron-builder` = `npm install --save-dev electron-builder`

Now you gotta write a build property in the `package.json` file and then add a build command in the `scripts` property:

```json
{
  ...,
  "scripts": {
    ...
    "build": "electron-builder"
  },
  "build": {
    "appId": "com.aa.screencapturer",
    "productName": "Screen Capturer",
    "files": ["**/*"],
    "directories": {
      "output": "dist"
    }
  }
}
```
