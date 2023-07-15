import React, { type ReactElement } from 'react';

import { Answer } from './Answer.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { MarkpromptForm } from './MarkpromptForm.js';
import * as BaseMarkprompt from './primitives/headless.js';
import { References } from './References.js';
import { type MarkpromptOptions } from './types.js';

interface PromptViewProps {
  prompt: MarkpromptOptions['prompt'];
  references: MarkpromptOptions['references'];
  close?: MarkpromptOptions['close'];
}

export function PromptView(props: PromptViewProps): ReactElement {
  const { prompt, references, close } = props;

  return (
    <div className="MarkpromptPromptView">
      <MarkpromptForm
        label={prompt?.label ?? DEFAULT_MARKPROMPT_OPTIONS.prompt!.label!}
        placeholder={
          prompt?.placeholder ?? DEFAULT_MARKPROMPT_OPTIONS.prompt!.placeholder!
        }
        icon="prompt"
        close={close}
      />

      <AnswerContainer references={references} />
    </div>
  );
}

interface AnswerContainerProps {
  references: MarkpromptOptions['references'];
}

function AnswerContainer({ references }: AnswerContainerProps): ReactElement {
  return (
    <div className="MarkpromptAnswerContainer">
      <BaseMarkprompt.AutoScroller className="MarkpromptAutoScroller">
        <Answer />
      </BaseMarkprompt.AutoScroller>

      <References
        loadingText={references?.loadingText}
        transformReferenceId={references?.transformReferenceId}
        getLabel={references?.getLabel}
        getHref={references?.getHref}
      />
    </div>
  );
}
