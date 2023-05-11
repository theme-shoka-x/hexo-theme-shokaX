此部分提供了ShokaX的typescript API以供参考
下面是标识的对应表(术语表):

|                          标识                           |   内容   |                 含义                  |
|:-----------------------------------------------------:|:------:|:-----------------------------------:|
|   <Badge type="tip" text="实验性" vertical="middle" />   | 实验性API |      此API正处于实验中，可能会在未来被删除或发生更改      |
|   <Badge type="tip" text="开发中" vertical="middle" />   | 开发中API |     此API会在某个计划版本发布，但截止文档更新时暂不可用     |
| <Badge type="warning" text="非标准" vertical="middle" /> | 非标准API | 此API并非ShokaX计划中的标准API接口，而是第三方支持的API |
| <Badge type="danger" text="已弃用" vertical="middle" />  | 弃用API  |        此API已被弃用，会在未来某个版本被删除         |

ShokaX API的可用分区:

|     名称      |         含义          | 可用分区                |
|:-----------:|:-------------------:|:--------------------|
| hexo script |   Hexo 生成脚本可用API    | scripts目录及插件        |
|   page ts   | 前端可用typescript API  | 注入时机在app.js之后的js/ts |
|  head api   |      前端可用基本API      | 任何运行在前端的代码          |
|   plugin    | 插件及ShokaX Utils API | 插件脚本中               |