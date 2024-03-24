import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { Feedback } from './Feedback.js';

describe('Feedback', () => {
  const submitFeedback = vi.fn(() => Promise.resolve());
  const abortFeedbackRequest = vi.fn();

  const messageId = 'test-message-id';

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('render the Feedback component', () => {
    render(
      <Feedback
        submitFeedback={submitFeedback}
        abortFeedbackRequest={abortFeedbackRequest}
        variant="text"
        data-testid="test-feedback"
        messageId={messageId}
      />,
    );

    const element = screen.getByTestId('test-feedback');

    expect(element).toBeInTheDocument();
  });

  test('render the Feedback component with the icons variant', () => {
    render(
      <Feedback
        submitFeedback={submitFeedback}
        abortFeedbackRequest={abortFeedbackRequest}
        variant="icons"
        data-testid="test-feedback"
        messageId={messageId}
      />,
    );

    const element = screen.getByTestId('test-feedback');

    expect(element).toBeInTheDocument();
  });

  test('thank the user when feedback was provided', async () => {
    const user = userEvent.setup();

    render(
      <Feedback
        variant="text"
        submitFeedback={submitFeedback}
        abortFeedbackRequest={abortFeedbackRequest}
        messageId={messageId}
      />,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);

    const yesButton = screen.getByText('Yes');

    await user.click(yesButton);

    await waitFor(() =>
      expect(submitFeedback).toHaveBeenCalledWith({ vote: '1' }, messageId),
    );

    expect(yesButton).toHaveAttribute('data-active', 'true');
  });
});
