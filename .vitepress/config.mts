import { defineConfig } from "vitepress";
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "YanRongShi",
  description: "yanrongshi's blog",
// 设置 head
  head: [
    ['link', { rel: 'icon', href: '/img/ppr.png' }], // 设置 favicon
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'blog', link: '/blog' },
      { text: 'Examples', link: '/blog/markdown-examples' },
      { text: 'brok', link: '/book'}
    ],

    sidebar:
      {
        '/blog/': [
          {
            text: '2021',
            collapsed: false,
            items: [
              { text: 'OCP 镜像仓库调研', link: '/blog/ocp_image_registry'},
              { text: 'kubean 使用', link: '/blog/kubean'},
              // { text: 'Two', link: '/guide/two' }
            ]
          }
        ]
      },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yanrongshi' }
    ],

      footer: {
        message: 'Powered by VitePress and <a href="https://samzong.me/" target="_blank">samzong</a>',
      },
      search: {
        provider: "local",
        options: {
          translations: {
            button: {
              buttonText: "Search",
              buttonAriaLabel: "Search",
            },
            modal: {
              noResultsText: "No results found",
              resetButtonTitle: "Reset search",
              footer: {
                selectText: "to select",
                navigateText: "to navigate",
              },
            },
          },
        },
      }
  }
  
})
