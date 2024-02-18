import {
  isAbortError,
  isToolCall,
  isToolCalls,
  submitChat,
  type ChatCompletionAssistantMessageParam,
  type ChatCompletionMessageParam,
  type ChatCompletionMessageToolCall,
  type ChatCompletionTool,
  type ChatCompletionToolMessageParam,
  type SubmitChatOptions,
  type SubmitChatYield,
  type ChatCompletionChunk,
} from '@markprompt/core';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { createStore, useStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { MarkpromptOptions } from '../types.js';
import {
  hasValueAtKey,
  isIterable,
  isPresent,
  isStoredError,
} from '../utils.js';

export type ChatLoadingState =
  | 'indeterminate'
  | 'preload'
  | 'streaming-answer'
  | 'done'
  | 'cancelled';

export interface ToolCall {
  status: 'loading' | 'done' | 'error';
  error?: string;
  result?: string;
}

export interface ChatViewMessage
  extends Omit<SubmitChatYield, 'conversationId'> {
  id: ReturnType<typeof crypto.randomUUID>;
  state: ChatLoadingState;
  name?: string;
  error?: Error;
}

function toApiMessages(
  messages: (ChatViewMessage & { tool_call_id?: string })[],
): ChatCompletionMessageParam[] {
  return (
    messages
      .map(({ content, role, tool_calls, tool_call_id, name }) => {
        if (!content && !tool_calls) {
          // Ignore empty messages unless it's a tool_call
          return undefined;
        }
        switch (role) {
          case 'assistant': {
            const msg: ChatCompletionAssistantMessageParam = {
              content: content ?? null,
              role,
            };

            if (isToolCalls(tool_calls)) {
              msg.tool_calls = tool_calls;
            }

            return msg;
          }
          // case 'system': {
          //   return {
          //     content: content ?? null,
          //     role,
          //   } satisfies ChatCompletionSystemMessageParam;
          // }
          case 'tool': {
            if (!tool_call_id) throw new Error('tool_call_id is required');
            if (!content) throw new Error('content is required');
            return {
              content,
              role,
              tool_call_id,
            } satisfies ChatCompletionToolMessageParam;
          }
          case 'user': {
            if (!content) throw new Error('content is required');
            return {
              content,
              role,
              ...(name ? { name } : {}),
            } satisfies ChatCompletionMessageParam;
          }
        }
      })
      .filter(isPresent)
      // remove the last message if role is assistant and content is null
      // we add this message locally as a placeholder for ourself and OpenAI errors out
      // if we send it to them
      .filter(
        (m, i, arr) =>
          !(
            i === arr.length - 1 &&
            m.role === 'assistant' &&
            m.content === null
          ),
      )
  );
}

export interface ConfirmationProps {
  /**
   * Tool calls as returned by the model
   */
  toolCalls: ChatCompletionMessageToolCall[];
  /**
   * Status and results of tool calls
   */
  toolCallsStatus: { [key: string]: ToolCall };
  /**
   * Tools as provided by the user
   */
  tools?: ChatViewTool[];
  confirmToolCalls: () => void;
}

export interface ChatViewTool {
  /**
   * OpenAI tool definition.
   */
  tool: ChatCompletionTool;
  /**
   * The actual function to call. Called with a JSON string as returned from
   * OpenAI. Should validate the JSON for correctness as OpenAI can hallucinate
   * arguments. Must return a string to feed the result back into OpenAI.
   **/
  call: (args: string) => Promise<string>;
  /**
   * Whether user needs to confirm a call to this function or function calls
   * will be executed right away.
   * @default true
   */
  requireConfirmation?: boolean;
  /**
   * If true, show a message when the tool is automatically triggered.
   * @default true
   */
  showDefaultAutoTriggerMessage?: boolean;
}

export type UserConfigurableOptions = Omit<
  SubmitChatOptions,
  'signal' | 'tools'
> & {
  tools?: ChatViewTool[];
  /**
   * An optional user-provided confirmation message component that takes the tool calls
   * provided by OpenAI and a confirm function that should be called when the user
   * confirms the tool calls.
   */
  ToolCallsConfirmation?: (props: ConfirmationProps) => JSX.Element;
};

export interface ChatStoreState {
  abort?: () => void;
  projectKey: string;
  conversationId?: string;
  setConversationId: (conversationId: string) => void;
  selectConversation: (conversationId?: string) => void;
  messages: ChatViewMessage[];
  setMessages: (messages: ChatViewMessage[]) => void;
  setMessageById(id: string, next: Partial<ChatViewMessage>): void;
  setMessageByIndex: (index: number, next: Partial<ChatViewMessage>) => void;
  setToolCallById: (toolCallId: string, next: Partial<ToolCall>) => void;
  conversationIdsByProjectKey: {
    [projectKey: string]: string[];
  };
  messagesByConversationId: {
    [conversationId: string]: {
      lastUpdated: string;
      messages: ChatViewMessage[];
    };
  };
  toolCallsByToolCallId: {
    [tool_call_id: string]: ToolCall;
  };
  submitChat: (
    messages: (
      | { content: string; role: 'user'; name?: string }
      | {
          role: 'assistant';
          tool_calls: ChatCompletionChunk.Choice.Delta.ToolCall[];
        }
      | { content: string; role: 'tool'; name: string; tool_call_id: string }
    )[],
  ) => void;
  submitToolCalls: (message: ChatViewMessage) => Promise<void>;
  options: UserConfigurableOptions;
  setOptions: (options: UserConfigurableOptions) => void;
  regenerateLastAnswer: () => void;
}

export interface CreateChatOptions {
  chatOptions: UserConfigurableOptions;
  debug?: boolean;
  persistChatHistory?: boolean;
  projectKey: string;
}

/**
 * Creates a chat store for a given project key.
 * Keeps track of messages by project key and conversation id.
 *
 * @param projectKey - Markprompt project key
 * @param persistChatHistory - Should chat history be persisted in local storage?
 */
export const createChatStore = ({
  chatOptions,
  debug,
  persistChatHistory,
  projectKey, // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
}: CreateChatOptions) => {
  if (!projectKey) {
    throw new Error(
      `Markprompt: a project key is required. Make sure to pass your Markprompt project key to createChatStore.`,
    );
  }

  return createStore<ChatStoreState>()(
    immer(
      persist(
        (set, get) => ({
          projectKey,
          messages: [],
          conversationIdsByProjectKey: {
            [projectKey]: [],
          },
          messagesByConversationId: {},
          toolCallsByToolCallId: {},
          setConversationId: (conversationId: string) => {
            set((state) => {
              // set the conversation id for this session
              state.conversationIdsByProjectKey[projectKey] ??= [];
              state.conversationId = conversationId;

              if (!isIterable(state.conversationIdsByProjectKey[projectKey])) {
                // Backward-compatibility
                state.conversationIdsByProjectKey[projectKey] = [];
              }

              // save the conversation id for this project, for later sessions
              state.conversationIdsByProjectKey[projectKey] = [
                ...new Set([
                  ...state.conversationIdsByProjectKey[projectKey],
                  conversationId,
                ]),
              ];

              // save the messages for this conversation
              state.messagesByConversationId[conversationId] = {
                lastUpdated: new Date().toISOString(),
                messages: state.messages,
              };
            });
          },
          selectConversation: (conversationId?: string) => {
            set((state) => {
              if (!conversationId) {
                // start a new conversation
                state.conversationId = undefined;
                state.messages = [];
                return;
              }

              // restore an existing conversation
              state.conversationId = conversationId;
              state.messages =
                state.messagesByConversationId[conversationId]?.messages ?? [];
            });
          },
          setMessages: (messages: ChatViewMessage[]) => {
            set((state) => {
              state.messages = messages;

              const conversationId = state.conversationId;
              if (!conversationId) return;

              // save the message to local storage
              state.messagesByConversationId[conversationId] = {
                lastUpdated: new Date().toISOString(),
                messages,
              };
            });
          },
          setMessageByIndex: (
            index: number,
            next: Partial<ChatViewMessage>,
          ) => {
            set((state) => {
              let currentMessage = state.messages[index] ?? {};

              // update the current message
              currentMessage = { ...currentMessage, ...next };
              state.messages[index] = currentMessage;

              const conversationId = state.conversationId;
              if (!conversationId) return;

              // save the message to local storage
              state.messagesByConversationId[conversationId] = {
                lastUpdated: new Date().toISOString(),
                messages: state.messages,
              };
            });
          },
          setMessageById: (id: string, next: Partial<ChatViewMessage>) => {
            set((state) => {
              let index = state.messages.findIndex((m) => m.id === id);
              index = index === -1 ? state.messages.length : index;

              let currentMessage = state.messages[index] ?? {};
              currentMessage = {
                ...currentMessage,
                ...next,
              };
              state.messages[index] = currentMessage;

              const conversationId = state.conversationId;
              if (!conversationId) return;

              // save the message to local storage
              state.messagesByConversationId[conversationId] = {
                lastUpdated: new Date().toISOString(),
                messages: state.messages,
              };
            });
          },
          setToolCallById(toolCallId, next) {
            set((state) => {
              state.toolCallsByToolCallId[toolCallId] = {
                ...state.toolCallsByToolCallId[toolCallId],
                ...next,
              };
            });
          },
          submitChat: async (messages) => {
            const messageIds = Array.from({ length: messages.length }, () =>
              self.crypto.randomUUID(),
            );
            const responseId = self.crypto.randomUUID();

            set((state) => {
              state.messages.push(
                ...messages.map((message, i) => ({
                  ...message,
                  id: messageIds[i],
                  references: [],
                  state: 'indeterminate' as const,
                })),
                // also create a placeholder message for the assistants response
                {
                  id: responseId,
                  role: 'assistant',
                  state: 'indeterminate',
                },
              );
            });

            // abort any pending or ongoing requests
            get().abort?.();

            const prevMessageId = get().messages.findLast(
              (m) =>
                m.role === 'user' &&
                m.state !== 'done' &&
                m.state !== 'cancelled' &&
                !messageIds.includes(m.id),
            )?.id;

            if (prevMessageId) {
              get().setMessageById(prevMessageId, {
                state: 'cancelled',
              });
            }

            // create a new abort controller
            const controller = new AbortController();
            const abort = (): void => {
              controller.abort();
              for (const id of [...messageIds, responseId]) {
                get().setMessageById(id, {
                  state: 'cancelled',
                });
              }
            };
            set((state) => {
              state.abort = abort;
            });

            // Get ready to do the request
            const apiMessages = toApiMessages(get().messages);

            for (const id of [...messageIds, responseId]) {
              get().setMessageById(id, {
                state: 'preload',
              });
            }

            const options = {
              debug,
              conversationId: get().conversationId,
              signal: controller.signal,
              ...get().options,
              tools: get().options?.tools?.map((x) => x.tool),
            } satisfies SubmitChatOptions;

            // do the chat completion request
            try {
              for await (const chunk of submitChat(
                apiMessages,
                projectKey,
                options,
              )) {
                if (chunk.conversationId) {
                  get().setConversationId(chunk.conversationId);
                }
                for (const id of messageIds) {
                  get().setMessageById(id, {
                    state: 'streaming-answer',
                  });
                }
                get().setMessageById(responseId, {
                  state: 'streaming-answer',
                  ...chunk,
                });
              }
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error({ error });

              for (const id of [...messageIds, responseId]) {
                get().setMessageById(id, {
                  state: 'cancelled',
                });
              }

              if (isAbortError(error)) return;

              get().setMessageById(responseId, {
                error:
                  error instanceof Error ? error : new Error(String(error)),
              });
            }

            if (get().abort === abort) {
              set((state) => {
                state.abort = undefined;
              });
            }

            if (controller.signal.aborted) return;

            for (const id of [...messageIds, responseId]) {
              const message = get().messages.find((m) => m.id === id);

              if (!message) continue;
              if (message.state === 'cancelled') continue;

              get().setMessageById(id, {
                state: 'done',
              });
            }

            /**
             * Submit automatic tool calls if none of the tool calls require
             * confirmation.
             *
             * We do this so that we can return the result of all tool calls to
             * OpenAI simultaneously and OpenAI can generate a single response in return.
             *
             * If we have some calls that require confirmation and some that do not, we will
             * do all calls simultaneously after the user has confirmed.
             **/
            const responseMessage = get().messages.find(
              (m) => m.id === responseId,
            );

            if (!responseMessage?.tool_calls) return;

            const tools = get().options?.tools;
            if (!tools) return;

            if (
              responseMessage.tool_calls.every((x) => {
                const name = x.function?.name;
                const tool = tools.find((x) => x.tool.function.name === name);
                return tool?.requireConfirmation === false;
              })
            ) {
              get().submitToolCalls(responseMessage);
            }
          },
          async submitToolCalls(message: ChatViewMessage) {
            if (!message.tool_calls) return;

            const tools = get().options?.tools;
            if (!tools) return;

            const toolCallResults = await Promise.allSettled(
              message.tool_calls.filter(isToolCall).map(async (tool_call) => {
                const tool = tools.find(
                  (x) => x.tool.function.name === tool_call.function?.name,
                );

                if (!tool) throw new Error('Tool not found');

                try {
                  get().setToolCallById(tool_call.id!, {
                    status: 'loading',
                  });

                  const result = await tool.call(
                    tool_call.function?.arguments || '{}',
                  );

                  get().setToolCallById(tool_call.id!, {
                    result,
                    status: 'done',
                  });

                  return { result, tool_call, tool };
                } catch (error) {
                  get().setToolCallById(tool_call.id!, {
                    status: 'error',
                    error:
                      error instanceof Error ? error.message : String(error),
                  });
                }
              }),
            );

            get().submitChat(
              toolCallResults
                .filter(hasValueAtKey('status', 'fulfilled' as const))
                .filter((x) => x.value)
                .map((x) => ({
                  role: 'tool',
                  name: x.value!.tool.tool.function.name,
                  tool_call_id: x.value!.tool_call.id!,
                  content: x.value!.result,
                })),
            );
          },
          options: chatOptions ?? {},
          setOptions: (options) => {
            set((state) => {
              state.options = options;
            });
          },
          regenerateLastAnswer: () => {
            const messages = [...get().messages];

            const lastUserMessageIndex = messages.findLastIndex(
              (m) => m.role === 'user',
            );
            if (lastUserMessageIndex < 0) return;

            const lastUserMessage = messages[lastUserMessageIndex];
            if (!lastUserMessage.content) return;

            get().setMessages(messages.slice(0, lastUserMessageIndex));
            get().submitChat([
              {
                role: 'user',
                content: lastUserMessage.content,
              },
            ]);
          },
        }),
        {
          name: 'markprompt',
          version: 1,
          storage: createJSONStorage(
            () => (persistChatHistory ? localStorage : sessionStorage),
            {
              reviver: (_, value) => {
                if (value && isStoredError(value)) {
                  const error = new Error(value.message);
                  error.name = value.name;
                  if (value.stack) error.stack = value.stack;
                  if (value.cause) error.cause = value.cause;
                  return error;
                }

                return value;
              },
              replacer: (_, value) => {
                if (value instanceof Error) {
                  return Object.fromEntries(
                    [
                      ['type', 'error'],
                      ['name', value.name],
                      ['message', value.message],
                      ['cause', value.cause],
                    ].filter(([, v]) => v !== undefined),
                  );
                }
                return value;
              },
            },
          ),
          // only store conversationsByProjectKey in local storage
          partialize: (state) => ({
            conversationIdsByProjectKey: state.conversationIdsByProjectKey,
            messagesByConversationId: state.messagesByConversationId,
            toolCallsByToolCallId: state.toolCallsByToolCallId,
          }),
          // restore the last conversation for this project if it's < 4 hours old
          onRehydrateStorage: () => (state) => {
            if (!state || typeof state !== 'object') return;

            const { conversationIdsByProjectKey, messagesByConversationId } =
              state;

            const conversationIds =
              conversationIdsByProjectKey?.[projectKey] ?? [];

            const now = new Date();
            const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);

            const projectConversations = Object.entries(
              messagesByConversationId,
            )
              // filter out conversations that are not in the list of conversations for this project
              .filter(([id]) => conversationIds.includes(id))
              // filter out conversations older than 4 hours
              .filter(([, { lastUpdated }]) => {
                const lastUpdatedDate = new Date(lastUpdated);
                return lastUpdatedDate > fourHoursAgo;
              })
              // sort by last updated date, descending
              .sort(([, { lastUpdated: a }], [, { lastUpdated: b }]) =>
                b.localeCompare(a),
              );

            if (
              projectConversations.length === 0 ||
              !isPresent(projectConversations[0])
            )
              return;

            const [conversationId, { messages }] = projectConversations[0];

            state.setConversationId(conversationId);
            state.setMessages(
              messages.map((x) => ({
                ...x,
                state:
                  // cancel any pending or streaming requests
                  x.state === 'preload' || x.state === 'streaming-answer'
                    ? 'cancelled'
                    : x.state,
              })),
            );
          },
        },
      ),
    ),
  );
};

type ChatStore = ReturnType<typeof createChatStore>;

export const ChatContext = createContext<ChatStore | null>(null);

interface ChatProviderProps {
  chatOptions: NonNullable<MarkpromptOptions['chat']>;
  children: ReactNode;
  debug?: boolean;
  projectKey: string;
}

export function ChatProvider(props: ChatProviderProps): JSX.Element {
  const { chatOptions, children, debug, projectKey } = props;

  const store = useRef<ChatStore>();

  if (!store.current) {
    store.current = createChatStore({
      chatOptions,
      debug,
      persistChatHistory: chatOptions?.history,
      projectKey,
    });
  }

  // update chat options when they change
  useEffect(() => {
    if (!chatOptions) return;
    store.current?.getState().setOptions(chatOptions);
  }, [chatOptions]);

  return (
    <ChatContext.Provider value={store.current}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatStore<T>(selector: (state: ChatStoreState) => T): T {
  const store = useContext(ChatContext);
  if (!store) throw new Error('Missing ChatContext.Provider in the tree');
  return useStore(store, selector);
}

export const selectProjectConversations = (
  state: ChatStoreState,
): [
  conversationId: string,
  { lastUpdated: string; messages: ChatViewMessage[] },
][] => {
  const projectKey = state.projectKey;

  const conversationIds = state.conversationIdsByProjectKey[projectKey];
  if (!conversationIds || conversationIds.length === 0) return [];

  const messagesByConversationId = Object.entries(
    state.messagesByConversationId,
  )
    .filter(([id]) => conversationIds.includes(id))
    // ascending order, so the newest conversation will be closest to the dropdown toggle
    .sort(([, { lastUpdated: a }], [, { lastUpdated: b }]) =>
      a.localeCompare(b),
    );

  if (!messagesByConversationId) return [];

  return messagesByConversationId;
};
