export {
  DEFAULT_SUBMIT_CHAT_OPTIONS,
  submitChat,
  type ChatMessage,
  type SubmitChatOptions,
  type SubmitChatReturn,
  type SubmitChatYield,
} from './chat.js';

export {
  DEFAULT_SUBMIT_FEEDBACK_OPTIONS,
  submitFeedback,
  type SubmitFeedbackBody,
  type SubmitFeedbackOptions,
} from './feedback.js';

export {
  DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS,
  submitAlgoliaDocsearchQuery,
  submitSearchQuery,
  type SubmitSearchQueryOptions,
  type AlgoliaProvider,
} from './search.js';

export {
  OPENAI_CHAT_COMPLETIONS_MODELS,
  OPENAI_COMPLETIONS_MODELS,
  OPENAI_EMBEDDINGS_MODEL,
  type AlgoliaDocSearchHit,
  type AlgoliaDocSearchResultsResponse,
  type Chat,
  type ChatCompletion,
  type ChatCompletionAssistantMessageParam,
  type ChatCompletionChunk,
  type ChatCompletionFunctionMessageParam,
  type ChatCompletionMessage,
  type ChatCompletionMessageParam,
  type ChatCompletionMessageToolCall,
  type ChatCompletionSystemMessageParam,
  type ChatCompletionTool,
  type ChatCompletionToolChoiceOption,
  type ChatCompletionToolMessageParam,
  type ChatCompletionUserMessageParam,
  type FileReferenceFileData,
  type FileSectionReference,
  type FileSectionReferenceSectionData,
  type OpenAIChatCompletionsModelId,
  type OpenAICompletionsModelId,
  type OpenAIEmbeddingsModelId,
  type OpenAIModelId,
  type MessageFeedback,
  type SearchResult,
  type SearchResultSection,
  type SearchResultsResponse,
  type Source,
  type SourceType,
} from './types.js';

export {
  getErrorMessage,
  isAbortError,
  isChatCompletion,
  isChatCompletionChunk,
  isChatCompletionMessage,
  isFileSectionReferences,
  isKeyOf,
  isMarkpromptMetadata,
  isToolCall,
  isToolCalls,
  parseEncodedJSONHeader,
} from './utils.js';
