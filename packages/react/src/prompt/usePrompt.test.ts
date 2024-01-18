import { DEFAULT_SUBMIT_CHAT_GENERATOR_OPTIONS } from '@markprompt/core';
import { waitFor } from '@testing-library/react';
import {
  act,
  renderHook,
  suppressErrorOutput,
} from '@testing-library/react-hooks';
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
let response:
  | object
  | {
      content: string | null;
      tool_call?: { name: string; parameters: string } | null;
    }[] = [];

let status = 200;
let stream: ReadableStream;

const server = setupServer(
  rest.post(
    DEFAULT_SUBMIT_CHAT_GENERATOR_OPTIONS.apiUrl!,
    async (_req, res, ctx) => {
      if (status >= 400) {
        return res(ctx.status(status), ctx.json(response));
      }

      stream = new ReadableStream({
        start(controller) {
          if (Array.isArray(response)) {
            let i = 0;
            for (const chunk of response) {
              controller.enqueue(
                encoder.encode(
                  formatEvent({
                    data: getChunk(chunk.content, chunk.tool_call ?? null, i),
                  }),
                ),
              );
              i++;
            }
            controller.enqueue(encoder.encode(formatEvent({ data: '[DONE]' })));
          } else {
            controller.enqueue(encoder.encode(JSON.stringify(response)));
          }

          controller?.close();
        },
      });

      return res(ctx.status(status), ctx.body(stream));
    },
  ),
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

    response = [
      { content: 'According to my calculator ' },
      { content: '1 + 2 = 3' },
    ];

    await result.current.submitPrompt();

    await waitFor(() =>
      expect(result.current.answer).toBe(
        'According to my calculator 1 + 2 = 3',
      ),
    );
  });

  it('should throw when instantiated without projectKey', async () => {
    const restoreConsole = suppressErrorOutput();

    try {
      const { result } = renderHook(() => usePrompt({ projectKey: '' }));
      expect(result.error).toBeInstanceOf(Error);
    } finally {
      restoreConsole();
    }
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
    const restoreConsole = suppressErrorOutput();

    try {
      const { result } = renderHook(() =>
        usePrompt({ projectKey: 'TEST_PROJECT_KEY' }),
      );

      act(() => result.current.setPrompt('How much is 1+2?'));

      response = { error: 'test' };
      status = 500;

      await act(() => result.current.submitPrompt());

      expect(consoleMock).toHaveBeenCalled();
    } finally {
      restoreConsole();
    }
  });

  it('should ignore AbortErrors', async () => {
    const mockFetch = vi.spyOn(global, 'fetch').mockImplementation(() => {
      throw new DOMException('test', 'AbortError');
    });

    try {
      const { result } = renderHook(() =>
        usePrompt({ projectKey: 'TEST_PROJECT_KEY' }),
      );

      response = [
        { content: 'According to my calculator ' },
        { content: '1 + 2 = 3' },
      ];

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

// Server-sent events formatting code taken from:
// https://github.com/rexxars/eventsource-parser/blob/main/test/format.ts
export interface SseMessage {
  event?: string;
  retry?: number;
  id?: string;
  data: string;
}

export function formatEvent(message: SseMessage | string): string {
  const msg = typeof message === 'string' ? { data: message } : message;

  let output = '';
  if (msg.event) {
    output += `event: ${msg.event}\n`;
  }

  if (msg.retry) {
    output += `retry: ${msg.retry}\n`;
  }

  if (typeof msg.id === 'string' || typeof msg.id === 'number') {
    output += `id: ${msg.id}\n`;
  }

  output += encodeData(msg.data);

  return output;
}

export function formatComment(comment: string): string {
  return `:${comment}\n\n`;
}

export function encodeData(text: string): string {
  const data = String(text).replace(/(\r\n|\r|\n)/g, '\n');
  const lines = data.split(/\n/);

  let line = '';
  let output = '';

  for (let i = 0, l = lines.length; i < l; ++i) {
    line = lines[i];

    output += `data: ${line}`;
    output += i + 1 === l ? '\n\n' : '\n';
  }

  return output;
}

export function getChunk(
  content: string | null,
  tool_call: { name: string; parameters: string } | null,
  index: number,
  model = 'gpt-4-1106-preview',
  isLast?: boolean,
): string {
  return JSON.stringify({
    object: 'chat.completion.chunk',
    choices: [
      {
        delta: {
          content,
          role: 'assistant',
          ...(tool_call
            ? {
                tool_calls: [
                  {
                    id: crypto.randomUUID(),
                    type: 'function',
                    function: {
                      name: tool_call?.name,
                      parameters: tool_call?.parameters,
                    },
                  },
                ],
              }
            : {}),
        },
        finish_reason: isLast ? 'stop' : null,
        index,
      },
    ],
    created: Date.now(),
    model,
  });
}
