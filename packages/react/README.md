# Markprompt React

[Markprompt](https://markprompt.com)'s `@markprompt/react` library offers you
both a simple, accessible, prebuilt React component that you can include in your
codebase, as well as a set of React primitives that you can use to build your
own custom Markprompt UI.

The `<Markprompt />` component is built with [Radix'](https://www.radix-ui.com/)
[`Dialog component`](https://www.radix-ui.com/docs/primitives/components/dialog)
and allows for limited control over the Markprompt UI, mostly offering you the
ability to change texts as well as how prompt references and search results are
linked to your website.

The `Markprompt.*` primitives offer you a fully customizable way to build your
own UI and have full control.

In combination with
[`@markprompt/css`](https://github.com/motifland/markprompt-js/tree/main/packages/css),
the `<Markprompt />` component is a drop-in solution for most websites. You can
also opt to provide your own styles, or override ours to your liking.

<br />
<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@markprompt/react">
    <img alt="" src="https://badgen.net/npm/v/@markprompt/react">
  </a>
  <a aria-label="License" href="https://github.com/motifland/markprompt-js/blob/main/packages/react/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/@markprompt/react">
  </a>
</p>

## Installation

Install the `@markprompt/react` package via `npm`, `yarn` or `pnpm`:

```sh
# npm
npm install @markprompt/react

# yarn
yarn add @markprompt/react

# pnpm
pnpm add @markprompt/react
```

## Usage

Example:

```jsx
import `@markprompt/css`;
import { Markprompt } from '@markprompt/react';

export function Component() {
  return <Markprompt projectKey="YOUR-PROJECT-KEY" />;
}
```

replacing `YOUR-PROJECT-KEY` with the key associated to your project. It can be
obtained in the project settings on [Markprompt.com](https://markprompt.com/)
under "Project key".

## API

### `<Markprompt />`

The pre-built Markprompt component. It accepts the following props:

- `projectKey` (`string`): The project key associated to your project. It can be
  obtained in the project settings on [Markprompt.com](https://markprompt.com/)
  under "Project key"
- `display` (`plain | dialog`): The way to display the prompt (Default:
  `dialog`)
- `defaultView` (`chat | prompt | search`): The default view to show (Default:
  `prompt` or `search` when search is enabled)
- `close` (`object`): Options for the close modal button
- `close.label` (`string`): `aria-label` for the close modal button (Default:
  `Close Markprompt`)
- `close.visible` (`boolean`): Show the close button (Default: `true`)
- `description` (`object`): Options for the description
- `description.hide` (`boolean`): Visually hide the description (Default:
  `true`)
- `description.text` (`string`): Description text
- `chat` (`object`): Options for the chat view
- `chat.enabled` (`boolean`): Whether or not to enable the chat view. Disables
  `prompt` (Default: `false`)
- `chat.history` (`boolean`): Whether or not to store conversation history and show conversation selection. (Default:
  `true`)
- `chat.label` (`string`): Label for the prompt input (Default: `Ask AI`)
- `chat.tabLabel` (`string`): Label for the tab bar (Default: `Ask AI`)
- `chat.placeholder` (`string`): Placeholder for the prompt input (Default:
  `Ask AI…`)
- `chat.defaultView.message` (`string` or `ReactElement`): A message or React component to show when no conversation has been initiated.
- `chat.defaultView.prompts` (`stringp[]`): A list of default prompts to show to give the user ideas of what to ask for.
- `chat.apiUrl` (`string`): URL at which to fetch completions. (Default:
  `https://api.markprompt.com/v1/chat`)
- `chat.iDontKnowMessage` (`string`): Message returned when the model does not
  have an answer. (Default: `Sorry, I am not sure how to answer that.`)
- `chat.model` (`string`): The OpenAI model to use. (Default: `gpt-3.5-turbo`)
- `chat.systemPrompt` (`string`): The prompt template. (Default:
  `You are a very enthusiastic company representative who loves to help people!`)
- `chat.temperature` (`number`): The model temperature. (Default: `0.1`)
- `chat.topP` (`number`): The model top P. (Default: `1`)
- `chat.frequencyPenalty` (`number`): The model frequency penalty. (Default:
  `0`)
- `chat.presencePenalty` (`number`): The model presence penalty. (Default: `0`)
- `chat.maxTokens` (`number`): The max number of tokens to include in the
  response. (Default: `500`)
- `chat.sectionsMatchCount` (`number`): The number of sections to include in the
  prompt context. (Default: `10`)
- `chat.sectionsMatchThreshold` (`number`): The similarity threshold between the
  input question and selected sections. (Default: `0.5`)
- `chat.tools`: (`OpenAI.ChatCompletionTool[]`): A list of tools the model may call.
- `chat.tool_choice`: (`OpenAI.ChatCompletionToolChoiceOption`): Controls which (if any) function is called by the model.
- `feedback` (`object`): Options for the feedback component
- `feedback.enabled` (`boolean`): Enable users to give feedback on prompt or
  chat answers. (Default: `true`)
- `feedback.apiUrl` (`string`): URL at which to deliver feedback. (Default:
  `https://api.markprompt.com/v1/feedback`)
- `feedback.heading` (`string`): Heading for the feedback form, only shown in
  the prompt view (Default: `Was this response helpful?`)
- `feedback.onFeedbackSubmit` (`function`): Callback when feedback is
  submitted
- `prompt` (`object`): Options for the prompt view
- `prompt.label` (`string`): Label for the prompt input (Default: `Ask AI`)
- `prompt.tabLabel` (`string`): Label for the tab bar (Default: `Ask AI`)
- `prompt.placeholder` (`string`): Placeholder for the prompt input (Default:
  `Ask AI…`)
- `prompt.defaultView.message` (`string` or `ReactElement`): A message or React component to show when no conversation has been initiated.
- `prompt.defaultView.prompts` (`stringp[]`): A list of default prompts to show to give the user ideas of what to ask for.
- `prompt.apiUrl` (`string`): URL at which to fetch completions. (Default:
  `https://api.markprompt.com/v1/completions`)
- `prompt.iDontKnowMessage` (`string`): Message returned when the model does not
  have an answer. (Default: `Sorry, I am not sure how to answer that.`)
- `prompt.model` (`string`): The OpenAI model to use. (Default: `gpt-3.5-turbo`)
- `prompt.systemPrompt` (`string`): The prompt template. (Default:
  `You are a very enthusiastic company representative who loves to help people!`)
- `prompt.temperature` (`number`): The model temperature. (Default: `0.1`)
- `prompt.topP` (`number`): The model top P. (Default: `1`)
- `prompt.frequencyPenalty` (`number`): The model frequency penalty. (Default:
  `0`)
- `prompt.presencePenalty` (`number`): The model presence penalty. (Default:
  `0`)
- `prompt.maxTokens` (`number`): The max number of tokens to include in the
  response. (Default: `500`)
- `prompt.sectionsMatchCount` (`number`): The number of sections to include in
  the prompt context. (Default: `10`)
- `prompt.sectionsMatchThreshold` (`number`): The similarity threshold between
  the input question and selected sections. (Default: `0.5`)
- `prompt.sectionsScope` (`number`): When a section is matched, extend the context to the parent section. For instance, if a section has level 3 and `sectionsScope` is set to 1, include the content of the entire parent section of level 1. If 0, this includes the entire file. (Default: `undefined`)
- `references` (`object`): Options for the references
- `references.getHref` (`function`): Callback to transform a reference into an
  href
- `references.getLabel` (`function`): Callback to transform a reference into an
  label to show for the link
- `references.loadingText` (`string`): Loading text (Default:
  `Fetching relevant pages…`)
- `references.heading` (`string`): Heading for the references panel (Default:
  `Answer generated from the following sources:`)
- `search` (`object`): Options for search
- `search.enabled` (`boolean`): Whether or not to enable search. (Default:
  `true`)
- `search.getHref` (`function`): Callback to transform a search result into an
  href
- `search.getHeading` (`function`): Callback to transform a search result into a
  heading
- `search.getTitle` (`function`): Callback to transform a search result into a
  title
- `search.getSubtitle` (`function`): Callback to transform a search result into
  a subtitle
- `search.label` (`string`): Label for the search input, not shown but used for
  `aria-label` (Default: `Search docs…`)
- `search.tabLabel` (`string`): Label for the tab bar (Default: `Search`)
- `search.placeholder` (`string`): Placeholder for the search input (Default:
  `Search docs…`)
- `search.limit` (`number`): Maximum amount of results to return. (Default: `5`)
- `search.apiUrl` (`string`): URL at which to fetch search results. (Default:
  `https://api.markprompt.com/v1/search`)
- `search.provider` (`object`): A custom search provider configuration, such as
  Algolia
- `trigger` (`object`): Options for the trigger
- `trigger.customElement` (`boolean`): Use a custom element as the trigger. Will
  disable rendering any trigger element. Use `openMarkprompt()` to trigger the
  Markprompt dialog. (Default: `false`)
- `trigger.label` (`string`): `aria-label` for the open button (Default:
  `Ask AI`)
- `trigger.buttonLabel` (`string`): Label for the open button (Default:
  `Ask AI`)
- `trigger.placeholder` (`string`): Placeholder text for non-floating element
  (Default: `Ask AI`)
- `trigger.iconSrc` (`string`): Custom image icon source for the open button
- `title` (`object`): Options for the title
- `title.hide` (`boolean`): Visually hide the title (Default: `true`)
- `title.text` (`string`): Title text (Default: `Ask AI`)

When rendering the Markprompt component, it will render a search input-like
button by default. You have two other options:

- set `trigger.floating = true` to render a floating button
- set `trigger.customElement = true`, then
  `import { openMarkprompt } from '@markprompt/react'` and call
  `openMarkprompt()` from your code. This gives you the flexibility to render
  your own trigger element and attach whatever event handlers you would like
  and/or open the Markprompt dialog programmatically.

### `openMarkprompt()`

A function to open the Markprompt dialog programmatically. Takes no arguments.

### `<ChatView />`

A chat view component, renders a complete chat view. Can be used standalone. It
accepts the following props:

- `projectKey` (`string`): The project key associated to your project. It can be
  obtained in the project settings on [Markprompt.com](https://markprompt.com/)
  under "Project key"
- `activeView` (`"chat" | "prompt" | "search"`): The active view. (Default:
  `undefined`)
- `chatOptions` (`object`): Options for the chat view
- `chatOptions.enabled` (`boolean`): Whether or not to enable the chat view.
  Disables `prompt` (Default: `false`)
- `chatOptions.label` (`string`): Label for the prompt input (Default: `Ask AI`)
- `chatOptions.tabLabel` (`string`): Label for the tab bar (Default: `Ask AI`)
- `chatOptions.placeholder` (`string`): Placeholder for the prompt input
  (Default: `Ask AI…`)
- `chatOptions.apiUrl` (`string`): URL at which to fetch completions. (Default:
  `https://api.markprompt.com/v1/chat`)
- `chatOptions.iDontKnowMessage` (`string`): Message returned when the model
  does not have an answer. (Default: `Sorry, I am not sure how to answer that.`)
- `chatOptions.model` (`string`): The OpenAI model to use. (Default:
  `gpt-3.5-turbo`)
- `chatOptions.systemPrompt` (`string`): The prompt template. (Default:
  `You are a very enthusiastic company representative who loves to help people!`)
- `chatOptions.temperature` (`number`): The model temperature. (Default: `0.1`)
- `chatOptions.topP` (`number`): The model top P. (Default: `1`)
- `chatOptions.frequencyPenalty` (`number`): The model frequency penalty.
  (Default: `0`)
- `chatOptions.presencePenalty` (`number`): The model presence penalty.
  (Default: `0`)
- `chatOptions.maxTokens` (`number`): The max number of tokens to include in the
  response. (Default: `500`)
- `chatOptions.sectionsMatchCount` (`number`): The number of sections to include
  in the prompt context. (Default: `10`)
- `chatOptions.sectionsMatchThreshold` (`number`): The similarity threshold
  between the input question and selected sections. (Default: `0.5`)
- `chat.tools`: (`OpenAI.ChatCompletionTool[]`): A list of tools the model may call.
- `chat.tool_choice`: (`OpenAI.ChatCompletionToolChoiceOption`): Controls which (if any) function is called by the model.
- `close`: Options for the close modal button
- `close.label` (`string`): `aria-label` for the close modal button (Default:
  `Close Markprompt`)
- `close.visible` (`boolean`): Show the close button (Default: `true`)
- `feedbackOptions` (`MarkpromptOptions['feedback']`): Options for the feedback
  component
- `feedbackOptions.enabled` (`boolean`): Enable users to give feedback on prompt
  or chat answers. (Default: `true`)
- `feedbackOptions.apiUrl` (`string`): URL at which to deliver feedback.
  (Default: `https://api.markprompt.com/v1/feedback`)
- `onDidSelectReference` (`function(reference: FileSectionReference): void`):
  Callback when a reference is selected
- `referencesOptions` (`MarkpromptOptions['references']`): Options for the
  references
- `referencesOptions.getHref` (`function`): Callback to transform a reference
  into an href
- `referencesOptions.getLabel` (`function`): Callback to transform a reference
  into an label to show for the link
- `referencesOptions.loadingText` (`string`): Loading text (Default:
  `Fetching relevant pages…`)
- `referencesOptions.heading` (`string`): Heading for the references panel
  (Default: `Answer generated from the following sources:`)

### `<PromptView />`

A prompt view component, renders a complete prompt view. Can be used standalone.
It accepts the following props:

- `projectKey` (`string`): The project key associated to your project. It can be
  obtained in the project settings on [Markprompt.com](https://markprompt.com/)
  under "Project key"
- `activeView` (`"chat" | "prompt" | "search"`): The active view. (Default:
  `undefined`)
- `promptOptions` (`object`): Options for the prompt view
- `promptOptions.enabled` (`boolean`): Whether or not to enable the prompt view.
  Disables `prompt` (Default: `false`)
- `promptOptions.label` (`string`): Label for the prompt input (Default:
  `Ask AI`)
- `promptOptions.tabLabel` (`string`): Label for the tab bar (Default: `Ask AI`)
- `promptOptions.placeholder` (`string`): Placeholder for the prompt input
  (Default: `Ask AI…`)
- `promptOptions.apiUrl` (`string`): URL at which to fetch completions.
  (Default: `https://api.markprompt.com/v1/prompt`)
- `promptOptions.iDontKnowMessage` (`string`): Message returned when the model
  does not have an answer. (Default: `Sorry, I am not sure how to answer that.`)
- `promptOptions.model` (`string`): The OpenAI model to use. (Default:
  `gpt-3.5-turbo`)
- `promptOptions.systemPrompt` (`string`): The prompt template. (Default:
  `You are a very enthusiastic company representative who loves to help people!`)
- `promptOptions.temperature` (`number`): The model temperature. (Default:
  `0.1`)
- `promptOptions.topP` (`number`): The model top P. (Default: `1`)
- `promptOptions.frequencyPenalty` (`number`): The model frequency penalty.
  (Default: `0`)
- `promptOptions.presencePenalty` (`number`): The model presence penalty.
  (Default: `0`)
- `promptOptions.maxTokens` (`number`): The max number of tokens to include in
  the response. (Default: `500`)
- `promptOptions.sectionsMatchCount` (`number`): The number of sections to
  include in the prompt context. (Default: `10`)
- `promptOptions.sectionsMatchThreshold` (`number`): The similarity threshold
  between the input question and selected sections. (Default: `0.5`)
- `promptOption.tools`: (`OpenAI.ChatCompletionTool[]`): A list of tools the model may call.
- `promptOption.tool_choice`: (`OpenAI.ChatCompletionToolChoiceOption`): Controls which
- `close`: Options for the close modal button
- `close.label` (`string`): `aria-label` for the close modal button (Default:
  `Close Markprompt`)
- `close.visible` (`boolean`): Show the close button (Default: `true`)
- `feedbackOptions` (`MarkpromptOptions['feedback']`): Options for the feedback
  component
- `feedbackOptions.enabled` (`boolean`): Enable users to give feedback on prompt
  or chat answers. (Default: `true`)
- `feedbackOptions.apiUrl` (`string`): URL at which to deliver feedback.
  (Default: `https://api.markprompt.com/v1/feedback`)
- `onDidSelectReference` (`function(reference: FileSectionReference): void`):
  Callback when a reference is selected
- `referencesOptions` (`MarkpromptOptions['references']`): Options for the
  references
- `referencesOptions.getHref` (`function`): Callback to transform a reference
  into an href
- `referencesOptions.getLabel` (`function`): Callback to transform a reference
  into an label to show for the link
- `referencesOptions.loadingText` (`string`): Loading text (Default:
  `Fetching relevant pages…`)
- `referencesOptions.heading` (`string`): Heading for the references panel
  (Default: `Answer generated from the following sources:`)

### `<SearchView />`

A search view component, renders a complete search view. Can be used standalone.
It accepts the following props:

- `projectKey` (`string`): The project key associated to your project. It can be
  obtained in the project settings on [Markprompt.com](https://markprompt.com/)
  under "Project key"
- `activeView` (`"chat" | "prompt" | "search"`): The active view. (Default:
  `undefined`)
- `close`: Options for the close modal button
- `close.label` (`string`): `aria-label` for the close modal button (Default:
  `Close Markprompt`)
- `close.visible` (`boolean`): Show the close button (Default: `true`)
- `debug` (`boolean`): Enable debug mode. (Default: `false`)
- `onDidSelectResult` (`function(): void`): Callback when a search result is
  selected
- `searchOptions` (`object`): Options for search
- `searchOptions.enabled` (`boolean`): Whether or not to enable search.
  (Default: `false`)
- `searchOptions.getHref` (`function`): Callback to transform a search result
  into an href
- `searchOptions.getHeading` (`function`): Callback to transform a search result
  into a heading
- `searchOptions.getTitle` (`function`): Callback to transform a search result
  into a title
- `searchOptions.getSubtitle` (`function`): Callback to transform a search
  result into a subtitle
- `searchOptions.label` (`string`): Label for the search input, not shown but
  used for `aria-label` (Default: `Search docs…`)
- `searchOptions.tabLabel` (`string`): Label for the tab bar (Default: `Search`)
- `searchOptions.placeholder` (`string`): Placeholder for the search input
  (Default: `Search docs…`)
- `searchOptions.limit` (`number`): Maximum amount of results to return.
  (Default: `5`)
- `searchOptions.apiUrl` (`string`): URL at which to fetch search results.
  (Default: `https://api.markprompt.com/v1/search`)
- `searchOptions.provider` (`object`): A custom search provider configuration,
  such as Algolia

### `<Answer />`

Render the markdown answer from the Markprompt API. It accepts the same props as
[`react-markdown`](https://github.com/remarkjs/react-markdown#props), except
`children`.

### `<AutoScroller />`

A component automatically that scrolls to the bottom. It accepts the following
props:

- `autoScroll` (`boolean`): Whether or not to enable automatic scrolling.
  (Default: `true`)
- `scrollBehaviour` (`string`): The behaviour to use for scrolling. (Default:
  `smooth`)

All other props will be passed to the underlying `<div>` element.

### `<Close />`

A button to close the Markprompt dialog and abort an ongoing request. It accepts
the same props as
[Radix UI `Dialog.Close`](https://www.radix-ui.com/docs/primitives/components/dialog#close).

### `<Content />`

The Markprompt dialog content. It accepts the same props as
[Radix UI `Dialog.Content`](https://www.radix-ui.com/docs/primitives/components/dialog#content),
with the following additional prop:

### `<Description />`

A visually hidden aria description. It accepts the same props as
[Radix UI `Dialog.Description`](https://www.radix-ui.com/docs/primitives/components/dialog#description),
with the following additional prop:

- `hide` (`boolean`): Hide the description.

### `<Form />`

A form which, when submitted, submits the current prompt. It accepts the same
props as `<form>`.

### `<Overlay />`

The Markprompt dialog overlay. It accepts the same props as
[Radix UI `Dialog.Overlay`](https://www.radix-ui.com/docs/primitives/components/dialog#overlay).

### `<Portal />`

The Markprompt dialog portal. It accepts the same props as
[Radix UI `Dialog.Portal`](https://www.radix-ui.com/docs/primitives/components/dialog#portal).

### `<Prompt />`

The Markprompt input prompt. User input will update the prompt in the Markprompt
context. It accepts the following props:

- `label` (`ReactNode`): The label for the input.
- `labelClassName` (`string`): The class name of the label element.

### `<References />`

Render the references that Markprompt returns. It accepts the following props:

- `RootComponent` (`Component`): The wrapper component to render. (Default:
  `'ul'`)
- `ReferenceComponent` (`Component`): The component to render for each
  reference. (Default: '`li`')

### `<Root />`

The Markprompt context provider and dialog root. It accepts the
[Radix UI `Dialog.Root`](https://www.radix-ui.com/docs/primitives/components/dialog#root)
props and the `useMarkprompt`options as props.

### `<Title />`

A visually hidden aria title. It accepts the same props as
[Radix UI `Dialog.Title`](https://www.radix-ui.com/docs/primitives/components/dialog#title),
with the following additional prop:

- `hide` (`boolean`): Hide the title.

### `<Trigger />`

A button to open the Markprompt dialog. It accepts the same props as
[Radix UI `Dialog.Trigger`](https://www.radix-ui.com/docs/primitives/components/dialog#trigger).

### `useChat(options): UseChatResult`

Create a chat prompt. It accepts the following options:

- `options` (`UseChatOptions`): Options for `useChat`.
  - `options.chatOptions` (`SubmitChatOptions`): Options passed to `submitChat`
    from `@markprompt/core`
    - `chatOptions.apiUrl` (`string`): URL at which to fetch completions.
      (Default: `https://api.markprompt.com/v1/chat`)
    - `chatOptions.frequencyPenalty` (`number`): The model frequency penalty.
      (Default: `0`)
    - `chatOptions.iDontKnowMessage` (`string`): Message returned when the model
      does not have an answer. (Default:
      `Sorry, I am not sure how to answer that.`)
    - `chatOptions.maxTokens` (`number`): The max number of tokens to include in
      the response. (Default: `500`)
    - `chatOptions.model` (`string`): The OpenAI model to use. (Default:
      `gpt-3.5-turbo`)
    - `chatOptions.presencePenalty` (`number`): The model presence penalty.
      (Default: `0`)
    - `chatOptions.sectionsMatchCount` (`number`): The number of sections to
      include in the prompt context. (Default: `10`)
    - `chatOptions.sectionsMatchThreshold` (`number`): The similarity threshold
      between the input question and selected sections. (Default: `0.5`)
    - `chatOptions.sectionsScope` (`number`): When a section is matched, extend the context to the parent section. For instance, if a section has level 3 and `sectionsScope` is set to 1, include the content of the entire parent section of level 1. If 0, this includes the entire file. (Default: `undefined`)
    - `chatOptions.systemPrompt` (`string`): The prompt template. (Default:
      `You are a very enthusiastic company representative who loves to help people!`)
    - `chatOptions.temperature` (`number`): The model temperature. (Default:
      `0.1`)
    - `chatOptions.topP` (`number`): The model top P. (Default: `1`)
    - `chatOptions.tools`: (`OpenAI.ChatCompletionTool[]`): A list of tools the model may call.
    - `chatOptions.tool_choice`: (`OpenAI.ChatCompletionToolChoiceOption`): Controls which
  - `options.debug` (`boolean`): Enable debug mode. (Default: `false`)
  - `options.feedbackOptions` (`SubmitFeedbackOptions`): Options for
    `useFeedback`.
    - `options.apiUrl` (`string`): URL at which to deliver feedback. (Default:
      `https://api.markprompt.com/v1/feedback`)
  - `options.projectKey` (`string`): The project key associated to your project.
    It can be obtained in the project settings on
    [Markprompt.com](https://markprompt.com/) under "Your Project > Settings >
    Project key"

And it returns:

- `result` (`UseChatResult`)
  - `result.abort` (`function(): void`): Abort the current chat completions
    request.
  - `result.abortFeedbackRequest` (`string`): Abort the current feedback
    request.
  - `result.messages` (`ChatViewMessage[]`): The messages of the current chat
    session.
  - `result.promptId` (`string`): The prompt id of the last message.
  - `result.regenerateLastAnswer` (`function(): void`): Regenerate the last
    answer.
  - `result.submitChat` (`function(prompt: string): void`): Submit a chat
    prompt.
  - `result.submitFeedback`
    (`function(feedback: PromptFeedback, state: ChatLoadingState, messageIndex: number)`):
    Submit feedback for the last answer.

### `useFeedback(options): UseFeedbackResult`

Create a chat prompt. It accepts the following options:

- `options` (`UseFeedbackOptions`): Options for `useFeedback`.
  - `options.debug` (`boolean`): Enable debug mode. (Default: `false`)
  - `options.feedbackOptions` (`SubmitFeedbackOptions`): Options for
    `@markprompt/core`'s `submitFeedback`.
    - `options.apiUrl` (`string`): URL at which to deliver feedback. (Default:
      `https://api.markprompt.com/v1/feedback`)
  - `options.projectKey` (`string`): The project key associated to your project.
    It can be obtained in the project settings on
    [Markprompt.com](https://markprompt.com/) under "Your Project > Settings >
    Project key"
  - `options.promptId` (`string`): The prompt id to submit feedback for.

And it returns:

- `result` (`UseFeedbackResult`)
  - `result.abort` (`function(): void`): Abort the current feedback request.
  - `result.submitFeedback`
    (`function(feedback: PromptFeedback, state: ChatLoadingState, messageIndex: number)`):
    Submit feedback for the last answer.

### `usePrompt(options): UsePromptResult`

Create a prompt. It accepts the following options:

- `options` (`UsePromptOptions`): Options for `usePrompt`.
  - `options.debug` (`boolean`): Enable debug mode. (Default: `false`)
  - `options.feedbackOptions` (`SubmitFeedbackOptions`): Options for
    `useFeedback`.
    - `options.apiUrl` (`string`): URL at which to deliver feedback. (Default:
      `https://api.markprompt.com/v1/feedback`)
  - `options.projectKey` (`string`): The project key associated to your project.
    It can be obtained in the project settings on
    [Markprompt.com](https://markprompt.com/) under "Your Project > Settings >
    Project key"
  - `options.promptOptions` (`SubmitPromptOptions`): Options for
    `@markprompt/core`'s `submitPrompt`
    - `promptOptions.apiUrl` (`string`): URL at which to fetch completions.
      (Default: `https://api.markprompt.com/v1/completions`)
    - `promptOptions.frequencyPenalty` (`number`): The model frequency penalty.
      (Default: `0`)
    - `promptOptions.iDontKnowMessage` (`string`): Message returned when the
      model does not have an answer. (Default:
      `Sorry, I am not sure how to answer that.`)
    - `promptOptions.maxTokens` (`number`): The max number of tokens to include
      in the response. (Default: `500`)
    - `promptOptions.model` (`string`): The OpenAI model to use. (Default:
      `gpt-3.5-turbo`)
    - `promptOptions.presencePenalty` (`number`): The model presence penalty.
      (Default: `0`)
    - `promptOptions.sectionsMatchCount` (`number`): The number of sections to
      include in the prompt context. (Default: `10`)
    - `promptOptions.sectionsMatchThreshold` (`number`): The similarity
      threshold between the input question and selected sections. (Default:
      `0.5`)
    - `promptOptions.sectionsScope` (`number`): When a section is matched, extend the context to the parent section. For instance, if a section has level 3 and `sectionsScope` is set to 1, include the content of the entire parent section of level 1. If 0, this includes the entire file. (Default: `undefined`)
    - `promptOptions.systemPrompt` (`string`): The prompt template. (Default:
      `You are a very enthusiastic company representative who loves to help people!`)
    - `promptOptions.temperature` (`number`): The model temperature. (Default:
      `0.1`)
    - `promptOptions.topP` (`number`): The model top P. (Default: `1`)

And it returns:

- `result` (`UsePromptResult`)
  - `result.answer` (`string`): The answer for the current prompt
  - `result.prompt` (`string`): The current prompt
  - `result.references` (`FileSectionReference[]`): References for the current
    prompt. Can be used to render a list of references.
  - `result.state` (`PromptLoadingState`): The loading state of the current
    completions request
  - `result.abort` (`function(): void`): Abort the current prompt completions
    request.
  - `result.abortFeedbackRequest` (`string`): Abort the current feedback
    request.
  - `result.setPrompt` (`function(prompt: string): void`): Set the prompt.
  - `result.submitFeedback`
    (`function(feedback: PromptFeedback, state: PromptLoadingState)`): Submit
    feedback for the last answer.
  - `result.submitPrompt` (`function(): void`): Submit the prompt.

### `useSearch(options): UseSearchResult`

Create a search prompt. It accepts the following options:

- `options` (`UseSearchOptions`): Options for `useSearch`.
  - `options.debug` (`boolean`): Enable debug mode. (Default: `false`)
  - `options.projectKey` (`string`): The project key associated to your project.
    It can be obtained in the project settings on
    [Markprompt.com](https://markprompt.com/) under "Your Project > Settings >
    Project key"
  - `options.searchOptions` (`SubmitSearchOptions`): Options for
    `@markprompt/core`'s `submitSearch`
    - `searchOptions.apiUrl` (`string`): URL at which to fetch search results.
      (Default: `https://api.markprompt.com/v1/search`)
    - `searchOptions.limit` (`number`): Maximum amount of results to return.
      (Default: `8`)
    - `searchOptions.provider` (`AlgoliaProvider`): A custom search provider
      configuration, such as Algolia
      - `provider.apiKey` (`string`): The API key to use for the search provider
      - `provider.appId` (`string`): The app ID to use for the search provider
      - `provider.indexName` (`string`): The index name to use for the search
        provider
      - `provider.name` (`"algolia"`): The name of the custom provider.
        Currently only `algolia` is supported.
      - `provider.searchParameters` (`object`): Additional search parameters to
        pass to the search provider

And it returns:

- `result` (`UseSearchResult`): The search result
  - `result.abort` (`function(): void`): Abort the current search request.
  - `result.searchQuery` (`string`): The current search query
  - `result.searchResults` (`SearchResultComponentProps[]`): The current search
    results
  - `result.state` (`SearchLoadingState`): The loading state of the current
    search request
  - `result.submitSearchQuery` (`function(query: string): void`): Submit a
    search query.
  - `result.setSearchQuery` (`function(query: string): void`): Set the search
    query.

## Documentation

The full documentation for the component can be found on the
[Markprompt docs](https://markprompt.com/docs#react).

## Starter Template

For a working setup based on Next.js + Tailwind, check out the
[Markprompt starter template](https://github.com/motifland/markprompt-starter-template).

## Community

- [X](https://x.com/markprompt)
- [Discord](https://discord.gg/MBMh4apz6X)

## Authors

This library is created by the team behind [Markprompt](https://markprompt.com)
([@markprompt](https://x.com/markprompt)).

## License

[MIT](./LICENSE) © [Markprompt](https://markprompt.com)
