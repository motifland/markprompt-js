import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  type FormEventHandler,
  type ReactElement,
  useState,
} from 'react';

import { ConversationSelect } from './ConversationSelect.js';
import { RegenerateButton } from './RegenerateButton.js';
import {
  ChatContext,
  selectProjectConversations,
  useChatStore,
} from './store.js';
import { SparklesIcon } from '../icons.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import type { MarkpromptOptions } from '../types.js';
import type { View } from '../useViews.js';

interface ChatViewFormProps {
  activeView?: View;
  chatOptions: NonNullable<MarkpromptOptions['chat']>;
}

export function ChatViewForm(props: ChatViewFormProps): ReactElement {
  const { activeView, chatOptions } = props;

  const [prompt, setPrompt] = useState('');

  const submitChat = useChatStore((state) => state.submitChat);
  const lastMessageState = useChatStore(
    (state) => state.messages[state.messages.length - 1]?.state,
  );
  const regenerateLastAnswer = useChatStore(
    (state) => state.regenerateLastAnswer,
  );
  const conversations = useChatStore(selectProjectConversations);
  const error = useChatStore((state) => state.error);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const value = data.get('markprompt-prompt');

      if (typeof value === 'string') {
        submitChat(value);
      }

      if (event.target instanceof HTMLFormElement) {
        setPrompt('');
      }
    },
    [submitChat],
  );

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Bring form input in focus when activeView changes.
    inputRef.current?.focus();
  }, [activeView]);

  // keep abortChat up to date, but do not trigger rerenders (and effect hooks calls) when it updates
  const store = useContext(ChatContext);
  const abortChat = useRef(() => store?.getState().abort?.());

  useEffect(
    () =>
      store?.subscribe((state) => {
        abortChat.current = () => state.abort?.();
      }),
    [store],
  );

  useEffect(() => {
    // cancel pending chat requests when the view changes.
    if (activeView && activeView !== 'chat') {
      abortChat.current?.();
    }

    // cancel pending chat request when the component unmounts.
    return () => abortChat.current?.();
  }, [activeView]);

  return (
    <BaseMarkprompt.Form className={'MarkpromptForm'} onSubmit={handleSubmit}>
      <div className="MarkpromptPromptWrapper">
        <BaseMarkprompt.Prompt
          ref={inputRef}
          className="MarkpromptPrompt"
          name="markprompt-prompt"
          type="text"
          autoFocus
          placeholder={chatOptions?.placeholder}
          labelClassName="MarkpromptPromptLabel"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          label={
            <AccessibleIcon.Root label={chatOptions!.label!}>
              <SparklesIcon className="MarkpromptSearchIcon" />
            </AccessibleIcon.Root>
          }
        />
      </div>

      {error && (
        <BaseMarkprompt.ErrorMessage className="MarkpromptErrorMessage">
          {chatOptions.errorText}
        </BaseMarkprompt.ErrorMessage>
      )}

      <div className="MarkpromptChatActions">
        {lastMessageState && lastMessageState !== 'indeterminate' && (
          <RegenerateButton
            lastMessageState={lastMessageState}
            regenerateLastAnswer={regenerateLastAnswer}
            abortSubmitChat={abortChat.current}
          />
        )}

        {conversations.length > 0 && <ConversationSelect />}
      </div>
    </BaseMarkprompt.Form>
  );
}
