import { DEFAULT_SUBMIT_CHAT_OPTIONS } from '@markprompt/core';
import { waitFor, act, renderHook } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { type UsePromptResult, usePrompt } from './usePrompt.js';

const encoder = new TextEncoder();
let response: object | string[] = [];
let status = 200;
let stream: ReadableStream;

const server = setupServer(
  rest.post(DEFAULT_SUBMIT_CHAT_OPTIONS.apiUrl!, async (_req, res, ctx) => {
    if (status >= 400) {
      return res(ctx.status(status), ctx.json(response));
    }

    stream = new ReadableStream({
      start(controller) {
        for (const chunk of response as string[]) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller?.close();
      },
    });
    return res(ctx.status(status), ctx.body(stream));
  }),
);

describe('usePrompt', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => {});

  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterAll(() => {
    server.close();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    response = [];
    status = 200;
    server.resetHandlers();
    vi.resetAllMocks();
  });

  it('should return a default state', () => {
    const { result } = renderHook(() =>
      usePrompt({
        projectKey: 'TEST_PROJECT_KEY',
      }),
    );

    expect(result.current).toStrictEqual({
      abort: expect.any(Function),
      abortFeedbackRequest: expect.any(Function),
      answer: '',
      error: undefined,
      prompt: '',
      promptId: undefined,
      references: [],
      setPrompt: expect.any(Function),
      state: 'indeterminate',
      submitFeedback: expect.any(Function),
      submitPrompt: expect.any(Function),
    } satisfies UsePromptResult);
  });

  it('should submit prompts', async () => {
    const { result } = renderHook(() =>
      usePrompt({ projectKey: 'TEST_PROJECT_KEY' }),
    );

    act(() => result.current.setPrompt('How much is 1+2?'));

    response = ['According to my calculator ', '1 + 2 = 3'];

    await result.current.submitPrompt();

    await waitFor(() =>
      expect(result.current.answer).toBe(
        'According to my calculator 1 + 2 = 3',
      ),
    );
  });

  it('should throw when instantiated without projectKey', async () => {
    try {
      const { result } = renderHook(() => usePrompt({ projectKey: '' }));
      expect(result.error).toBeInstanceOf(Error);
      // eslint-disable-next-line no-empty
    } catch {}
  });

  it('should not do requests when submitting without prompt', async () => {
    const { result } = renderHook(() =>
      usePrompt({ projectKey: 'TEST_PROJECT_KEY' }),
    );

    await result.current.submitPrompt();

    expect(result.current.answer).toBe('');
    expect(result.current.state).toBe('indeterminate');
  });

  it('should not throw when aborted', async () => {
    const { result } = renderHook(() =>
      usePrompt({ projectKey: 'TEST_PROJECT_KEY' }),
    );

    act(() => result.current.setPrompt('How much is 1+2?'));
    result.current.submitPrompt();
    result.current.abort();

    expect(result.error).toBeUndefined();
  });

  it('should log an error to console when an error is thrown', async () => {
    const { result } = renderHook(() =>
      usePrompt({ projectKey: 'TEST_PROJECT_KEY' }),
    );

    act(() => result.current.setPrompt('How much is 1+2?'));

    response = { error: 'test' };
    status = 500;

    await act(() => result.current.submitPrompt());

    expect(consoleMock).toHaveBeenCalled();
  });

  it('should ignore AbortErrors', async () => {
    const mockFetch = vi.spyOn(global, 'fetch').mockImplementation(() => {
      throw new DOMException('test', 'AbortError');
    });

    try {
      const { result } = renderHook(() =>
        usePrompt({ projectKey: 'TEST_PROJECT_KEY' }),
      );

      response = ['According to my calculator ', '1 + 2 = 3'];

      act(() => result.current.setPrompt('How much is 1+2?'));

      result.current.submitPrompt();
      result.current.abort();

      expect(result.error).toBeUndefined();
      expect(consoleMock).not.toHaveBeenCalled();
    } finally {
      mockFetch.mockRestore();
    }
  });
});
