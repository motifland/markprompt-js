import { Duplex } from 'node:stream';

import { type RestRequest, rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
  vi,
} from 'vitest';

import { MARKPROMPT_COMPLETIONS_URL, submitPrompt } from './index.js';

let request: RestRequest;
let stream: ReadableStream;
const server = setupServer(
  rest.post(MARKPROMPT_COMPLETIONS_URL, (req, res, ctx) => {
    request = req;
    return res(ctx.status(200), ctx.body(stream));
  }),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterAll(() => {
  server.close();
});

afterEach(() => {
  server.resetHandlers();
});

describe('submitPrompt', () => {
  test('require projectKey', async () => {
    // @ts-expect-error We test a missing project key.
    await expect(() => submitPrompt('Explain to me…')).rejects.toThrowError(
      'A projectKey is required',
    );
  });

  test('don’t make requests if the prompt is empty', async () => {
    const onAnswerChunk = vi.fn();
    const onReferences = vi.fn();
    const onError = vi.fn();

    await submitPrompt('', 'testKey', onAnswerChunk, onReferences, onError);

    expect(request).toBeUndefined();
    expect(onAnswerChunk).not.toHaveBeenCalled();
    expect(onReferences).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  test('make a request', async () => {
    const onAnswerChunk = vi.fn();
    const onReferences = vi.fn();
    const onError = vi.fn();

    stream = new Duplex();

    await submitPrompt('', 'testKey', onAnswerChunk, onReferences, onError);

    expect(request).toBeUndefined();
    expect(onAnswerChunk).not.toHaveBeenCalled();
    expect(onReferences).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
});
