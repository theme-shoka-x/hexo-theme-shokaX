# 📣 公告
[你的 ShokaX 和 Shoka 站点可能正在遭遇供应链攻击](https://github.com/theme-shoka-x/hexo-theme-shokaX/discussions/293) \
[关于 ShokaX 部署平台和 Astro 迁移的调查](https://github.com/theme-shoka-x/hexo-theme-shokaX/discussions/229)

# hexo-theme-shokaX
![LICENSE](	https://img.shields.io/github/license/theme-shoka-x/hexo-theme-shokaX)
![stars](https://img.shields.io/github/stars/theme-shoka-x/hexo-theme-shokaX)
![version](https://shields.io/npm/v/hexo-theme-shokax)
![build](https://img.shields.io/github/actions/workflow/status/theme-shoka-x/hexo-theme-shokaX/build-theme.yml)

#### 语言(language): 简体中文 | [English](./README_en.MD) \
此项目是shoka的一个二次开发版(算精神续作),致力于提高性能和优化魔改体验 \
诞生原因是目前shoka已经三年没有更新了,积压了大量BUG和功能请求。

shokaX的社区资源导航和插件仓库为[awesome-shokaX](https://github.com/theme-shoka-x/awesome-shokaX)

## 💬 和shoka的区别
原先shoka使用了javascript+Native+nunjucks的技术 \
而shokaX则使用了typescript+Vue 3+Pug的技术搭配 \
更改了大量难以访问的CDN链接

## ✨ 功能清单 

|   功能名称   | 实现状态 |     功能名称     | 实现状态 |
|:--------:|:----:|:------------:|:----:|
|  PWA支持   |  ✅   |    JSD拆分     |  ✅   |
|  注入API   |  ✅   |    社区插件系统    |  ✅   |
|  自定义字体   |  ✅*  |    自定义样式     |  ✅*  |
| 多种评论系统支持 |  ✅   |   AI生成文章概括   |  🔬  |
|  底部备案号   |  ✅   |    自定义页尾     |  ✅*  |
| CSS渐变封面  |  ✅   | typescript支持 |  ✅   |

备注:
- *: 需要使用注入API实现
- 🔬: 实验中，可能存在问题


## 🔧 如何安装?
注意: 本项目需要 node.js 18.x 或更高版本才能运行 \
见文档中[如何安装](https://docs-hexo.shokax.top/getting-started/)部分

## 📚子项目
- [ShokaX docs](https://github.com/theme-shoka-x/shokaX-docs) ShokaX 主题文档 (正在编写中，欢迎加入！)
- [HRMNMI](https://github.com/theme-shoka-x/hexo-renderer-multi-next-markdown-it) ShokaX 正在使用的 markdown 渲染器 (等待重构)
- [ShokaX Pjax](https://github.com/theme-shoka-x/theme-shokax-pjax) ShokaX 提供的高效 Pjax 实现
- [ShokaX Anime](https://github.com/theme-shoka-x/theme-shokax-anime) ShokaX 提供的精简版 Anime.js 实现

# [许可证](https://github.com/theme-shoka-x/hexo-theme-shokaX/blob/main/LICENSE)
许可证: AGPL 3 or later

## 特别说明
AGPL许可证主要目的是限制修改后的分发行为，避免未经许可的二次修改封装商业行为 \
仅修改源代码**需要**开源，因为根据AGPL许可，搭建网站需要开源修改部分

## 使用特殊说明
依照AGPLv3 Section 7，我们添加了一些附加条款:
请查看[使用限制](./UsageRestrictions.md)，使用ShokaX则默认您已知晓此文件内容

# 致谢名单
## 开源项目
| 名称               | 作者                | 描述                 |
|:-----------------|:------------------|:-------------------|
| Hexo             | Hexo contributors | 为本项目提供了良好的基础       |
| hexo-theme-shoka | amehime           | 本项目的父主题            |

## 开发者们
Hexo 主题： \
[![](https://contributors-img.web.app/image?repo=theme-shoka-x/hexo-theme-shokaX)](https://github.com/theme-shoka-x/hexo-theme-shokaX/graphs/contributors) \
ShokaX 文档： \
[![](https://contributors-img.web.app/image?repo=theme-shoka-x/shokaX-docs)](https://github.com/theme-shoka-x/shokaX-docs/graphs/contributors) \

## 特别鸣谢
[<img src="https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.png" width="25%">](https://jb.gg/OpenSourceSupport)

## 其他信息
![Star history chart](https://api.star-history.com/svg?repos=theme-shoka-x/hexo-theme-shokaX&type=Date)
