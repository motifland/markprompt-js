import type { FileSectionReference } from '@markprompt/core';
import * as Dialog from '@radix-ui/react-dialog';
import React, {
  forwardRef,
  useEffect,
  useRef,
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactElement,
  type ReactNode,
  memo,
} from 'react';
import Markdown from 'react-markdown';
import { mergeRefs } from 'react-merge-refs';
import remarkGfm from 'remark-gfm';

import { ConditionalVisuallyHidden } from './ConditionalWrap.js';
import { Footer } from './footer.js';
import type {
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
  SearchResultComponentProps,
} from '../types.js';

type RootProps = Dialog.DialogProps & { display?: 'plain' | 'dialog' };

/**
 * The Markprompt context provider and dialog root.
 */
function Root(props: RootProps): ReactElement {
  const {
    children,
    display = 'dialog',
    defaultOpen,
    modal,
    onOpenChange,
    open,
  } = props;

  if (display === 'plain') {
    return <>{children}</>;
  }

  return (
    <DialogRootWithAbort
      defaultOpen={defaultOpen}
      modal={modal}
      onOpenChange={onOpenChange}
      open={open}
    >
      {children}
    </DialogRootWithAbort>
  );
}

function DialogRootWithAbort(props: Dialog.DialogProps): ReactElement {
  const { modal = true, ...rest } = props;
  return (
    <Dialog.Root {...rest} modal={modal}>
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
  /**
   * Show Algolia attribution in the footer.
   **/
  showAlgolia?: boolean;
};

/**
 * The Markprompt dialog content.
 */
const Content = forwardRef<HTMLDivElement, ContentProps>(
  function Content(props, ref) {
    const { showBranding = true, showAlgolia, ...rest } = props;

    return (
      <Dialog.Content {...rest} ref={ref}>
        {props.children}
        {showBranding && <Footer showAlgolia={showAlgolia} />}
      </Dialog.Content>
    );
  },
);
Content.displayName = 'Markprompt.Content';

type PlainContentProps = ComponentPropsWithRef<'div'> & {
  /**
   * Show the Markprompt footer.
   */
  showBranding?: boolean;
  /**
   * Show Algolia attribution in the footer.
   **/
  showAlgolia?: boolean;
};

/**
 * The Markprompt plain content.
 */
const PlainContent = forwardRef<HTMLDivElement, PlainContentProps>(
  function PlainContent(props, ref) {
    const { showBranding = true, showAlgolia, ...rest } = props;

    return (
      <div {...rest} ref={ref}>
        {props.children}
        {showBranding && <Footer showAlgolia={showAlgolia} />}
      </div>
    );
  },
);
PlainContent.displayName = 'Markprompt.PlainContent';

type CloseProps = ComponentPropsWithRef<typeof Dialog.Close>;
/**
 * A button to close the Markprompt dialog and abort an ongoing request.
 */
const Close = forwardRef<HTMLButtonElement, CloseProps>(
  function Close(props, ref) {
    return <Dialog.Close {...props} ref={ref} />;
  },
);
Close.displayName = 'Markprompt.Close';

type TitleProps = ComponentPropsWithRef<typeof Dialog.Title> & {
  hide?: boolean;
};
const Title = forwardRef<HTMLHeadingElement, TitleProps>((props, ref) => {
  const { hide, ...rest } = props;
  return (
    <ConditionalVisuallyHidden hide={hide} asChild>
      <Dialog.Title {...rest} ref={ref} />
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
    const { hide, ...rest } = props;
    return (
      <ConditionalVisuallyHidden hide={hide} asChild>
        <Dialog.Description {...rest} ref={ref} />
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
  return <form {...props} ref={ref} />;
});

type PromptProps = ComponentPropsWithRef<'input'> & {
  /** The label for the input. */
  label?: ReactNode;
  /** The class name of the label element. */
  labelClassName?: string;
};
/**
 * The Markprompt input prompt. User input will update the prompt in the Markprompt context.
 */
const Prompt = forwardRef<HTMLInputElement, PromptProps>(
  function Prompt(props, ref) {
    const {
      autoCapitalize = 'none',
      autoComplete = 'off',
      autoCorrect = 'off',
      autoFocus = true,
      label,
      labelClassName,
      placeholder,
      spellCheck = false,
      type = 'search',
      name,
      ...rest
    } = props;

    return (
      <>
        <label htmlFor={name} className={labelClassName}>
          {label}
        </label>
        <input
          {...rest}
          id={name}
          type={type}
          name={name}
          placeholder={placeholder}
          ref={ref}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={autoCorrect}
          autoFocus={autoFocus}
          spellCheck={spellCheck}
        />
      </>
    );
  },
);
Prompt.displayName = 'Markprompt.Prompt';

type AnswerProps = Omit<
  ComponentPropsWithoutRef<typeof Markdown>,
  'children'
> & {
  answer?: string;
};
/**
 * Render the markdown answer from the Markprompt API.
 */
function Answer(props: AnswerProps): ReactElement {
  const { answer = '', remarkPlugins = [remarkGfm], ...rest } = props;
  return (
    <Markdown {...rest} remarkPlugins={remarkPlugins}>
      {answer}
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

  /**
   * The element scrolls when this prop changes
   * @default undefined
   * */
  scrollTrigger?: unknown;
};
/**
 * A component automatically that scrolls to the bottom.
 */
const AutoScroller = memo<AutoScrollerProps>(
  forwardRef<HTMLDivElement, AutoScrollerProps>((props, ref) => {
    const {
      // eslint-disable-next-line react/prop-types
      autoScroll = true,
      // eslint-disable-next-line react/prop-types
      scrollBehavior = 'smooth',
      // eslint-disable-next-line react/prop-types
      scrollTrigger,
      ...rest
    } = props;
    const localRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!localRef.current) return;
      if (!autoScroll) return;
      localRef.current.scrollTo({
        top: localRef.current.scrollHeight,
        behavior: scrollBehavior,
      });
    }, [scrollTrigger, autoScroll, scrollBehavior]);

    return <div ref={mergeRefs([ref, localRef])} {...rest} />;
  }),
);
AutoScroller.displayName = 'Markprompt.AutoScroller';

interface ReferencesProps<
  TRoot extends ElementType,
  TReference extends ElementType<{
    reference: FileSectionReference;
    index: number;
  }>,
> {
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
  references: FileSectionReference[];
}

/**
 * Render the references that Markprompt returns.
 */
const References = function References<
  TRoot extends ElementType,
  TReference extends ElementType<{
    reference: FileSectionReference;
    index: number;
  }>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  P extends ReferencesProps<TRoot, TReference> = { references: [] },
>(props: P, ref: PolymorphicRef<TRoot>): ReactElement {
  const {
    RootComponent = 'ul',
    ReferenceComponent = 'li',
    references = [],
  } = props;

  return (
    <RootComponent ref={ref}>
      {references.map((reference, index) => {
        return (
          <ReferenceComponent
            key={`${reference.file.path}-${index}`}
            reference={reference}
            index={index}
          />
        );
      })}
    </RootComponent>
  );
};
/**
 * Render the references that Markprompt returned.
 */
const ForwardedReferences = forwardRef(References);
ForwardedReferences.displayName = 'Markprompt.References';

type SearchResultsProps = PolymorphicComponentPropWithRef<
  'ul',
  {
    label?: string;
    SearchResultComponent?: ElementType<
      SearchResultComponentProps & { index?: number }
    >;
    searchResults: SearchResultComponentProps[];
  }
>;

const SearchResults = forwardRef<HTMLUListElement, SearchResultsProps>(
  (props, ref) => {
    const {
      as: Component = 'ul',
      label = 'Search results',
      SearchResultComponent = SearchResult,
      searchResults,
      ...rest
    } = props;

    return (
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
              id={id}
              index={index}
              key={id}
              role="option"
              {...result}
            />
          );
        })}
      </Component>
    );
  },
);
SearchResults.displayName = 'Markprompt.SearchResults';

type SearchResultProps = PolymorphicComponentPropWithRef<
  'li',
  SearchResultComponentProps & {
    onMouseMove?: () => void;
    onClick?: () => void;
  }
>;

const SearchResult = forwardRef<HTMLLIElement, SearchResultProps>(
  (props, ref) => {
    const { title, href, ...rest } = props;
    return (
      <li ref={ref} {...rest}>
        <a href={href}>{title}</a>
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
  PlainContent,
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
