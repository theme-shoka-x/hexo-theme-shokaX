# 二次开发
## 在开始之前...
本教程仅提供与ShokaX有关的Hexo开发知识、代码示例和API调用文档，因此，在开始之前，你应该会:
- 编写并运行一个Javascript/Typescript脚本
- 了解基础的Node.js知识(例如import和npm)
- 自行配置一个适合自己的IDE环境
- 会使用git和github进行一些基础操作

此文档的一些阅读须知:
- `<type>`代表此值必填，不需要保留尖括号，直接用值替换即可，需要符合Type(遵循typescript类型标准)
- `[--depth=1]`代表此值/选项可选，不需要保留方括号

## 克隆代码库
我建议你使用fork功能以便储存更改/发起PR，在仓库的右上角有一个fork按钮，点击之后进入你fork的仓库，随后:
```bash
git clone <string> # 此处为你的fork地址
```

然后请确保你已经安装了`pnpm`包管理器，随后:
```shell
pnpm install
pnpm run build
```
如果`build`未抛出错误，则仓库完整且可以用于开发

## 开发须知
### 目录结构
ShokaX的目录结构(仅包含对开发重要的部分)如下:
```text
|- .github # issues模板、CI工作流等存储位置
|- docs # 文档储存位置，使用vuepress
|- languages # 国际化文件储存位置
|- layout # 模板储存位置
|- scripts # hexo脚本储存位置
|- source # 前端文件位置
- package.json # npm包json
- tsconfig.json # typescript编译配置
- .eslintrc.cjs # eslint配置
- _config.yml # hexo主题配置文件
```

### 调试注意事项
1. hexo不会自动排除typescript文件，因此在build后复制到themes文件时应手动删除`*.ts`文件，linux可使用`find . -type f -name "*.ts" -delete`批量删除

### 代码注意事项
1. `source/js`目录不能使用hexo的辅助函数和node库，`scripts`目录不能使用`source/js`的函数
2. 注意ESM和CJS的区别，对于仅支持CJS的模块应使用`import xxx = require('xxx')`的形式，否则tsc后无法正常生成文件
3. 尽可能少使用`@ts-ignore`，一般除去部分遗留代码和types有问题的代码外不应出现`@ts-ignore`
4. 较通用的 interface 和 declare 应写在`library.ts`中，如果仅在一个文件中出现则写在对应文件中即可
5. 写注释，特别是奇怪的代码(例如魔法数字和神奇的正则)。对于正则表达式应提供一个示例以便理解

剩余部分正在编写