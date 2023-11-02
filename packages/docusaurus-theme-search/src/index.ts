import { type PluginModule } from '@docusaurus/types';
import type { MarkpromptProps } from '@markprompt/react';

declare namespace themeSearchMarkprompt {
  export type MarkpromptConfig = MarkpromptProps;

  export interface ThemeConfig {
    markprompt?: MarkpromptConfig;
  }
}

// eslint-disable-next-line no-redeclare
const themeSearchMarkprompt: PluginModule = () => ({
  name: '@markprompt/docusaurus-theme-search',
  getThemePath: () => '../dist/theme',
  getTypeScriptThemePath: () => '../src/theme',
  getSwizzleComponentList: () => ['SearchBar'],
});

themeSearchMarkprompt.validateThemeConfig = (data) => {
  return data.themeConfig;
};

export default themeSearchMarkprompt;
