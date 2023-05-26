import { type PluginModule } from '@docusaurus/types';
// @ts-ignore TypeScript doesn’t allows us to import types from an ESM file in a CJS file.
// Apart from that, TypeScript does recognize the type.
import type { RootProps } from '@markprompt/react';

declare namespace themeSearchMarkprompt {
  export type MarkpromptConfig = Omit<RootProps, 'children'>;

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

export = themeSearchMarkprompt;
