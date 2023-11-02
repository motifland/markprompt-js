import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import clsx from 'clsx';
import { useSelect, type UseSelectProps } from 'downshift';
import { type ReactNode } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps<T = Option> extends UseSelectProps<T> {
  className?: string;
  items: T[];
  itemToChildren?: (item: T | null) => ReactNode;
  itemToString: (item: T | null) => string;
  label?: ReactNode;
  toggle?: ReactNode;
  menuClassName?: string;
  toggleClassName?: string;
  itemClassName?: string;
}

export function Select<T = Option>(props: SelectProps<T>): JSX.Element {
  const {
    className,
    itemClassName,
    menuClassName,
    toggleClassName,
    label,
    items,
    toggle,
    itemToChildren,
    itemToString,
    ...useSelectProps
  } = props;

  const {
    getItemProps,
    getLabelProps,
    getMenuProps,
    getToggleButtonProps,
    highlightedIndex,
    isOpen,
    selectedItem,
  } = useSelect({
    items,
    itemToString,
    ...useSelectProps,
  });

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
    placement: 'top-start',
  });

  return (
    <div className={clsx('MarkpromptSelect', className)}>
      <VisuallyHidden asChild>
        <label {...getLabelProps()}>{label}</label>
      </VisuallyHidden>

      <button
        type="button"
        className={clsx('MarkpromptSelectToggle', toggleClassName)}
        {...getToggleButtonProps({ ref: refs.setReference })}
      >
        {toggle}
      </button>

      <ul
        className={clsx('MarkpromptSelectMenu', menuClassName)}
        style={floatingStyles}
        data-open={isOpen}
        {...getMenuProps({ ref: refs.setFloating })}
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              key={`${itemToString(item)}-${index}`}
              className={itemClassName}
              data-highlighted={highlightedIndex === index}
              data-selected={itemToString(selectedItem) === itemToString(item)}
              {...getItemProps({ item, index })}
            >
              {itemToChildren ? itemToChildren(item) : itemToString(item)}
            </li>
          ))}
      </ul>
    </div>
  );
}
