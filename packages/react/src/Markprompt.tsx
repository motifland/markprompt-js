import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import { clsx } from 'clsx';
import Emittery from 'emittery';
import React, { useEffect, useState, type ReactElement, useRef } from 'react';

import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { useMarkpromptContext } from './context.js';
import { ChatIcon, SparklesIcon } from './icons.js';
import * as BaseMarkprompt from './primitives/headless.js';
import { PromptView } from './PromptView.js';
import { SearchBoxTrigger } from './SearchBoxTrigger.js';
import { SearchView } from './SearchView.js';
import { type MarkpromptOptions } from './types.js';

type MarkpromptProps = MarkpromptOptions &
  Omit<
    BaseMarkprompt.RootProps,
    | 'activeView'
    | 'children'
    | 'onOpenChange'
    | 'open'
    | 'promptOptions'
    | 'searchOptions'
  > & {
    projectKey: string;
  };

const emitter = new Emittery<{ open: undefined }>();

/**
 * Open Markprompt programmatically. Useful for building a custom trigger or opening the
 * Markprompt dialog in response to other user actions.
 */
function openMarkprompt(): void {
  emitter.emit('open');
}

function Markprompt(props: MarkpromptProps): ReactElement {
  const {
    close,
    debug,
    description,
    display = 'dialog',
    projectKey,
    prompt,
    references,
    search,
    showBranding,
    title,
    trigger,
    ...dialogProps
  } = props;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!trigger?.customElement || display !== 'dialog') {
      return;
    }
    const onOpen = (): void => setOpen(true);
    emitter.on('open', onOpen);
    return () => emitter.off('open', onOpen);
  }, [trigger?.customElement, display]);

  return (
    <BaseMarkprompt.Root
      projectKey={projectKey}
      display={display}
      promptOptions={prompt}
      searchOptions={search}
      open={open}
      onOpenChange={setOpen}
      debug={debug}
      {...dialogProps}
    >
      {!trigger?.customElement && display === 'dialog' && (
        <>
          {trigger?.floating !== false ? (
            <BaseMarkprompt.DialogTrigger className="MarkpromptFloatingTrigger">
              <AccessibleIcon.Root
                label={
                  trigger?.label ?? DEFAULT_MARKPROMPT_OPTIONS.trigger!.label!
                }
              >
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
            >
              <BaseMarkprompt.Title hide={title?.hide ?? true}>
                {title?.text ?? DEFAULT_MARKPROMPT_OPTIONS.prompt!.label}
              </BaseMarkprompt.Title>

              {description?.text && (
                <BaseMarkprompt.Description hide={description?.hide ?? true}>
                  {description?.text}
                </BaseMarkprompt.Description>
              )}

              <MarkpromptContent
                prompt={prompt}
                references={references}
                search={search}
              />

              {close?.visible !== false && (
                <BaseMarkprompt.Close className="MarkpromptClose">
                  <AccessibleIcon.Root
                    label={
                      close?.label ?? DEFAULT_MARKPROMPT_OPTIONS.close!.label!
                    }
                  >
                    <kbd>Esc</kbd>
                  </AccessibleIcon.Root>
                </BaseMarkprompt.Close>
              )}
            </BaseMarkprompt.Content>
          </BaseMarkprompt.Portal>
        </>
      )}

      {display === 'plain' && (
        <BaseMarkprompt.PlainContent
          className="MarkpromptContentPlain"
          showBranding={showBranding}
        >
          <MarkpromptContent
            prompt={prompt}
            search={search}
            references={references}
          />
        </BaseMarkprompt.PlainContent>
      )}
    </BaseMarkprompt.Root>
  );
}

type MarkpromptContentProps = {
  prompt: MarkpromptOptions['prompt'];
  references: MarkpromptOptions['references'];
  search: MarkpromptOptions['search'];
};

function MarkpromptContent(props: MarkpromptContentProps): ReactElement {
  const { prompt, references, search } = props;

  const { abort, activeView, setActiveView } = useMarkpromptContext();

  return (
    <div className="MarkpromptTabsContainer">
      {search?.enabled && (
        <div className="MarkpromptTabsList">
          <button
            aria-label={search.tabLabel}
            className="MarkpromptTab"
            data-state={activeView === 'search' ? 'active' : ''}
            onClick={() => {
              abort();
              setActiveView('search');
            }}
          >
            {search.tabLabel || DEFAULT_MARKPROMPT_OPTIONS.search!.tabLabel}
          </button>
          <button
            className="MarkpromptTab"
            data-state={activeView === 'prompt' ? 'active' : ''}
            onClick={() => {
              abort();
              setActiveView('prompt');
            }}
          >
            <SparklesIcon
              focusable={false}
              className={clsx('MarkpromptBaseIcon', {
                MarkpromptPrimaryIcon: activeView === 'prompt',
                MarkpromptHighlightedIcon: activeView === 'search',
              })}
            />
            {prompt?.tabLabel || DEFAULT_MARKPROMPT_OPTIONS.prompt!.tabLabel}
          </button>
        </div>
      )}
      <div className="MarkpromptViews">
        <div style={{ display: activeView === 'search' ? 'block' : 'none' }}>
          <SearchView
            handleViewChange={() => setActiveView('prompt')}
            search={search}
          />
        </div>
        <div style={{ display: activeView === 'prompt' ? 'block' : 'none' }}>
          <PromptView prompt={prompt} references={references} />
        </div>
      </div>
    </div>
  );
}

export { Markprompt, openMarkprompt, type MarkpromptProps };
