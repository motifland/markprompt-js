import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  ConditionalVisuallyHidden,
  ConditionalWrap,
} from './ConditionalWrap.js';

describe('ConditionalWrap', () => {
  it('renders', () => {
    const { rerender } = render(
      <ConditionalWrap
        condition
        wrap={(children) => <button>{children}</button>}
      >
        test
      </ConditionalWrap>,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(
      <ConditionalWrap wrap={(children) => <button>{children}</button>}>
        test
      </ConditionalWrap>,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('ConditionalVisuallyHidden', () => {
  it('renders', () => {
    const { rerender } = render(
      <ConditionalVisuallyHidden hide>test</ConditionalVisuallyHidden>,
    );

    expect(screen.getByText('test')).toHaveStyle(
      'position: absolute; border: 0px; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; word-wrap: normal;',
    );

    rerender(<ConditionalVisuallyHidden>test</ConditionalVisuallyHidden>);

    expect(screen.getByText('test')).not.toHaveStyle(
      'position: absolute; border: 0px; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; word-wrap: normal;',
    );
  });
});
