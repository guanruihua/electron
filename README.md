# electron-app

An Electron application with React and TypeScript
<https://cn.electron-vite.org/guide/>

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## 直接渲染图片

```js
// 假设你有一个本地图片路径
const imagePath = 'C:\\Users\\YourName\\Pictures\\photo.jpg';

// 方式1：直接使用 file:// 协议
const fileUrl = 'file:///' + imagePath.replace(/\\/g, '/');
document.getElementById('preview').src = fileUrl;
```
