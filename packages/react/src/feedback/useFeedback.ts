import {
  submitFeedback as submitFeedbackToMarkprompt,
  type MessageFeedback,
  type SubmitFeedbackOptions,
} from '@markprompt/core';
import { useCallback } from 'react';

import { useAbortController } from '../useAbortController.js';

export interface UseFeedbackOptions {
  /** Enable and configure feedback functionality */
  feedbackOptions?: Omit<SubmitFeedbackOptions, 'signal'>;
  /** Markprompt project key */
  projectKey: string;
}

export interface UseFeedbackResult {
  /** Abort any pending feedback submission */
  abort: () => void;
  /** Submit feedback for the current prompt */
  submitFeedback: (feedback: MessageFeedback, messageId?: string) => void;
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
    async (feedback: MessageFeedback, messageId?: string) => {
      abort();

      // we need to be able to associate the feedback to a prompt
      if (!messageId) return;

      const controller = new AbortController();
      controllerRef.current = controller;

      const promise = submitFeedbackToMarkprompt(
        { feedback, messageId },
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
