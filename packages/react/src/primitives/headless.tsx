import * as Dialog from '@radix-ui/react-dialog';
import debounce from 'p-debounce';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ChangeEventHandler,
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type FormEventHandler,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
} from 'react';
import Markdown from 'react-markdown';
import { mergeRefs } from 'react-merge-refs';
import remarkGfm from 'remark-gfm';

import { Footer } from './footer.js';
import { ConditionalVisuallyHidden } from '../ConditionalWrap.js';
import { MarkpromptContext, useMarkpromptContext } from '../context.js';
import type {
  FlattenedSearchResult,
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
} from '../types.js';
import { useMarkprompt, type UseMarkpromptOptions } from '../useMarkprompt.js';

type RootProps = Dialog.DialogProps & UseMarkpromptOptions;

/**
 * The Markprompt context provider and dialog root.
 */
function Root(props: RootProps): ReactElement {
  const {
    children,
    defaultOpen,
    modal,
    onOpenChange,
    open,
    ...markpromptOptions
  } = props;

  if (!markpromptOptions.projectKey) {
    throw new Error(
      'Markprompt: a project key is required. Make sure to pass the projectKey prop to Markprompt.Root.',
    );
  }

  const contextValue = useMarkprompt(markpromptOptions);

  return (
    <MarkpromptContext.Provider value={contextValue}>
      <DialogRootWithAbort
        defaultOpen={defaultOpen}
        modal={modal}
        onOpenChange={onOpenChange}
        open={open}
      >
        {children}
      </DialogRootWithAbort>
    </MarkpromptContext.Provider>
  );
}

function DialogRootWithAbort(props: Dialog.DialogProps): ReactElement {
  const { onOpenChange, modal = true, ...rest } = props;
  const { abort } = useMarkpromptContext();

  const handleOpenChange: NonNullable<Dialog.DialogProps['onOpenChange']> =
    useCallback(
      (open) => {
        if (!open) abort();
        if (onOpenChange) onOpenChange(open);
      },
      [abort, onOpenChange],
    );

  return (
    <Dialog.Root {...rest} modal={modal} onOpenChange={handleOpenChange}>
      {props.children}
    </Dialog.Root>
  );
}

type DialogTriggerProps = ComponentPropsWithRef<typeof Dialog.Trigger>;
/**
 * A button to open the Markprompt dialog.
 */
const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  (props, ref) => {
    return <Dialog.Trigger ref={ref} {...props} />;
  },
);
DialogTrigger.displayName = 'Markprompt.DialogTrigger';

type PortalProps = ComponentPropsWithoutRef<typeof Dialog.Portal>;
/**
 * The Markprompt dialog portal.
 */
function Portal(props: PortalProps): ReactElement {
  return <Dialog.Portal {...props} />;
}
Portal.displayName = 'Markprompt.Portal';

type OverlayProps = ComponentPropsWithRef<typeof Dialog.Overlay>;
/**
 * The Markprompt dialog overlay.
 */
const Overlay = forwardRef<HTMLDivElement, OverlayProps>((props, ref) => {
  return <Dialog.Overlay ref={ref} {...props} />;
});
Overlay.displayName = 'Markprompt.Overlay';

type ContentProps = ComponentPropsWithRef<typeof Dialog.Content> & {
  /**
   * Show the Markprompt footer.
   */
  showBranding?: boolean;
};

/**
 * The Markprompt dialog content.
 */
const Content = forwardRef<HTMLDivElement, ContentProps>(function Content(
  props,
  ref,
) {
  const { showBranding = true } = props;
  const { state } = useMarkpromptContext();

  return (
    <Dialog.Content {...props} ref={ref} data-loading-state={state}>
      {props.children}
      {showBranding && <Footer />}
    </Dialog.Content>
  );
});
Content.displayName = 'Markprompt.Content';

type CloseProps = ComponentPropsWithRef<typeof Dialog.Close>;
/**
 * A button to close the Markprompt dialog and abort an ongoing request.
 */
const Close = forwardRef<HTMLButtonElement, CloseProps>(function Close(
  props,
  ref,
) {
  const { onClick, ...rest } = props;
  const { abort } = useMarkpromptContext();

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      // abort ongoing fetch requests on close
      abort();
      // call user-provided onClick handler
      if (onClick) onClick(event);
    },
    [abort, onClick],
  );

  return <Dialog.Close {...rest} ref={ref} onClick={handleClick} />;
});
Close.displayName = 'Markprompt.Close';

type TitleProps = ComponentPropsWithRef<typeof Dialog.Title> & {
  hide?: boolean;
};
const Title = forwardRef<HTMLHeadingElement, TitleProps>((props, ref) => {
  const { hide } = props;
  return (
    <ConditionalVisuallyHidden hide={hide}>
      <Dialog.Title {...props} ref={ref} />
    </ConditionalVisuallyHidden>
  );
});
Title.displayName = 'Markprompt.Title';

type DescriptionProps = ComponentPropsWithRef<typeof Dialog.Description> & {
  hide?: boolean;
};
/**
 * A visually hidden aria description.
 */
const Description = forwardRef<HTMLParagraphElement, DescriptionProps>(
  (props, ref) => {
    const { hide } = props;
    return (
      <ConditionalVisuallyHidden hide={hide}>
        <Dialog.Description {...props} ref={ref} />
      </ConditionalVisuallyHidden>
    );
  },
);
Description.displayName = 'Markprompt.Description';

type FormProps = ComponentPropsWithRef<'form'>;
/**
 * A form which, when submitted, submits the current prompt.
 */
const Form = forwardRef<HTMLFormElement, FormProps>(function Form(props, ref) {
  const { onSubmit, ...rest } = props;

  const {
    isSearchEnabled,
    isSearchActive,
    submitPrompt,
    submitSearchQuery,
    prompt,
  } = useMarkpromptContext();

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();

      // call user-provided onSubmit handler
      if (onSubmit) {
        onSubmit(event);
      }

      // submit search query if search is enabled
      if (isSearchEnabled && isSearchActive) {
        await submitSearchQuery(prompt);
      } else {
        // submit prompt if search is disabled
        await submitPrompt();
      }
    },
    [
      isSearchEnabled,
      isSearchActive,
      onSubmit,
      prompt,
      submitPrompt,
      submitSearchQuery,
    ],
  );

  return <form {...rest} ref={ref} onSubmit={handleSubmit} />;
});
Form.displayName = 'Markprompt.Form';

const name = 'markprompt-prompt';
type PromptProps = ComponentPropsWithRef<'input'> & {
  /** The label for the input. */
  label?: ReactNode;
  /** The class name of the label element. */
  labelClassName?: string;
};
/**
 * The Markprompt input prompt. User input will update the prompt in the Markprompt context.
 */
const Prompt = forwardRef<HTMLInputElement, PromptProps>(function Prompt(
  props,
  ref,
) {
  const {
    autoCapitalize = 'none',
    autoComplete = 'off',
    autoCorrect = 'off',
    autoFocus = true,
    label,
    labelClassName,
    onChange,
    placeholder = 'Ask me anything…',
    spellCheck = false,
    type = 'search',
    ...rest
  } = props;

  const {
    activeSearchResult,
    isSearchActive,
    prompt,
    searchResults,
    submitSearchQuery,
    updateActiveSearchResult,
    updatePrompt,
  } = useMarkpromptContext();

  const debouncedSubmitSearchQuery = useMemo(
    () => debounce(submitSearchQuery, 220),
    [submitSearchQuery],
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const value = event.target.value;
      // We use the input value directly instead of using the prompt state
      // to avoid an off-by-one-bug when querying.
      if (isSearchActive) {
        debouncedSubmitSearchQuery(value);
      }

      updatePrompt(value);

      if (onChange) {
        onChange(event);
      }
    },
    [isSearchActive, updatePrompt, onChange, debouncedSubmitSearchQuery],
  );

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (!isSearchActive) return;

      switch (event.key) {
        case 'ArrowDown': {
          if (!activeSearchResult) return;
          if (activeSearchResult.endsWith(`${searchResults.length - 1}`)) {
            return;
          }
          event.preventDefault();
          const nextActiveSearchResult = activeSearchResult.replace(
            /\d+$/,
            (match) => String(Number(match) + 1),
          );
          updateActiveSearchResult(nextActiveSearchResult);
          const el: HTMLAnchorElement | null = document.querySelector(
            `#${nextActiveSearchResult} > a`,
          );
          if (!el) return;
          break;
        }
        case 'ArrowUp': {
          if (!activeSearchResult) return;
          if (activeSearchResult.endsWith('0')) return;
          event.preventDefault();
          const nextActiveSearchResult = activeSearchResult.replace(
            /\d+$/,
            (match) => String(Number(match) - 1),
          );
          updateActiveSearchResult(nextActiveSearchResult);
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
            `#${activeSearchResult} a`,
          );
          // todo: reset search query and result
          if (!el) return;
          el?.click();
          break;
        }
      }
    },
    [
      activeSearchResult,
      isSearchActive,
      searchResults.length,
      updateActiveSearchResult,
    ],
  );

  return (
    <>
      <label htmlFor={name} className={labelClassName}>
        {label}
      </label>
      <input
        {...rest}
        id={name}
        name={name}
        placeholder={placeholder}
        ref={ref}
        type={type}
        value={prompt}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        autoFocus={autoFocus}
        spellCheck={spellCheck}
        aria-controls={isSearchActive ? 'markprompt-search-results' : undefined}
        aria-activedescendant={isSearchActive ? activeSearchResult : undefined}
      />
    </>
  );
});
Prompt.displayName = 'Markprompt.Prompt';

type AnswerProps = Omit<ComponentPropsWithoutRef<typeof Markdown>, 'children'>;
/**
 * Render the markdown answer from the Markprompt API.
 */
function Answer(props: AnswerProps): ReactElement {
  const { remarkPlugins = [remarkGfm], ...rest } = props;
  const { answer } = useMarkpromptContext();
  return (
    <Markdown {...rest} remarkPlugins={remarkPlugins}>
      {answer ?? ''}
    </Markdown>
  );
}
Answer.displayName = 'Markprompt.Answer';

type AutoScrollerProps = ComponentPropsWithRef<'div'> & {
  /**
   * Whether or not to enable automatic scrolling.
   *
   * @default true
   */
  autoScroll?: boolean;

  /**
   * The behaviour to use for scrolling.
   *
   * @default 'smooth'
   */
  scrollBehavior?: ScrollBehavior;
};
/**
 * A component automatically that scrolls to the bottom.
 */
const AutoScroller = forwardRef<HTMLDivElement, AutoScrollerProps>(
  (props, ref) => {
    const { autoScroll = true, scrollBehavior = 'smooth' } = props;
    const localRef = useRef<HTMLDivElement>(null);
    const { answer } = useMarkpromptContext();

    useEffect(() => {
      if (!localRef.current) return;
      if (!autoScroll) return;
      localRef.current.scrollTo({
        top: localRef.current.scrollHeight,
        behavior: scrollBehavior,
      });
    }, [answer, autoScroll, scrollBehavior]);

    return <div ref={mergeRefs([ref, localRef])} {...props} />;
  },
);
AutoScroller.displayName = 'Markprompt.AutoScroller';

type ReferencesProps<
  TRoot extends ElementType,
  TReference extends ElementType<{
    referenceId: string;
    index: number;
  }>,
> = {
  /**
   * The wrapper component to render.
   * @default 'ul'
   */
  RootComponent?: TRoot;

  /**
   * The component to render for each reference.
   * @default 'li'
   */
  ReferenceComponent?: TReference;
};

/**
 * Render the references that Markprompt returns.
 */
const References = function References<
  TRoot extends ElementType,
  TReference extends ElementType<{
    referenceId: string;
    index: number;
  }>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  P extends ReferencesProps<TRoot, TReference> = {},
>(props: P, ref: PolymorphicRef<TRoot>): ReactElement {
  const { RootComponent = 'ul', ReferenceComponent = 'li' } = props;
  const { references } = useMarkpromptContext();
  return (
    <RootComponent ref={ref}>
      {references.map((reference, index) => {
        return (
          <ReferenceComponent
            key={reference}
            referenceId={reference}
            index={index}
          />
        );
      })}
    </RootComponent>
  );
};
/**
 * Render the references that Markprompr returned.
 */
const ForwardedReferences = forwardRef(References);
ForwardedReferences.displayName = 'Markprompt.References';

type SearchResultsProps = PolymorphicComponentPropWithRef<
  'ul',
  {
    label?: string;
    SearchResultComponent?: ElementType<FlattenedSearchResult>;
  }
>;

const SearchResults = forwardRef<HTMLUListElement, SearchResultsProps>(
  (props, ref) => {
    const {
      as: Component = 'ul',
      label = 'Search results',
      SearchResultComponent = SearchResult,
      ...rest
    } = props;

    const { activeSearchResult, searchResults, updateActiveSearchResult } =
      useMarkpromptContext();

    useEffect(() => {
      if (!activeSearchResult) {
        return;
      }

      const element = document.getElementById(activeSearchResult);
      if (!element) {
        return;
      }

      element.focus();
      element.scrollIntoView({
        block: 'nearest',
      });
    }, [activeSearchResult, searchResults]);

    return (
      <>
        <Component
          {...rest}
          ref={ref}
          role="listbox"
          id="markprompt-search-results"
          tabIndex={0}
          aria-label={label}
        >
          {searchResults.map((result, index) => {
            const id = `markprompt-result-${index}`;
            return (
              <SearchResultComponent
                role="option"
                id={id}
                onMouseOver={() => updateActiveSearchResult(id)}
                aria-selected={id === activeSearchResult}
                key={`${result.path}:${result.title}`}
                {...result}
              />
            );
          })}
        </Component>
      </>
    );
  },
);
SearchResults.displayName = 'Markprompt.SearchResults';

type SearchResultProps = PolymorphicComponentPropWithRef<
  'li',
  FlattenedSearchResult & {
    getHref?: (result: FlattenedSearchResult) => string;
  }
>;
const SearchResult = forwardRef<HTMLLIElement, SearchResultProps>(
  (props, ref) => {
    const {
      title,
      isParent,
      hasParent,
      path,
      score,
      tag,
      getHref = (result) => result.path,
      ...rest
    } = props;
    return (
      <li ref={ref} {...rest}>
        <a href={getHref(props)} data-markprompt-score={score}>
          {title}
        </a>
      </li>
    );
  },
);
SearchResult.displayName = 'Markprompt.SearchResult';

export {
  Answer,
  AutoScroller,
  Close,
  Content,
  Description,
  DialogTrigger,
  Form,
  Overlay,
  Portal,
  Prompt,
  ForwardedReferences as References,
  Root,
  SearchResult,
  SearchResults,
  Title,
  type AnswerProps,
  type AutoScrollerProps,
  type CloseProps,
  type ContentProps,
  type DescriptionProps,
  type DialogTriggerProps,
  type FormProps,
  type OverlayProps,
  type PortalProps,
  type PromptProps,
  type ReferencesProps,
  type RootProps,
  type SearchResultProps,
  type SearchResultsProps,
  type TitleProps,
};