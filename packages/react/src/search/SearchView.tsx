import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import React, {
  useCallback,
  useEffect,
  useRef,
  type ChangeEventHandler,
  type Dispatch,
  type FormEventHandler,
  type KeyboardEventHandler,
  type ReactElement,
  type SetStateAction,
} from 'react';

import { SearchResult } from './SearchResult.js';
import { useSearch, type SearchLoadingState } from './useSearch.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants.js';
import { SearchIcon } from '../icons.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import {
  type MarkpromptOptions,
  type SearchResultComponentProps,
} from '../types.js';
import { useDefaults } from '../useDefaults.js';
import type { View } from '../useViews.js';

export interface SearchViewProps {
  activeView?: View;
  debug?: boolean;
  onDidSelectResult?: () => void;
  projectKey: string;
  searchOptions?: MarkpromptOptions['search'];
}

interface ActiveSearchResult {
  id: string | undefined;
  trigger?: 'mouse' | 'keyboard';
}

const searchInputName = 'markprompt-search';

export function SearchView(props: SearchViewProps): ReactElement {
  const { activeView, debug, onDidSelectResult, projectKey } = props;

  if (!projectKey) {
    throw new Error(
      `Markprompt: a project key is required. Make sure to pass your Markprompt project key to <SearchView />.`,
    );
  }

  // we are also merging defaults in the Markprompt component, but this makes sure
  // that standalone SearchView components also have defaults as expected.
  const searchOptions = useDefaults(
    { ...props.searchOptions },
    DEFAULT_MARKPROMPT_OPTIONS.search,
  );

  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    abort,
    searchResults,
    searchQuery,
    state,
    setSearchQuery,
    submitSearchQuery,
  } = useSearch({
    debug,
    projectKey,
    searchOptions,
  });

  const [activeSearchResult, setActiveSearchResult] =
    React.useState<ActiveSearchResult>();

  useEffect(() => {
    // if the search query changes, unset the active search result
    setActiveSearchResult(undefined);
  }, [searchQuery]);

  useEffect(() => {
    // if the search results change, set the active search result to the
    // first result
    if (searchResults.length === 0) return;
    setActiveSearchResult({ id: 'markprompt-result-0' });
  }, [searchResults]);

  useEffect(() => {
    // Bring form input in focus when activeView changes.
    inputRef.current?.focus();
  }, [activeView]);

  useEffect(() => {
    // abort search requests when the view changes to something
    // that's not search and on unmounting the component
    if (activeView && activeView !== 'search') abort();
    return () => abort();
  }, [abort, activeView]);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      switch (event.key) {
        case 'ArrowDown': {
          if (!activeSearchResult) return;
          if (activeSearchResult.id?.endsWith(`${searchResults.length - 1}`)) {
            return;
          }
          event.preventDefault();
          const nextActiveSearchResultId = activeSearchResult.id?.replace(
            /\d+$/,
            (match) => String(Number(match) + 1),
          );
          setActiveSearchResult({
            id: nextActiveSearchResultId,
            trigger: 'keyboard',
          });
          const el: HTMLAnchorElement | null = document.querySelector(
            `#${nextActiveSearchResultId} > a`,
          );
          if (!el) return;
          break;
        }
        case 'ArrowUp': {
          if (!activeSearchResult) return;
          if (activeSearchResult.id?.endsWith('-0')) return;
          event.preventDefault();
          const nextActiveSearchResult = activeSearchResult.id?.replace(
            /\d+$/,
            (match) => String(Number(match) - 1),
          );
          setActiveSearchResult({
            id: nextActiveSearchResult,
            trigger: 'keyboard',
          });
          const el: HTMLAnchorElement | null = document.querySelector(
            `#${nextActiveSearchResult} > a`,
          );
          if (!el) return;
          break;
        }
        case 'Enter': {
          if (event.ctrlKey || event.metaKey) return;
          if (!activeSearchResult) return;
          event.preventDefault();
          // assumption here is that the search result will always contain an a element
          const el: HTMLAnchorElement | null = document.querySelector(
            `#${activeSearchResult.id} a`,
          );
          // todo: reset search query and result
          if (!el) return;
          el?.click();
          break;
        }
      }
    },
    [activeSearchResult, searchResults.length],
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setSearchQuery(event.target.value);
      submitSearchQuery(event.target.value);
    },
    [setSearchQuery, submitSearchQuery],
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();
      await submitSearchQuery(searchQuery);
    },
    [searchQuery, submitSearchQuery],
  );

  return (
    <div className="MarkpromptSearchView">
      <BaseMarkprompt.Form className="MarkpromptForm" onSubmit={handleSubmit}>
        <div className="MarkpromptPromptWrapper">
          <BaseMarkprompt.Prompt
            ref={inputRef}
            className="MarkpromptPrompt"
            name={searchInputName}
            placeholder={searchOptions?.placeholder}
            labelClassName="MarkpromptPromptLabel"
            value={searchQuery}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            aria-controls="markprompt-search-results"
            aria-activedescendant={activeSearchResult?.id}
            label={
              <AccessibleIcon.Root label={searchOptions?.label}>
                <SearchIcon className="MarkpromptSearchIcon" />
              </AccessibleIcon.Root>
            }
          />
        </div>
      </BaseMarkprompt.Form>

      <SearchResultsContainer
        activeSearchResult={activeSearchResult}
        onDidSelectResult={onDidSelectResult}
        searchQuery={searchQuery}
        searchResults={searchResults}
        setActiveSearchResult={setActiveSearchResult}
        state={state}
      />
    </div>
  );
}

interface SearchResultsContainerProps {
  searchQuery: string;
  searchResults: SearchResultComponentProps[];
  state: SearchLoadingState;
  activeSearchResult?: ActiveSearchResult;
  setActiveSearchResult: Dispatch<
    SetStateAction<ActiveSearchResult | undefined>
  >;
  onDidSelectResult?: () => void;
}

function SearchResultsContainer(
  props: SearchResultsContainerProps,
): ReactElement {
  const {
    searchQuery,
    searchResults,
    state,
    activeSearchResult,
    setActiveSearchResult,
    onDidSelectResult,
  } = props;
  const onMouseMovedOverSearchResult = useRef<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'ArrowDown') {
        if (searchResults.length > 0 && activeSearchResult === undefined) {
          setActiveSearchResult({
            id: 'markprompt-result-0',
            trigger: 'keyboard',
          });
          const el = document.querySelector(`#${searchInputName}`);
          if (el instanceof HTMLInputElement) el.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSearchResult, searchResults, setActiveSearchResult]);

  useEffect(() => {
    // Do not scroll into view unless using keyboard navigation.
    // While using the mouse, we don't want movable hit targets.
    if (!activeSearchResult?.id || activeSearchResult.trigger !== 'keyboard') {
      return;
    }

    const element = document.getElementById(activeSearchResult.id);

    element?.focus();
    element?.scrollIntoView({ block: 'nearest' });
  }, [activeSearchResult, searchResults]);

  return (
    <div className="MarkpromptSearchResultsContainer">
      {state === 'done' &&
        searchResults.length === 0 &&
        searchQuery.trim().length > 0 && (
          <div className="MarkpromptNoSearchResults">
            <p>
              No results for “<span>{searchQuery}</span>”
            </p>
          </div>
        )}

      {searchResults.length > 0 && (
        <BaseMarkprompt.SearchResults
          searchResults={searchResults}
          className="MarkpromptSearchResults"
          SearchResultComponent={({ index, ...rest }) => {
            const id = `markprompt-result-${index}`;
            return (
              <SearchResult
                {...rest}
                id={`markprompt-result-${index}`}
                searchQuery={searchQuery}
                onMouseMove={() => {
                  // We use a mouse move event, instead of mouse over or
                  // mouse enter. Indeed, onMouseOver and onMouseEnter will
                  // trigger at each rerender. This is a problem when scrolling
                  // the list using the keyboard: it will automatically reselect
                  // the result that the mouse is over.
                  if (onMouseMovedOverSearchResult?.current === id) {
                    return;
                  }
                  onMouseMovedOverSearchResult.current = id;
                  setActiveSearchResult({ id, trigger: 'mouse' });
                }}
                onClick={onDidSelectResult}
                aria-selected={id === activeSearchResult?.id}
              />
            );
          }}
        />
      )}
    </div>
  );
}
