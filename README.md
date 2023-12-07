<a href="https://markprompt.com">
  <img alt="Markprompt – Enterprise-grade AI chatbots for your website and docs" src="https://raw.githubusercontent.com/motifland/markprompt/main/public/static/cover.png">
  <h1 align="center">Markprompt</h1>
</a>

Markprompt is a platform for building GPT-powered prompts. It takes Markdown,
Markdoc, MDX, reStructuredText, HTML and plain text files (from a GitHub repo,
website or file uploads), and creates embeddings that you can use to create a
prompt, for instance using the companion
[headless Markprompt React components or our prebuilt dialog](https://markprompt.com/docs#components).
Markprompt also offers analytics, so you can gain insights on how visitors
interact with your docs.

<br />

<p align="center">
  <a href="https://x.com/markprompt">
    <img src="https://img.shields.io/twitter/follow/markprompt?style=flat&label=%40markprompt&logo=twitter&color=0bf&logoColor=fff" alt="X" />
  </a>
  <a aria-label="License" href="https://github.com/motifland/markprompt-js/blob/main/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/markprompt">
  </a>
</p>

## Components

This repo contains various UI libraries for building prompts based on the
Markprompt API:

- [`@markprompt/core`](packages/core#readme) — shared utility functions to speak
  with the Markprompt API.
- [`@markprompt/react`](packages/react#readme) — a React component.
- [`@markprompt/web`](packages/web#readme) — a pre-built Markprompt component,
  based on `@markprompt/react`, built with Preact for bundle-size savings.
  Viable for use with vanilla JavaScript or any framework.
- [`@markprompt/docusaurus-theme-search`](packages/docusaurus-theme-search#readme)
  — a Markprompt search theme for Docusaurus.

and some example implementations:

- [`with-css-modules`](examples/with-css-modules#readme) — a web application based on `@markprompt/react`, Vite and CSS Modules.
- [`with-custom-trigger`](examples/with-custom-trigger#readme) — a reference implementation of `@markprompt/web` using a custom trigger button.
- [`with-custom-trigger-react`](examples/with-custom-trigger-react#readme) — a reference implementation of `@markprompt/react` using a custom trigger button.
- [`with-docusaurus`](examples/with-docusaurus#readme) — a Docusaurus project with `@markprompt/docusaurus-theme-search`.
- [`with-docusaurus-algolia`](examples/with-docusaurus-algolia#readme) — a Docusaurus project with `@markprompt/docusaurus-theme-search` and our Algolia
  integration.
- [`with-docusaurus-swizzled`](examples/with-docusaurus-swizzled#readme) — a Docusaurus project with Markprompt and [theme-search-algolia](https://docusaurus.io/docs/api/themes/@docusaurus/theme-search-algolia).
- [`with-init`](examples/with-init#readme) — a web application based on
`@markprompt/web` using a global instance of Markprompt.
- [`with-markprompt-web`](examples/with-markprompt-web#readme) — a web application based on `@markprompt/web` and Vite. based on `@markprompt/react`, Vite and CSS Modules.
- [`with-next`](examples/with-next#readme) — a web application based on `@markprompt/react`, `@markprompt/web`, and Next.js.
- [`with-standalone-chat`](examples/with-standalone-chat#readme) — a web application based on `@markprompt/web` using a standalone version of the chat component.
- [`with-function-calling`](examples/with-function-calling#readme) — a web application based on `@markprompt/react` and Next.js showcasing the use for [OpenAI function calling](https://platform.openai.com/docs/guides/function-calling).

## Documentation

To use the Markprompt platform as is, please refer to the
[Markprompt documentation](https://markprompt.com/docs).

## Community

- [X](https://x.com/markprompt)
- [Discord](https://discord.gg/MBMh4apz6X)

## Authors

This library is created by the team behind [Markprompt](https://markprompt.com)
([@markprompt](https://x.com/markprompt)).

## License

[MIT](./LICENSE) © [Markprompt](https://markprompt.com)
