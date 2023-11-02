import { type ReactElement } from 'react';

import { type ChatViewMessage } from './store.js';
import { Answer } from '../prompt/Answer.js';

interface MessageAnswerProps {
  children: string;
  state: ChatViewMessage['state'];
}

export function MessageAnswer(props: MessageAnswerProps): ReactElement {
  const { children, state } = props;
  return (
    <div className="MarkpromptMessageAnswer">
      <Answer answer={children} state={state} />
      {state === 'cancelled' && (
        <div className="MarkpromptCancelled">
          <p className="MarkpromptCancelledText">
            This chat response was cancelled. Please try regenerating the answer
            or ask another question.
          </p>
        </div>
      )}
    </div>
  );
}
