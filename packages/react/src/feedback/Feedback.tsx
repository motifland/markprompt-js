import type { MessageFeedback } from '@markprompt/core';
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
import { CopyContentButton } from '../primitives/headless.js';

interface FeedbackProps extends ComponentPropsWithoutRef<'aside'> {
  message?: string;
  heading?: string;
  submitFeedback: UseFeedbackResult['submitFeedback'];
  abortFeedbackRequest: UseFeedbackResult['abort'];
  variant: 'text' | 'icons';
  messageId?: string;
  showFeedback?: boolean;
  showCopy?: boolean;
}

// Historically, this component held the thumbs up/down buttons only.
// This is evolving into a more general "Actions" component, which now
// also includes a copy button.
export function Feedback(props: FeedbackProps): ReactElement {
  const {
    message,
    heading = DEFAULT_MARKPROMPT_OPTIONS.feedback!.heading,
    submitFeedback,
    abortFeedbackRequest,
    variant,
    messageId,
    showFeedback = true,
    showCopy,
    ...divProps
  } = props;

  const [feedback, setFeedback] = useState<MessageFeedback>();

  function handleFeedback(feedback: MessageFeedback): void {
    submitFeedback(feedback, messageId);
    setFeedback(feedback);
  }

  useEffect(() => {
    // Abort feedback request on unmount
    return () => abortFeedbackRequest();
  }, [abortFeedbackRequest]);

  return (
    <div {...divProps} data-variant={variant}>
      {heading && <h3>{heading}</h3>}
      <div>
        {showCopy && message && (
          <CopyContentButton
            content={message}
            className="MarkpromptGhostThumbButton"
          />
        )}
        {showFeedback && (
          <>
            <button
              className="MarkpromptGhostThumbButton"
              onClick={() => handleFeedback({ vote: 1 })}
              data-active={feedback?.vote === 1}
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
              onClick={() => handleFeedback({ vote: -1 })}
              data-active={feedback?.vote === -1}
              style={{ animationDelay: '100ms' }}
            >
              {variant === 'text' && 'No'}
              {variant === 'icons' && (
                <AccessibleIcon label="no">
                  <ThumbsDownIcon width={16} height={16} />
                </AccessibleIcon>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
