import navbar from './nav/navbar'
import sidebar from './nav/sidebar'
import {defaultTheme, defineUserConfig} from 'vuepress'
// @ts-ignore
import { sitemapPlugin } from "vuepress-plugin-sitemap2"
// @ts-ignore
import { docsearchPlugin } from '@vuepress/plugin-docsearch'

export default defineUserConfig({
    plugins: [
        sitemapPlugin({
            hostname: "https://docs.kaitaku.xyz"
        }),
        docsearchPlugin({
          apiKey: 'c30c4d59605d21483f6b76cdde63ce96',
          appId: 'MTVNNUDZBE',
          indexName: 'kaitaku',
          placeholder: '请输入您需要搜索的内容',
          translations: {
            button: {
              buttonText: '搜索文档'
            }
          }
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