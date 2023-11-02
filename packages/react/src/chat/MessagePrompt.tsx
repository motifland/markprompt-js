import { type ReactElement } from 'react';

import { type ChatViewMessage } from './store.js';
import type { MarkpromptOptions } from '../types.js';

interface MessagePromptProps {
  children: string;
  state: ChatViewMessage['state'];
  referencesOptions?: MarkpromptOptions['references'];
}

export function MessagePrompt(props: MessagePromptProps): ReactElement {
  const { children, referencesOptions, state } = props;
  return (
    <div className="MarkpromptMessagePrompt" data-loading-state={state}>
      <h3 className="MarkpromptMessagePromptText">{children}</h3>
      {(state === 'preload' || state === 'streaming-answer') && (
        <div
          className="MarkpromptProgress"
          id="markprompt-progressbar"
          role="progressbar"
          aria-labelledby="markprompt-loading-text"
        >
          <p id="markprompt-loading-text">{referencesOptions?.loadingText}</p>
        </div>
      )}
    </div>
  );
}
