import clsx from 'clsx';
import React, {
  type ReactNode,
  type ComponentPropsWithoutRef,
  type ComponentType,
  forwardRef,
  type ForwardedRef,
} from 'react';

interface ActionsProps {
  children: ReactNode;
}

export function Actions(props: ActionsProps): JSX.Element {
  const { children } = props;
  return <div className="MarkpromptActions">{children}</div>;
}

interface ActionButtonProps extends ComponentPropsWithoutRef<'button'> {
  Icon: ComponentType<ComponentPropsWithoutRef<'svg'>>;
  children: ReactNode;
}

export const ActionButton = forwardRef(function ActionButton(
  props: ActionButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
): JSX.Element {
  const { Icon, children, className, ...rest } = props;
  return (
    <button
      ref={ref}
      className={clsx('MarkpromptActionButton', className)}
      {...rest}
    >
      <Icon className="MarkpromptSearchIcon" />
      <span>{children}</span>
    </button>
  );
});
