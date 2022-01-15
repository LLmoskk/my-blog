// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'LLmoskk blog',
  url: 'https://llmoskk.vercel.app/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'LLmoskk', // Usually your GitHub org/user name.
  projectName: 'my-blog', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        blog: {
          blogSidebarTitle: '全部博文',
          blogSidebarCount: 0,
          path: './blog',
          routeBasePath: '/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'LLmoskk',
        logo: {
          src: 'img/logo.svg',
        },
        items: [
          { to: '/', label: 'Blog', position: 'left' },
          {
            href: 'https://github.com/LLmoskk',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      // algolia: {
      //   apiKey: "fabfb0e9997e101154ed85d64b7b6a3c",
      //   indexName: "ZXUQIANCN",
      //   appId: "LIJMO3C9C4",
      // },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} LLmoskk`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
