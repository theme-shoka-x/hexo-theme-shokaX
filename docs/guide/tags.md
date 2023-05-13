# 文章内嵌标签
## Hexo标签
### links(链接块)
此标签用于以富媒体形式表现某链接，可用于友链、网站分享和功能合集等 \
配置格式如下:
```yaml
- site: # 主标题
  owner: # 站点所有者(选填)
  url: # 站点链接
  desc: # 站点描述(选填)
  image: # 站点图像(选填)
  color: # 站点颜色(选填)
```
- `color`: 需要使用双引号包裹，值为大写的16进制颜色代码

在文章中使用:
:::: code-group
::: code-group-item 文章内嵌
```text
{% links %}
- site: # 主标题
  owner: # 站点所有者(选填)
  url: # 站点链接
  desc: # 站点描述(选填)
  image: # 站点图像(选填)
  color: # 站点颜色(选填)
# 多链接参考yaml列表格式
{% endlinks %}
```
:::
::: code-group-item 外部文件
```text
# path为一个yaml文件
{% linksfile [path] %}
```
示例文件:
```yaml
- site: # 主标题
  owner: # 站点所有者(选填)
  url: # 站点链接
  desc: # 站点描述(选填)
  image: # 站点图像(选填)
  color: # 站点颜色(选填)
```
:::
::::