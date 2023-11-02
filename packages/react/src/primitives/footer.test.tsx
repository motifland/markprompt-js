import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { Footer, MarkpromptIcon } from './footer.js';

describe('Footer', () => {
  test('render a footer', () => {
    render(<Footer />);

    const element = screen.getByText(/Powered by/);
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Powered by Markprompt AI');

    const anchor = screen.getByText<HTMLAnchorElement>('Markprompt AI');
    expect(anchor.href).toBe('https://markprompt.com/');
  });

  test('render a footer with Algolia', () => {
    render(<Footer showAlgolia />);

    const anchor = screen.getByLabelText<HTMLAnchorElement>('Algolia');
    expect(anchor.href).toBe('https://algolia.com/');
  });
});

describe('MarkpromptIcon', () => {
  test('render SVG icon', () => {
    const { container } = render(<MarkpromptIcon />);
    expect(container).toContainHTML('svg');
  });

  test('custom className', () => {
    render(<MarkpromptIcon className="custom-class" data-testid="test-id" />);
    const svg = screen.getByTestId('test-id');
    expect(svg).toHaveClass('custom-class');
  });

  test('custom style', () => {
    render(
      <MarkpromptIcon style={{ color: 'tomato' }} data-testid="test-id" />,
    );
    const svg = screen.getByTestId('test-id');
    // html color names are converted to rgb by some step in the build process for tests
    expect(svg).toHaveStyle({ color: 'rgb(255, 99, 71)' });
  });
});
