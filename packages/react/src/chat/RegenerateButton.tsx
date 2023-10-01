import React, { type ReactElement } from 'react';

import type { ChatViewMessage } from './store.js';
import { ReloadIcon, StopIcon } from '../icons.js';
import { ActionButton } from '../primitives/Actions.js';

interface RegenerateButtonProps {
  abortSubmitChat?: () => void;
  lastMessageState: ChatViewMessage['state'];
  regenerateLastAnswer: () => void;
}

export function RegenerateButton(
  props: RegenerateButtonProps,
): ReactElement | null {
  const { abortSubmitChat, lastMessageState, regenerateLastAnswer } = props;

  if (lastMessageState === 'done' || lastMessageState === 'cancelled') {
    return (
      <ActionButton
        type="button"
        onClick={regenerateLastAnswer}
        Icon={ReloadIcon}
      >
        Regenerate
      </ActionButton>
    );
  }

  if (
    lastMessageState === 'preload' ||
    lastMessageState === 'streaming-answer'
  ) {
    return (
      <ActionButton type="button" onClick={abortSubmitChat} Icon={StopIcon}>
        Stop generating
      </ActionButton>
    );
  }

  return null;
}
