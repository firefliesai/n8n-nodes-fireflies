import { INodeProperties } from 'n8n-workflow';

export const meetingOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['meeting'],
    },
  },
  options: [
    {
      name: 'Add to Live Meeting',
      action: 'Add fred to a live meeting',
      description: 'Add the Fireflies bot to an active meeting',
      value: 'addToLiveMeeting',
    },
    {
      name: 'Create Live Action Item',
      action: 'Create an action item in a live meeting',
      description:
        'Ask Fred to create an action item during a live meeting. Uses AI credits; limited to 10 requests per hour.',
      value: 'createLiveActionItem',
    },
    {
      name: 'Create Live Soundbite',
      action: 'Create a soundbite in a live meeting',
      description:
        'Ask Fred to create a soundbite during a live meeting. Uses AI credits; limited to 10 requests per hour.',
      value: 'createLiveSoundbite',
    },
    {
      name: 'Get Active Meetings',
      action: 'Get active meetings',
      description: 'Get a list of currently active meetings',
      value: 'getActiveMeetings',
    },
    {
      name: 'Get Live Action Items',
      action: 'Get the action items of a live meeting',
      description: 'Get the action items Fireflies and the API have created during a live meeting',
      value: 'getLiveActionItems',
    },
    {
      name: 'Pause or Resume Recording',
      action: 'Pause or resume recording of a live meeting',
      description:
        'Pause or resume the Fireflies bot recording a live meeting. Limited to 10 requests per hour.',
      value: 'updateMeetingState',
    },
  ],
  default: 'getActiveMeetings',
};
