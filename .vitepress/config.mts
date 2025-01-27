import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "测试是否自动构建",
  description: "ppr测试描述",
// 设置 head
  head: [
    ['link', { rel: 'icon', href: '/me.jpg' }], // 设置 favicon
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'github', link: 'https://github.com/yanrongshi' },
      { text: 'Examples', link: '/blog/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'baidu.com' }
    ]
  }
})
