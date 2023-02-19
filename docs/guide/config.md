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
:::tip
一般情况选择`npm(SXC) origin`即可，如果是github源安装则需要使用`github origin`
:::
::: code-group
```yaml [github origin]
feed:
  limit: 20
  order_by: "-date"
  tag_dir: false
  category_dir: false
  rss:
    enable: true
    template: "themes/shokaX/layout/_alternate/rss.ejs"
    output: "rss.xml"
  atom:
    enable: true
    template: "themes/shokaX/layout/_alternate/atom.ejs"
    output: "atom.xml"
  jsonFeed:
    enable: true
    template: "themes/shokaX/layout/_alternate/json.ejs"
    output: "feed.json"
```

```yaml [npm(SXC) origin]
feed:
  limit: 20
  order_by: "-date"
  tag_dir: false
  category_dir: false
  rss:
    enable: true
    template: "node_modules/hexo-theme-shokax/layout/_alternate/rss.ejs"
    output: "rss.xml"
  atom:
    enable: true
    template: "node_modules/hexo-theme-shokax/layout/_alternate/atom.ejs"
    output: "atom.xml"
  jsonFeed:
    enable: true
    template: "node_modules/hexo-theme-shokax/layout/_alternate/json.ejs"
    output: "feed.json"
```
:::

## algolia搜索
此部分为站内搜索配置
```yaml
algolia:
  appId: #Your appId
  apiKey: #Your apiKey
  adminApiKey: #Your adminApiKey
  chunkSize: 5000
  indexName: #"shokaX"
  fields:
    - title #必须配置
    - path #必须配置
    - categories #推荐配置
    - content:strip:truncate,0,2000
    - gallery
    - photos
    - tags
```
自行参考algolia官网填入即可
:::info
如果您对于algolia搜索配置流程有印象，可以编辑此文档
:::