import {
  type FileSectionReference,
  type SubmitPromptOptions,
  type SubmitSearchQueryOptions,
} from '@markprompt/core';
import type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
} from 'react';

type AsProp<C extends ElementType> = {
  as?: C;
};

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

export type SectionHeading = {
  value?: string | undefined;
  id?: string | undefined;
  slug?: string | undefined;
};

export type SearchResultComponentProps = {
  isSection?: boolean;
  path: string;
  reference: FileSectionReference;
  tag?: string;
  title: string;
};

type MarkpromptOptions = {
  /**
   * Display format.
   * @default "dialog"
   **/
  display?: 'plain' | 'dialog';
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
  feedback?: {
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
     * Confirmation message
     * @default "Thank you!"
     **/
    confirmationMessage?: string;
  };
  prompt?: SubmitPromptOptions & {
    /**
     * Label for the prompt input
     * @default "Ask me anything…"
     **/
    label?: string;
    /**
     * Placeholder for the prompt input
     * @default "Ask me anything…"
     **/
    placeholder?: string;
    /**
     * When search is enabled, this label is used for the call-to-action button
     * that switches to the prompt view that is shown in the search view.
     * @default "Ask Docs AI…"
     **/
    cta?: string;
  };
  references?: {
    /** Loading text, default: `Fetching relevant pages…` */
    loadingText?: string;
    /**
     * Heading above the references
     * @default "Answer generated from the following sources:"
     **/
    heading?: string;
    /** Callback to transform a reference into an href */
    getHref?: (reference: FileSectionReference) => string;
    /** Callback to transform a reference into a label */
    getLabel?: (reference: FileSectionReference) => string;
    /**
     * [DEPRECATED] References title
     * @default "Answer generated from the following sources:"
     **/
    referencesText?: string;
    /**
     * [DEPRECATED] Callback to transform a reference id into an href and text
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
    getHref?: (reference: FileSectionReference) => string;
    /**
     * When search is enabled, this label is used for the call-to-action button
     * that switches to the search view that is shown in the prompt view.
     */
    cta?: string;
    /**
     * Label for the search input, not shown but used for `aria-label`
     * @default "Search docs…"
     **/
    label?: string;
    /**
     * Placeholder for the search input
     * @default "Search docs…"
     */
    placeholder?: string;
  };
  trigger?: {
    /**
     * `aria-label` for the open button
     * @default "Open Markprompt"
     **/
    label?: string;
    /**
     * Placeholder text for non-floating element.
     * @default "Ask docs"
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
  };
  title?: {
    /**
     * Visually hide the title
     * @default true
     **/
    hide?: boolean;
    /**
     * Text for the title
     * @default "Ask me anything"
     **/
    text?: string;
  };
  /**
   * Show Markprompt branding
   * @default true
   **/
  showBranding?: boolean;
  /**
   * Display debug info
   * @default false
   **/
  debug?: boolean;
};

export type { MarkpromptOptions };
