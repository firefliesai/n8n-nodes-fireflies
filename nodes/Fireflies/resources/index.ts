import { INodeProperties } from 'n8n-workflow';
import { transcriptFields } from './transcript.fields';
import { aiAppFields } from './aiApp.fields';
import { audioFields } from './audio.fields';
import { askfredFields } from './askfred.fields';
import { userOperations } from './user.properties';
import { transcriptOperations } from './transcript.properties';
import { aiAppOperations } from './aiApp.properties';
import { audioOperations } from './audio.properties';
import { askfredOperations } from './askfred.properties';

const resourcesOptions: INodeProperties = {
  displayName: 'Resource',
  name: 'resource',
  type: 'options',
  noDataExpression: true,
  options: [
    {
      name: 'AI App',
      value: 'aiApp',
    },
    {
      name: 'AskFred',
      value: 'askfred',
    },
    {
      name: 'Audio',
      value: 'audio',
    },
    {
      name: 'Transcript',
      value: 'transcript',
    },
    {
      name: 'User',
      value: 'user',
    },
  ],
  default: 'transcript',
};

export const firefliesNodeProperties = [
  resourcesOptions,
  aiAppOperations,
  askfredOperations,
  audioOperations,
  transcriptOperations,
  userOperations,
  ...aiAppFields,
  ...askfredFields,
  ...audioFields,
  ...transcriptFields,
];
