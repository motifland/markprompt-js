import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import { clsx } from 'clsx';
import defaults from 'defaults';
import Emittery from 'emittery';
import React, { useEffect, useState, type ReactElement, useMemo } from 'react';

import { ChatView } from './chat/ChatView.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { ChatIcon, SparklesIcon } from './icons.js';
import * as BaseMarkprompt from './primitives/headless.js';
import { PromptView } from './prompt/PromptView.js';
import { SearchBoxTrigger } from './search/SearchBoxTrigger.js';
import { SearchView } from './search/SearchView.js';
import { type MarkpromptOptions } from './types.js';
import { useViews } from './useViews.js';

type MarkpromptProps = MarkpromptOptions &
  Omit<
    BaseMarkprompt.RootProps,
    | 'activeView'
    | 'children'
    | 'open'
    | 'onOpenChange'
    | 'promptOptions'
    | 'searchOptions'
  > & {
    projectKey: string;
    onDidRequestOpenChange?: (open: boolean) => void;
  };

const emitter = new Emittery<{ open: undefined; close: undefined }>();

/**
 * Open Markprompt programmatically. Useful for building a custom trigger
 * or opening the Markprompt dialog in response to other user actions.
 */
function openMarkprompt(): void {
  emitter.emit('open');
}

/**
 * Close Markprompt programmatically. Useful for building a custom trigger
 * or closing the Markprompt dialog in response to other user actions.
 */
function closeMarkprompt(): void {
  emitter.emit('close');
}

function Markprompt(props: MarkpromptProps): JSX.Element {
  const { projectKey, onDidRequestOpenChange, ...dialogProps } = props;

  if (!projectKey) {
    throw new Error(
      'Markprompt: a project key is required. Make sure to pass the projectKey prop to <Markprompt />.',
    );
  }

  const {
    display,
    defaultView,
    close,
    description,
    feedback,
    chat,
    prompt,
    references,
    search,
    trigger,
    title,
    showBranding,
    debug,
  }: MarkpromptOptions = useMemo(
    () =>
      defaults(
        {
          display: props.display,
          defaultView: props.defaultView,
          close: props.close,
          description: props.description,
          feedback: props.feedback,
          chat: props.chat,
          prompt: props.prompt,
          references: props.references,
          search: props.search,
          trigger: props.trigger,
          title: props.title,
          showBranding: props.showBranding,
          debug: props.debug,
        },
        DEFAULT_MARKPROMPT_OPTIONS,
      ),
    [props],
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = (): void => {
      onDidRequestOpenChange?.(true);
      if (display === 'dialog') {
        setOpen(true);
      }
    };
    const onClose = (): void => {
      onDidRequestOpenChange?.(false);
      if (display === 'dialog') {
        setOpen(false);
      }
    };

    emitter.on('open', onOpen);
    emitter.on('close', onClose);

    return () => {
      emitter.off('open', onOpen);
      emitter.off('close', onClose);
    };
  }, [trigger?.customElement, display, onDidRequestOpenChange]);

  return (
    <BaseMarkprompt.Root
      display={display}
      open={open}
      onOpenChange={(open) => {
        onDidRequestOpenChange?.(open);
        setOpen(open);
      }}
      {...dialogProps}
    >
      {!trigger?.customElement && display === 'dialog' && (
        <>
          {trigger?.floating !== false ? (
            <BaseMarkprompt.DialogTrigger className="MarkpromptFloatingTrigger">
              <AccessibleIcon.Root label={trigger.label!}>
                <ChatIcon
                  className="MarkpromptChatIcon"
                  width="24"
                  height="24"
                />
              </AccessibleIcon.Root>
            </BaseMarkprompt.DialogTrigger>
          ) : (
            <SearchBoxTrigger trigger={trigger} setOpen={setOpen} open={open} />
          )}
        </>
      )}

      {display === 'dialog' && (
        <>
          <BaseMarkprompt.Portal>
            <BaseMarkprompt.Overlay className="MarkpromptOverlay" />
            <BaseMarkprompt.Content
              className="MarkpromptContentDialog"
              showBranding={showBranding}
              showAlgolia={
                search?.enabled && search.provider?.name === 'algolia'
              }
            >
              <BaseMarkprompt.Title hide={title.hide ?? true}>
                {title.text}
              </BaseMarkprompt.Title>

              {description.text && (
                <BaseMarkprompt.Description hide={description.hide ?? true}>
                  {description.text}
                </BaseMarkprompt.Description>
              )}

              <MarkpromptContent
                close={close}
                chat={chat}
                debug={debug}
                defaultView={defaultView}
                feedback={feedback}
                projectKey={projectKey}
                prompt={prompt}
                references={references}
                search={search}
              />
            </BaseMarkprompt.Content>
          </BaseMarkprompt.Portal>
        </>
      )}

      {display === 'plain' && (
        <BaseMarkprompt.PlainContent
          className="MarkpromptContentPlain"
          showBranding={showBranding}
          showAlgolia={search?.enabled && search.provider?.name === 'algolia'}
        >
          <MarkpromptContent
            chat={chat}
            defaultView={defaultView}
            feedback={feedback}
            projectKey={projectKey}
            prompt={prompt}
            references={references}
            search={search}
          />
        </BaseMarkprompt.PlainContent>
      )}
    </BaseMarkprompt.Root>
  );
}

interface MarkpromptContentProps {
  projectKey: string;
  chat?: MarkpromptOptions['chat'];
  close?: MarkpromptOptions['close'];
  debug?: boolean;
  defaultView?: MarkpromptOptions['defaultView'];
  feedback?: MarkpromptOptions['feedback'];
  prompt?: MarkpromptOptions['prompt'];
  references?: MarkpromptOptions['references'];
  search?: MarkpromptOptions['search'];
}

function MarkpromptContent(props: MarkpromptContentProps): ReactElement {
  const {
    close,
    debug,
    defaultView,
    feedback,
    projectKey,
    chat,
    prompt,
    references,
    search,
  } = props;

  const { activeView, setActiveView, toggleActiveView } = useViews(
    { search, chat },
    defaultView,
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (
        (event.key === 'Enter' && event.ctrlKey) ||
        (event.key === 'Enter' && event.metaKey)
      ) {
        event.preventDefault();
        toggleActiveView();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleActiveView]);

  return (
    <div className="MarkpromptTabsContainer">
      {search?.enabled ? (
        <div style={{ position: 'relative' }}>
          <div className="MarkpromptTabsList">
            <button
              aria-label={search.tabLabel}
              className="MarkpromptTab"
              data-state={activeView === 'search' ? 'active' : ''}
              onClick={() => setActiveView('search')}
            >
              {search.tabLabel}
            </button>
            {!chat?.enabled && (
              <button
                className="MarkpromptTab"
                data-state={activeView === 'prompt' ? 'active' : ''}
                onClick={() => setActiveView('prompt')}
              >
                <SparklesIcon
                  focusable={false}
                  className={clsx('MarkpromptBaseIcon', {
                    MarkpromptPrimaryIcon: activeView === 'prompt',
                    MarkpromptHighlightedIcon: activeView === 'search',
                  })}
                />
                {prompt!.tabLabel}
              </button>
            )}
            {chat?.enabled && (
              <button
                className="MarkpromptTab"
                data-state={activeView === 'chat' ? 'active' : ''}
                onClick={() => setActiveView('chat')}
              >
                <SparklesIcon
                  focusable={false}
                  className={clsx('MarkpromptBaseIcon', {
                    MarkpromptPrimaryIcon: activeView === 'chat',
                    MarkpromptHighlightedIcon: activeView === 'search',
                  })}
                />
                {chat?.tabLabel}
              </button>
            )}
          </div>
          {/* Add close button in the tab bar */}
          {close?.visible && (
            <div
              style={{
                position: 'absolute',
                display: 'flex',
                justifyItems: 'center',
                alignItems: 'center',
                right: '0.5rem',
                top: '0rem',
                bottom: '0rem',
              }}
            >
              <BaseMarkprompt.Close className="MarkpromptClose">
                <AccessibleIcon.Root label={close!.label!}>
                  <kbd>Esc</kbd>
                </AccessibleIcon.Root>
              </BaseMarkprompt.Close>
            </div>
          )}
        </div>
      ) : (
        // We still include a div to preserve the grid-template-rows rules
        <div />
      )}
      <div className="MarkpromptViews">
        {search?.enabled && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: activeView === 'search' ? 'block' : 'none',
            }}
          >
            <SearchView
              activeView={activeView}
              projectKey={projectKey}
              searchOptions={search}
              onDidSelectResult={() => emitter.emit('close')}
              debug={debug}
            />
          </div>
        )}

        {chat?.enabled ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: activeView === 'chat' ? 'block' : 'none',
            }}
          >
            <ChatView
              activeView={activeView}
              chatOptions={chat}
              debug={debug}
              feedbackOptions={feedback}
              onDidSelectReference={() => emitter.emit('close')}
              projectKey={projectKey}
              referencesOptions={references}
            />
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: activeView === 'prompt' ? 'block' : 'none',
            }}
          >
            <PromptView
              activeView={activeView}
              debug={debug}
              feedbackOptions={feedback}
              onDidSelectReference={() => emitter.emit('close')}
              projectKey={projectKey}
              promptOptions={prompt}
              referencesOptions={references}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export { Markprompt, openMarkprompt, closeMarkprompt, type MarkpromptProps };
