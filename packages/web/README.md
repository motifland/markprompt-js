# `@markprompt/web`

A prebuilt version of the Markprompt dialog, based on `@markprompt/react`, built
with Preact for bundle-size savings. Viable for use from vanilla JavaScript or
any framework.

<br />
<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/markprompt">
    <img alt="" src="https://badgen.net/npm/v/markprompt">
  </a>
  <a aria-label="License" href="https://github.com/motifland/markprompt/blob/main/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/markprompt">
  </a>
</p>

## Installation

Install the package from NPM:

```sh
npm add @markprompt/web @markprompt/css
```

## Usage

Include the CSS on your page, via a link tag or by importing it in your
JavaScript:

```html
<!-- load from a CDN: -->
<link rel="stylesheet" href="https://esm.sh/@markprompt/css@0.5.1?css" />
```

```js
import '@markprompt/css';
```

Call the `markprompt` function with your project key:

```js
import { markprompt } from '@markprompt/web';

const markpromptEl = document.querySelector('#markprompt');

markprompt('YOUR-PROJECT-KEY', markpromptEl, {
  references: {
    getHref: (reference) => reference.file.path.replace(/\.[^.]+$/, '');
    getLabel: (reference) => {
      return reference.meta?.leadHeading?.value || reference.file?.title;
    }
  },
});
```

where `YOUR-PROJECT-KEY` can be obtained in your project settings on
[Markprompt.com](https://markprompt.com/).

Options are optional and allow you to configure the texts and links used in the
component to some extent. You will most likely want to pass `references.getHref`
and `reference.getLabel` to transform your prompt references into links to your
corresponding documentation, and `search.getHref` to transform search result
paths into links to your documentation.

```ts
import type {
  SubmitFeedbackOptions,
  SubmitPromptOptions,
  SubmitSearchQueryOptions,
} from '@markprompt/core';

interface MarkpromptOptions {
  /**
   * Display format.
   * @default "dialog"
   **/
  display?: 'plain' | 'dialog';
  /**
   * Enable and configure search functionality.
   * @default "search"
   * */
  defaultView?: 'search' | 'chat' | 'prompt';
  close?: {
    /**
     * `aria-label` for the close modal button
     * @default "Close Markprompt"
     **/
    label?: string;
    /**
     * Show the close button
     * @default true
     **/
    visible?: boolean;
  };
  description?: {
    /**
     * Visually hide the description
     * @default true
     **/
    hide?: boolean;
    /**
     * Description text
     **/
    text?: string;
  };
  feedback?: SubmitFeedbackOptions & {
    /**
     * Enable feedback functionality, shows a thumbs up/down button after a
     * prompt was submitted.
     * @default false
     * */
    enabled?: boolean;
    /**
     * Heading above the form
     * @default "Was this response helpful?"
     **/
    heading?: string;
    /**
     * Called when feedback is submitted
     * @default undefined
     */
    onFeedbackSubmit?: (
      feedback: PromptFeedback,
      messages: ChatViewMessage[],
      promptId?: string,
    ) => void;
  };
  /**
   * Enable and configure chat functionality. Allows users to have a conversation with an assistant.
   * Enabling chat functionality will disable prompt functionality.
   */
  chat?: SubmitChatOptions & {
    /**
     * Show a chat-like prompt input allowing for conversation-style interaction
     * rather than single question prompts.
     * @default false
     **/
    enabled?: boolean;
    /**
     * Label for the chat input
     * @default "Ask AI"
     **/
    label?: string;
    /**
     * Label for the tab bar
     * @default "Ask AI"
     **/
    tabLabel?: string;
    /**
     * Placeholder for the chat input
     * @default "Ask AI…"
     **/
    placeholder?: string;
    /**
     * Show sender info, like avatar
     * @default true
     **/
    showSender?: boolean;
    /**
     * Enable chat history features
     * - enable saving chat history to local storage
     * - show chat history UI
     * - resume chat conversations
     * @default true
     */
    history?: boolean;
    /**
     * Default (empty) view
     */
    defaultView?:  {
      message?: string | ReactElement;
      promptsHeading?: string;
      prompts?: string[];
    };
  };
  /**
   * Enable and configure prompt functionality. Allows users to ask a single question to an assistant
   */
  prompt?: SubmitChatOptions & {
    /**
     * Label for the prompt input
     * @default "Ask AI"
     **/
    label?: string;
    /**
     * Label for the tab bar
     * @default "Ask AI"
     **/
    tabLabel?: string;
    /**
     * Placeholder for the prompt input
     * @default "Ask AI…"
     **/
    placeholder?: string;
    /**
     * Default (empty) view
     */
    defaultView?:  {
      message?: string | ReactElement;
      promptsHeading?: string;
      prompts?: string[];
    };
  };
  references?: {
    /**
     * Display mode for the references. References can either be
     * displayed after the response or not displayed at all.
     * @default 'end'
     * */
    display?: 'none' | 'end';
    /** Callback to transform a reference into an href */
    getHref?: (reference: FileSectionReference) => string | undefined;
    /** Callback to transform a reference into a label */
    getLabel?: (reference: FileSectionReference) => string | undefined;
    /**
     * Heading above the references
     * @default "Answer generated from the following sources:"
     **/
    heading?: string;
    /** Loading text, default: `Fetching relevant pages…` */
    loadingText?: string;
    /**
     * Callback to transform a reference id into an href and text
     * @deprecated Use `getHref` and `getLabel` instead
     **/
    transformReferenceId?: (referenceId: string) => {
      href: string;
      text: string;
    };
  };
  /**
   * Enable and configure search functionality
   */
  search?: SubmitSearchQueryOptions & {
    /**
     * Enable search
     * @default false
     **/
    enabled?: boolean;
    /** Callback to transform a search result into an href */
    getHref?: (
      reference: SearchResult | AlgoliaDocSearchHit,
    ) => string | undefined;
    /** Callback to transform a search result into a heading */
    getHeading?: (
      reference: SearchResult | AlgoliaDocSearchHit,
      query: string,
    ) => string | undefined;
    /** Callback to transform a search result into a title */
    getTitle?: (
      reference: SearchResult | AlgoliaDocSearchHit,
      query: string,
    ) => string | undefined;
    /** Callback to transform a search result into a subtitle */
    getSubtitle?: (
      reference: SearchResult | AlgoliaDocSearchHit,
      query: string,
    ) => string | undefined;
    /**
     * Label for the search input, not shown but used for `aria-label`
     * @default "Search docs…"
     **/
    label?: string;
    /**
     * Label for the tab bar
     * @default "Search"
     **/
    tabLabel?: string;
    /**
     * Placeholder for the search input
     * @default "Search docs…"
     */
    placeholder?: string;
  };
  trigger?: {
    /**
     * `aria-label` for the open button
     * @default "Ask AI"
     **/
    label?: string;
    /**
     * Label the open button
     **/
    buttonLabel?: string;
    /**
     * Placeholder text for non-floating element
     * @default "Ask AI"
     **/
    placeholder?: string;
    /**
     * Should the trigger button be displayed as a floating button at the bottom right of the page?
     * Setting this to false will display a trigger button in the element passed
     * to the `markprompt` function.
     */
    floating?: boolean;
    /**
     * Do you use a custom element as the dialog trigger?
     */
    customElement?: boolean;
    /**
     * Custom image icon source for the open button
     */
    iconSrc?: string;
  };
  title?: {
    /**
     * Visually hide the title
     * @default true
     **/
    hide?: boolean;
    /**
     * Text for the title
     * @default "Ask AI"
     **/
    text?: string;
  };
  /**
   * Show Markprompt branding
   * @default true
   **/
  showBranding?: boolean;
  /**
   * Display debug info
   * @default false
   **/
  debug?: boolean;
}
```

Styles are easily overridable for customization via targeting classes.
Additionally, see the [styling section](https://markprompt.com/docs#styling) in
our documentation for a full list of variables.

## Usage via `<script>` tag

Besides initializing the Markprompt component yourselves from JavaScript, you
can load the script from a CDN. You can attach the options for the Markprompt
component to the window prior to loading our script:

```html
<link rel="stylesheet" href="https://esm.sh/@markprompt/css@0.13.x?css" />
<script>
  window.markprompt = {
    projectKey: `YOUR-PROJECT-KEY`,
    container: `#markprompt`,
    options: {
      references: {
        getHref: (reference) => reference.file?.path?.replace(/\.[^.]+$/, ''),
        getLabel: (reference) => {
          return reference.meta?.leadHeading?.value || reference.file?.title;
        },
      },
    },
  };
</script>
<script type="module" src="https://esm.sh/@markprompt/web@0.16.x/init"></script>

<div id="markprompt"></div>
```

## API

### `markprompt(projectKey, container, options?)`

Render a Markprompt dialog button.

#### Arguments

- `projectKey` (`string`): Your Markprompt project key.
- `container` (`HTMLElement | string`): The element or selector to render
  Markprompt into.
- `options` (`object`): Options for customizing Markprompt, see above.

When rendering the Markprompt component, it will render a search input-like
button by default. You have two other options:

- set `trigger.floating = true` to render a floating button
- set `trigger.customElement = true`, then
  `import { openMarkprompt } from '@markprompt/react'` and call
  `openMarkprompt()` from your code. This gives you the flexibility to render
  your own trigger element and attach whatever event handlers you would like
  and/or open the Markprompt dialog programmatically.

  ### `markpromptOpen()`

  Open the Markprompt dialog programmatically.

  ### `markpromptClose()`

  Close the Markprompt dialog programmatically.

  ### `markpromptChat(projectKey, container, options?)`

  Render the Markprompt chat view standalone, outside of a dialog.

  - `projectKey` (`string`): Your Markprompt project key.
  - `container` (`HTMLElement | string`): The element or selector to render
    Markprompt into.
  - `options` (`object`): Options for customizing Markprompt, see above.
  - `options.chatOptions` (`MarkpromptOptions.chat`): Enable and configure chat
    functionality. Allows users to have a conversation with an assistant.
    Enabling chat functionality will disable prompt functionality. See above for options.
  - `options.debug` (`boolean`): Display debug info
  - `options.feedbackOptions` (`MarkpromptOptions.feedback`): Enable feedback
    functionality, shows a thumbs up/down button after a prompt was submitted. See above for options.
  - `options.referencesOptions` (`MarkpromptOptions.references`): Enable and
    configure references functionality. See above for options.

## Documentation

The full documentation for `@markprompt/web` can be found on the
[Markprompt docs](https://markprompt.com/docs#javascript).

## Community

- [X](https://x.com/markprompt)
- [Discord](https://discord.gg/MBMh4apz6X)

## Authors

This library is created by the team behind [Markprompt](https://markprompt.com)
([@markprompt](https://x.com/markprompt)).

## License

[MIT](./LICENSE) © [Markprompt](https://markprompt.com)
