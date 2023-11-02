import clsx from 'clsx';
import { type ReactElement } from 'react';

import type { PromptLoadingState } from './usePrompt.js';
import type { ChatLoadingState } from '../chat/store.js';
import * as BaseMarkprompt from '../primitives/headless.js';

interface CaretProps {
  answer: string;
}

export function Caret(props: CaretProps): ReactElement | null {
  const { answer } = props;

  if (answer) {
    return null;
  }

  return <span className="MarkpromptCaret" />;
}

interface AnswerProps {
  className?: string;
  answer: string;
  state: PromptLoadingState | ChatLoadingState;
}

export function Answer(props: AnswerProps): ReactElement {
  const { answer, className, state } = props;

  return (
    <div
      className={clsx('MarkpromptAnswer', className)}
      aria-describedby="markprompt-progressbar"
      aria-busy={state === 'preload' || state === 'streaming-answer'}
      aria-live="polite"
    >
      <Caret answer={answer} />
      <BaseMarkprompt.Answer answer={answer} />
    </div>
  );
}
