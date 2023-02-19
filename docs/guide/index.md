# 快速上手
## 在开始之前
在开始之前，你应该已经安装了如下软件:
- nodejs 16以上
- hexo-cli 的 latest 版本

ShokaX-CLI 目前版本不负责处理 hexo 环境，请自行`hexo init`

## 安装主题
### 使用ShokaX-CLI
安装 ShokaX-CLI:
::: code-group
```shell [npm]
# hexo init
npm install shokax-cli --location=global
# cd your_blog
SXC install shokaX
```

```shell [pnpm]
# hexo init
pnpm install shokax-cli --location=global
# cd your_blog
SXC install shokaX
```
:::
:::tip
SXC默认从npm安装主题，如果自定义的部分较多可以从github安装:
`SXC install -r=github shokaX`
:::

### 手动安装

:::warning
ShokaX不建议使用手动安装，仅应该在SXC无法正常安装的时候手动安装
:::

指令如下:
::: code-group
```shell [npm]
npm i hexo-theme-shokax
npm i hexo-renderer-multi-next-markdown-it
npm i hexo-autoprefixer
npm i hexo-algoliasearch
npm i hexo-feed
```

```shell [yarn]
yarn add hexo-theme-shokax
yarn add hexo-renderer-multi-next-markdown-it
yarn add hexo-autoprefixer
yarn add hexo-algoliasearch
yarn add hexo-feed
```

```shell [pnpm]
pnpm i hexo-theme-shokax
pnpm i hexo-renderer-multi-next-markdown-it
pnpm i hexo-autoprefixer
pnpm i hexo-algoliasearch
pnpm i hexo-feed
```
:::

## 配置主题
:::tip
更改根目录`_config.yml`中的`theme`为`shokaX`(SXC默认origin或npm安装修改为`shokax`) \
请注意,本主题仅在npm上使用的是`shokax`,其他情况下均为`shokaX`
:::

markdown配置如下:
```yaml
markdown:
  render: # 渲染器设置
    html: false # 过滤 HTML 标签
    xhtmlOut: true # 使用 '/' 来闭合单标签 （比如 <br />）。
    breaks: true # 转换段落里的 '\n' 到 <br>。
    linkify: true # 将类似 URL 的文本自动转换为链接。
    typographer: 
    quotes: '“”‘’'
  plugins: # markdown-it 插件设置
    - plugin:
        name: markdown-it-toc-and-anchor
        enable: true
        options: # 文章目录以及锚点应用的 class 名称，shoka 主题必须设置成这样
          tocClassName: 'toc'
          anchorClassName: 'anchor'
    - plugin:
        name: markdown-it-multimd-table
        enable: true
        options:
          multiline: true
          rowspan: true
          headerless: true
    - plugin:
        name: ./markdown-it-furigana
        enable: true
        options:
          fallbackParens: "()"
    - plugin:
        name: ./markdown-it-spoiler
        enable: true
        options:
          title: "你知道得太多了"

autoprefixer:
  exclude:
    - '*.min.css'

```
停用默认代码高亮:
```yaml
highlight:
  enable: false

prismjs:
  enable: false
```


现在shokaX已经可以正常运行了,`hexo s`即可