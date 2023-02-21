# 主题配置
## 基础配置
### 静态资源和标题
`alternate`为站点大标题(比title高一级，但仅在index显示)

```yaml
statics: "/" # 静态文件根目录，可用于CDN加速
assets: "assets" # 图片资源存放目录
css: "css" # css存放目录(不建议改动)
js: "js" # js存放目录(不建议改动)
```

### 实验性特性
#### PWA
:::tip
PWA功能较为复杂且需要一些时间，早期站点搭建时可以先忽略
:::
PWA是Progressive Web Apps的缩写，可以为web应用提供类似于原生应用的体验
配置如下:
```yaml
pwa:
  enable: false # 开启PWA功能
  serviceworker: sw.js #serviceworker脚本位置,使用以/为基准的绝对路径
  manifest: manifest.json #manifest位置,使用以/为基准的绝对路径
```
serviceworker可查看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers)以获取帮助 \
manifest可查看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/Manifest)获取帮助 \
建议将上述文件放置于assets或source(hexo根目录)下以方便定位