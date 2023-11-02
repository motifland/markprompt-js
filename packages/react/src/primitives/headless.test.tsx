import {
  DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS,
  type SearchResult,
} from '@markprompt/core';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  afterAll,
  afterEach,
  beforeAll,
  expect,
  test,
  vi,
  vitest,
} from 'vitest';

import * as Markprompt from './headless.js';

let searchResults: SearchResult[] = [];
let status = 200;
const server = setupServer(
  rest.get(
    DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS.apiUrl!,
    async (_req, res, ctx) => {
      return res(
        ctx.status(status),
        ctx.body(JSON.stringify({ data: searchResults })),
      );
    },
  ),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterAll(() => {
  server.close();
});

afterEach(() => {
  searchResults = [];
  status = 200;
  server.resetHandlers();
});

test('Initial state', async () => {
  render(
    <Markprompt.Root>
      <Markprompt.DialogTrigger>Trigger</Markprompt.DialogTrigger>
      <Markprompt.Portal>
        <Markprompt.Overlay />
        <Markprompt.Content>
          <Markprompt.Close>Close</Markprompt.Close>
          <Markprompt.Form>
            Search
            <Markprompt.Prompt />
          </Markprompt.Form>
          <Markprompt.AutoScroller>
            Caret
            <Markprompt.Answer answer="" />
          </Markprompt.AutoScroller>
          <Markprompt.References references={[]} />
        </Markprompt.Content>
      </Markprompt.Portal>
    </Markprompt.Root>,
  );

  const trigger = await screen.findByText('Trigger');
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(trigger).toHaveAttribute('data-state', 'closed');
});

test('Returns children when display is plain', async () => {
  render(
    <Markprompt.Root display="plain">
      <Markprompt.Form>
        Search
        <Markprompt.Prompt />
      </Markprompt.Form>
      <Markprompt.AutoScroller>
        Caret
        <Markprompt.Answer answer="" />
      </Markprompt.AutoScroller>
      <Markprompt.References references={[]} />
    </Markprompt.Root>,
  );

  expect(screen.getByRole('searchbox')).toBeInTheDocument();
});

test('Trigger opens the dialog', async () => {
  const user = userEvent.setup();

  render(
    <Markprompt.Root>
      <Markprompt.DialogTrigger>Trigger</Markprompt.DialogTrigger>
      <Markprompt.Portal>
        <Markprompt.Overlay />
        <Markprompt.Content>
          <Markprompt.Close>Close</Markprompt.Close>
          <Markprompt.Form>
            Search
            <Markprompt.Prompt />
          </Markprompt.Form>
          <Markprompt.AutoScroller>
            Caret
            <Markprompt.Answer answer="" />
          </Markprompt.AutoScroller>
          <Markprompt.References references={[]} />
        </Markprompt.Content>
      </Markprompt.Portal>
    </Markprompt.Root>,
  );

  const trigger = await screen.findByText('Trigger');
  await user.click(trigger);
  expect(await screen.findByText('Caret')).toBeVisible();

  const close = await screen.findByText('Close');
  expect(close).toBeVisible();
});

test('Branding is displayed in Content when set to true', async () => {
  const user = userEvent.setup();

  render(
    <Markprompt.Root>
      <Markprompt.DialogTrigger>Trigger</Markprompt.DialogTrigger>
      <Markprompt.Portal>
        <Markprompt.Content branding={{ show: true }}></Markprompt.Content>
      </Markprompt.Portal>
    </Markprompt.Root>,
  );

  const trigger = await screen.findByText('Trigger');
  await user.click(trigger);

  const branding = await screen.findByText('Powered by');
  expect(branding).toBeInTheDocument();
});

test('Branding is not displayed in Content when set to false', async () => {
  const user = userEvent.setup();

  render(
    <Markprompt.Root>
      <Markprompt.DialogTrigger>Trigger</Markprompt.DialogTrigger>
      <Markprompt.Portal>
        <Markprompt.Content branding={{ show: false }}></Markprompt.Content>
      </Markprompt.Portal>
    </Markprompt.Root>,
  );

  const trigger = await screen.findByText('Trigger');
  await user.click(trigger);

  const branding = screen.queryByText('Powered by');
  expect(branding).not.toBeInTheDocument();
});

test('Branding is displayed in PlainContent when set to true', async () => {
  const user = userEvent.setup();

  render(
    <Markprompt.Root>
      <Markprompt.DialogTrigger>Trigger</Markprompt.DialogTrigger>
      <Markprompt.Portal>
        <Markprompt.PlainContent
          branding={{ show: true }}
        ></Markprompt.PlainContent>
      </Markprompt.Portal>
    </Markprompt.Root>,
  );

  const trigger = await screen.findByText('Trigger');
  await user.click(trigger);

  const branding = await screen.findByText('Powered by');
  expect(branding).toBeInTheDocument();
});

test('Branding is not displayed in PlainContent when set to false', async () => {
  const user = userEvent.setup();

  render(
    <Markprompt.Root>
      <Markprompt.DialogTrigger>Trigger</Markprompt.DialogTrigger>
      <Markprompt.Portal>
        <Markprompt.PlainContent
          branding={{ show: false }}
        ></Markprompt.PlainContent>
      </Markprompt.Portal>
    </Markprompt.Root>,
  );

  const trigger = await screen.findByText('Trigger');
  await user.click(trigger);

  const branding = screen.queryByText('Powered by');
  expect(branding).not.toBeInTheDocument();
});

test('Close button closes the dialog', async () => {
  const user = userEvent.setup();

  render(
    <Markprompt.Root>
      <Markprompt.DialogTrigger>Trigger</Markprompt.DialogTrigger>
      <Markprompt.Portal>
        <Markprompt.Overlay />
        <Markprompt.Content>
          <Markprompt.Close>Close</Markprompt.Close>
          <p>test</p>
        </Markprompt.Content>
      </Markprompt.Portal>
    </Markprompt.Root>,
  );

  const trigger = await screen.findByText('Trigger');
  await user.click(trigger);

  const close = await screen.findByText('Close');
  await user.click(close);

  expect(screen.queryByText('test')).not.toBeInTheDocument();
});

test('SearchResult properly includes href', async () => {
  render(
    <Markprompt.SearchResult
      href="https://example.com"
      title="Example result"
    />,
  );

  const result = await screen.findByText('Example result');
  expect(result).toHaveAttribute('href', 'https://example.com');
});

test('Title and description should be visible', async () => {
  const user = userEvent.setup();

  render(
    <Markprompt.Root>
      <Markprompt.DialogTrigger>Trigger</Markprompt.DialogTrigger>
      <Markprompt.Portal>
        <Markprompt.Overlay />
        <Markprompt.Content>
          <Markprompt.Title hide={false}>Example title</Markprompt.Title>
          <Markprompt.Description hide={false}>
            Example description
          </Markprompt.Description>
        </Markprompt.Content>
      </Markprompt.Portal>
    </Markprompt.Root>,
  );

  const trigger = await screen.findByText('Trigger');
  await user.click(trigger);

  const title = await screen.findByText('Example title');
  expect(title).toBeVisible();

  const description = await screen.findByText('Example description');
  expect(description).toBeVisible();
});

test('Search result title and description should be visible', async () => {
  render(
    <Markprompt.SearchResults
      searchResults={[
        {
          href: 'https://example.com',
          heading: 'Test heading',
          title: 'Test title',
          subtitle: 'Test subtitle',
        },
      ]}
    ></Markprompt.SearchResults>,
  );

  const heading = await screen.findByText('Test title');
  expect(heading).toBeVisible();
});

test('Prompt changes trigger user-defined callbacks', async () => {
  const cb = vitest.fn();
  const user = userEvent.setup();

  render(
    <Markprompt.Root>
      <Markprompt.Prompt type="text" onChange={cb} />
    </Markprompt.Root>,
  );

  const input = await screen.findByRole('textbox');

  await user.type(input, 'test');
  expect(input).toHaveValue('test');
  expect(cb).toHaveBeenCalled();
});

test('Prompt changes updates prompt state', async () => {
  const user = userEvent.setup();

  render(
    <Markprompt.Root>
      <Markprompt.Prompt type="text" />
    </Markprompt.Root>,
  );

  const input = await screen.findByRole('textbox');

  await user.type(input, 'test');
  expect(input).toHaveValue('test');
});

test('References renders the passed ReferenceComponent', () => {
  const ReferenceComponent = vi.fn(({ reference }) => reference.file.path);
  render(
    <Markprompt.References
      references={[
        { file: { path: '/path/to/file', source: { type: 'github' } } },
      ]}
      ReferenceComponent={ReferenceComponent}
    />,
  );
  expect(ReferenceComponent).toHaveBeenCalledOnce();
});
