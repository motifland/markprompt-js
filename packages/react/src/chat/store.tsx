import {
  isAbortError,
  submitChat,
  type ChatMessage,
  type FileSectionReference,
  type SubmitChatOptions,
} from '@markprompt/core';
import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
  useEffect,
  type ReactElement,
} from 'react';
import { createStore, useStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { MarkpromptOptions } from '../types.js';
import { isIterable, isPresent } from '../utils.js';

export type ChatLoadingState =
  | 'indeterminate'
  | 'preload'
  | 'streaming-answer'
  | 'done'
  | 'cancelled';

export interface ChatViewMessage {
  id: string;
  prompt: string;
  promptId?: string;
  answer?: string;
  state: ChatLoadingState;
  references: FileSectionReference[];
}

function toApiMessages(messages: ChatViewMessage[]): ChatMessage[] {
  return messages
    .map((message) => [
      {
        content: message.prompt,
        role: 'user' as const,
      },
      message.answer
        ? {
            content: message.answer,
            role: 'assistant' as const,
          }
        : undefined,
    ])
    .flat()
    .filter(isPresent) satisfies ChatMessage[];
}

export interface ChatStoreState {
  abort?: () => void;
  projectKey: string;
  conversationId?: string;
  error?: string;
  setError: (error?: string) => void;
  setConversationId: (conversationId: string) => void;
  selectConversation: (conversationId?: string) => void;
  messages: ChatViewMessage[];
  setMessages: (messages: ChatViewMessage[]) => void;
  setMessageByIndex: (index: number, next: Partial<ChatViewMessage>) => void;
  conversationIdsByProjectKey: {
    [projectKey: string]: string[];
  };
  messagesByConversationId: {
    [conversationId: string]: {
      lastUpdated: string;
      messages: ChatViewMessage[];
    };
  };
  submitChat: (prompt: string) => void;
  options?: Omit<SubmitChatOptions, 'signal'>;
  setOptions: (options: Omit<SubmitChatOptions, 'signal'>) => void;
  regenerateLastAnswer: () => void;
}

export interface CreateChatOptions {
  debug?: boolean;
  projectKey: string;
  persistChatHistory?: boolean;
  chatOptions?: Omit<SubmitChatOptions, 'signal'>;
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
          error: undefined,
          setError: (error?: string) => {
            set((state) => {
              state.error = error;
            });
          },
          setConversationId: (conversationId: string) => {
            set((state) => {
              // set the conversation id for this session
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
              let currentMessage = state.messages[index];
              if (!currentMessage) return;

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
          submitChat: (prompt: string) => {
            const id = crypto.randomUUID();

            get().setError(undefined);

            set((state) => {
              state.messages.push({
                id,
                prompt,
                state: 'indeterminate',
                references: [],
              });
            });

            // abort any pending or ongoing requests
            get().abort?.();

            const currentMessageIndex = get().messages.length - 1;
            const prevMessageIndex = currentMessageIndex - 1;

            if (prevMessageIndex >= 0) {
              const prevMessage = get().messages[prevMessageIndex];
              if (
                prevMessage &&
                ['indeterminate', 'preload', 'streaming-answer'].includes(
                  prevMessage.state,
                )
              ) {
                get().setMessageByIndex(prevMessageIndex, {
                  state: 'cancelled',
                });
              }
            }

            // create a new abort controller
            const controller = new AbortController();
            const abort = (): void => {
              controller.abort();
              get().setMessageByIndex(currentMessageIndex, {
                state: 'cancelled',
              });
            };
            set((state) => {
              state.abort = abort;
            });

            // get ready to do the request
            const apiMessages = toApiMessages(get().messages);

            get().setMessageByIndex(currentMessageIndex, {
              state: 'preload',
            });

            const promise = submitChat(
              apiMessages,
              get().projectKey,
              (chunk) => {
                if (controller.signal.aborted) return false;

                const currentMessage = get().messages[currentMessageIndex];
                if (!currentMessage) return;

                get().setMessageByIndex(currentMessageIndex, {
                  answer: (currentMessage.answer ?? '') + chunk,
                  state: 'streaming-answer',
                });

                return true;
              },
              (references) => {
                get().setMessageByIndex(currentMessageIndex, { references });
              },
              (conversationId) => {
                get().setConversationId(conversationId);
              },
              (promptId) => {
                get().setMessageByIndex(currentMessageIndex, { promptId });
              },
              (error) => {
                get().setMessageByIndex(currentMessageIndex, {
                  state: 'cancelled',
                });

                if (isAbortError(error)) return;

                // eslint-disable-next-line no-console
                get().setError(error.message);
              },
              {
                conversationId: get().conversationId,
                signal: controller.signal,
                ...get().options,
              },
              debug,
            );

            promise.then(() => {
              // don't overwrite the state of cancelled messages with done when the promise resolves
              // or the fetch was cancelled
              const currentMessage = get().messages[currentMessageIndex];
              if (currentMessage?.state === 'cancelled') return;
              if (controller.signal.aborted) return;

              // set state of current message to done
              get().setMessageByIndex(currentMessageIndex, {
                state: 'done',
              });
            });

            promise.finally(() => {
              if (get().abort === abort) {
                set((state) => {
                  state.abort = undefined;
                });
              }
            });
          },
          options: chatOptions ?? {},
          setOptions: (options: Omit<SubmitChatOptions, 'signal'>) => {
            set((state) => {
              state.options = options;
            });
          },
          regenerateLastAnswer: () => {
            // eslint-disable-next-line prefer-const
            let messages = [...get().messages];
            const lastMessage = messages.pop();
            if (!lastMessage) return;
            get().setMessages(messages);
            get().submitChat(lastMessage.prompt);
          },
        }),
        {
          name: 'markprompt',
          version: 1,
          storage: createJSONStorage(() =>
            persistChatHistory ? localStorage : sessionStorage,
          ),
          // only store conversationsByProjectKey in local storage
          partialize: (state) => ({
            conversationIdsByProjectKey: state.conversationIdsByProjectKey,
            messagesByConversationId: state.messagesByConversationId,
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
  chatOptions: MarkpromptOptions['chat'];
  children: ReactNode;
  debug?: boolean;
  projectKey: string;
}

export function ChatProvider(props: ChatProviderProps): ReactElement {
  const { chatOptions, children, debug, projectKey } = props;

  const store = useRef<ChatStore>();

  if (!store.current) {
    store.current = createChatStore({
      projectKey,
      chatOptions,
      debug,
      persistChatHistory: chatOptions?.history,
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
