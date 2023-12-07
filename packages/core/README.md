# `@markprompt/core`

`@markprompt/core` is the core library for Markprompt, a conversational AI
component for your website, trained on your data.

It contains core functionality for Markprompt and allows you to build
abstractions on top of it.

<br />
<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@markprompt/core">
    <img alt="" src="https://badgen.net/npm/v/@markprompt/core">
  </a>
  <a aria-label="License" href="https://github.com/motifland/markprompt-js/blob/main/packages/core/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/@markprompt/core">
  </a>
</p>

## Installation

```sh
npm install @markprompt/core
```

In browsers with [esm.sh](https://esm.sh):

```html
<script type="module">
  import {
    submitChat,
    submitSearchQuery,
    submitFeedback,
  } from 'https://esm.sh/@markprompt/core';
</script>
```

## Usage

```js
import { submitChat } from '@markprompt/core';

// User input
const prompt = 'What is Markprompt?';
// Can be obtained in your project settings on markprompt.com
const projectKey = 'YOUR-PROJECT-KEY';

// Called when a new answer chunk is available
// Should be concatenated to previous chunks
function onAnswerChunk(chunk) {
  // Process an answer chunk
}

// Called when references are available
function onReferences(references) {
  // Process references
}

function onConversationId(conversationId) {
  // Store conversationId for future use
}

function onPromptId(promptId) {
  // Store promptId for future use
}

// Called when submitChat encounters an error
function onError(error) {
  // Handle errors
}

// Optional parameters, defaults displayed
const options = {
  model: 'gpt-3.5-turbo', // Supports all OpenAI models
  iDontKnowMessage: 'Sorry, I am not sure how to answer that.',
  apiUrl: 'https://api.markprompt.com/v1/chat', // Or your own chat API endpoint
};

await submitChat(
  [{ content: prompt, role: 'user' }],
  projectKey,
  onAnswerChunk,
  onReferences,
  onConversationId,
  onPromptId,
  onError,
  options,
);
```

## API

### `submitChat(messages: ChatMessage[], projectKey: string, onAnswerChunk, onReferences, onConversationId, onPromptId, onError, options?)`

Submit a prompt to the Markprompt Completions API.

#### Arguments

- `messages` (`ChatMessage[]`): Chat messages to submit to the model
- `projectKey` (`string`): Project key for the project
- `onAnswerChunk` (`function(chunk: string)`): Answers come in via streaming.
  This function is called when a new chunk arrives. Chunks should be
  concatenated to previous chunks of the same answer response.
- `onReferences` (`function(references: FileSectionReference[])`): This function
  is called when receiving the list of references from which the response was
  created.
- `onConversationId` (`function(conversationId: string)`): This function is
  called with the conversation ID returned by the API. Used to keep track of
  conversations.
- `onPromptId` (`function(promptId: string)`): This function is called with the
  prompt ID returned by the API. Used to submit feedback.
- `onError` (`function`): called when an error occurs
- [`options`](#options) (`SubmitChatOptions`): Optional parameters

#### Options

All options are optional.

- `apiUrl` (`string`): URL at which to fetch completions
- `conversationId` (`string`): Conversation ID
- `iDontKnowMessage` (`string`): Message returned when the model does not have
  an answer
- `model` (`OpenAIModelId`): The OpenAI model to use
- `systemPrompt` (`string`): The prompt template
- `temperature` (`number`): The model temperature
- `topP` (`number`): The model top P
- `frequencyPenalty` (`number`): The model frequency penalty
- `presencePenalty` (`number`): The model present penalty
- `maxTokens` (`number`): The max number of tokens to include in the response
- `sectionsMatchCount` (`number`): The number of sections to include in the
  prompt context
- `sectionsMatchThreshold` (`number`): The similarity threshold between the
- `sectionsScope` (`number`): When a section is matched, extend the context to the parent section. For instance, if a section has level 3 and `sectionsScope` is set to 1, include the content of the entire parent section of level 1. If 0, this includes the entire file.
- `signal` (`AbortSignal`): AbortController signal
- `tools`: (`OpenAI.ChatCompletionTool[]`): A list of tools the model may call
- `tool_choice`: (`OpenAI.ChatCompletionToolChoiceOption`): Controls which (if any) function is called by the model

#### Returns

A promise that resolves when the response is fully handled.

### `submitSearchQuery(query, projectKey, options?)`

Submit a search query to the Markprompt Search API.

#### Arguments

- `query` (`string`): Search query
- `projectKey` (`string`): Project key for the project
- [`options`](#options) (`object`): Optional parameters

#### Options

- `apiUrl` (`string`): URL at which to fetch search results
- `limit` (`number`): Maximum amount of results to return
- `signal` (`AbortSignal`): AbortController signal

#### Returns

A list of search results.

### `submitFeedback(feedback, projectKey, options?)`

Submit feedback to the Markprompt Feedback API about a specific prompt.

#### Arguments

- `feedback` (`object`): Feedback to submit
- `feedback.feedback` (`object`): Feedback data
- `feedback.feedback.vote` (`"1" | "-1"`): Vote
- `feedback.promptId` (`string`): Prompt ID
- `projectKey` (`string`): Project key for the project
- `options` (`object`): Optional parameters
- `options.apiUrl` (`string`): URL at which to post feedback
- `options.onFeedbackSubmitted` (`function`): Callback function when feedback
  is submitted
- `options.signal` (`AbortSignal`): AbortController signal

#### Returns

A promise that resolves when the feedback is submitted. Has no return value.

## Community

- [X](https://x.com/markprompt)
- [Discord](https://discord.gg/MBMh4apz6X)

## Authors

This library is created by the team behind [Markprompt](https://markprompt.com)
([@markprompt](https://x.com/markprompt)).

## License

[MIT](./LICENSE) © [Markprompt](https://markprompt.com)
