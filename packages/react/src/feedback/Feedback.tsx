import type { PromptFeedback } from '@markprompt/core';
import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import {
  useState,
  type ReactElement,
  type ComponentPropsWithoutRef,
  useEffect,
} from 'react';

import type { UseFeedbackResult } from './useFeedback.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants.js';
import { ThumbsDownIcon, ThumbsUpIcon } from '../icons.js';

interface FeedbackProps extends ComponentPropsWithoutRef<'aside'> {
  heading?: string;
  submitFeedback: UseFeedbackResult['submitFeedback'];
  abortFeedbackRequest: UseFeedbackResult['abort'];
  variant: 'text' | 'icons';
  promptId?: string;
}

export function Feedback(props: FeedbackProps): ReactElement {
  const {
    heading = DEFAULT_MARKPROMPT_OPTIONS.feedback!.heading,
    submitFeedback,
    abortFeedbackRequest,
    variant,
    promptId,
    ...divProps
  } = props;

  const [feedback, setFeedback] = useState<PromptFeedback>();

  function handleFeedback(feedback: PromptFeedback): void {
    submitFeedback(feedback, promptId);
    setFeedback(feedback);
  }

  useEffect(() => {
    // Abort feedback request on unmount
    return () => abortFeedbackRequest();
  }, [abortFeedbackRequest]);

  return (
    <div {...divProps} data-variant={variant}>
      <h3>{heading}</h3>
      <div>
        <button
          className="MarkpromptGhostThumbButton"
          onClick={() => handleFeedback({ vote: '1' })}
          data-active={feedback?.vote === '1'}
        >
          {variant === 'text' && 'Yes'}
          {variant === 'icons' && (
            <AccessibleIcon label="yes">
              <ThumbsUpIcon width={16} height={16} strokeWidth={2} />
            </AccessibleIcon>
          )}
        </button>
        <button
          className="MarkpromptGhostThumbButton"
          onClick={() => handleFeedback({ vote: '-1' })}
          data-active={feedback?.vote === '-1'}
          style={{ animationDelay: '100ms' }}
        >
          {variant === 'text' && 'No'}
          {variant === 'icons' && (
            <AccessibleIcon label="no">
              <ThumbsDownIcon width={16} height={16} />
            </AccessibleIcon>
          )}
        </button>
      </div>
    </div>
  );
}
