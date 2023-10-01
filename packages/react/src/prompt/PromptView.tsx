import React, { type ReactElement } from 'react';

import { PromptAndAnswer } from './PromptAndAnswer.js';
import { ChatViewForm } from '../chat/ChatViewForm.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants.js';
import { ChatProvider } from '../index.js';
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
