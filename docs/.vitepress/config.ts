import navbar from './nav/navbar'
import sidebar from './nav/sidebar'
import {defineConfig} from 'vitepress'

export default defineConfig({
    lang: 'zh-CN',
    title: 'Hexo-theme-ShokaX',
    description: '基于 shoka 的高度可定制现代hexo主题，简洁、高效、易用。',
    themeConfig: {
        nav: navbar,
        sidebar: sidebar,
        editLink: {
            pattern: 'https://github.com/zkz098/hexo-theme-shokaX/edit/main/docs/:path',
            text: '在 GitHub 上编辑此页'
        },
        socialLinks: [
            {icon: 'github', link: 'https://github.com/zkz098'}
        ],
        footer: {
            message: 'GPL 3 or later Licensed',
            copyright: 'Copyright © 2022-present zkz098 <a href="https://beian.miit.gov.cn/" target="_blank">津ICP备2022001375号</a><br /><a href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=12011402001353"  target="_blank">津公网安备 12011402001353号</a>'
        }
    },
    lastUpdated: true
})