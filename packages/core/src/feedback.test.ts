import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';

import { DEFAULT_SUBMIT_FEEDBACK_OPTIONS, submitFeedback } from './index.js';

let status = 200;

const server = setupServer(
  rest.post(DEFAULT_SUBMIT_FEEDBACK_OPTIONS.apiUrl, async (req, res, ctx) => {
    return res(
      ctx.status(status),
      ctx.body(
        status === 200
          ? JSON.stringify({ status: 'ok' })
          : JSON.stringify({ error: 'Internal Server Error' }),
      ),
    );
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
  server.resetHandlers();
});

describe('submitFeedback', () => {
  test('requires a projectKey', async () => {
    // @ts-expect-error We test a missing project key.
    await expect(() => submitFeedback()).rejects.toThrowError(
      'A projectKey is required',
    );
  });

  test('makes a request', async () => {
    const response = await submitFeedback(
      {
        feedback: { vote: 1 },
        messageId: 'test-id',
      },
      'testKey',
    );

    expect(response).toStrictEqual({ status: 'ok' });
  });

  test('throws an error on invalid status code', async () => {
    status = 500;

    await expect(
      submitFeedback(
        {
          feedback: { vote: 1 },
          messageId: 'test-id',
        },
        'testKey',
      ),
    ).rejects.toThrowError('Internal Server Error');
  });
});
