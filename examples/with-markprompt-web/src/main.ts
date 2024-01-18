import '@markprompt/css';
import './style.css';
import { markprompt, type MarkpromptOptions } from '@markprompt/web';

const el = document.querySelector('#markprompt');

async function get_random_activity(args: string): Promise<string> {
  const parsed = JSON.parse(args);
  const url = new URL('https://www.boredapi.com/api/activity');

  Object.entries(parsed).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value.toString());
  });

  const res = await fetch(url);
  return await res.text();
}

if (el && el instanceof HTMLElement) {
  markprompt(import.meta.env.VITE_PROJECT_API_KEY, el, {
    feedback: { enabled: true },
    search: { enabled: true },
    chat: {
      apiUrl: import.meta.env.VITE_MARKPROMPT_API_URL,
      enabled: true,
      defaultView: {
        message:
          "Welcome to Markprompt! We're here to assist you. Just type your question to get started.",
        promptsHeading: 'Popular questions',
        prompts: [
          'What is Markprompt?',
          'How do I setup the React component?',
          'Do you have a REST API?',
        ],
      },
      tool_choice: 'auto',
      tools: [
        {
          call: get_random_activity,
          tool: {
            type: 'function',
            function: {
              name: 'get_random_activity',
              description: 'Get a random activity from the Bored API',
              parameters: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    description: 'Find a random activity with a given type',
                    enum: [
                      'education',
                      'recreational',
                      'social',
                      'diy',
                      'charity',
                      'cooking',
                      'relaxation',
                      'music',
                      'busywork',
                    ],
                  },
                  participants: {
                    type: 'integer',
                    description:
                      'Find a random activity for a given number of participants',
                  },
                },
                required: [],
              },
            },
          },
          requireConfirmation: false,
        },
      ],
    },
    defaultView: 'chat',
    trigger: {
      buttonLabel: 'Ask AI',
    },
  } satisfies MarkpromptOptions);
}
