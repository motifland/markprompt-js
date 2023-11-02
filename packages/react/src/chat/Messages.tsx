import { type ReactElement } from 'react';

import { MessageAnswer } from './MessageAnswer.js';
import { MessagePrompt } from './MessagePrompt.js';
import { useChatStore } from './store.js';
import { Feedback } from '../feedback/Feedback.js';
import { useFeedback } from '../feedback/useFeedback.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import { DefaultView } from '../prompt/DefaultView.js';
import { References } from '../prompt/References.js';
import type { MarkpromptOptions } from '../types.js';

interface MessagesProps {
  feedbackOptions: NonNullable<MarkpromptOptions['feedback']>;
  referencesOptions: NonNullable<MarkpromptOptions['references']>;
  defaultView: NonNullable<MarkpromptOptions['chat']>['defaultView'];
  projectKey: string;
}

export function Messages(props: MessagesProps): ReactElement {
  const { feedbackOptions, referencesOptions, defaultView, projectKey } = props;

  const messages = useChatStore((state) => state.messages);
  const submitChat = useChatStore((state) => state.submitChat);

  const { submitFeedback, abort: abortFeedbackRequest } = useFeedback({
    projectKey,
    feedbackOptions,
  });

  if (!messages || messages.length === 0) {
    return (
      <DefaultView
        message={defaultView?.message}
        prompts={defaultView?.prompts}
        promptsHeading={defaultView?.promptsHeading}
        onDidSelectPrompt={submitChat}
      />
    );
  }

  return (
    <div className="MarkpromptMessages">
      <BaseMarkprompt.AutoScroller
        className="MarkpromptAutoScroller"
        scrollTrigger={messages}
        discreteScrollTrigger={messages.length}
      >
        {messages.map((message) => (
          <section key={message.id}>
            <MessagePrompt
              state={message.state}
              referencesOptions={referencesOptions}
            >
              {message.prompt}
            </MessagePrompt>

            <div className="MarkpromptMessageAnswerContainer">
              <MessageAnswer state={message.state}>
                {message.answer ?? ''}
              </MessageAnswer>

              {feedbackOptions?.enabled && message.state === 'done' && (
                <Feedback
                  variant="icons"
                  className="MarkpromptPromptFeedback"
                  submitFeedback={(feedback, promptId) => {
                    submitFeedback(feedback, promptId);
                    feedbackOptions.onFeedbackSubmit?.(
                      feedback,
                      messages,
                      promptId,
                    );
                  }}
                  abortFeedbackRequest={abortFeedbackRequest}
                  promptId={message.promptId}
                  heading={feedbackOptions.heading}
                />
              )}
            </div>

            {(!referencesOptions?.display ||
              referencesOptions?.display === 'end') && (
              <div className="MarkpromptReferences">
                {(message.state === 'streaming-answer' ||
                  message.state === 'done') && (
                  <>
                    <References
                      references={message.references}
                      getHref={referencesOptions?.getHref}
                      getLabel={referencesOptions?.getLabel}
                      loadingText={referencesOptions?.loadingText}
                      heading={referencesOptions?.heading}
                      state={message.state}
                    />
                  </>
                )}
              </div>
            )}
          </section>
        ))}
      </BaseMarkprompt.AutoScroller>
    </div>
  );
}
