import { submitChatGenerator } from '@markprompt/core';
import Head from 'next/head';
import type { OpenAI } from 'openai';
import React, { ReactElement, useCallback, useState } from 'react';

interface ChatCompletionExecution {
  run?: (args: unknown) => void;
}

const tools: (OpenAI.ChatCompletionTool & ChatCompletionExecution)[] = [
  {
    type: 'function',
    function: {
      name: 'get_current_weather',
      description: 'Get the current weather in a given location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The city and state, e.g. San Francisco, CA',
          },
          unit: { type: 'string', enum: ['celsius', 'fahrenheit'] },
        },
        required: ['location'],
      },
    },
    run: (args) => {
      // eslint-disable-next-line no-console
      console.debug(
        'Calling get_current_weather with arguments',
        JSON.stringify(args, null, 2),
      );
    },
  },
];

export default function IndexPage(): ReactElement {
  const [input, setInput] = useState('');
  const [streamedMessage, setStreamedMessage] = useState('');

  const submitForm = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setStreamedMessage('Fetching response...');

      const toolCalls: OpenAI.Chat.Completions.ChatCompletionChunk.Choice.Delta.ToolCall[] =
        [];
      for await (const chunk of submitChatGenerator(
        [
          {
            role: 'system',
            content: 'You are an expert AI assistant who loves to help people.',
          },
          {
            role: 'user',
            content: input,
          },
        ],
        process.env.NEXT_PUBLIC_PROJECT_API_KEY!,
        {
          tools: tools,
        },
      )) {
        if (chunk.content) {
          setStreamedMessage(chunk.content);
        }

        for (const toolCall of chunk.tool_calls || []) {
          if (
            !toolCall.function ||
            toolCalls.find((c) => c.function?.name === toolCall.function?.name)
          ) {
            continue;
          }
          toolCalls.push(toolCall);
        }
      }

      for (const toolCall of toolCalls || []) {
        if (!toolCall.function) {
          continue;
        }
        const tool = tools.find(
          (t) => t.function.name === toolCall.function?.name,
        );
        if (tool) {
          tool.run?.(toolCall.function?.arguments);
          setStreamedMessage(
            `Calling: ${tool.function.name}\n\nArguments:\n\n${
              toolCall.function?.arguments || {}
            }`,
          );
        }
      }
    },
    [input],
  );

  return (
    <>
      <Head>
        <title>Function calling</title>
        <meta charSet="utf-8" />
      </Head>
      <div className="Container">
        <form className="InputForm" onSubmit={submitForm}>
          <label className="label" htmlFor="input">
            Input
          </label>
          <input
            id="input"
            type="text"
            placeholder="What is the weather in Paris?"
            onChange={(e) => setInput(e.target.value)}
          ></input>
        </form>
        <div className="Output">
          <p className="label">Output</p>
          <div className="OutputLogs">
            <pre>
              <code>{streamedMessage}</code>
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}
