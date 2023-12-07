import {
  type AlgoliaDocSearchHit,
  type FileSectionReference,
  type PromptFeedback,
  type SearchResult,
  type SubmitChatOptions,
  type SubmitFeedbackOptions,
  type SubmitSearchQueryOptions,
} from '@markprompt/core';
import type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ElementType,
  JSXElementConstructor,
  PropsWithChildren,
} from 'react';

import type { ChatViewMessage } from './index.js';

interface AsProp<C extends ElementType> {
  as?: C;
}

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

// This is the first reusable type utility we built
export type PolymorphicComponentProp<
  C extends ElementType,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Props = {},
> = PropsWithChildren<Props & AsProp<C>> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

// This is a new type utility with ref!
export type PolymorphicComponentPropWithRef<
  C extends ElementType,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Props = {},
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };

// This is the type for the "ref" only
export type PolymorphicRef<C extends ElementType> =
  ComponentPropsWithRef<C>['ref'];

export interface SectionHeading {
  value?: string | undefined;
  id?: string | undefined;
  slug?: string | undefined;
}

export interface SearchResultComponentProps {
  href?: string;
  heading?: string;
  title?: string;
  subtitle?: string;
}

export interface DefaultViewProps {
  message?: string | JSXElementConstructor<unknown>;
  promptsHeading?: string;
  prompts?: string[];
}

export interface MarkpromptOptions {
  /**
   * Display format.
   * @default "dialog"
   **/
  display?: 'plain' | 'dialog';
  /**
   * Enable and configure search functionality.
   * @default "search"
   * */
  defaultView?: 'search' | 'chat' | 'prompt';
  close?: {
    /**
     * `aria-label` for the close modal button
     * @default "Close Markprompt"
     **/
    label?: string;
    /**
     * Show the close button
     * @default true
     **/
    visible?: boolean;
  };
  description?: {
    /**
     * Visually hide the description
     * @default true
     **/
    hide?: boolean;
    /**
     * Description text
     **/
    text?: string;
  };
  feedback?: SubmitFeedbackOptions & {
    /**
     * Enable feedback functionality, shows a thumbs up/down button after a
     * prompt was submitted.
     * @default false
     * */
    enabled?: boolean;
    /**
     * Heading above the form
     * @default "Was this response helpful?"
     **/
    heading?: string;
    /**
     * Called when feedback is submitted
     * @default undefined
     */
    onFeedbackSubmit?: (
      feedback: PromptFeedback,
      messages: ChatViewMessage[],
      promptId?: string,
    ) => void;
  };
  /**
   * Enable and configure chat functionality. Allows users to have a conversation with an assistant.
   * Enabling chat functionality will disable prompt functionality.
   */
  chat?: SubmitChatOptions & {
    /**
     * Show a chat-like prompt input allowing for conversation-style interaction
     * rather than single question prompts.
     * @default false
     **/
    enabled?: boolean;
    /**
     * Label for the chat input
     * @default "Ask AI"
     **/
    label?: string;
    /**
     * Label for the tab bar
     * @default "Ask AI"
     **/
    tabLabel?: string;
    /**
     * Placeholder for the chat input
     * @default "Ask AI…"
     **/
    placeholder?: string;
    /**
     * Default error text
     * @default "Sorry, it looks like the bot is having a hard time! Please try again in a few minutes."
     */
    errorText?: string;
    /**
     * Show sender info, like avatar
     * @default true
     **/
    showSender?: boolean;
    /**
     * Enable chat history features
     * - enable saving chat history to local storage
     * - show chat history UI
     * - resume chat conversations
     * @default true
     */
    history?: boolean;
    /**
     * Default (empty) view
     */
    defaultView?: DefaultViewProps;
  };
  /**
   * Enable and configure prompt functionality. Allows users to ask a single question to an assistant
   */
  prompt?: SubmitChatOptions & {
    /**
     * Label for the prompt input
     * @default "Ask AI"
     **/
    label?: string;
    /**
     * Label for the tab bar
     * @default "Ask AI"
     **/
    tabLabel?: string;
    /**
     * Placeholder for the prompt input
     * @default "Ask AI…"
     **/
    placeholder?: string;
    /**
     * Default (empty) view
     */
    defaultView?: DefaultViewProps;
    /**
     * Default error text
     * @default "Sorry, it looks like the bot is having a hard time! Please try again in a few minutes."
     */
    errorText?: string;
  };
  references?: {
    /**
     * Display mode for the references. References can either be
     * displayed after the response or not displayed at all.
     * @default 'end'
     * */
    display?: 'none' | 'end';
    /** Callback to transform a reference into an href */
    getHref?: (reference: FileSectionReference) => string | undefined;
    /** Callback to transform a reference into a label */
    getLabel?: (reference: FileSectionReference) => string | undefined;
    /**
     * Heading above the references
     * @default "Answer generated from the following sources:"
     **/
    heading?: string;
    /** Loading text, default: `Fetching relevant pages…` */
    loadingText?: string;
    /**
     * Callback to transform a reference id into an href and text
     * @deprecated Use `getHref` and `getLabel` instead
     **/
    transformReferenceId?: (referenceId: string) => {
      href: string;
      text: string;
    };
  };
  /**
   * Enable and configure search functionality
   */
  search?: SubmitSearchQueryOptions & {
    /**
     * Enable search
     * @default false
     **/
    enabled?: boolean;
    /** Callback to transform a search result into an href */
    getHref?: (
      reference: SearchResult | AlgoliaDocSearchHit,
    ) => string | undefined;
    /** Callback to transform a search result into a heading */
    getHeading?: (
      reference: SearchResult | AlgoliaDocSearchHit,
      query: string,
    ) => string | undefined;
    /** Callback to transform a search result into a title */
    getTitle?: (
      reference: SearchResult | AlgoliaDocSearchHit,
      query: string,
    ) => string | undefined;
    /** Callback to transform a search result into a subtitle */
    getSubtitle?: (
      reference: SearchResult | AlgoliaDocSearchHit,
      query: string,
    ) => string | undefined;
    /**
     * Label for the search input, not shown but used for `aria-label`
     * @default "Search docs…"
     **/
    label?: string;
    /**
     * Label for the tab bar
     * @default "Search"
     **/
    tabLabel?: string;
    /**
     * Placeholder for the search input
     * @default "Search docs…"
     */
    placeholder?: string;
  };
  trigger?: {
    /**
     * `aria-label` for the open button
     * @default "Ask AI"
     **/
    label?: string;
    /**
     * Label for the open button
     **/
    buttonLabel?: string;
    /**
     * Placeholder text for non-floating element.
     * @default "Ask AI"
     **/
    placeholder?: string;
    /**
     * Should the trigger button be displayed as a floating button at the bottom right of the page?
     * Setting this to false will display a trigger button in the element passed
     * to the `markprompt` function.
     */
    floating?: boolean;
    /** Do you use a custom element as the dialog trigger? */
    customElement?: boolean;
    /**
     * Custom image icon source for the open button
     **/
    iconSrc?: string;
  };
  title?: {
    /**
     * Visually hide the title
     * @default true
     **/
    hide?: boolean;
    /**
     * Text for the title
     * @default "Ask AI"
     **/
    text?: string;
  };
  /**
   * Show Markprompt branding
   * @default true
   * @deprecated Use `branding` instead
   **/
  showBranding?: boolean;
  /**
   * Show Markprompt branding
   * @default true
   **/
  branding?: {
    show?: boolean;
    type?: 'plain' | 'text';
  };
  /**
   * Display debug info
   * @default false
   **/
  debug?: boolean;
}
