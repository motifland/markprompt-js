export {
  submitChat,
  type SubmitChatOptions,
  type ChatMessage,
  DEFAULT_SUBMIT_CHAT_OPTIONS,
  submitChatGenerator,
  type SubmitChatGeneratorOptions,
  DEFAULT_SUBMIT_CHAT_GENERATOR_OPTIONS,
} from './chat.js';

export {
  submitFeedback,
  type SubmitFeedbackOptions,
  type SubmitFeedbackBody,
  DEFAULT_SUBMIT_FEEDBACK_OPTIONS,
} from './feedback.js';

export {
  submitSearchQuery,
  submitAlgoliaDocsearchQuery,
  type SubmitSearchQueryOptions,
  DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS,
} from './search.js';

export {
  OPENAI_CHAT_COMPLETIONS_MODELS,
  OPENAI_COMPLETIONS_MODELS,
  OPENAI_EMBEDDINGS_MODEL,
  type AlgoliaDocSearchHit,
  type AlgoliaDocSearchResultsResponse,
  type FileReferenceFileData,
  type FileSectionReference,
  type FileSectionReferenceSectionData,
  type OpenAIChatCompletionsModelId,
  type OpenAICompletionsModelId,
  type OpenAIEmbeddingsModelId,
  type OpenAIModelId,
  type PromptFeedback,
  type SearchResult,
  type SearchResultSection,
  type SearchResultsResponse,
  type Source,
  type SourceType,
} from './types.js';

export { isAbortError } from './utils.js';
