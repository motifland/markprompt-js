# `@markprompt/css`

Common CSS for [Markprompt](https://markprompt.com) components.

<br />
<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@markprompt/css">
    <img alt="" src="https://badgen.net/npm/v/@markprompt/css">
  </a>
  <a aria-label="License" href="https://github.com/motifland/markprompt-js/blob/main/packages/css/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/@markprompt/css">
  </a>
</p>

## Installation

```sh
npm install @markprompt/core
```

## Usage

With a bundler:

```js
import '@markprompt/css';
```

With a CDN:

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@markprompt/css@0.2.0/markprompt.css"
/>
```

This package adds styling for various CSS classes. All styling is applied using
the [`:where()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:where) pseudo
class, so you can override all styling manually.

## API

### CSS Classes

The package adds styling using the following classes.

- `MarkpromptAnswer`
- `MarkpromptAutoScroller`
- `MarkpromptCaret`
- `MarkpromptClose`
- `MarkpromptContentDialog`
- `MarkpromptContentPlain`
- `MarkpromptForm`
- `MarkpromptIcon`
- `MarkpromptOverlay`
- `MarkpromptProgress`
- `MarkpromptPrompt`
- `MarkpromptPromptLabel`
- `MarkpromptReferences`
- `MarkpromptSearchIcon`
- `MarkpromptTitle`
- `MarkpromptTrigger`

### CSS Variables

Styling can be customized using the following CSS variables.

- `--markprompt-background`: (Default: `#ffffff`, Default dark: `#050505`)
- `--markprompt-foreground`: (Default: `#171717`, Default dark: `#d4d4d4`)
- `--markprompt-muted`: (Default: `#fafafa`, Default dark: `#171717`)
- `--markprompt-mutedForeground`: (Default: `#737373`, Default dark: `#737373`)
- `--markprompt-border`: (Default: `#e5e5e5`, Default dark: `#262626`)
- `--markprompt-input`: (Default: `#ffffff`, Default dark: `#ffffff`)
- `--markprompt-primary`: (Default: `#6366f1`, Default dark: `#6366f1`)
- `--markprompt-primaryForeground`: (Default: `#ffffff`, Default dark:
  `#ffffff`)
- `--markprompt-primaryMuted`: (Default: `#8285f4`, Default dark: `#8285f4`)
- `--markprompt-secondary`: (Default: `#fafafa`, Default dark: `#0e0e0e`)
- `--markprompt-secondaryForeground`: (Default: `#171717`, Default dark:
  `#ffffff`)
- `--markprompt-primaryHighlight`: (Default: `#ec4899`, Default dark: `#ec4899`)
- `--markprompt-secondaryHighlight`: (Default: `#a855f7`, Default dark:
  `#a855f7`)
- `--markprompt-overlay`: (Default: `#00000010`, Default dark: `#00000040\`)
- `--markprompt-ring`: (Default: `#0ea5e9`, Default dark: `#ffffff`)
- `--markprompt-radius`: (Default: `8px`)
- `--markprompt-text-size`-(Default: `0.875rem`)
- `--markprompt-text-size-xs`-(Default: `0.75rem`)
- `--markprompt-button-icon-size`-(Default: `: 1rem`)

## Community

- [X](https://x.com/markprompt)
- [Discord](https://discord.gg/MBMh4apz6X)

## Authors

This library is created by the team behind [Markprompt](https://markprompt.com)
([@markprompt](https://x.com/markprompt)).

## License

[MIT](./LICENSE) © [Markprompt](https://markprompt.com)
