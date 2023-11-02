import { Markprompt } from '@markprompt/react';
import { ReactElement } from 'react';

export default function IndexPage(): ReactElement {
  return (
    <Markprompt
      projectKey={
        process.env.NEXT_PUBLIC_MARKPROMPT_PROJECT_KEY || 'YOUR-PROJECT-KEY'
      }
      chat={{
        enabled: true,
        iDontKnowMessage: 'Sorry, I am not sure how to answer that.',
        systemPrompt:
          'You are a very enthusiastic company representative who loves to help people!',
        temperature: 0.1,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
        maxTokens: 500,
        sectionsMatchCount: 10,
        sectionsMatchThreshold: 0.5,
        defaultView: {
          message: () => (
            <div style={{ padding: 16, fontSize: 15 }}>
              Welcome to the Markprompt AI chatbot!
            </div>
          ),
          prompts: [
            'What is Markprompt?',
            'Is React supported?',
            'Is there an API?',
          ],
        },
      }}
      search={{
        enabled: false,
      }}
    />
  );
}
