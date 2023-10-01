import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import clsx from 'clsx';
import {
  useSelect,
  type UseSelectGetToggleButtonReturnValue,
  type UseSelectProps,
} from 'downshift';
import React, { type ComponentType, type ReactNode } from 'react';

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
  Toggle: ComponentType<UseSelectGetToggleButtonReturnValue>;
  menuClassName?: string;
  toggleClassName?: string;
  itemClassName?: string;
}

export function Select<T = Option>(props: SelectProps<T>): JSX.Element {
  const {
    className,
    itemClassName,
    menuClassName,
    label,
    items,
    Toggle,
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

      <Toggle {...getToggleButtonProps({ ref: refs.setReference })} />

      <ul
        className={clsx('MarkpromptSelectMenu', menuClassName)}
        style={floatingStyles}
        data-open={isOpen}
        {...getMenuProps({ ref: refs.setFloating })}
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              key={itemToString(item)}
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
