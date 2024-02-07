import { ChatViewForm } from './ChatViewForm';
import { ConversationSidebar } from './ConversationSidebar';
import { Messages } from './Messages';
import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants';
import { ChevronLeftIcon } from '../icons';
import type { MarkpromptOptions, View } from '../types';
import { useDefaults } from '../useDefaults';

export interface ChatViewProps {
  activeView?: View;
  chatOptions?: MarkpromptOptions['chat'];
  debug?: boolean;
  feedbackOptions?: MarkpromptOptions['feedback'];
  projectKey: string;
  referencesOptions?: MarkpromptOptions['references'];
  showBack?: boolean;
  onDidSelectReference?: () => void;
  onDidPressBack?: () => void;
}

export function ChatView(props: ChatViewProps): JSX.Element {
  const { activeView, projectKey, showBack, onDidPressBack } = props;

  if (!projectKey) {
    throw new Error(
      'Markprompt: a project key is required. Make sure to pass your Markprompt project key to <ChatView />.',
    );
  }

  // We are also merging defaults in the Markprompt component, but this makes
  // sure that standalone ChatView components also have defaults as expected.
  const chatOptions = useDefaults(
    { ...props.chatOptions },
    DEFAULT_MARKPROMPT_OPTIONS.chat,
  );

  const feedbackOptions = useDefaults(
    { ...props.feedbackOptions },
    DEFAULT_MARKPROMPT_OPTIONS.feedback,
  );

  const referencesOptions = useDefaults(
    { ...props.referencesOptions },
    DEFAULT_MARKPROMPT_OPTIONS.references,
  );

  return (
    <div className="MarkpromptChatView">
      <ConversationSidebar />
      <div className="MarkpromptChatViewChat">
        {showBack ? (
          <div className="MarkpromptChatViewNavigation">
            <button className="MarkpromptGhostButton" onClick={onDidPressBack}>
              <ChevronLeftIcon
                style={{ width: 16, height: 16 }}
                strokeWidth={2.5}
              />
            </button>
          </div>
        ) : (
          // Keep this for the grid template rows layout
          <div />
        )}
        <Messages
          chatOptions={chatOptions}
          feedbackOptions={feedbackOptions}
          projectKey={projectKey}
          referencesOptions={referencesOptions}
        />
        <ChatViewForm activeView={activeView} chatOptions={chatOptions} />
      </div>
    </div>
  );
}
