import {
  DEFAULT_SUBMIT_CHAT_OPTIONS,
  DEFAULT_SUBMIT_FEEDBACK_OPTIONS,
  type FileSectionReference,
} from '@markprompt/core';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  afterEach,
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { ChatView } from './ChatView.js';
import { createChatStore, useChatStore } from './store.js';

const encoder = new TextEncoder();
let markpromptData: {
  conversationId?: string;
  promptId?: string;
  references?: FileSectionReference[];
  debug?: unknown;
} = {};
let markpromptDebug: object = {};
let response: string | string[] = [];
let wait = false;
let status = 200;
let stream: ReadableStream;

const server = setupServer(
  rest.post(DEFAULT_SUBMIT_CHAT_OPTIONS.apiUrl!, async (req, res, ctx) => {
    if (status >= 400) {
      return res(
        ctx.status(status),
        ctx.json({ error: 'Internal server error' }),
      );
    }

    stream = new ReadableStream({
      async start(controller) {
        for (const chunk of response) {
          if (wait) await new Promise((resolve) => setTimeout(resolve, 1000));
          controller.enqueue(encoder.encode(chunk));
        }
        controller?.close();
      },
    });

    return res(
      ctx.delay('real'),
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
  rest.post(DEFAULT_SUBMIT_FEEDBACK_OPTIONS.apiUrl!, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ status: 'ok' }));
  }),
);

describe('ChatView', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

  afterEach(() => {
    status = 200;
    response = [];
    wait = false;
    markpromptData = {};
    markpromptDebug = {};

    server.resetHandlers();
    vi.resetAllMocks();
    localStorage.clear();
  });

  afterAll(() => {
    vi.restoreAllMocks();
    server.close();
  });

  it('renders', () => {
    render(<ChatView projectKey="test-key" />);
    expect(screen.getByText('Ask AI')).toBeInTheDocument();
  });

  it('throws an error if no project key is provided', () => {
    try {
      // @ts-expect-error intentionally passing no project key
      expect(() => render(<ChatView />)).toThrow(
        'Markprompt: a project key is required. Make sure to pass your Markprompt project key to <ChatView />.',
      );
    } catch {
      // do nothing
    }
  });

  it('submits a chat request', async () => {
    response = ['answer'];

    const user = await userEvent.setup();

    render(<ChatView projectKey="test-key" />);

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('answer')).toBeInTheDocument();
    });
  });

  it('allows users to ask multiple questions', async () => {
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId };
    response = ['answer'];

    const user = await userEvent.setup();

    render(<ChatView projectKey="test-key" />);

    await user.type(screen.getByRole('textbox'), 'test 1');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getAllByText('answer')).toHaveLength(2);
    });

    const nextPromptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId: nextPromptId };
    response = ['a different answer'];

    await user.type(screen.getByRole('textbox'), 'test 2');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getAllByText('a different answer')).toHaveLength(1);
    });

    expect(screen.queryAllByText('answer')).toHaveLength(2);
  });

  it('allows users to switch between conversations', async () => {
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId };
    response = ['answer'];

    const user = await userEvent.setup();

    render(<ChatView projectKey="test-key" />);

    await user.type(screen.getByRole('textbox'), 'test 1');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getAllByText('answer')).toHaveLength(2);
    });

    await user.click(screen.getByText('New chat'));

    const nextConversationId = crypto.randomUUID();
    const nextPromptId = crypto.randomUUID();
    markpromptData = {
      conversationId: nextConversationId,
      promptId: nextPromptId,
    };
    response = ['a different answer'];

    await user.type(screen.getByRole('textbox'), 'test 2');
    await user.keyboard('{Enter}');

    await user.click(screen.getByRole('button', { name: 'test 1 answer' }));
  });

  it('shows references', async () => {
    response = ['answer'];
    const references = [
      {
        file: { path: '/page1', source: { type: 'file-upload' as const } },
        meta: { leadHeading: { value: 'Page 1' } },
      },
    ];
    markpromptData = { references };

    const user = await userEvent.setup();

    render(<ChatView projectKey="test-key" />);

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument();
    });
  });

  it('shows references at the end', async () => {
    response = ['answer'];
    const references = [
      {
        file: { path: '/page1', source: { type: 'file-upload' as const } },
        meta: { leadHeading: { value: 'Page 1' } },
      },
    ];
    markpromptData = { references };

    const user = await userEvent.setup();

    render(
      <ChatView projectKey="test-key" referencesOptions={{ display: 'end' }} />,
    );

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument();
    });
  });

  it('does not show references when disabled', async () => {
    response = ['answer'];
    const references = [
      {
        file: { path: '/page1', source: { type: 'file-upload' as const } },
        meta: { leadHeading: { value: 'Page 1' } },
      },
    ];
    markpromptData = { references };

    const user = await userEvent.setup();

    render(
      <ChatView
        projectKey="test-key"
        referencesOptions={{ display: 'none' }}
      />,
    );

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.queryByText('Page 1')).not.toBeInTheDocument();
    });
  });

  it('aborts a pending chat request when the view changes', async () => {
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId };
    response = ['testing', 'testing', 'test'];
    wait = true;

    const user = await userEvent.setup();

    const { rerender } = render(<ChatView projectKey="test-key" />);

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    rerender(<ChatView projectKey="test-key" activeView="search" />);

    await waitFor(() => {
      expect(
        screen.getByText(
          'This chat response was cancelled. Please try regenerating the answer or ask another question.',
        ),
      ).toBeInTheDocument();
    });
  });

  it(
    'aborts a pending chat request when a new prompt is submitted',
    async () => {
      response = ['testing ', 'testing ', 'test'];
      wait = true;

      const user = await userEvent.setup();

      render(<ChatView projectKey="test-key" />);

      await user.type(screen.getByRole('textbox'), 'test');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(
          screen.getByText('Fetching relevant pages…'),
        ).toBeInTheDocument();
      });

      response = ['testing ', 'testing ', 'test again'];
      wait = false;

      await user.type(screen.getByRole('textbox'), 'test again');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(
          screen.getByText(
            'This chat response was cancelled. Please try regenerating the answer or ask another question.',
          ),
        ).toBeInTheDocument();
      });
    },
    {
      // flaky test: sometimes the first request finishes before it can be cancelled by the seceond prompt
      retry: 3,
    },
  );

  it('aborts a pending chat request when an error is returned from the API', async () => {
    status = 500;

    const user = await userEvent.setup();

    render(<ChatView projectKey="test-key" />);

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(
        screen.getByText(
          'This chat response was cancelled. Please try regenerating the answer or ask another question.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('initially does not have stored conversations', async () => {
    render(<ChatView projectKey="test-key" />);
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('starts a new chat when the "New chat" option is selected', async () => {
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId };
    response = ['answer'];

    const user = await userEvent.setup();

    render(<ChatView projectKey="test-key" />);

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'New chat' }));

    await waitFor(() => {
      // only the sidebar is shown, not the conversation itself
      expect(screen.getAllByText('answer')).toHaveLength(1);
    });
  });

  it('saves conversations', async () => {
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId };
    response = ['answer'];

    const user = await userEvent.setup();

    render(<ChatView projectKey="test-key" />);

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getAllByText('answer')).toHaveLength(2);
    });

    await user.click(screen.getByRole('combobox'));

    await waitFor(() => {
      expect(screen.getAllByRole('option')).toHaveLength(2);
    });
  });

  it('does not save conversations when disabled', async () => {
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId };
    response = ['answer'];

    const user = await userEvent.setup();

    render(<ChatView projectKey="test-key" chatOptions={{ history: false }} />);

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getAllByText('answer')).toHaveLength(2);
    });

    expect(localStorage.getItem('markprompt')).toBeNull();
  });

  it("does not restore a conversation if it's older than 4 hours", () => {
    const conversationId = crypto.randomUUID();
    const lastUpdated = new Date(
      new Date().getTime() - 1000 * 60 * 60 * 5,
    ).toISOString();

    localStorage.setItem(
      'markprompt',
      JSON.stringify({
        state: {
          conversationIdsByProjectKey: {
            'test-key': [conversationId],
          },
          messagesByConversationId: {
            [conversationId]: {
              lastUpdated,
              messages: [
                {
                  id: crypto.randomUUID(),
                  promptId: crypto.randomUUID(),
                  prompt: 'test',
                  answer: 'answer',
                  state: 'done',
                  references: [],
                },
              ],
            },
          },
        },
        version: 1,
      }),
    );

    render(<ChatView projectKey="test-key" />);

    expect(screen.getAllByText('test')).toHaveLength(1);
  });

  it('restores the latest conversation that is < 4 hours old', () => {
    const conversationId1 = crypto.randomUUID();
    const conversationId2 = crypto.randomUUID();
    const lastUpdated1 = new Date(
      new Date().getTime() - 1000 * 60 * 60 * 3,
    ).toISOString();
    const lastUpdated2 = new Date(
      new Date().getTime() - 1000 * 60 * 60 * 2,
    ).toISOString();

    localStorage.setItem(
      'markprompt',
      JSON.stringify({
        state: {
          conversationIdsByProjectKey: {
            'test-key': [conversationId1, conversationId2],
          },
          messagesByConversationId: {
            [conversationId1]: {
              lastUpdated: lastUpdated1,
              messages: [
                {
                  id: crypto.randomUUID(),
                  promptId: crypto.randomUUID(),
                  prompt: 'test 1',
                  answer: 'answer 1',
                  state: 'done',
                  references: [],
                },
              ],
            },
            [conversationId2]: {
              lastUpdated: lastUpdated2,
              messages: [
                {
                  id: crypto.randomUUID(),
                  promptId: crypto.randomUUID(),
                  prompt: 'test 2',
                  answer: 'answer 2',
                  state: 'done',
                  references: [],
                },
              ],
            },
          },
        },
        version: 1,
      }),
    );

    render(<ChatView projectKey="test-key" />);

    expect(screen.getAllByText('test 1')).toHaveLength(1);
    expect(screen.getAllByText('test 2')).toHaveLength(2);
  });

  it('allows users to give feedback', async () => {
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId };
    response = ['answer'];

    const user = await userEvent.setup();

    render(
      <ChatView projectKey="test-key" feedbackOptions={{ enabled: true }} />,
    );

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(
        screen.getByText('Was this response helpful?'),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByText('yes'));
  });

  it('calls back after giving feedback', async () => {
    const onSubmit = vi.fn();
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId };
    response = ['answer'];

    const user = await userEvent.setup();

    render(
      <ChatView
        projectKey="test-key"
        feedbackOptions={{ enabled: true, onFeedbackSubmit: onSubmit }}
      />,
    );

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(
        screen.getByText('Was this response helpful?'),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByText('yes'));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('allows users to regenerate an answer', async () => {
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId };
    response = ['answer'];

    const user = await userEvent.setup();

    render(<ChatView projectKey="test-key" />);

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getAllByText('answer')).toHaveLength(2);
    });

    const nextPromptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId: nextPromptId };
    response = ['a different answer'];

    await user.click(screen.getByText('Regenerate'));

    await waitFor(() => {
      expect(screen.getAllByText('a different answer')).toHaveLength(2);
    });

    expect(screen.queryAllByText('answer')).toHaveLength(0);
  });

  it('allows users to stop generating an answer', async () => {
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId };
    response = ['testing ', 'testing ', 'test'];
    wait = true;

    const user = await userEvent.setup();

    render(<ChatView projectKey="test-key" />);

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await user.click(await screen.findByText('Stop generating'));

    await waitFor(() => {
      expect(
        screen.getByText('This chat response was cancelled.', { exact: false }),
      ).toBeInTheDocument();
    });
  });

  it('errors when creating a standalone chat store', async () => {
    try {
      // @ts-expect-error - intentionally throwing error
      expect(createChatStore({})).toThrowError(
        'Markprompt: a project key is required. Make sure to pass your Markprompt project key to createChatStore.',
      );
    } catch {
      // do nothing
    }
  });

  it('errors when calling useChatStore outside a provider', async () => {
    try {
      expect(() => renderHook(() => useChatStore((x) => x))).toThrowError();
    } catch {
      // do nothing
    }
  });
});
