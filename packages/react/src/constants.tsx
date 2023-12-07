import {
  type AlgoliaDocSearchHit,
  type FileSectionReference,
  type SearchResult,
} from '@markprompt/core';

import type { MarkpromptOptions } from './types.js';

const removeFileExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');

  if (lastDotIndex === -1) {
    return fileName;
  }

  return fileName.substring(0, lastDotIndex);
};

const pathToHref = (path: string): string => {
  const lastDotIndex = path.lastIndexOf('.');
  let cleanPath = path;
  if (lastDotIndex >= 0) {
    cleanPath = path.substring(0, lastDotIndex);
  }
  if (cleanPath.endsWith('/index')) {
    cleanPath = cleanPath.replace(/\/index/gi, '');
  }
  return cleanPath;
};

function trimContent(text: string): string {
  // we don't use String.prototype.trim() because we
  // don't want to remove line terminators from Markdown
  return text.trimStart().trimEnd();
}

function removeLeadHeading(text: string, heading?: string): string {
  // This needs to be revised. When returning the search result, the endpoint
  // provides a snippet of the content around the search term (to avoid sending
  // entire sections). This snippet may contain the start of the section
  // content, and this content may start with a heading (the leadHeading).
  // We don't want this leadHeading to be part of the content snippet.
  // Since it's a snippet, we can't assume that the leadHeading will always be
  // the first line. Instead, we have to check it in the string itself.
  const trimmedContent = trimContent(text);
  if (!heading) {
    return trimmedContent;
  }
  const pattern = new RegExp(`^#{1,}\\s${heading}\\s?`);
  return trimContent(trimmedContent.replace(pattern, ''));
}

function createKWICSnippet(
  content: string,
  normalizedSearchQuery: string,
): string {
  const trimmedContent = content.trim().replace(/\n/g, ' ');
  const index = trimmedContent
    .toLocaleLowerCase()
    .indexOf(normalizedSearchQuery);

  if (index === -1) {
    return trimmedContent.slice(0, 200);
  }

  const rawSnippet = trimmedContent.slice(Math.max(0, index - 50), index + 150);

  const words = rawSnippet.split(/\s+/);
  if (words.length > 3) {
    return words.slice(1, words.length - 1).join(' ');
  }
  return words.join(' ');
}

const defaultPromptGetLabel = (reference: FileSectionReference): string => {
  if (reference.meta?.leadHeading?.value) {
    return reference.meta.leadHeading.value;
  }

  if (reference.file?.title) {
    return reference.file.title;
  }

  const fileName = reference.file.path.split('/').pop();
  if (fileName) return removeFileExtension(fileName);

  return reference.file?.path;
};

const isAlgoliaSearchResult = (
  result: FileSectionReference | SearchResult | AlgoliaDocSearchHit,
): result is AlgoliaDocSearchHit => {
  return '_highlightResult' in result;
};

const defaultGetHref = (
  result: FileSectionReference | SearchResult | AlgoliaDocSearchHit,
): string | undefined => {
  if (isAlgoliaSearchResult(result)) {
    return result.url;
  }

  const path = pathToHref(result.file.path);

  if (result.meta?.leadHeading?.id) {
    return `${path}#${result.meta.leadHeading.id}`;
  }

  if (result.meta?.leadHeading?.value) {
    return `${path}#${result.meta.leadHeading.slug}`;
  }

  return path;
};

const defaultGetSearchResultHeading = (
  result: SearchResult | AlgoliaDocSearchHit,
): string | undefined => {
  if (isAlgoliaSearchResult(result)) {
    return result.hierarchy?.lvl0 || undefined;
  }

  if (result.matchType === 'title') {
    return undefined;
  } else {
    const leadHeading = result.meta?.leadHeading;
    if (result.matchType === 'leadHeading' && leadHeading?.value) {
      return result.file.title;
    } else {
      return leadHeading?.value || result.file.title;
    }
  }
};

const defaultGetSearchResultTitle = (
  result: SearchResult | AlgoliaDocSearchHit,
  query: string,
): string | undefined => {
  if (isAlgoliaSearchResult(result)) {
    return result.hierarchy?.lvl1 || undefined;
  }

  if (result.matchType === 'title') {
    return result.file.title;
  }

  const leadHeading = result.meta?.leadHeading;
  if (result.matchType === 'leadHeading' && leadHeading?.value) {
    return leadHeading.value;
  }

  const normalizedSearchQuery = query.toLowerCase();
  // Fast and hacky way to remove the lead heading from
  // the content, which we don't want to be part of the snippet.
  const trimmedContent = removeLeadHeading(
    result.snippet || '',
    result.meta?.leadHeading?.value,
  );

  return createKWICSnippet(trimmedContent, normalizedSearchQuery);
};

const defaultGetSearchResultSubtitle = (
  result: SearchResult | AlgoliaDocSearchHit,
): string | undefined => {
  if (isAlgoliaSearchResult(result)) {
    return result.hierarchy?.lvl2 || undefined;
  }

  return undefined;
};

export const DEFAULT_MARKPROMPT_OPTIONS = {
  display: 'dialog',
  branding: {
    show: true,
    type: 'plain',
  },
  close: {
    label: 'Close Markprompt',
    visible: true,
  },
  description: {
    hide: true,
    text: 'Markprompt',
  },
  feedback: {
    enabled: false,
    heading: 'Was this response helpful?',
  },
  chat: {
    enabled: false,
    label: 'Ask AI',
    tabLabel: 'Ask AI',
    placeholder: 'Ask AI…',
    history: true,
    errorText:
      'Sorry, it looks like the bot is having a hard time! Please try again in a few minutes.',
  },
  prompt: {
    label: 'Ask AI',
    tabLabel: 'Ask AI',
    placeholder: 'Ask AI…',
    errorText:
      'Sorry, it looks like the bot is having a hard time! Please try again in a few minutes.',
  },
  references: {
    loadingText: 'Fetching relevant pages…',
    heading: 'Answer generated from the following sources:',
    getHref: defaultGetHref,
    getLabel: defaultPromptGetLabel,
  },
  search: {
    enabled: false,
    getHref: defaultGetHref,
    getHeading: defaultGetSearchResultHeading,
    getTitle: defaultGetSearchResultTitle,
    getSubtitle: defaultGetSearchResultSubtitle,
    label: 'Search docs…',
    tabLabel: 'Search',
    placeholder: 'Search docs…',
  },
  trigger: {
    label: 'Ask AI',
    placeholder: 'Ask AI',
    floating: true,
    customElement: false,
  },
  title: {
    hide: true,
    text: 'Ask AI',
  },
} satisfies MarkpromptOptions;
