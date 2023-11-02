import {
  DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS,
  type SearchResult,
  type AlgoliaDocSearchHit,
} from '@markprompt/core';
import { waitFor, renderHook, act } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  describe,
  expect,
  it,
  afterAll,
  afterEach,
  beforeAll,
  vi,
} from 'vitest';

import { type UseSearchResult, useSearch } from './useSearch.js';

let searchResults: SearchResult[] | AlgoliaDocSearchHit[] = [];
let status = 200;
let searchHits = 0;
let algoliaHits = 0;

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterAll(() => {
  server.close();
});

afterEach(() => {
  searchResults = [];
  searchHits = 0;
  algoliaHits = 0;
  status = 200;
  server.resetHandlers();
  vi.resetAllMocks();
});

const server = setupServer(
  rest.get(
    DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS.apiUrl!,
    async (_req, res, ctx) => {
      searchHits += 1;
      return res(
        ctx.status(status),
        ctx.body(JSON.stringify({ data: searchResults })),
      );
    },
  ),
  rest.post(
    `https://test-dsn.algolia.net/1/indexes/test/query`,
    async (_req, res, ctx) => {
      algoliaHits += 1;
      return res(
        ctx.status(status),
        ctx.body(JSON.stringify({ data: searchResults })),
      );
    },
  ),
);

describe('useSearch', () => {
  it('should return a default state', () => {
    const { result } = renderHook(() =>
      useSearch({
        projectKey: 'TEST_PROJECT_KEY',
      }),
    );

    expect(result.current).toStrictEqual({
      state: 'indeterminate',
      searchResults: [],
      searchQuery: '',
      setSearchQuery: expect.any(Function),
      submitSearchQuery: expect.any(Function),
      abort: expect.any(Function),
    } satisfies UseSearchResult);
  });

  it('should return a state with search results', async () => {
    const { result } = renderHook(() =>
      useSearch({
        projectKey: 'TEST_PROJECT_KEY',
      }),
    );

    searchResults = [
      {
        matchType: 'title',
        file: {
          title: 'Home page',
          path: '/',
          source: {
            type: 'file-upload',
          },
        },
      },
      {
        matchType: 'leadHeading',
        file: {
          path: '/page1',
          source: {
            type: 'file-upload',
          },
        },
        meta: {
          leadHeading: { value: 'Page 1' },
        },
      },
      {
        matchType: 'content',
        snippet: 'Page 2 snippet',
        file: {
          path: '/page2',
          source: {
            type: 'file-upload',
          },
        },
      },
    ];

    await result.current.submitSearchQuery('react');

    await waitFor(() => expect(searchHits).toBe(1));

    expect(result.current.searchResults[0]?.href).toBe(
      (searchResults as SearchResult[])[0].file.path,
    );
    expect(result.current.searchResults[0]?.title).toBe(
      (searchResults as SearchResult[])[0].file.title,
    );
    expect(result.current.searchResults[1]?.title).toBe(
      (searchResults as SearchResult[])[1].meta?.leadHeading?.value,
    );
    expect(result.current.searchResults[2]?.title).toBe(
      (searchResults as SearchResult[])[2].snippet,
    );
  });

  it('should allow Algolia as a search provider', async () => {
    const { result } = renderHook(() =>
      useSearch({
        projectKey: 'TEST_PROJECT_KEY',
        searchOptions: {
          provider: {
            name: 'algolia',
            apiKey: 'test',
            appId: 'test',
            indexName: 'test',
          },
        },
      }),
    );

    searchResults = [
      {
        url: 'https://markprompt.com/docs/hit',
        hierarchy: {
          lvl0: 'React',
          lvl1: 'React introduction',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null,
          lvl6: null,
        },
        _highlightResult: {
          hierarchy: {
            lvl0: {
              value: 'React',
              matchLevel: 'full',
              matchedWords: ['react'],
            },
            lvl1: {
              value: 'React introduction',
              matchLevel: 'partial',
              matchedWords: ['react'],
            },
          },
        },
      },
    ] as AlgoliaDocSearchHit[];

    await act(() => result.current.submitSearchQuery('react'));
    await waitFor(() => expect(algoliaHits).toBe(1));
  });
});
