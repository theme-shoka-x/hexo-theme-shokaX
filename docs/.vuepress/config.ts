import navbar from './nav/navbar'
import sidebar from './nav/sidebar'
import {defaultTheme, defineUserConfig} from 'vuepress'
// @ts-ignore
import { sitemapPlugin } from "vuepress-plugin-sitemap2";

export default defineUserConfig({
    plugins: [
        sitemapPlugin({
            hostname: "https://docs.kaitaku.xyz"
        })
    ],
    lang: 'zh-CN',
    title: 'Hexo-theme-ShokaX',
    description: '基于 shoka 的高度可定制现代hexo主题，简洁、高效、易用。',
    head: [['meta',{name: "baidu-site-verification",content: "codeva-8HEN8ONW9G"}]],
    theme: defaultTheme({
        repo: "zkz098/hexo-theme-shokaX",
        navbar: navbar,
        lastUpdated: true,
        contributors: true,
        sidebar: sidebar,
        docsDir: 'docs',
        editLinkText: '在 GitHub 上编辑此页'
    })
})