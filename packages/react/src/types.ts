/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type AlgoliaDocSearchHit,
  type FileSectionReference,
  type MessageFeedback,
  type SearchResult,
  type SubmitFeedbackOptions,
  type SubmitSearchQueryOptions,
} from '@markprompt/core';
import type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ComponentType,
  ElementType,
  PropsWithChildren,
  ReactNode,
} from 'react';

import type { UserConfigurableOptions } from './chat/store.js';
import type { ChatViewMessage } from './index.js';

export type View = 'chat' | 'search' | 'create-ticket';

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
  message?: string | ComponentType;
  promptsHeading?: string;
  prompts?: string[];
}

export interface DefaultSearchViewProps {
  searchesHeading?: string;
  searches?: SearchResultComponentProps[];
}

export interface CloseOptions {
  /**
   * `aria-label` for the close modal button.
   * @default "Close Markprompt"
   **/
  label?: string;
  /**
   * Show the close button
   * @default true
   **/
  visible?: boolean;
  /**
   * Show an × icon in the close button instead of the keyboard shortcut ('Esc')
   */
  hasIcon?: boolean;
}

export interface DescriptionOptions {
  /**
   * Visually hide the description
   * @default true
   **/
  hide?: boolean;
  /**
   * Description text
   **/
  text?: string;
}

export interface FeedbackOptions {
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
    feedback: MessageFeedback,
    messages: ChatViewMessage[],
    promptId?: string,
  ) => void;
}

export interface AvatarsOptions {
  /**
   * If true, show avatars.
   * @default true
   */
  visible?: boolean;
  /**
   * The user avatar. Can be a string (to use as source for
   * the image) or a component.
   */
  user?: string | ComponentType<{ className: string }>;
  /**
   * The assistant avatar. Can be a string (to use as source for
   * the image) or a component.
   */
  assistant?: string | ComponentType<{ className: string }>;
}

export interface ChatOptions {
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
   * Label for the submit button
   * @default "Send"
   **/
  buttonLabel?: string;
  /**
   * Component to render when an error occurs in prompt view
   */
  errorText?: ComponentType<{ error: Error }>;
  /**
   * Show copy response button
   * @default true
   **/
  showCopy?: boolean;
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
  /**
   * Avatars to use for chat messages.
   */
  avatars?: AvatarsOptions;
}

export interface ReferencesOptions {
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
   * @default "Sources"
   **/
  heading?: string;
  /** Loading text, default: `Fetching context…` */
  loadingText?: string;
  /**
   * Callback to transform a reference id into an href and text
   * @deprecated Use `getHref` and `getLabel` instead
   **/
  transformReferenceId?: (referenceId: string) => {
    href: string;
    text: string;
  };
}

export interface SearchOptions {
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
   * @default "Search documentation"
   **/
  label?: string;
  /**
   * Label for the "Ask AI" link when using "input" layout
   * @default "Ask AI"
   **/
  askLabel?: string;
  /**
   * Default (empty) view
   */
  defaultView?: DefaultSearchViewProps;
  /**
   * Label for the tab bar
   * @default "Search"
   **/
  tabLabel?: string;
  /**
   * Placeholder for the search input
   * @default "Search documentation"
   */
  placeholder?: string;
}

export interface TriggerOptions {
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
  customElement?: boolean | ReactNode;
  /**
   * Custom image icon source for the open button
   **/
  iconSrc?: string;
}

export interface TitleOptions {
  /**
   * Visually hide the title.
   * @default true
   **/
  hide?: boolean;
  /**
   * Text for the title.
   * @default "Ask AI"
   **/
  text?: string;
}

export interface BrandingOptions {
  /**
   * Show branding.
   * @default true
   **/
  show?: boolean;
  /**
   * Branding display type.
   * @default true
   **/
  type?: 'plain' | 'text';
}

export interface CreateTicketIntegrationMessageButtonOptions {
  /**
   * Button text shown at the end of a message
   * @default "Create a support case"
   */
  text?: string;
  /**
   * Show icon?
   * @default true
   */
  hasIcon?: boolean;
  /**
   * Show text?
   * @default true
   */
  hasText?: boolean;
}

export interface CreateTicketIntegrationViewOptions {
  /**
   * Title for the create ticket view
   * @default "Create a case"
   */
  title: string;
  /**
   * Label for the name input
   * @default "Your Name"
   */
  nameLabel: string;
  /**
   * Placeholder for the name input
   * @default "Markprompt AI"
   */
  namePlaceholder: string;
  /**
   * Label for the email input
   * @default "Email"
   */
  emailLabel: string;
  /**
   * Placeholder for the email input
   * @default "bot@markprompt.com"
   * */
  emailPlaceholder: string;
  /**
   * Label for the summary input
   * @default "How can we help?"
   */
  summaryLabel: string;
  /**
   * Placeholder for the summary input
   * @default "Please describe your issue"
   */
  summaryPlaceholder: string;
  /**
   * Loading text for the summary input
   * @default "Generating summary…"
   */
  summaryLoading: string;
  /**
   * Label for the submit button
   * @default "Submit case"
   */
  submitLabel: string;
  /**
   * Text shown when the ticket was created ok
   * @default "Ticket created successfully!"
   */
  ticketCreatedOk: string;
  /**
   * Text shown when the ticket creation failed
   * @default "An error occurred while creating the case"
   */
  ticketCreatedError: string;
}

export interface CreateTicketIntegrationOptions {
  /**
   * Enable the create ticket feature
   * @default false
   **/
  enabled: boolean;
  /**
   * The provider to use for creating tickets
   **/
  provider: 'zendesk';
  /**
   * The API URL to use for creating tickets
   * @default "https://api.markprompt.com/create-ticket"
   **/
  apiUrl?: string;
  /**
   * The prompt to use to create a summary of the conversation between user and bot for the support agent
   * @default "I want to create a support case. Please summarize the conversation so far for sending it to a support agent. Return only the summary itself without assistant commentary. Use short paragraphs. Include relevant code snippets."
   **/
  prompt?: string;
  /**
   * Default text shown at the end of a chat message.
   * @default "Bot not being helpful?"
   */
  messageText?: string;
  /**
   * Options for the button shown at the end of a chat message.
   */
  messageButton?: CreateTicketIntegrationMessageButtonOptions;
  /**
   * Options for the create ticket view.
   */
  view?: CreateTicketIntegrationViewOptions;
}

export interface IntegrationsOptions {
  /**
   * Allow users to create tickets in a support system from the chat.
   * @default undefined
   */
  createTicket?: CreateTicketIntegrationOptions;
}

export interface MarkpromptOptions {
  /**
   * Trigger component, such as a search button or a floating chat bubble.
   * @default undefined
   **/
  children?: React.ReactNode;
  /**
   * The way to display the content, either as a plain view or as a dialog.
   * @default "dialog"
   **/
  display?: 'plain' | 'dialog';
  /**
   * Enable user interactions outside of the dialog while keeping it open.
   * @default false
   **/
  sticky?: boolean;
  /**
   * The default view to show when both chat and search are enabled.
   * @default "search"
   * */
  defaultView?: View;
  /**
   * Multi-pane layout when both search and chat are enabled.
   * @default "panels"
   **/
  layout?: 'panels' | 'tabs';
  /**
   * Options for the chat component.
   */
  chat?: UserConfigurableOptions & ChatOptions;
  /**
   * Options for the search component.
   */
  search?: SubmitSearchQueryOptions & SearchOptions;
  /**
   * Options for the feedback component.
   **/
  feedback?: SubmitFeedbackOptions & FeedbackOptions;
  /**
   * Options for the references component.
   */
  references?: ReferencesOptions;
  /**
   * Options for integrations.
   */
  integrations?: IntegrationsOptions;
  /**
   * Options for the trigger component.
   */
  trigger?: TriggerOptions;
  /**
   * Options for the close button.
   **/
  close?: CloseOptions;
  /**
   * Options for the description.
   **/
  description?: DescriptionOptions;
  /**
   * Options for the title component.
   */
  title?: TitleOptions;
  /**
   * Component to use in place of <a>.
   * @default "a"
   */
  linkAs?: string | ComponentType<any>;
  /**
   * Options for the title component.
   * @default true
   * @deprecated Use `branding` instead
   **/
  showBranding?: boolean;
  /**
   * Options for the title component.
   **/
  branding?: BrandingOptions;
  /**
   * Display debug info.
   * @default false
   **/
  debug?: boolean;
}
