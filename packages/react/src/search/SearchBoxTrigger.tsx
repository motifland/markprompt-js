import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import {
  useEffect,
  type Dispatch,
  type ReactElement,
  type SetStateAction,
} from 'react';

import {
  ChevronUpIcon,
  CommandIcon,
  CornerDownLeftIcon,
  SearchIcon,
} from '../icons.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import { type MarkpromptOptions } from '../types.js';

interface SearchBoxTriggerProps {
  trigger: MarkpromptOptions['trigger'];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

/**
 * A button that can be used to open the Markprompt dialog, styled as a search
 * input, displaying a keyboard shortcut. This trigger is relatively positioned
 * in the container where Markprompt is rendered.
 */
export function SearchBoxTrigger(props: SearchBoxTriggerProps): ReactElement {
  const { trigger, setOpen, open } = props;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (open) return;
      if (
        (event.key === 'Enter' && event.ctrlKey) ||
        (event.key === 'Enter' && event.metaKey)
      ) {
        event.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, setOpen]);

  return (
    <BaseMarkprompt.DialogTrigger className="MarkpromptSearchBoxTrigger">
      <AccessibleIcon.Root label={trigger?.label ?? ''}>
        <span className="MarkpromptSearchBoxTriggerContent">
          <span className="MarkpromptSearchBoxTriggerText">
            <SearchIcon width={16} height={16} />{' '}
            {trigger?.placeholder || 'Search'}{' '}
          </span>
          <kbd>
            {navigator.platform.indexOf('Mac') === 0 ||
            navigator.platform === 'iPhone' ? (
              <CommandIcon className="MarkpromptKeyboardKey" />
            ) : (
              <ChevronUpIcon className="MarkpromptKeyboardKey" />
            )}
            <CornerDownLeftIcon className="MarkpromptKeyboardKey" />
          </kbd>
        </span>
      </AccessibleIcon.Root>
    </BaseMarkprompt.DialogTrigger>
  );
}
