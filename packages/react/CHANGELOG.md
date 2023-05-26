# @markprompt/react

## 0.3.2

### Patch Changes

- [#12](https://github.com/motifland/markprompt-js/pull/12) [`e169b5e`](https://github.com/motifland/markprompt-js/commit/e169b5ed758b56cec48fe4e26e7e50f5c62d3b70) Thanks [@remcohaszing](https://github.com/remcohaszing)! - Use star import for @radix-ui/react-dialog

  `@radix-ui/react-dialog` is [packaged incorrectly](https://github.com/radix-ui/primitives/issues/1848). Because of this, some
  tools (Next.js) must use a default import to import it, whereas others
  (Vite, Docusaurus) must use a star import. Since our demos use Vite and
  Docusaurus, let’s go with star imports.
