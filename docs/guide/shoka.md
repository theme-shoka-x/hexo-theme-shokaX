# 从shoka迁移
## 重新安装主题
先卸载`hexo-renderer-multi-markdown-it`
随后运行SXC安装主题
:::: code-group
::: code-group-item npm
```shell
# hexo init
npm install shokax-cli --location=global
# cd your_blog
SXC install shokaX
```
:::

::: code-group-item pnpm
```shell
# hexo init
pnpm add shokax-cli --location=global
# cd your_blog
SXC install shokaX
```
:::
::::

## 配置修改
首先，建议使用`_config.shokaX.yml`而非直接修改主题`_config.yml` \
这样可以防止因缺少配置导致的生成报错
### seo类
原先的搜索引擎验证已迁移为如下配置：
```yaml
seo: # 下方直接填入对应meta的content即可
  bing:
  google:
  yandex:
  baidu:
```
百度统计迁移为如下：
```yaml
visitor:
  baiduAnalytics: # 百度统计代码中的?后部分
```

### 评论系统
shokaX不再支持minivaline评论系统，建议迁移到[waline](./comment.md#valine系评论系统)

twikoo等评论系统也提供了迁移工具，可以自行选择

### 基础配置
```yaml
# assets代替了之前的image选项
assets: "assets"
```
:::tip
截止0.1.8中，ShokaX的advVendors和vendors是共存的，请不要删除这两个的任何一个
:::

ShokaX提供了官方的ICP及网安备案配置：
```yaml
footer:
  icp: # ICP备案
  enable: false
  icon: "beian.webp" #网安备案图片
  icpnumber: "xxx" # ICP备案号
  beian: "xxx" # 网安备案号
  recordcode: "xxx" # 网安备案链接中的recordcode参数
```

## 其他修改
### 技术修改
ShokaX将模板从njk更改为了pug，这可能会对具有大量魔改的shoka站点迁移产生困扰。

同时，ShokaX的page js部分使用了typescript。所以在修改代码后请自行编译，否则改动不会生效。

### 页面修改
ShokaX不会自动生成`404.html`，需要在source目录下手动放置404.md以生成404页面