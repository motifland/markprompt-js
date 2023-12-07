# @markprompt/core

## 0.19.1

### Patch Changes

- [#247](https://github.com/motifland/markprompt-js/pull/247) [`79494a3`](https://github.com/motifland/markprompt-js/commit/79494a3a3aea3c4644ea1d683181ad075e800f8f) Thanks [@michaelfester](https://github.com/michaelfester)! - Add doNotInjectContext and excludeFromInsights types

## 0.19.0

### Minor Changes

- [#245](https://github.com/motifland/markprompt-js/pull/245) [`5a4acfd`](https://github.com/motifland/markprompt-js/commit/5a4acfd693023ac109405a917cb13703f8778a96) Thanks [@nickrttn](https://github.com/nickrttn)! - Add a generator-based version of `submitChat`

## 0.18.0

### Minor Changes

- [#240](https://github.com/motifland/markprompt-js/pull/240) [`2b97082`](https://github.com/motifland/markprompt-js/commit/2b970823f2fe23fa95cf7e13f91822fad11a2acd) Thanks [@nickrttn](https://github.com/nickrttn)! - Show configurable error messages to users when upstream outages occur

### Patch Changes

- [#242](https://github.com/motifland/markprompt-js/pull/242) [`98a8f5d`](https://github.com/motifland/markprompt-js/commit/98a8f5d71071114d1a8f6387f66e92617eed0e5e) Thanks [@michaelfester](https://github.com/michaelfester)! - Add sectionsScope parameter

## 0.17.1

### Patch Changes

- [#235](https://github.com/motifland/markprompt-js/pull/235) [`a7e4f0a`](https://github.com/motifland/markprompt-js/commit/a7e4f0a2b947b76a4b691fb970d8926ba5924541) Thanks [@michaelfester](https://github.com/michaelfester)! - Add gpt-4-1106-preview

## 0.17.0

### Minor Changes

- [#231](https://github.com/motifland/markprompt-js/pull/231) [`1c56e9b`](https://github.com/motifland/markprompt-js/commit/1c56e9bebb18025905d0cd60ea488be97cc37b0a) Thanks [@michaelfester](https://github.com/michaelfester)! - Fix infinite loop

## 0.16.5

### Patch Changes

- [#229](https://github.com/motifland/markprompt-js/pull/229) [`b5a7cf2`](https://github.com/motifland/markprompt-js/commit/b5a7cf24999725aa8439ef23917c675c3951dd07) Thanks [@michaelfester](https://github.com/michaelfester)! - Omit non-serializable options from API calls

## 0.16.4

### Patch Changes

- [#194](https://github.com/motifland/markprompt-js/pull/194) [`40b26d6`](https://github.com/motifland/markprompt-js/commit/40b26d6094c1939572df01dbbb9e9e103ca5fbb3) Thanks [@nickrttn](https://github.com/nickrttn)! - Don't cancel the `ReadableStream` returned by `res.body.getReader()` when `submitChat` is canceled

- [#193](https://github.com/motifland/markprompt-js/pull/193) [`3733e74`](https://github.com/motifland/markprompt-js/commit/3733e741e842f881642424e4eff67c136ba3096d) Thanks [@nickrttn](https://github.com/nickrttn)! - Add provenance statements

## 0.16.3

### Patch Changes

- [#195](https://github.com/motifland/markprompt-js/pull/195) [`a67327f`](https://github.com/motifland/markprompt-js/commit/a67327f3176f6c2d7b9084b8cea3ae99582c08bb) Thanks [@michaelfester](https://github.com/michaelfester)! - Add Nango source type

## 0.16.2

### Patch Changes

- [#189](https://github.com/motifland/markprompt-js/pull/189) [`23d34e2`](https://github.com/motifland/markprompt-js/commit/23d34e271a40e96b908cb012e16842d167ea8fbc) Thanks [@michaelfester](https://github.com/michaelfester)! - Add Salesforce source type

## 0.16.1

### Patch Changes

- [`1f3e991`](https://github.com/motifland/markprompt-js/commit/1f3e9914f47f1c10e8d1d4e01e6784622b820ca3) Thanks [@nickrttn](https://github.com/nickrttn)! - Bump to fix broken changesets, no changes

## 0.16.0

### Minor Changes

- [#175](https://github.com/motifland/markprompt-js/pull/175) [`9b146fe`](https://github.com/motifland/markprompt-js/commit/9b146fe1b0afd6acfc10470a9cdc4f350ef742e2) Thanks [@nickrttn](https://github.com/nickrttn)! - Update @algolia/client-search

- [#175](https://github.com/motifland/markprompt-js/pull/175) [`9b146fe`](https://github.com/motifland/markprompt-js/commit/9b146fe1b0afd6acfc10470a9cdc4f350ef742e2) Thanks [@nickrttn](https://github.com/nickrttn)! - Remove the onFeedbackSubmitted callback from submitFeedback

### Patch Changes

- [#175](https://github.com/motifland/markprompt-js/pull/175) [`9b146fe`](https://github.com/motifland/markprompt-js/commit/9b146fe1b0afd6acfc10470a9cdc4f350ef742e2) Thanks [@nickrttn](https://github.com/nickrttn)! - Update getErrorMessage to only read the response stream once

## 0.15.0

### Minor Changes

- [#181](https://github.com/motifland/markprompt-js/pull/181) [`10a2f04`](https://github.com/motifland/markprompt-js/commit/10a2f04760f31007520763c5d6d2bb2a53ad2ff3) Thanks [@michaelfester](https://github.com/michaelfester)! - Add feedback callback

## 0.14.0

### Minor Changes

- [`afd7025`](https://github.com/motifland/markprompt-js/commit/afd7025e11930e08e28d4ff99f4c8200bef1c661) Thanks [@michaelfester](https://github.com/michaelfester)! - Add conversation id and metadata

## 0.13.0

### Minor Changes

- [#163](https://github.com/motifland/markprompt-js/pull/163) [`983f098`](https://github.com/motifland/markprompt-js/commit/983f098298b391bed776bdd75be1e4f4fe9b8798) Thanks [@michaelfester](https://github.com/michaelfester)! - Add support for `conversationId` in `submitChat`

- [#163](https://github.com/motifland/markprompt-js/pull/163) [`983f098`](https://github.com/motifland/markprompt-js/commit/983f098298b391bed776bdd75be1e4f4fe9b8798) Thanks [@michaelfester](https://github.com/michaelfester)! - Fix an inconsistency in `submitFeedback`, switching the `feedback` and `projectKey` arguments

- [#163](https://github.com/motifland/markprompt-js/pull/163) [`983f098`](https://github.com/motifland/markprompt-js/commit/983f098298b391bed776bdd75be1e4f4fe9b8798) Thanks [@michaelfester](https://github.com/michaelfester)! - Remove `submitPrompt` in favor of `submitChat`. To migrate single question prompt implementations, instead of `submitPrompt(prompt, ...)` call `submitChat([{ content: prompt, role: 'user' }], ...)` with the same arguments.

- [`691164c`](https://github.com/motifland/markprompt-js/commit/691164c7c13af5995ae4330388421401435b8139) Thanks [@michaelfester](https://github.com/michaelfester)! - Add chat support

### Patch Changes

- [#169](https://github.com/motifland/markprompt-js/pull/169) [`02b2cb0`](https://github.com/motifland/markprompt-js/commit/02b2cb080b76b85ba629a2f6d7925385feda31b5) Thanks [@nickrttn](https://github.com/nickrttn)! - Don't distribute compiled test files

- [#159](https://github.com/motifland/markprompt-js/pull/159) [`90122a8`](https://github.com/motifland/markprompt-js/commit/90122a8969791af328a8dd889b3f76afa07727ed) Thanks [@nickrttn](https://github.com/nickrttn)! - Update [`defaults`](https://github.com/sindresorhus/node-defaults/releases/tag/v2.0.2)

- [#159](https://github.com/motifland/markprompt-js/pull/159) [`90122a8`](https://github.com/motifland/markprompt-js/commit/90122a8969791af328a8dd889b3f76afa07727ed) Thanks [@nickrttn](https://github.com/nickrttn)! - Update [`type-fest`](https://github.com/sindresorhus/type-fest/releases/tag/v4.3.1) and move it to `dependencies`

## 0.12.1

### Patch Changes

- [#157](https://github.com/motifland/markprompt-js/pull/157) [`611c42c`](https://github.com/motifland/markprompt-js/commit/611c42c246387683223a5fa1234b4429843d6a2d) Thanks [@michaelfester](https://github.com/michaelfester)! - Remove @docsearch/react dependency from core

## 0.12.0

### Minor Changes

- [#149](https://github.com/motifland/markprompt-js/pull/149) [`7718303`](https://github.com/motifland/markprompt-js/commit/77183036e67837680c50bd4a5c0023234c4df881) Thanks [@nickrttn](https://github.com/nickrttn)! - Add `submitChat`, allowing to send conversations to the Markprompt API

### Patch Changes

- [#149](https://github.com/motifland/markprompt-js/pull/149) [`7718303`](https://github.com/motifland/markprompt-js/commit/77183036e67837680c50bd4a5c0023234c4df881) Thanks [@nickrttn](https://github.com/nickrttn)! - Change how default options are passed to `@markprompt/core`

- [#149](https://github.com/motifland/markprompt-js/pull/149) [`7718303`](https://github.com/motifland/markprompt-js/commit/77183036e67837680c50bd4a5c0023234c4df881) Thanks [@nickrttn](https://github.com/nickrttn)! - Add an optional messageIndex parameter to submitFeedback, which can be used to submit feedback for messages in chat conversations

- [#148](https://github.com/motifland/markprompt-js/pull/148) [`cd011ec`](https://github.com/motifland/markprompt-js/commit/cd011ecfc53325f23618554f1ace9ca9018b5680) Thanks [@nickrttn](https://github.com/nickrttn)! - Add isAbortError utility

## 0.11.0

### Minor Changes

- [#140](https://github.com/motifland/markprompt-js/pull/140) [`3252bfd`](https://github.com/motifland/markprompt-js/commit/3252bfd04e0b358c0ade9c1e7826806b568ca9ea) Thanks [@nickrttn](https://github.com/nickrttn)! - Upgrade dependencies

- [#140](https://github.com/motifland/markprompt-js/pull/140) [`3252bfd`](https://github.com/motifland/markprompt-js/commit/3252bfd04e0b358c0ade9c1e7826806b568ca9ea) Thanks [@nickrttn](https://github.com/nickrttn)! - Fix issues reported by upgraded linters

### Patch Changes

- [#140](https://github.com/motifland/markprompt-js/pull/140) [`3252bfd`](https://github.com/motifland/markprompt-js/commit/3252bfd04e0b358c0ade9c1e7826806b568ca9ea) Thanks [@nickrttn](https://github.com/nickrttn)! - Improve types

## 0.10.0

### Minor Changes

- [#136](https://github.com/motifland/markprompt-js/pull/136) [`615d124`](https://github.com/motifland/markprompt-js/commit/615d1242efd6519079ffcb75305fed6ac5584e76) Thanks [@michaelfester](https://github.com/michaelfester)! - Integrate feedback API

## 0.9.1

### Patch Changes

- [#132](https://github.com/motifland/markprompt-js/pull/132) [`4cdbfb6`](https://github.com/motifland/markprompt-js/commit/4cdbfb6c5483f3009277e803df8cbbd4e9987825) Thanks [@michaelfester](https://github.com/michaelfester)! - Support more Algolia search result formats

## 0.9.0

### Minor Changes

- [#129](https://github.com/motifland/markprompt-js/pull/129) [`2c61fbf`](https://github.com/motifland/markprompt-js/commit/2c61fbf65fd4d4e51093b5f3f46daf31da58d1dc) Thanks [@michaelfester](https://github.com/michaelfester)! - Add Algolia search

- [#129](https://github.com/motifland/markprompt-js/pull/129) [`2c61fbf`](https://github.com/motifland/markprompt-js/commit/2c61fbf65fd4d4e51093b5f3f46daf31da58d1dc) Thanks [@michaelfester](https://github.com/michaelfester)! - Add Algolia search

## 0.8.2

### Patch Changes

- [#103](https://github.com/motifland/markprompt-js/pull/103) [`cb2d619`](https://github.com/motifland/markprompt-js/commit/cb2d619395e00342c2bb9ef5ae485f2b82ee1c3c) Thanks [@michaelfester](https://github.com/michaelfester)! - Update exposed types

## 0.8.1

### Patch Changes

- [#101](https://github.com/motifland/markprompt-js/pull/101) [`8d6b50d`](https://github.com/motifland/markprompt-js/commit/8d6b50d2e4c04917175ea851c8e0102009c3ed73) Thanks [@michaelfester](https://github.com/michaelfester)! - Expose FileReferenceFileData type

## 0.8.0

### Minor Changes

- [#95](https://github.com/motifland/markprompt-js/pull/95) [`251db73`](https://github.com/motifland/markprompt-js/commit/251db739e996c0a9bb72fea50fc016e5fbccdca8) Thanks [@michaelfester](https://github.com/michaelfester)! - Harmonize references API and use reponse header for references and debug info

- [#80](https://github.com/motifland/markprompt-js/pull/80) [`9bd2123`](https://github.com/motifland/markprompt-js/commit/9bd212354ab9d8e79d8c34335f9a0dd8e76176d0) Thanks [@nickrttn](https://github.com/nickrttn)! - Add feedback functionality to the prompt, allowing users to give feedback on the usefulness of prompt answers

## 0.7.0

### Minor Changes

- [#87](https://github.com/motifland/markprompt-js/pull/87) [`c5102c5`](https://github.com/motifland/markprompt-js/commit/c5102c5937e72d6796f885dab9410ed1f5dc36ed) Thanks [@michaelfester](https://github.com/michaelfester)! - Upgrade to new search API

## 0.6.4

### Patch Changes

- [#72](https://github.com/motifland/markprompt-js/pull/72) [`ad10a87`](https://github.com/motifland/markprompt-js/commit/ad10a87ead941b13626746dbb5fbef882fc8c0e8) Thanks [@michaelfester](https://github.com/michaelfester)! - Export model types

- [#72](https://github.com/motifland/markprompt-js/pull/72) [`ad10a87`](https://github.com/motifland/markprompt-js/commit/ad10a87ead941b13626746dbb5fbef882fc8c0e8) Thanks [@michaelfester](https://github.com/michaelfester)! - Update READMEs

## 0.6.3

### Patch Changes

- [#70](https://github.com/motifland/markprompt-js/pull/70) [`c1605bd`](https://github.com/motifland/markprompt-js/commit/c1605bd46c672b653e6f92bb7ecf38a9219a7fb7) Thanks [@michaelfester](https://github.com/michaelfester)! - Update READMEs

## 0.6.2

### Patch Changes

- [#67](https://github.com/motifland/markprompt-js/pull/67) [`df494a4`](https://github.com/motifland/markprompt-js/commit/df494a422fb770bca1f2fc56d55039e009718655) Thanks [@michaelfester](https://github.com/michaelfester)! - Add model exports

## 0.6.1

### Patch Changes

- [#62](https://github.com/motifland/markprompt-js/pull/62) [`144bad4`](https://github.com/motifland/markprompt-js/commit/144bad4e88fbff68c5349a1128b29cbb4ee96616) Thanks [@michaelfester](https://github.com/michaelfester)! - Centralize default configuration

## 0.6.0

### Minor Changes

- [#52](https://github.com/motifland/markprompt-js/pull/52) [`642e3a1`](https://github.com/motifland/markprompt-js/commit/642e3a1fecb4d09e9b0269a5009b0a2952880e3a) Thanks [@nickrttn](https://github.com/nickrttn)! - Add text-embedding-ada-002 to allowed models

## 0.5.0

### Minor Changes

- [#31](https://github.com/motifland/markprompt-js/pull/31) [`df37791`](https://github.com/motifland/markprompt-js/commit/df377911ef009c9e41d647febc291a674ddc9d8e) Thanks [@nickrttn](https://github.com/nickrttn)! - Add search functionality to Markprompt

### Patch Changes

- [#40](https://github.com/motifland/markprompt-js/pull/40) [`c772430`](https://github.com/motifland/markprompt-js/commit/c77243035121001d544dd061d86835a424b2adb2) Thanks [@remcohaszing](https://github.com/remcohaszing)! - Define explicit return types

## 0.4.6

### Patch Changes

- [#18](https://github.com/motifland/markprompt-js/pull/18) [`c007554`](https://github.com/motifland/markprompt-js/commit/c007554ca769c6143d3e26ecf155f6e3eb0c76e9) Thanks [@nickrttn](https://github.com/nickrttn)! - Remove unused options from type definitions
