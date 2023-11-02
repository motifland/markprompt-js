import {
  ThemeConfig as BaseThemeConfig,
  Options,
} from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import type { ThemeConfig } from '@markprompt/docusaurus-theme-search';
import dotenv from 'dotenv';
import { themes } from 'prism-react-renderer';

const darkCodeTheme = themes.dracula;
const lightCodeTheme = themes.github;

dotenv.config();

const config: Config = {
  title: 'Markprompt demo',
  tagline: 'Markprompt in Docusaurus',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-production-site.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  themes: ['@markprompt/docusaurus-theme-search'],

  // Markprompt globals, used for link mapping functions.
  clientModules: [require.resolve('./src/markprompt-config.js')],

  presets: [
    [
      'classic',
      {
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    markprompt: {
      // Set the project key here, on in a `.env` file. You can obtain
      // the project key in the Markprompt dashboard, under
      // project settings.
      projectKey: 'YOUR-PROJECT-KEY',
      trigger: { floating: true },
      search: {
        enabled: false,
      },
    },
    navbar: {
      title: 'Markprompt',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          href: 'https://github.com/motifland/markprompt-js/blob/main/examples/with-docusaurus',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      copyright: `Copyright © ${new Date().getFullYear()} Markprompt. Built with Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  } satisfies BaseThemeConfig & ThemeConfig,
};

export default config;
