import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import {
  ChatIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  CloseIcon,
  CommandIcon,
  CopyIcon,
  CornerDownLeftIcon,
  CounterClockwiseClockIcon,
  FileTextIcon,
  HashIcon,
  ReloadIcon,
  SearchIcon,
  SparklesIcon,
  StopIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  PlusIcon,
} from './icons.js';

const icons = [
  ChatIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  CloseIcon,
  CommandIcon,
  CopyIcon,
  CornerDownLeftIcon,
  CounterClockwiseClockIcon,
  FileTextIcon,
  HashIcon,
  ReloadIcon,
  SearchIcon,
  SparklesIcon,
  StopIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  PlusIcon,
];

describe('icons', () => {
  for (const Icon of icons) {
    test(`renders the ${Icon.name} component`, () => {
      render(<Icon data-testid={`test-icon-${Icon.name}`} />);
      const el = screen.getByTestId(`test-icon-${Icon.name}`);
      expect(el).toBeInTheDocument();
    });
  }
});
