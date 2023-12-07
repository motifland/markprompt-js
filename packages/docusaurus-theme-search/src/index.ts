import {
  type PluginModule,
  type ThemeConfigValidationContext,
} from '@docusaurus/types';
import type { MarkpromptProps } from '@markprompt/react';

export type MarkpromptConfig = MarkpromptProps;

export interface ThemeConfig {
  markprompt?: MarkpromptConfig;
}

// eslint-disable-next-line no-redeclare
const themeSearchMarkprompt: PluginModule = async () => ({
  name: '@markprompt/docusaurus-theme-search',
  getThemePath: () => '../dist/theme',
  getTypeScriptThemePath: () => '../src/theme',
});

export function getSwizzleComponentList(): string[] {
  return ['SearchBar'];
}

export const validateThemeConfig = (
  context: ThemeConfigValidationContext<ThemeConfig>,
): ThemeConfig => {
  return context.themeConfig;
};

export default themeSearchMarkprompt;
