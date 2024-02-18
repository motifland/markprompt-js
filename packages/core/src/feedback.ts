import defaults from 'defaults';

import type { PromptFeedback } from './types.js';

export interface SubmitFeedbackBody {
  /** Prompt feedback */
  feedback: PromptFeedback;
  /** ID of the prompt for which feedback is being submitted. */
  promptId: string;
}

export interface SubmitFeedbackOptions {
  /**
   * URL to submit feedback to.
   * @default 'https://api.markprompt.com/feedback'
   */
  apiUrl?: string;
  /**
   * Client ID to use for submitting feedback.
   * @default undefined
   **/
  clientId?: string;
  /**
   * AbortController signal
   * @default undefined
   **/
  signal?: AbortSignal;
  /**
   * User data to attach to the feedback request
   * @default undefined
   **/
  userData?: { [key: string]: unknown };
}

const allowedOptionKeys = ['apiUrl', 'signal', 'clientId', 'userData'];

export const DEFAULT_SUBMIT_FEEDBACK_OPTIONS = {
  apiUrl: 'https://api.markprompt.com/feedback',
  clientId: crypto.randomUUID(),
} satisfies SubmitFeedbackOptions;

export async function submitFeedback(
  feedback: SubmitFeedbackBody,
  projectKey: string,
  options?: SubmitFeedbackOptions,
): Promise<void> {
  if (!projectKey) {
    throw new Error('A projectKey is required.');
  }

  const allowedOptions = Object.fromEntries(
    Object.entries(options ?? {}).filter(([key]) =>
      allowedOptionKeys.includes(key),
    ),
  );

  const { signal, ...cloneableOpts } = allowedOptions ?? {};

  const resolvedOptions = defaults(
    cloneableOpts,
    DEFAULT_SUBMIT_FEEDBACK_OPTIONS,
  );

  const params = new URLSearchParams({
    projectKey,
  });

  try {
    const response = await fetch(resolvedOptions.apiUrl + `?${params}`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'X-Markprompt-API-Version': '2023-12-01',
      }),
      body: JSON.stringify({
        ...feedback,
        // /v1/feedback was using promptId. The new /feedback endpoint
        // now uses messageId. We should eventually migrate everything
        // to messageId, but now we just copy the promptId parameter
        // to messageId, so that it works with both endpoints.
        messageId: feedback.promptId,
      }),
      signal: signal,
    });

    if (!response.ok) {
      const error = (await response.json())?.error;
      throw new Error(`Failed to submit feedback: ${error || 'Unknown error'}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      // do nothing on AbortError's, this is expected
      return undefined;
    } else {
      throw error;
    }
  }
}
