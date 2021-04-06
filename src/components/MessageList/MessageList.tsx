import React from 'react';

import { useCallLoadMore } from './hooks/useCallLoadMore';
import { useEnrichedMessages } from './hooks/useEnrichedMessages';
import { useMessageListElements } from './hooks/useMessageListElements';
import { useScrollLocationLogic } from './hooks/useScrollLocationLogic';

import { Center } from './Center';
import { ConnectionStatus } from './ConnectionStatus';
import { CustomNotification } from './CustomNotification';
import { MessageNotification } from './MessageNotification';

import {
  ChannelActionContextValue,
  useChannelActionContext,
} from '../../context/ChannelActionContext';
import {
  ChannelNotifications,
  ChannelStateContextValue,
  useChannelStateContext,
} from '../../context/ChannelStateContext';
import { useChatContext } from '../../context/ChatContext';
import { ComponentContextValue, useComponentContext } from '../../context/ComponentContext';
import { TranslationContextValue, useTranslationContext } from '../../context/TranslationContext';
import { Attachment as DefaultAttachment } from '../Attachment';
import { Avatar as DefaultAvatar } from '../Avatar';
import { DateSeparator as DefaultDateSeparator } from '../DateSeparator';
import { EmptyStateIndicator as DefaultEmptyStateIndicator } from '../EmptyStateIndicator';
import { EventComponent } from '../EventComponent';
import { InfiniteScroll, InfiniteScrollProps } from '../InfiniteScrollPaginator';
import { LoadingIndicator as DefaultLoadingIndicator, LoadingIndicatorProps } from '../Loading';
import { MessageSimple } from '../Message';
import { defaultPinPermissions, MESSAGE_ACTIONS } from '../Message/utils';
import { TypingIndicator as DefaultTypingIndicator } from '../TypingIndicator';

import type { StreamChat } from 'stream-chat';

import type { EmptyStateIndicatorProps } from '../EmptyStateIndicator/EmptyStateIndicator';
import type { EventComponentProps } from '../EventComponent/EventComponent';
import type { MessageProps } from '../Message/types';
import type { DateSeparatorProps } from '../DateSeparator/DateSeparator';
import type { TypingIndicatorProps } from '../TypingIndicator/TypingIndicator';

import type { StreamMessage } from '../../context/ChannelStateContext';

import type {
  DefaultAttachmentType,
  DefaultChannelType,
  DefaultCommandType,
  DefaultEventType,
  DefaultMessageType,
  DefaultReactionType,
  DefaultUserType,
} from '../../../types/types';

type MessageListWithContextProps<
  At extends DefaultAttachmentType = DefaultAttachmentType,
  Ch extends DefaultChannelType = DefaultChannelType,
  Co extends DefaultCommandType = DefaultCommandType,
  Ev extends DefaultEventType = DefaultEventType,
  Me extends DefaultMessageType = DefaultMessageType,
  Re extends DefaultReactionType = DefaultReactionType,
  Us extends DefaultUserType<Us> = DefaultUserType
> = ChannelActionContextValue<At, Ch, Co, Ev, Me, Re, Us> &
  ChannelStateContextValue<At, Ch, Co, Ev, Me, Re, Us> &
  ComponentContextValue<At, Ch, Co, Ev, Me, Re, Us> &
  TranslationContextValue &
  MessageListProps<At, Ch, Co, Ev, Me, Re, Us> & {
    client: StreamChat<At, Ch, Co, Ev, Me, Re, Us>;
  };

type MessageListNotificationsProps = {
  hasNewMessages: boolean;
  notifications: ChannelNotifications;
  scrollToBottom: () => void;
  t: (key: string) => string;
};

const MessageListNotifications = ({
  hasNewMessages,
  notifications,
  scrollToBottom,
  t,
}: MessageListNotificationsProps) => (
  <div className='str-chat__list-notifications'>
    {notifications.map((notification) => (
      <CustomNotification active={true} key={notification.id} type={notification.type}>
        {notification.text}
      </CustomNotification>
    ))}
    <ConnectionStatus />
    <MessageNotification onClick={scrollToBottom} showNotification={hasNewMessages}>
      {t('New Messages!')}
    </MessageNotification>
  </div>
);

const useInternalInfiniteScrollProps = (
  props: Pick<
    MessageListWithContextProps,
    | 'hasMore'
    | 'loadMore'
    | 'LoadingIndicator'
    | 'loadingMore'
    | 'internalInfiniteScrollProps'
    | 'messageLimit'
  >,
) => {
  const { LoadingIndicator = DefaultLoadingIndicator } = props;

  return {
    hasMore: props.hasMore,
    isLoading: props.loadingMore,
    loader: (
      <Center key='loadingindicator'>
        <LoadingIndicator size={20} />
      </Center>
    ),
    loadMore: useCallLoadMore(props.loadMore, props.messageLimit || 100),
    ...props.internalInfiniteScrollProps,
  };
};

const MessageListWithContext = <
  At extends DefaultAttachmentType = DefaultAttachmentType,
  Ch extends DefaultChannelType = DefaultChannelType,
  Co extends DefaultCommandType = DefaultCommandType,
  Ev extends DefaultEventType = DefaultEventType,
  Me extends DefaultMessageType = DefaultMessageType,
  Re extends DefaultReactionType = DefaultReactionType,
  Us extends DefaultUserType<Us> = DefaultUserType
>(
  props: MessageListWithContextProps<At, Ch, Co, Ev, Me, Re, Us>,
) => {
  const {
    channel,
    client,
    Attachment = DefaultAttachment,
    Avatar = DefaultAvatar,
    disableDateSeparator = false,
    hideDeletedMessages = false,
    hideNewMessageSeparator = false,
    DateSeparator = DefaultDateSeparator,
    EmptyStateIndicator = DefaultEmptyStateIndicator,
    Message = MessageSimple,
    messageActions = Object.keys(MESSAGE_ACTIONS),
    messages = [],
    MessageSystem = EventComponent,
    notifications,
    noGroupByUser = false,
    pinPermissions = defaultPinPermissions,
    t,
    threadList = false,
    TypingIndicator = DefaultTypingIndicator,
    unsafeHTML = false,
    headerPosition,
    HeaderComponent,
    read,
  } = props;

  const {
    hasNewMessages,
    onMessageLoadCaptured,
    onScroll,
    ref,
    scrollToBottom,
    wrapperRect,
  } = useScrollLocationLogic({
    currentUserId: client.userID,
    messages,
    scrolledUpThreshold: props.scrolledUpThreshold,
  });

  const { messageGroupStyles, messages: enrichedMessages } = useEnrichedMessages({
    channel,
    client,
    disableDateSeparator,
    HeaderComponent,
    headerPosition,
    hideDeletedMessages,
    hideNewMessageSeparator,
    messages,
    noGroupByUser,
    threadList,
  });

  const elements = useMessageListElements<At, Ch, Co, Ev, Me, Re, Us>({
    client,
    DateSeparator,
    enrichedMessages,
    HeaderComponent,
    internalMessageProps: {
      additionalMessageInputProps: props.additionalMessageInputProps,
      addNotification: props.addNotification,
      Attachment,
      Avatar,
      channel,
      getFlagMessageErrorNotification: props.getFlagMessageErrorNotification,
      getFlagMessageSuccessNotification: props.getFlagMessageSuccessNotification,
      getMuteUserErrorNotification: props.getMuteUserErrorNotification,
      getMuteUserSuccessNotification: props.getMuteUserSuccessNotification,
      getPinMessageErrorNotification: props.getPinMessageErrorNotification,
      members: props.members,
      Message,
      messageActions,
      messageListRect: wrapperRect,
      mutes: props.mutes,
      onMentionsClick: props.onMentionsClick,
      onMentionsHover: props.onMentionsHover,
      onUserClick: props.onUserClick,
      onUserHover: props.onUserHover,
      openThread: props.openThread,
      pinPermissions,
      removeMessage: props.removeMessage,
      retrySendMessage: props.retrySendMessage,
      unsafeHTML,
      updateMessage: props.updateMessage,
      watchers: props.watchers,
    },
    messageGroupStyles,
    MessageSystem,
    onMessageLoadCaptured,
    read,
    threadList,
  });

  const finalInternalInfiniteScrollProps = useInternalInfiniteScrollProps(props);

  return (
    <>
      <div
        className={`str-chat__list ${props.threadList ? 'str-chat__list--thread' : ''}`}
        onScroll={onScroll}
        ref={ref}
      >
        {!elements.length && EmptyStateIndicator ? (
          <EmptyStateIndicator listType='message' />
        ) : (
          <InfiniteScroll
            className='str-chat__reverse-infinite-scroll'
            data-testid='reverse-infinite-scroll'
            isReverse
            useWindow={false}
            {...finalInternalInfiniteScrollProps}
          >
            <ul className='str-chat__ul'>{elements}</ul>
            <TypingIndicator threadList={threadList} />
            <div key='bottom' />
          </InfiniteScroll>
        )}
      </div>
      <MessageListNotifications
        hasNewMessages={hasNewMessages}
        notifications={notifications}
        scrollToBottom={scrollToBottom}
        t={t}
      />
    </>
  );
};

type PropsDrilledToMessage =
  | 'additionalMessageInputProps'
  | 'Attachment'
  | 'Avatar'
  | 'Message'
  | 'getFlagMessageErrorNotification'
  | 'getFlagMessageErrorNotification'
  | 'getFlagMessageSuccessNotification'
  | 'getMuteUserErrorNotification'
  | 'getMuteUserSuccessNotification'
  | 'getPinMessageErrorNotification'
  | 'messageActions'
  | 'onMentionsClick'
  | 'onMentionsHover'
  | 'onUserClick'
  | 'onUserHover'
  | 'pinPermissions'
  | 'unsafeHTML';

export type MessageListProps<
  At extends DefaultAttachmentType = DefaultAttachmentType,
  Ch extends DefaultChannelType = DefaultChannelType,
  Co extends DefaultCommandType = DefaultCommandType,
  Ev extends DefaultEventType = DefaultEventType,
  Me extends DefaultMessageType = DefaultMessageType,
  Re extends DefaultReactionType = DefaultReactionType,
  Us extends DefaultUserType<Us> = DefaultUserType
> = Partial<Pick<MessageProps<At, Ch, Co, Ev, Me, Re, Us>, PropsDrilledToMessage>> & {
  /**
   * Date separator UI component to render
   * Defaults to and accepts same props as: [DateSeparator](https://github.com/GetStream/stream-chat-react/blob/master/src/components/DateSeparator.tsx)
   */
  DateSeparator?: React.ComponentType<DateSeparatorProps>;
  /** Disables the injection of date separator components, defaults to `false` */
  disableDateSeparator?: boolean;
  /** The UI Indicator to use when `MessageList` or `ChannelList` is empty  */
  EmptyStateIndicator?: React.ComponentType<EmptyStateIndicatorProps>;
  /** Whether or not the list has more items to load */
  hasMore?: boolean;
  /** Component to render at the top of the MessageList */
  HeaderComponent?: React.ComponentType;
  /** Position to render HeaderComponent */
  headerPosition?: number;
  /** Hides the MessageDeleted components from the list, defaults to `false` */
  hideDeletedMessages?: boolean;
  /** Hides the DateSeparator component when new messages are received in a channel that's watched but not active, defaults to false */
  hideNewMessageSeparator?: boolean;
  /** Overrides the default props passed to [InfiniteScroll](https://github.com/GetStream/stream-chat-react/blob/master/src/components/InfiniteScrollPaginator/InfiniteScroll.tsx) */
  internalInfiniteScrollProps?: InfiniteScrollProps;
  /** Component to render at the top of the MessageList while loading new messages */
  LoadingIndicator?: React.ComponentType<LoadingIndicatorProps>;
  /** Whether or not the list is currently loading more items */
  loadingMore?: boolean;
  /** Function called when more messages are to be loaded, defaults to function stored in [ChannelActionContext](https://getstream.github.io/stream-chat-react/#section-channelactioncontext) */
  loadMore?: ((limit: number) => Promise<number>) | (() => Promise<void>);
  /** The limit to use when paginating messages */
  messageLimit?: number;
  /**
   * The messages to render in the list
   * Defaults to the messages stored in [ChannelStateContext](https://getstream.github.io/stream-chat-react/#section-channelstatecontext)
   */
  messages?: StreamMessage<At, Ch, Co, Ev, Me, Re, Us>[];
  /**
   * Custom UI component to display system messages
   * Defaults to and accepts same props as: [EventComponent](https://github.com/GetStream/stream-chat-react/blob/master/src/components/EventComponent.tsx)
   */
  MessageSystem?: React.ComponentType<EventComponentProps<At, Ch, Co, Ev, Me, Re, Us>>;
  /** Set to `true` to turn off grouping of messages by user */
  noGroupByUser?: boolean;
  /**
   * The pixel threshold to determine whether or not the user is scrolled up in the list
   * @default 200px
   */
  scrolledUpThreshold?: number;
  /** Set to `true` to indicate that the list is a thread  */
  threadList?: boolean;
  /**
   * Typing indicator UI component to render
   * Defaults to and accepts same props as: [TypingIndicator](https://github.com/GetStream/stream-chat-react/blob/master/src/components/TypingIndicator/TypingIndicator.tsx)
   */
  TypingIndicator?: React.ComponentType<TypingIndicatorProps>;
};

/**
 * The MessageList component renders a list of Messages.
 * It is a consumer of the following contexts:
 * - [ChannelStateContext](https://getstream.github.io/stream-chat-react/#section-channelstatecontext)
 * - [ChannelActionContext](https://getstream.github.io/stream-chat-react/#section-channelactioncontext)
 * - [ComponentContext](https://getstream.github.io/stream-chat-react/#section-componentcontext)
 * - [TypingContext](https://getstream.github.io/stream-chat-react/#section-typingcontext)
 * @example ./MessageList.md
 */
export const MessageList = <
  At extends DefaultAttachmentType = DefaultAttachmentType,
  Ch extends DefaultChannelType = DefaultChannelType,
  Co extends DefaultCommandType = DefaultCommandType,
  Ev extends DefaultEventType = DefaultEventType,
  Me extends DefaultMessageType = DefaultMessageType,
  Re extends DefaultReactionType = DefaultReactionType,
  Us extends DefaultUserType<Us> = DefaultUserType
>(
  props: MessageListProps<At, Ch, Co, Ev, Me, Re, Us>,
) => {
  const channelActionContext = useChannelActionContext<At, Ch, Co, Ev, Me, Re, Us>();
  const channelStateContext = useChannelStateContext<At, Ch, Co, Ev, Me, Re, Us>();
  const { client } = useChatContext<At, Ch, Co, Ev, Me, Re, Us>();
  const componentContext = useComponentContext<At, Ch, Co, Ev, Me, Re, Us>();
  const translationContext = useTranslationContext();

  return (
    <MessageListWithContext
      client={client}
      {...channelActionContext}
      {...channelStateContext}
      {...componentContext}
      {...translationContext}
      {...props}
    />
  );
};
