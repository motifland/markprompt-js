import React, { type ReactElement } from 'react';

import { Answer } from './Answer.js';
import { References } from './References.js';
import { Feedback } from '../feedback/Feedback.js';
import { useChatStore, useFeedback } from '../index.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import { type MarkpromptOptions } from '../types.js';

interface PromptAndAnswerProps {
  projectKey: string;
  feedbackOptions?: MarkpromptOptions['feedback'];
  onDidSelectReference?: () => void;
  referencesOptions: MarkpromptOptions['references'];
}

export function PromptAndAnswer(props: PromptAndAnswerProps): ReactElement {
  const {
    projectKey,
    feedbackOptions,
    onDidSelectReference,
    referencesOptions,
  } = props;

  const message = useChatStore(
    (state) =>
      state.messages[0] ?? {
        answer: '',
        prompt: '',
        references: [],
        state: 'indeterminate',
      },
  );

  const { submitFeedback, abort: abortFeedbackRequest } = useFeedback({
    projectKey,
    feedbackOptions,
  });

  return (
    <div
      className="MarkpromptAnswerContainer"
      data-loading-state={message.state}
    >
      <BaseMarkprompt.AutoScroller
        className="MarkpromptAutoScroller"
        scrollTrigger={message.answer}
      >
        <Answer answer={message.answer} state={message.state} />
        {feedbackOptions?.enabled && message.state === 'done' && (
          <Feedback
            variant="text"
            className="MarkpromptPromptFeedback"
            submitFeedback={(feedback) => {
              submitFeedback(feedback, message.promptId);
              feedbackOptions.onFeedbackSubmit?.(
                feedback,
                [message],
                message.promptId,
              );
            }}
            abortFeedbackRequest={abortFeedbackRequest}
            promptId={message.promptId}
            heading={feedbackOptions.heading}
          />
        )}
      </BaseMarkprompt.AutoScroller>

      <References
        getHref={referencesOptions?.getHref}
        getLabel={referencesOptions?.getLabel}
        loadingText={referencesOptions?.loadingText}
        heading={referencesOptions?.heading}
        onDidSelectReference={onDidSelectReference}
        references={message.references ?? []}
        state={message.state}
        transformReferenceId={referencesOptions?.transformReferenceId}
      />
    </div>
  );
}
