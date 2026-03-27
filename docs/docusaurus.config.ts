import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'ResultSafe',
  tagline: 'Functional Result type for TypeScript',
  favicon: 'img/favicon.ico',

  // Production URL
  url: 'https://resultsafe.github.io',
  baseUrl: '/resultsafe/',

  // GitHub Pages
  organizationName: 'resultsafe',
  projectName: 'resultsafe',

  // Error handling
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // i18n - Multi-language support
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    localeConfigs: {
      en: {
        htmlLang: 'en-US',
      },
      ru: {
        htmlLang: 'ru-RU',
      },
    },
  },

  // Presets
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/resultsafe/resultsafe/tree/main/docs/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false, // Disable blog for now
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  // Theme configuration
  themeConfig: {
    navbar: {
      title: 'ResultSafe',
      logo: {
        alt: 'ResultSafe Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/resultsafe/resultsafe',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/docs/introduction/overview',
            },
            {
              label: 'API',
              to: '/docs/api/core-fp-result',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/resultsafe/resultsafe',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Denis Savasteev. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['typescript', 'javascript', 'bash', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
