# hexo-theme-shokaX
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fzkz098%2Fhexo-theme-shokaX.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fzkz098%2Fhexo-theme-shokaX?ref=badge_shield)
![LICENSE](	https://img.shields.io/github/license/zkz098/hexo-theme-shokaX)
![stars](https://img.shields.io/github/stars/zkz098/hexo-theme-shokaX)
![version](https://shields.io/npm/v/hexo-theme-shokax)

语言(language): 简体中文 | [English](https://github.com/zkz098/hexo-theme-shokaX/blob/main/README_en.MD) \
此项目是shoka的一个二次开发版(算精神续作),致力于提高性能和优化魔改体验 \
诞生原因是目前shoka已经两年没有更新了,积压了大量BUG和功能请求。\
本项目处于高强度开发期,但github仓库版本已基本可用 \
二次开发与常见问题请看wiki \
`0.0.2-alpha2`开始,`lantern`和`qweather`已迁移为插件

shokaX的社区资源导航和插件仓库为[awesome-shokaX](https://github.com/zkz098/awesome-shokaX)

## 💬 和shoka的区别
原先shoka使用了javascript+Native+nunjucks的技术 \
而shokaX则使用了typescript+Vue 3+Pug的技术搭配 \
图标库可能会更换为Font Awesome 6 \
更改了大量难以访问的CDN链接

## ✨ 功能清单 

|   功能名称   | 实现状态 |     功能名称     | 实现状态 |
|:--------:|:----:|:------------:|:----:|
|  PWA支持   |  ✅   |    JSD拆分     |  ✅   |
|  注入API   |  ✅   |    社区插件系统    |  ✅   |
|  自定义字体   |  ✅*  |    自定义样式     |  ✅*  |
| 多种评论系统支持 |  ✅   |   用户行为分析支持   |  ✅   |
|  底部备案号   |  ✅   |    自定义页尾     |  ✅*  |
| CSS渐变封面  |  ✅   | typescript支持 |  ✅^  |

备注:
- *: 需要使用注入API实现
- ^: 仅page js部分,hexo script未实现


## 🔧 如何安装?
建议使用[ShokaX-CLI](https://github.com/zkz098/shokaX-CLI) ,执行下列命令即可:
```bash
npm i shokax-cli --location=global
# hexo init 初始化环境
SXC install shokaX
```
后续配置请点[这里](https://www.kaitaku.xyz/webbuild/shokaX/) 查看

releases及npm的版本号区别如下:
- x.x.x-alpha版本是早期测试版,部分未经测试环境测试,不能保证正常运行
- x.x.x-beta(目前还没有)是测试版,可以保证正常生成,但可能存在bug
- x.x.x是相对稳定的版本,基本上不存在严重BUG

github仓库建议通过右边的 releases 下载,步骤为:
- 点击 Releases 的 Latest 版本
- 下载 Assets 中的 `Source code(zip)`
- 解压即可作为主题使用
# 许可证
许可证: BSD-3-Clause \
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fzkz098%2Fhexo-theme-shokaX.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fzkz098%2Fhexo-theme-shokaX?ref=badge_large)

# 致谢名单
## 开源项目
| 名称               | 作者                | 描述                 |
|:-----------------|:------------------|:-------------------|
| Hexo             | Hexo contributors | 为本项目提供了良好的基础       |
| hexo-theme-shoka | amehime           | 本项目的父主题            |

## 贡献者
| 名称         | 站点                         | 描述                     |
|:-----------|:---------------------------|:-----------------------|
| Lavender   | https://www.lavenderdh.cn/ | 提供了大量shoka主题的魔改        |
| AdminZhang | https://www.a9-9.top/      | 为本项目提供了大量想法并进行了DEBUG工作 |

