import '@markprompt/css';
import './style.css';

import { markprompt, type MarkpromptOptions } from '@markprompt/web';

const el = document.querySelector('#markprompt');

if (el && el instanceof HTMLElement) {
  markprompt(import.meta.env.VITE_PROJECT_API_KEY, el, {
    feedback: { enabled: true },
    search: { enabled: true },
    prompt: {
      apiUrl: `${import.meta.env.VITE_MARKPROMPT_API_URL}/v1/chat`,
    },
    defaultView: 'prompt',
    open: true,
  } satisfies MarkpromptOptions);
}
