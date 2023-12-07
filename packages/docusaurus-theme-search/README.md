# Markprompt Docusaurus plugin

A [Markprompt](https://markprompt.com) plugin for
[Docusaurus](https://docusaurus.io).

<br />
<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@markprompt/docusaurus-theme-search">
    <img alt="" src="https://badgen.net/npm/v/@markprompt/docusaurus-theme-search">
  </a>
  <a aria-label="License" href="https://github.com/motifland/markprompt-js/blob/main/packages/docusaurus-theme-search/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/@markprompt/docusaurus-theme-search">
  </a>
</p>

## Installation

```sh
npm install @markprompt/docusaurus-theme-search
```

## Usage

### Basic Usage

In your `docusaurus.config.js`, add `@markprompt/docusaurus-theme-search` to
`themes`. Configure `markprompt` in the `themeConfig`.

```js
const config = {
  // …

  themes: [
    // …
    '@markprompt/docusaurus-theme-search',
  ],

  themeConfig:
    /** @type {import('@markprompt/docusaurus-theme-search').ThemeConfig} */ ({
      markprompt: {
        projectKey: 'YOUR-PROJECT-KEY',
        trigger: { floating: true },
      },
    }),
};
```

Now a search button will appear on your Docusaurus page.

### Usage with another search plugin

If your Docusaurus project already has a search plugin, such as
[theme-search-algolia](https://docusaurus.io/docs/api/themes/@docusaurus/theme-search-algolia),
you need to [swizzle](https://docusaurus.io/docs/swizzling) the current search
plugin, and add Markprompt as a standalone component.

To swizzle your current search plugin, run:

```
npx docusaurus swizzle
```

Choose `Wrap`, and confirm. This will create a `SearchBar` wrapper component in
`/src/theme/SearchBar`. Next, install the standalone Markprompt component and
CSS:

```
npm install @markprompt/react @markprompt/css
```

Edit `/src/theme/SearchBar/index.tsx` to include Markprompt next to your
existing search bar. Here is an example:

```tsx
import type { WrapperProps } from '@docusaurus/types';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { type MarkpromptConfig } from '@markprompt/docusaurus-theme-search';
import type SearchBarType from '@theme/SearchBar';
import SearchBar from '@theme-original/SearchBar';
import React, { lazy, Suspense } from 'react';

// import Markprompt lazily as Docusaurus does not currently support ESM
const Markprompt = lazy(() =>
  import('@markprompt/react').then((mod) => ({ default: mod.Markprompt })),
);

import '@markprompt/css';

type Props = WrapperProps<typeof SearchBarType>;

export default function SearchBarWrapper(props: Props): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  const { projectKey, ...config } = siteConfig.themeConfig
    .markprompt as MarkpromptConfig;

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      {/* Docusaurus' version of `ReactDOMServer` doesn't support Suspense yet, so we can only render the component on the client. */}
      {typeof window !== 'undefined' && (
        <Suspense fallback={null}>
          <Markprompt projectKey={projectKey} {...config} />
        </Suspense>
      )}
      <SearchBar {...props} />
    </div>
  );
}
```

## Examples

- [With the Docusaurus plugin](https://github.com/motifland/markprompt-js/tree/main/examples/with-docusaurus)
- [With an external search plugin](https://github.com/motifland/markprompt-js/tree/main/examples/with-docusaurus-swizzled)

## Community

- [X](https://x.com/markprompt)
- [Discord](https://discord.gg/MBMh4apz6X)

## Authors

This library is created by the team behind [Markprompt](https://markprompt.com)
([@markprompt](https://x.com/markprompt)).

## License

[MIT](./LICENSE) © [Markprompt](https://markprompt.com)
