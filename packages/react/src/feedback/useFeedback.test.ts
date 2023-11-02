import { DEFAULT_SUBMIT_FEEDBACK_OPTIONS } from '@markprompt/core';
import { waitFor, renderHook } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { useFeedback } from './useFeedback.js';

let status = 200;
let endpointHits = 0;
let response: unknown = '';

const server = setupServer(
  rest.post(DEFAULT_SUBMIT_FEEDBACK_OPTIONS.apiUrl, async (_req, res, ctx) => {
    endpointHits += 1;
    return res(ctx.status(status), ctx.body(JSON.stringify(response)));
  }),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterAll(() => {
  server.close();
});

afterEach(() => {
  status = 200;
  endpointHits = 0;
  response = '';
  server.resetHandlers();
});

describe('useFeedback', () => {
  it('should return an initial state', () => {
    const { result } = renderHook(() =>
      useFeedback({ projectKey: 'TEST_PROJECT_KEY' }),
    );

    expect(result.current).toStrictEqual({
      submitFeedback: expect.any(Function),
      abort: expect.any(Function),
    });
  });

  it('should throw an error if no project key is provided', async () => {
    try {
      const { result } = renderHook(() => useFeedback({ projectKey: '' }));

      expect(result.error!.message).toBe(
        `Markprompt: a project key is required. Make sure to pass your Markprompt project key to useFeedback.`,
      );
      // eslint-disable-next-line no-empty
    } catch {}
  });

  it(`submitFeedback should make requests to ${DEFAULT_SUBMIT_FEEDBACK_OPTIONS.apiUrl}`, async () => {
    const { result } = renderHook(() =>
      useFeedback({ projectKey: 'TEST_PROJECT_KEY' }),
    );

    const { submitFeedback } = result.current;

    await submitFeedback({ vote: '1' }, 'prompt-id');

    await waitFor(() => expect(endpointHits).toBe(1));
  });

  it("doesn't submit feedback if promptId is not provided", async () => {
    const { result } = renderHook(() =>
      useFeedback({ projectKey: 'TEST_PROJECT_KEY' }),
    );

    const { submitFeedback } = result.current;

    await submitFeedback({ vote: '1' });

    await waitFor(() => expect(endpointHits).toBe(0));
  });

  it(`submitFeedback should be aborted when abort is called`, async () => {
    const { result } = renderHook(() =>
      useFeedback({ projectKey: 'TEST_PROJECT_KEY' }),
    );

    const { submitFeedback, abort } = result.current;

    const submitFeedbackPromise = submitFeedback({ vote: '1' }, 'prompt-id');

    abort();

    await waitFor(() => expect(endpointHits).toBe(0));
    await expect(submitFeedbackPromise).resolves.toBeUndefined();
  });

  it('should ignore errors', async () => {
    try {
      const { result } = renderHook(() =>
        useFeedback({ projectKey: 'TEST_PROJECT_KEY' }),
      );

      const { submitFeedback } = result.current;

      response = { error: 'I will not be handled' };
      status = 500;

      await submitFeedback({ vote: '1' }, 'prompt-id');

      expect(result.error).toBeUndefined();
    } catch {
      // do nothing
    }
  });
});
