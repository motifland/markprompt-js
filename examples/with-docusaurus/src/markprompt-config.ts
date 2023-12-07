import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { MarkpromptConfig } from '@markprompt/docusaurus-theme-search';

declare global {
  interface Window {
    markpromptConfigExtras?: Partial<MarkpromptConfig>;
  }
}

// Custom link mapping functions: https://markprompt.com/docs#link-mapping
if (ExecutionEnvironment.canUseDOM) {
  window.markpromptConfigExtras = {
    references: {
      // Example link mapping for references:
      // getHref: (reference) => reference.file?.path?.replace(/\.[^.]+$/, ''),
      // getLabel: (reference) => reference.meta?.leadHeading?.value || reference.file?.title,
    },
    search: {
      // Example link mapping for search results (e.g. Algolia):
      // getHref: (result) => result.url,
      // getHeading: (result) => result.hierarchy?.lvl0,
      // getTitle: (result) => result.hierarchy?.lvl1,
      // getSubtitle: (result) => result.hierarchy?.lvl2,
    },
  };
}
