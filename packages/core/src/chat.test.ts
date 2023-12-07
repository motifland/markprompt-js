import { rest, type RestRequest } from 'msw';
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

import { DEFAULT_SUBMIT_CHAT_OPTIONS, submitChat } from './index.js';

const encoder = new TextEncoder();
let markpromptData: unknown = '';
const markpromptDebug = '';
let response: string[] = [];
let status = 200;
let request: RestRequest;
let requestBody: unknown = {};
let stream: ReadableStream;

const server = setupServer(
  rest.post(DEFAULT_SUBMIT_CHAT_OPTIONS.apiUrl!, async (req, res, ctx) => {
    request = req;
    requestBody = await req.json();
    stream = new ReadableStream({
      start(controller) {
        for (const chunk of response) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller?.close();
      },
    });

    return res(
      ctx.status(status),
      ctx.set(
        'x-markprompt-data',
        encoder.encode(JSON.stringify(markpromptData)).toString(),
      ),
      ctx.set(
        'x-markprompt-debug-info',
        encoder.encode(JSON.stringify(markpromptDebug)).toString(),
      ),
      ctx.body(stream),
    );
  }),
);

describe('submitChat', () => {
  const onAnswerChunk = vi.fn().mockReturnValue(true);
  const onReferences = vi.fn();
  const onPromptId = vi.fn();
  const onConversationId = vi.fn();
  const onError = vi.fn();

  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterAll(() => {
    server.close();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    response = [];
    requestBody = {};
    markpromptData = '';
    status = 200;
    server.resetHandlers();
    vi.resetAllMocks();
  });

  test('require projectKey', async () => {
    await expect(() =>
      // @ts-expect-error We test a missing project key.
      submitChat([]),
    ).rejects.toThrowError('A projectKey is required');
  });

  test('don’t make requests if the prompt is empty', async () => {
    await submitChat(
      [],
      'testKey',
      onAnswerChunk,
      onReferences,
      onConversationId,
      onPromptId,
      onError,
    );

    expect(request).toBeUndefined();
    expect(onAnswerChunk).not.toHaveBeenCalled();
    expect(onReferences).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  test('endpoint is called with the default options if none are provided', async () => {
    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onConversationId,
      onPromptId,
      onError,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { apiUrl, ...rest } = DEFAULT_SUBMIT_CHAT_OPTIONS;

    expect(requestBody).toStrictEqual({
      messages: [{ content: 'How much is 1+2?', role: 'user' }],
      projectKey: 'testKey',
      ...rest,
    });
  });

  test('make a request', async () => {
    onAnswerChunk.mockReturnValue(true);

    response = ['According to my calculator ', '1 + 2 = 3'];

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onConversationId,
      onPromptId,
      onError,
    );

    expect(request).toBeDefined();
    expect(onAnswerChunk.mock.calls).toStrictEqual([
      ['According to my calculator '],
      ['1 + 2 = 3'],
    ]);
    expect(onError).not.toHaveBeenCalled();
  });

  test('handle error status code', async () => {
    status = 500;
    response = ['Internal Server Error'];

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onConversationId,
      onPromptId,
      onError,
    );

    expect(request).toBeDefined();
    expect(onAnswerChunk.mock.calls).toStrictEqual([
      [DEFAULT_SUBMIT_CHAT_OPTIONS.iDontKnowMessage],
    ]);
    expect(onReferences).not.toHaveBeenCalled();
    expect(onError.mock.calls).toStrictEqual([
      [new Error('Internal Server Error')],
    ]);
  });

  test('ignore invalid references', async () => {
    onAnswerChunk.mockReturnValue(true);

    response = ['According to my calculator ', '1 + 2 = 3'];

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onConversationId,
      onPromptId,
      onError,
    );

    expect(request).toBeDefined();
    expect(onAnswerChunk.mock.calls).toStrictEqual([
      ['According to my calculator '],
      ['1 + 2 = 3'],
    ]);
    expect(onReferences).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  test('stop if onAnswerChunk returns false', async () => {
    onAnswerChunk.mockReturnValue(false);

    response = ['According to my calculator ', '1 + 2 = 3'];

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onConversationId,
      onPromptId,
      onError,
    );

    expect(request).toBeDefined();
    expect(onAnswerChunk.mock.calls).toStrictEqual([
      ['According to my calculator '],
    ]);
    expect(onReferences).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  test('calls back user-provided onReferences', async () => {
    const references = [
      {
        file: { path: '/page1', source: { type: 'file-upload' } },
        meta: { leadHeading: { value: 'Page 1' } },
      },
    ];

    markpromptData = { references };

    response = ['According to my calculator ', '1 + 2 = 3'];

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onConversationId,
      onPromptId,
      onError,
    );

    expect(request).toBeDefined();
    expect(onAnswerChunk).toHaveBeenCalled();
    expect(onReferences).toHaveBeenCalledWith(references);
    expect(onError).not.toHaveBeenCalled();
  });

  test('calls back user-provided onPromptId', async () => {
    const promptId = 'test-id';

    markpromptData = { promptId };

    response = ['According to my calculator ', '1 + 2 = 3'];

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onConversationId,
      onPromptId,
      onError,
    );

    expect(request).toBeDefined();
    expect(onAnswerChunk).toHaveBeenCalled();
    expect(onPromptId).toHaveBeenCalledWith(promptId);
    expect(onError).not.toHaveBeenCalled();
  });

  test('calls back user-provided onConversationId', async () => {
    const conversationId = 'test-id';

    markpromptData = { conversationId };

    response = ['According to my calculator ', '1 + 2 = 3'];

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onConversationId,
      onPromptId,
      onError,
    );

    expect(request).toBeDefined();
    expect(onAnswerChunk).toHaveBeenCalled();
    expect(onConversationId).toHaveBeenCalledWith(conversationId);
    expect(onError).not.toHaveBeenCalled();
  });

  test('expect onError to be called when an error occurs', async () => {
    const mockFetch = vi.spyOn(global, 'fetch').mockImplementation(() => {
      throw new Error('test');
    });

    try {
      response = ['According to my calculator ', '1 + 2 = 3'];

      await submitChat(
        [{ content: 'How much is 1+2?', role: 'user' }],
        'testKey',
        onAnswerChunk,
        onConversationId,
        onReferences,
        onPromptId,
        onError,
      );

      expect(request).toBeDefined();
      expect(onError).toHaveBeenCalledWith(new Error('test'));
    } finally {
      mockFetch.mockRestore();
    }
  });

  test('expect to log the error when debug is enabled and an error occurs', async () => {
    const mockFetch = vi.spyOn(global, 'fetch').mockImplementation(() => {
      throw new Error('test');
    });

    try {
      response = ['According to my calculator ', '1 + 2 = 3'];

      await submitChat(
        [{ content: 'How much is 1+2?', role: 'user' }],
        'testKey',
        onAnswerChunk,
        onConversationId,
        onReferences,
        onPromptId,
        onError,
        { debug: true },
      );

      expect(request).toBeDefined();
      expect(onError).toHaveBeenCalledWith(new Error('test'));
    } finally {
      mockFetch.mockRestore();
    }
  });

  test('expect onError to be called when a non-error is thrown', async () => {
    const mockFetch = vi.spyOn(global, 'fetch').mockImplementation(() => {
      throw 'test';
    });

    try {
      response = ['According to my calculator ', '1 + 2 = 3'];

      await submitChat(
        [{ content: 'How much is 1+2?', role: 'user' }],
        'testKey',
        onAnswerChunk,
        onConversationId,
        onReferences,
        onPromptId,
        onError,
      );

      expect(request).toBeDefined();
      expect(onError).toHaveBeenCalledWith(new Error('test'));
    } finally {
      mockFetch.mockRestore();
    }
  });
});
