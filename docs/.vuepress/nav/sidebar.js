export default {
    '/guide/': [
        {
            text: "使用指南",
            collapsible: true,
            children: [
                {text: "快速上手",link: "/guide/"},
                {text: "更多配置",link: "/guide/config.html"},
                {text: "主题配置",link: "/guide/theme.html"},
                {text: "评论系统",link: "/guide/comment.html"},
                {text: "内容模块",link: "/guide/tags.html"}
            ]
        },
        {
            text: "迁移指南",
            collapsible: true,
            children: [
                {text: "从shoka迁移",link: "/guide/shoka.html"}
            ]
        },
        {
            text: "最佳实践",
            collapsible: true,
            children: [
                {text: "性能优化",link: "/guide/performance.html"}
            ]
        }
    ],
  '/develop/': [
    {
      text: "开发指南",
      collapsible: true,
      children: [
        {text: "快速上手",link: "/develop/basic/"}
      ]
    },
    {
      text: "API指南",
      collapsible: true,
      children: [
        {text: "术语表及说明",link: "/develop/interface/"}
      ]
    }
  ]
}