import {
  Firebot,
  RunRequest,
} from '@crowbartools/firebot-custom-scripts-types';
import { EventSource } from '@crowbartools/firebot-custom-scripts-types/types/modules/event-manager';
import { ReplaceVariable } from '@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager';
import { TriggersObject } from '@crowbartools/firebot-custom-scripts-types/types/triggers';
import { ChatClient, UserNotice } from '@twurple/chat';

import { author, description, formattedName, version } from '../package.json';

let chatClient: ChatClient;

const script: Firebot.CustomScript<Record<string, unknown>> = {
  getScriptManifest: () => ({
    name: formattedName,
    description,
    author,
    version,
    firebotVersion: '5',
    startupOnly: true,
    website: 'https://github.com/CrowsterTKC/firebot-watch-streaks',
  }),
  getDefaultParameters: () => ({}),
  parametersUpdated: () => {},
  run: async ({ firebot, modules }: RunRequest<Record<string, unknown>>) => {
    const { eventManager, replaceVariableManager, twitchApi } = modules;

    const eventSource: EventSource = {
      id: 'crowstertkc:watch-streaks',
      name: 'Twitch Watch Streaks',
      events: [
        {
          id: 'watch-streak',
          name: 'Watch Streak',
          description:
            'When a viewer reaches a watch streak milestone on your channel.',
          cached: true,
          manualMetadata: {
            username: 'firebot',
            userDisplayName: 'Firebot',
            userId: '',
            watchStreak: 10,
            reward: 450,
            message: '',
          },
          activityFeed: {
            icon: 'fad fa-fire',
            getMessage: (eventData) => {
              const showUserIdName =
                (eventData.username as string).toLowerCase() !==
                (eventData.userDisplayName as string).toLowerCase();
              return `**${eventData.userDisplayName}${
                showUserIdName ? ` (${eventData.username})` : ''
              }** reached a **${eventData.watchStreak}-Stream Streak**${eventData.message ? `: *${eventData.message}*` : ''}`;
            },
          },
        },
      ],
    };
    eventManager.registerEventSource(eventSource);

    const replaceVariableTriggers: TriggersObject = {
      event: [`${eventSource.id}:watch-streak`],
      manual: true,
    };

    const watchStreakVariable: ReplaceVariable = {
      definition: {
        handle: 'watchStreak',
        description:
          'The number of consecutive streams the viewer has watched to reach their watch streak milestone.',
        categories: ['trigger based', 'common', 'numbers', 'user based'],
        triggers: replaceVariableTriggers,
        possibleDataOutput: ['number'],
      },
      evaluator: (trigger) => {
        return trigger.metadata.eventData?.watchStreak || 0;
      },
    };
    replaceVariableManager.registerReplaceVariable(watchStreakVariable);

    const watchStreamRewardVariable: ReplaceVariable = {
      definition: {
        handle: 'watchStreakReward',
        description:
          'The number of channel points rewarded to the viewer for reaching their watch streak milestone.',
        categories: ['trigger based', 'common', 'numbers', 'user based'],
        triggers: replaceVariableTriggers,
        possibleDataOutput: ['number'],
      },
      evaluator: (trigger) => {
        return trigger.metadata.eventData?.reward || 0;
      },
    };
    replaceVariableManager.registerReplaceVariable(watchStreamRewardVariable);

    const watchStreamMessageVariable: ReplaceVariable = {
      definition: {
        handle: 'watchStreakMessage',
        description:
          'The custom message the viewer included when reaching their watch streak milestone.',
        categories: ['trigger based', 'common', 'text', 'user based'],
        triggers: replaceVariableTriggers,
        possibleDataOutput: ['text'],
      },
      evaluator: (trigger) => {
        return trigger.metadata.eventData?.message || '';
      },
    };
    replaceVariableManager.registerReplaceVariable(watchStreamMessageVariable);

    chatClient = new ChatClient({
      authProvider: twitchApi.getClient()._authProvider,
      channels: [firebot.accounts.streamer.username],
    });
    chatClient.connect();

    chatClient.irc.onTypedMessage(UserNotice, (userNotice: UserNotice) => {
      const { text: message, tags } = userNotice;
      const messageType = tags.get('msg-id');

      switch (messageType) {
        case 'viewermilestone':
          if (tags.get('msg-param-category') === 'watch-streak') {
            const watchStreak = tags.get('msg-param-value');
            const reward = tags.get('msg-param-copoReward');

            eventManager.triggerEvent(eventSource.id, 'watch-streak', {
              username: tags.get('login'),
              userDisplayName: tags.get('display-name'),
              userId: tags.get('user-id'),
              watchStreak: watchStreak ? parseInt(watchStreak, 10) : 0,
              reward: reward ? parseInt(reward, 10) : 0,
              message: message || '',
            });
          }
      }
    });
  },
  stop: () => {
    if (chatClient) {
      chatClient.quit();
    }
  },
};

export default script;
