import {
  submitFeedback as submitFeedbackToMarkprompt,
  type PromptFeedback,
  type SubmitFeedbackOptions,
  type ChatMessage,
} from '@markprompt/core';
import { useCallback } from 'react';

import { useAbortController } from '../useAbortController.js';

export interface UseFeedbackOptions {
  /** Enable and configure feedback functionality */
  feedbackOptions: Omit<SubmitFeedbackOptions, 'signal'>;
  /** Markprompt project key */
  projectKey: string;
  /** The current list of messages */
  messages?: ChatMessage[];
}

export interface UseFeedbackResult {
  /** Abort any pending feedback submission */
  abort: () => void;
  /** Submit feedback for the current prompt */
  submitFeedback: (feedback: PromptFeedback, promptId?: string) => void;
}

export function useFeedback({
  feedbackOptions,
  projectKey,
}: UseFeedbackOptions): UseFeedbackResult {
  if (!projectKey) {
    throw new Error(
      `Markprompt: a project key is required. Make sure to pass your Markprompt project key to useFeedback.`,
    );
  }

  const { ref: controllerRef, abort } = useAbortController();

  const submitFeedback = useCallback(
    async (feedback: PromptFeedback, promptId?: string) => {
      abort();

      // we need to be able to associate the feedback to a prompt
      if (!promptId) return;

      const controller = new AbortController();
      controllerRef.current = controller;

      const promise = submitFeedbackToMarkprompt(
        { feedback, promptId },
        projectKey,
        { ...feedbackOptions, signal: controller.signal },
      );

      promise.catch(() => {
        // ignore submitFeedback errors
      });

      promise.finally(() => {
        if (controllerRef.current === controller) {
          controllerRef.current = undefined;
        }
      });
    },
    [abort, controllerRef, projectKey, feedbackOptions],
  );

  return { submitFeedback, abort };
}
