import React, { type ReactElement } from 'react';

import { Answer } from './Answer.js';
import { References } from './References.js';
import { ChatViewForm } from '../chat/ChatViewForm.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants.js';
import { Feedback } from '../feedback/Feedback.js';
import { ChatProvider, useChatStore, useFeedback } from '../index.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import { type MarkpromptOptions } from '../types.js';
import { useDefaults } from '../useDefaults.js';
import type { View } from '../useViews.js';

export interface PromptViewProps {
  activeView?: View;
  projectKey: string;
  promptOptions: MarkpromptOptions['prompt'];
  feedbackOptions?: MarkpromptOptions['feedback'];
  referencesOptions: MarkpromptOptions['references'];
  onDidSelectReference?: () => void;
  debug?: boolean;
}

export function PromptView(props: PromptViewProps): ReactElement {
  const { activeView, onDidSelectReference, debug, projectKey } = props;

  // we are also merging defaults in the Markprompt component, but this makes sure
  // that standalone PromptView components also have defaults as expected.
  const promptOptions = useDefaults(
    { ...props.promptOptions },
    DEFAULT_MARKPROMPT_OPTIONS.prompt,
  );

  const feedbackOptions = useDefaults(
    { ...props.feedbackOptions },
    DEFAULT_MARKPROMPT_OPTIONS.feedback,
  );

  const referencesOptions = useDefaults(
    { ...props.referencesOptions },
    DEFAULT_MARKPROMPT_OPTIONS.references,
  );

  return (
    <ChatProvider
      chatOptions={promptOptions}
      debug={debug}
      projectKey={projectKey}
      isPrompt
    >
      <div className="MarkpromptPromptView">
        <ChatViewForm chatOptions={promptOptions} activeView={activeView} />

        <PromptAndAnswer
          projectKey={projectKey}
          feedbackOptions={feedbackOptions}
          onDidSelectReference={onDidSelectReference}
          referencesOptions={referencesOptions}
        />
      </div>
    </ChatProvider>
  );
}

interface PromptAndAnswerProps {
  projectKey: string;
  feedbackOptions?: MarkpromptOptions['feedback'];
  onDidSelectReference?: () => void;
  referencesOptions: MarkpromptOptions['references'];
}

function PromptAndAnswer(props: PromptAndAnswerProps): ReactElement {
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
