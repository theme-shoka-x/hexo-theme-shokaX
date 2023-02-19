# 更多配置
## 文件压缩
此功能为 ShokaX 自带 MD 渲染器的一部分，参考自hexo-neat。
css使用css-clean压缩，js使用terser压缩，可参考对应API进行配置
```yaml
minify:
  html:
    enable: true
    exclude: # 排除 hexo-feed 用到的模板文件
      - '**/json.ejs'
      - '**/atom.ejs'
      - '**/rss.ejs'
  css:
    enable: true
    exclude:
      - '**/*.min.css'
  js:
    enable: true
    mangle:
      toplevel: true #如果js压缩错误请删除此行
    output:
    compress:
      ecma: 2018
    exclude:
      - '**/*.min.js'
```

## feed 生成
此部分对feed文件进行配置，生成`rss`、`atom`、`feed.json`等文件
