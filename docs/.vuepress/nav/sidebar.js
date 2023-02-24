export default {
    '/guide/': [
        {
            text: "使用指南",
            collapsible: true,
            children: [
                {text: "快速上手",link: "/guide/"},
                {text: "更多配置",link: "/guide/config"},
                {text: "主题配置",link: "/guide/theme"},
                {text: "评论系统",link: "/guide/comment"}
            ]
        },
        {
            text: "迁移指南",
            collapsible: true,
            children: [
                {text: "从shoka迁移",link: "/guide/shoka"}
            ]
        },
        {
            text: "最佳实践",
            collapsible: true,
            children: [
                {text: "性能优化",link: "/guide/performance"}
            ]
        }
    ]
}