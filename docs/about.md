# ShokaX简介
## 介绍
ShokaX 是 Shoka 的一个二次开发版，提供了更高的性能、更多的功能、更现代的代码

## 开发原因
ShokaX的开发原因经历了很多个阶段:
最开始的目的仅仅是解决puppeteer安装和ES6+代码无法压缩问题，所以[HRMNMI](https://github.com/zkz098/hexo-renderer-multi-next-markdown-it)诞生了

后续发现shoka长时间未更新导致积压大量issues，且架构老旧带来了以下问题:
1. shoka的主要代码仍然基于es5，这让shoka能够兼容ie11，但也为后续维护带来了极大的阻力
2. shoka使用了js原生DOM实现操作，这影响了代码可读性和性能
3. shoka整体和jsdelivr是捆绑的，这导致了jsdelivr无法正常运行时95%的shoka站点也会跟着炸掉
4. shoka的page js几乎没有注释，这进一步增加了维护难度

这时，shokaX便诞生了，shokaX使用ES6+(甚至ES8+)和typescript解决了第一个问题 \
后续的Vue版本尝试解决了第二个问题，第三个问题则在shoka-fork时期便已解决

第四个问题在shokaX前期几乎无解，因为shoka的代码较为难以理解(我太逊了)，而又没有工具能解决 \
在2023年这个问题得到解决，因为ChatGPT成功为shokaX提供了近90%的注释(仅限pagejs)
可以说shokaX在这之后才是一个"基于shoka开发的主题"，而非"shoka的魔改版"

shoka主题有很多魔改，这些魔改多半以修改文件的形式进行，但对于shokaX这种更新频率来说，这样显然过于麻烦 \
因此，shokaX参照NexT Inject制作了ShokaX Inject 并鼓励社区发布插件。诚然，Inject还存在很多问题，但现在至少可以让60%的shoka魔改无缝转换为shokaX Plugin

当然，shokaX的故事才刚刚开始，我们欢迎任何人来shokaX反馈问题/提起PR，或者在讨论区闲聊