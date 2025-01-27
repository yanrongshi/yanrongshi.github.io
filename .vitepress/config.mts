import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "YanRongShi",
  description: "yanrongshi's blog",
// 设置 head
  head: [
    ['link', { rel: 'icon', href: '/me.jpg' }], // 设置 favicon
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/blog/about' },
      { text: 'Examples', link: '/blog/markdown-examples' }
    ],

    sidebar: [
      {
        text: '目录',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yanrongshi' }
    ]
  }
})
