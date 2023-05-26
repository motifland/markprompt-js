# Markprompt React

The [Markprompt](https://markprompt.com) React component is a headless component that offers you a simple, accessible and fully customizable way to add a prompt UI to your React applications. It is based off of [Radix UI's](https://www.radix-ui.com/) [Dialog component](https://www.radix-ui.com/docs/primitives/components/dialog), and presents a similar API.

<br />
<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@markprompt/react">
    <img alt="" src="https://badgen.net/npm/v/@markprompt/react">
  </a>
  <a aria-label="License" href="https://github.com/motifland/markprompt-js/blob/main/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/@markprompt/react">
  </a>
</p>

## Installation

Install the `@markprompt/react` package via NPM or Yarn:

```sh
# NPM
npm install @markprompt/react
# Yarn
yarn add @markprompt/react
```

## Usage

Example:

```jsx
import { Markprompt } from '@markprompt/react';
import { ChatIcon, CloseIcon, SearchIcon, Caret } from './icons';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useContext } from 'react';

function Component() {
  return (
    <Markprompt.Root
      projectKey="<projectKey>"
      loadingHeading="Fetching relevant pages…"
      model="gpt-4"
    >
      <Markprompt.Trigger
        aria-label="Open Markprompt"
        className="MarkpromptButton"
      >
        <ChatIcon className="MarkpromptIcon" />
      </Markprompt.Trigger>
      <Markprompt.Portal>
        <Markprompt.Overlay className="MarkpromptOverlay" />
        <Markprompt.Content className="MarkpromptContent">
          <Markprompt.Close className="MarkpromptClose">
            <CloseIcon />
          </Markprompt.Close>

          {/* Markprompt.Title is required for accessibility reasons. It can be hidden using an accessible content hiding technique. */}
          <VisuallyHidden asChild>
            <Markprompt.Title>
              Ask me anything about Markprompt
            </Markprompt.Title>
          </VisuallyHidden>

          {/* Markprompt.Description is included for accessibility reasons. It is optional and can be hidden using an accessible content hiding technique. */}
          <VisuallyHidden asChild>
            <Markprompt.Description>
              I can answer your questions about Markprompt's client-side
              libraries, onboarding, API's and more.
            </Markprompt.Description>
          </VisuallyHidden>

          <Markprompt.Form>
            <SearchIcon className="MarkpromptSearchIcon" />
            <Markprompt.Prompt className="MarkpromptPrompt" />
          </Markprompt.Form>

          <Markprompt.AutoScroller className="MarkpromptAnswer">
            <Caret />
            <Markprompt.Answer />
          </Markprompt.AutoScroller>

          <References />
        </Markprompt.Content>
      </Markprompt.Portal>
    </Markprompt.Root>
  );
}

const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const removeFileExtension = (fileName: string) => {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return fileName;
  }
  return fileName.substring(0, lastDotIndex);
};

const Reference = ({
  referenceId,
  index,
}: {
  referenceId: string,
  index: number,
}) => {
  return (
    <li
      key={referenceId}
      className="reference"
      style={{
        animationDelay: `${100 * index}ms`,
      }}
    >
      <a href={removeFileExtension(referenceId)}>
        {capitalize(removeFileExtension(referenceId.split('/').slice(-1)[0]))}
      </a>
    </li>
  );
};

const References = () => {
  const { state, references } = useContext(Markprompt.Context);

  if (state === 'indeterminate') return null;

  let adjustedState: string = state;
  if (state === 'done' && references.length === 0) {
    adjustedState = 'indeterminate';
  }

  return (
    <div data-loading-state={adjustedState} className={styles.references}>
      <div className={styles.progress} />
      <p>Fetching relevant pages…</p>
      <p>Answer generated from the following sources:</p>
      <Markprompt.References RootElement="ul" ReferenceElement={Reference} />
    </div>
  );
};
```

replacing `<projectKey>` with the key associated to your project. It can be obtained in the project settings under "Project key".

## Documentation

The full documentation for the component can be found on the [Markprompt docs](https://markprompt.com/docs#react).

## Starter Template

For a working setup based on Next.js + Tailwind, check out the [Markprompt starter template](https://github.com/motifland/markprompt-starter-template).

## Community

- [Twitter @markprompt](https://twitter.com/markprompt)
- [Twitter @motifland](https://twitter.com/motifland)
- [Discord](https://discord.gg/MBMh4apz6X)

## Authors

This library is created by the team behind [Motif](https://motif.land)
([@motifland](https://twitter.com/motifland)).
