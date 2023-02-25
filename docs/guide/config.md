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
:::: code-group
::: code-group-item github
```yaml
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
:::

::: code-group-item NPM(SXC)
```yaml
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
::::

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
### 配置流程
- 登录 [Algolia](https://www.algolia.com/) 官网，建议使用 Github/Google 账号注册/登录
- 进入 `Dashboard` - `Search` - `Index` 页面，选择上方 `+ Create Index` 创建索引，索引名称建议为 `shokaX`
- 进入 `Dashboard` - `Settings` - `API Keys` 页面，复制如下数据到上方配置中

| 页面数据                  | 对应配置          |
|:----------------------|:--------------|
| `Application ID`      | `appId`       |
| `Search-Only API Key` | `apiKey`      |
| `Admin API Key`       | `adminApiKey` |
| 创建的索引名                | `indexName`   |

- 在博客部署前运行 `hexo algolia` 上传索引，可在 `Dashboard` - `Search` - `Index` 页面中查看

:::warning
请勿将 `apiKey` 和 `adminApiKey` 混用，否则索引可能被攻击！
:::