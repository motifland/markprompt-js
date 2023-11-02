import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { type ReactNode, type ReactElement } from 'react';

interface ConditionalWrapProps {
  condition?: boolean;
  wrap: (children: ReactNode) => ReactNode;
  children: ReactNode;
}

export const ConditionalWrap = (props: ConditionalWrapProps): ReactElement => {
  const { condition, wrap, children } = props;
  return (condition ? wrap(children) : children) as ReactElement;
};

interface ConditionalVisuallyHiddenProps {
  asChild?: boolean;
  children: ReactNode;
  hide?: boolean;
}

export const ConditionalVisuallyHidden = (
  props: ConditionalVisuallyHiddenProps,
): ReactElement => {
  const { asChild, hide, children } = props;
  return (
    <ConditionalWrap
      condition={hide}
      wrap={(children) => (
        <VisuallyHidden asChild={asChild}>{children}</VisuallyHidden>
      )}
    >
      {children}
    </ConditionalWrap>
  );
};
