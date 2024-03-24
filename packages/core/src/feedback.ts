import defaults from 'defaults';

import type { MessageFeedback } from './types.js';

export interface SubmitFeedbackBody {
  /** Message feedback */
  feedback: MessageFeedback;
  /** ID of the prompt for which feedback is being submitted. */
  messageId: string;
}

export interface SubmitFeedbackOptions {
  /**
   * URL to submit feedback to.
   * @default 'https://api.markprompt.com/messages'
   */
  apiUrl?: string;
  /**
   * AbortController signal
   * @default undefined
   **/
  signal?: AbortSignal;
}

const allowedOptionKeys = ['apiUrl', 'signal'];

export const DEFAULT_SUBMIT_FEEDBACK_OPTIONS = {
  apiUrl: 'https://api.markprompt.com/messages',
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
    const response = await fetch(resolvedOptions.apiUrl + `/${feedback.messageId}?${params}`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'X-Markprompt-API-Version': '2024-03-23',
      }),
      body: JSON.stringify(feedback.feedback),
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
